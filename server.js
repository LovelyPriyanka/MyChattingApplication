const path = require('path');
const fs = require('fs');
const http = require('http');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

function parseAllowedOrigins(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

const allowedOrigins = parseAllowedOrigins(process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN);
const allowAnyOrigin = allowedOrigins.includes('*');
const hasCrossOriginClients = allowedOrigins.length > 0;
const sessionCookieSameSite = process.env.SESSION_COOKIE_SAME_SITE || (hasCrossOriginClients ? 'none' : 'lax');
const sessionCookieSecure =
  String(process.env.SESSION_COOKIE_SECURE || '').toLowerCase() === 'true' || hasCrossOriginClients;

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = String(origin).trim().replace(/\/$/, '');

    if (!hasCrossOriginClients || allowAnyOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  }
};

const io = new Server(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 3000;
const connectedUsers = new Map();
const pendingRegistrations = new Map();
const pendingPasswordResets = new Map();
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const messagesFilePath = path.join(__dirname, 'data', 'messages.json');
const MAX_AVATAR_DATA_URL_LENGTH = 8000000;
const MAX_VOICE_DATA_URL_LENGTH = 8000000;
const MAX_MEDIA_DATA_URL_LENGTH = 45000000;
const MAX_MEDIA_UPLOAD_BYTES = 700 * 1024 * 1024;
const STATUS_TEXT_MAX_LENGTH = 300;
const STATUS_EXPIRY_MS = 24 * 60 * 60 * 1000;
const STATUS_MIN_HD_WIDTH = 1280;
const STATUS_MIN_HD_HEIGHT = 720;
const ALLOWED_REACTIONS = new Set(['❤️', '😂', '👍']);
const ALLOWED_CHAT_MOODS = new Set(['neutral', 'happy', 'sad', 'angry', 'excited']);
const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 3;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const PASSWORD_RESET_VERIFIED_EXPIRY_MS = 10 * 60 * 1000;
const OTP_BCRYPT_ROUNDS = 8;
const MESSAGE_HASH_PREFIX = 'sha256:';
const mediaUploadsDir = path.join(__dirname, 'public', 'uploads');
let mongoClientPromise = null;
let mongoCollectionsPromise = null;
let usersCache = [];
let messagesCache = [];
let usersWriteQueue = Promise.resolve();
let messagesWriteQueue = Promise.resolve();
let cacheRefreshInFlight = null;
let lastCacheRefreshAt = 0;
const CACHE_REFRESH_TTL_MS = 1500;
const sessionMiddleware = session({
  secret: 'simple-chat-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: sessionCookieSameSite,
    secure: sessionCookieSecure,
    maxAge: 1000 * 60 * 60 * 24
  }
});

function ensureJsonFile(filePath, defaultValue) {
  const dirPath = path.dirname(filePath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
  }
}

if (!fs.existsSync(mediaUploadsDir)) {
  fs.mkdirSync(mediaUploadsDir, { recursive: true });
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeUsernameList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];

  value.forEach((entry) => {
    const username = sanitizeText(entry).slice(0, 30);
    if (!username) {
      return;
    }

    const key = username.toLowerCase();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    normalized.push(username);
  });

  return normalized;
}

function normalizeProfilePhotoViews(value) {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const sourceEntries = Array.isArray(value)
    ? value.map((entry) => [String(entry?.username || '').toLowerCase(), entry])
    : Object.entries(value);

  return sourceEntries.reduce((acc, [key, rawEntry]) => {
    const entry = rawEntry && typeof rawEntry === 'object' ? rawEntry : {};
    const username = sanitizeText(entry.username || key).slice(0, 30);
    const count = Math.max(0, Number.parseInt(entry.count, 10) || 0);

    if (!username || count <= 0) {
      return acc;
    }

    const viewerKey = username.toLowerCase();
    const previous = acc[viewerKey];
    acc[viewerKey] = {
      username,
      count: (previous?.count || 0) + count,
      lastViewedAt: String(entry.lastViewedAt || previous?.lastViewedAt || '').slice(0, 40)
    };

    return acc;
  }, {});
}

function normalizeStatusViews(value) {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const sourceEntries = Array.isArray(value)
    ? value.map((entry) => [String(entry?.username || '').toLowerCase(), entry])
    : Object.entries(value);

  return sourceEntries.reduce((acc, [key, rawEntry]) => {
    const entry = rawEntry && typeof rawEntry === 'object' ? rawEntry : {};
    const username = sanitizeText(entry.username || key).slice(0, 30);
    const count = Math.max(0, Number.parseInt(entry.count, 10) || 0);

    if (!username || count <= 0) {
      return acc;
    }

    const viewerKey = username.toLowerCase();
    const previous = acc[viewerKey];
    acc[viewerKey] = {
      username,
      count: (previous?.count || 0) + count,
      lastViewedAt: String(entry.lastViewedAt || previous?.lastViewedAt || '').slice(0, 40)
    };

    return acc;
  }, {});
}

function normalizeStatusLikes(value) {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const sourceEntries = Array.isArray(value)
    ? value.map((entry) => [String(entry?.username || '').toLowerCase(), entry])
    : Object.entries(value);

  return sourceEntries.reduce((acc, [key, rawEntry]) => {
    const entry = rawEntry && typeof rawEntry === 'object' ? rawEntry : {};
    const username = sanitizeText(entry.username || key).slice(0, 30);
    if (!username) {
      return acc;
    }

    const likedAtRaw = String(entry.likedAt || '').trim();
    const likedAt = Number.isFinite(new Date(likedAtRaw).getTime()) ? likedAtRaw : new Date().toISOString();
    const likeKey = username.toLowerCase();

    acc[likeKey] = {
      username,
      likedAt
    };

    return acc;
  }, {});
}

function normalizeMessageReactions(value) {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const normalized = {};
  ALLOWED_REACTIONS.forEach((emoji) => {
    normalized[emoji] = normalizeUsernameList(value[emoji]);
  });

  return normalized;
}

function normalizeUser(user) {
  const activeStatuses = getActiveStatusesForUser(user);

  return {
    ...user,
    email: sanitizeEmail(user?.email),
    about: sanitizeText(user?.about).slice(0, 80) || 'Available to chat',
    avatarUrl: sanitizeAvatarUrl(user?.avatarUrl).value,
    profileVisibility: sanitizeProfileVisibility(user?.profileVisibility),
    onlineVisibility: sanitizeOnlineVisibility(user?.onlineVisibility),
    friends: normalizeUsernameList(user?.friends),
    blockedUsers: normalizeUsernameList(user?.blockedUsers),
    incomingRequests: normalizeUsernameList(user?.incomingRequests),
    outgoingRequests: normalizeUsernameList(user?.outgoingRequests),
    profilePhotoViews: normalizeProfilePhotoViews(user?.profilePhotoViews),
    status: activeStatuses[0] || null,
    statuses: activeStatuses
  };
}

function getProfilePhotoViewsForUser(user) {
  return Object.values(normalizeProfilePhotoViews(user?.profilePhotoViews)).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    return a.username.localeCompare(b.username);
  });
}

function getStatusViewsForUser(user) {
  return Object.values(normalizeStatusViews(getActiveStatusesForUser(user)[0]?.views)).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    return a.username.localeCompare(b.username);
  });
}

function findUser(users, username) {
  return users.find((user) => isSameUsername(user.username, username));
}

function hasUsernameInList(list, username) {
  return Array.isArray(list) && list.some((entry) => isSameUsername(entry, username));
}

function ensureUsernameInList(list, username) {
  if (!hasUsernameInList(list, username)) {
    list.push(username);
  }
}

function removeUsernameFromList(list, username) {
  return (Array.isArray(list) ? list : []).filter((entry) => !isSameUsername(entry, username));
}

function areFriends(users, usernameA, usernameB) {
  const userA = findUser(users, usernameA);
  const userB = findUser(users, usernameB);

  if (!userA || !userB) {
    return false;
  }

  return hasUsernameInList(userA.friends, userB.username) && hasUsernameInList(userB.friends, userA.username);
}

function isBlockedBy(users, blockerUsername, blockedUsername) {
  const blocker = findUser(users, blockerUsername);
  if (!blocker) {
    return false;
  }

  return hasUsernameInList(blocker.blockedUsers, blockedUsername);
}

function isBlockedEitherDirection(users, usernameA, usernameB) {
  return isBlockedBy(users, usernameA, usernameB) || isBlockedBy(users, usernameB, usernameA);
}

function buildUsersListForUser(username, users) {
  const currentUser = findUser(users, username);
  if (!currentUser) {
    return [];
  }

  return currentUser.friends
    .map((friendUsername) => {
      const friendUser = findUser(users, friendUsername);
      if (!friendUser) {
        return null;
      }

      const onlineUser = getConnectedUserByUsername(friendUser.username);
      const showOnlineStatus = Boolean(onlineUser) && isOnlineStatusVisibleToOthers(friendUser);
      return {
        username: friendUser.username,
        online: showOnlineStatus,
        socketId: showOnlineStatus ? onlineUser?.socketId || '' : '',
        about: onlineUser?.about || friendUser.about || 'Available to chat',
        avatarUrl: onlineUser?.avatarUrl || friendUser.avatarUrl || ''
      };
    })
    .filter(Boolean);
}

function notifyFriendStateChanged(usernames) {
  const unique = new Set();
  usernames.forEach((name) => {
    if (!name) {
      return;
    }
    unique.add(String(name).toLowerCase());
  });

  connectedUsers.forEach((connectedUser, socketId) => {
    if (unique.has(String(connectedUser.username).toLowerCase())) {
      io.to(socketId).emit('friends-updated');
    }
  });
}

function readUsers() {
  return cloneJson(usersCache);
}

function writeUsers(users) {
  usersCache = (Array.isArray(users) ? users : []).map(normalizeUser);
  const snapshot = cloneJson(usersCache);

  usersWriteQueue = usersWriteQueue
    .then(async () => {
      const collections = await getMongoCollections();
      await collections.users.deleteMany({});
      if (snapshot.length > 0) {
        await collections.users.insertMany(
          snapshot.map((user) => ({
            ...user,
            usernameLower: String(user.username || '').toLowerCase()
          }))
        );
      }
    })
    .catch((error) => {
      console.error('Failed to persist users to MongoDB:', error);
    });
}

function normalizeStoredMessage(message) {
  const rawMessage = String(message?.message || '').trim();
  const safeMessage = sanitizeText(rawMessage).slice(0, 300);
  const messageHash = hashMessageText(message?.messageHash || safeMessage || rawMessage).slice(0, 80);

  return {
    ...message,
    message: safeMessage,
    messageHash,
    replyTo: sanitizeReplyPayload(message?.replyTo, message?.fromUsername || ''),
    deletedFor: normalizeUsernameList(message?.deletedFor),
    mood: sanitizeMood(message?.mood),
    reactions: normalizeMessageReactions(message?.reactions)
  };
}

function readMessages() {
  return cloneJson(messagesCache).map(normalizeStoredMessage);
}

function writeMessages(messages) {
  messagesCache = (Array.isArray(messages) ? messages : []).map(normalizeStoredMessage);
  const snapshot = cloneJson(messagesCache);

  messagesWriteQueue = messagesWriteQueue
    .then(async () => {
      const collections = await getMongoCollections();
      await collections.messages.deleteMany({});
      if (snapshot.length > 0) {
        await collections.messages.insertMany(snapshot);
      }
    })
    .catch((error) => {
      console.error('Failed to persist messages to MongoDB:', error);
    });
}

function isSameUsername(a, b) {
  return String(a || '').toLowerCase() === String(b || '').toLowerCase();
}

function isSameEmail(a, b) {
  return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
}

function findUserByLoginIdentifier(users, identifier) {
  const value = String(identifier || '').trim();
  if (!value) {
    return null;
  }

  if (value.includes('@')) {
    return users.find((item) => isSameEmail(item.email, value)) || null;
  }

  return users.find((item) => isSameUsername(item.username, value)) || null;
}

async function isValidPasswordForUser(user, password) {
  const plainPassword = String(password || '');
  const hash = String(user?.passwordHash || '').trim();

  if (hash) {
    try {
      return await bcrypt.compare(plainPassword, hash);
    } catch (_error) {
      // Ignore invalid hash errors and continue with legacy password fallback.
    }
  }

  const legacyPassword = String(user?.password || '');
  if (!legacyPassword) {
    return false;
  }

  return plainPassword === legacyPassword;
}

function isConversationMessage(message, usernameA, usernameB) {
  return (
    (isSameUsername(message.fromUsername, usernameA) && isSameUsername(message.toUsername, usernameB)) ||
    (isSameUsername(message.fromUsername, usernameB) && isSameUsername(message.toUsername, usernameA))
  );
}

function getConversationMessages(usernameA, usernameB) {
  return readMessages()
    .filter((message) => isConversationMessage(message, usernameA, usernameB))
    .filter((message) => !hasUsernameInList(message.deletedFor, usernameA))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

function getKnownContactsForUser(currentUsername) {
  const allMessages = readMessages();
  const users = readUsers();
  const contactNames = new Set();

  allMessages.forEach((message) => {
    if (isSameUsername(message.fromUsername, currentUsername)) {
      contactNames.add(String(message.toUsername || '').trim());
      return;
    }

    if (isSameUsername(message.toUsername, currentUsername)) {
      contactNames.add(String(message.fromUsername || '').trim());
    }
  });

  return Array.from(contactNames)
    .filter(Boolean)
    .map((username) => {
      const profile = users.find((user) => isSameUsername(user.username, username));
      const onlineUser = getConnectedUserByUsername(username);
      const showOnlineStatus = Boolean(onlineUser) && isOnlineStatusVisibleToOthers(profile);

      return {
        username,
        online: showOnlineStatus,
        socketId: showOnlineStatus ? onlineUser?.socketId || '' : '',
        about: onlineUser?.about || profile?.about || 'Available to chat',
        avatarUrl: onlineUser?.avatarUrl || profile?.avatarUrl || ''
      };
    })
    .sort((a, b) => a.username.localeCompare(b.username));
}

function broadcastUsers() {
  const users = readUsers();

  connectedUsers.forEach((connectedUser, socketId) => {
    const list = buildUsersListForUser(connectedUser.username, users);
    io.to(socketId).emit('users-list', list);
  });
}

function getConnectedUserByUsername(username) {
  return Array.from(connectedUsers.values()).find(
    (user) => user.username.toLowerCase() === String(username || '').toLowerCase()
  );
}

function sanitizeText(value) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 300);
}

function sanitizeDateOnly(value) {
  const raw = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return '';
  }

  const timestamp = Date.parse(`${raw}T00:00:00.000Z`);
  return Number.isFinite(timestamp) ? raw : '';
}

function isHashedMessageText(value) {
  const raw = String(value || '').trim();
  return new RegExp(`^${MESSAGE_HASH_PREFIX}[a-f0-9]{64}$`).test(raw);
}

function hashMessageText(value) {
  const plainText = sanitizeText(value);
  if (!plainText) {
    return '';
  }

  if (isHashedMessageText(plainText)) {
    return plainText;
  }

  const digest = crypto.createHash('sha256').update(plainText, 'utf8').digest('hex');
  return `${MESSAGE_HASH_PREFIX}${digest}`;
}

function sanitizeReplyPayload(value, fallbackFromUsername = '') {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const messageId = String(value.messageId || '').trim().slice(0, 80);
  const fromUsername = sanitizeText(value.fromUsername || fallbackFromUsername).slice(0, 30);
  const message = sanitizeText(value.message).slice(0, 300);
  const messageHash = hashMessageText(value.messageHash || message).slice(0, 80);

  if (!messageId || !message) {
    return null;
  }

  return {
    messageId,
    fromUsername: fromUsername || sanitizeText(fallbackFromUsername).slice(0, 30),
    message,
    messageHash
  };
}

function sanitizeReactionEmoji(value) {
  const emoji = String(value || '').trim();
  return ALLOWED_REACTIONS.has(emoji) ? emoji : '';
}

function sanitizeMood(value) {
  const mood = String(value || '').trim().toLowerCase();
  return ALLOWED_CHAT_MOODS.has(mood) ? mood : 'neutral';
}

function sanitizeVoiceAudioUrl(value) {
  const raw = String(value || '').trim();

  if (!raw) {
    return '';
  }

  if (!raw.startsWith('data:audio/')) {
    return '';
  }

  if (raw.length > MAX_VOICE_DATA_URL_LENGTH) {
    return '';
  }

  return raw;
}

function sanitizeVoiceMimeType(value) {
  return String(value || '').trim().slice(0, 60);
}

function sanitizeVoiceDurationMs(value) {
  const duration = Number(value || 0);
  if (!Number.isFinite(duration) || duration < 0) {
    return 0;
  }

  return Math.floor(duration);
}

function sanitizeMediaDataUrl(value) {
  const raw = String(value || '').trim();

  if (!raw) {
    return '';
  }

  if (raw.startsWith('/uploads/')) {
    return raw.slice(0, 220);
  }

  if (!raw.startsWith('data:image/') && !raw.startsWith('data:video/')) {
    return '';
  }

  if (raw.length > MAX_MEDIA_DATA_URL_LENGTH) {
    return '';
  }

  return raw;
}

function sanitizeMediaType(value, fallbackMediaUrl = '') {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'image' || normalized === 'video') {
    return normalized;
  }

  const fromUrl = String(fallbackMediaUrl || '').toLowerCase();
  if (fromUrl.startsWith('data:image/')) {
    return 'image';
  }

  if (fromUrl.startsWith('data:video/')) {
    return 'video';
  }

  return '';
}

function sanitizeMediaMimeType(value) {
  return String(value || '').trim().slice(0, 80);
}

function sanitizeStatusType(value) {
  const type = String(value || '').trim().toLowerCase();
  return ['text', 'image', 'video'].includes(type) ? type : '';
}

function sanitizeStatusDimension(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return parsed;
}

function sanitizeStatusDurationMs(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return parsed;
}

function sanitizeStatusRecord(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const type = sanitizeStatusType(value.type);
  if (!type) {
    return null;
  }

  const createdAtRaw = String(value.createdAt || '').trim();
  const createdAt = createdAtRaw || new Date().toISOString();
  const createdAtMs = new Date(createdAt).getTime();
  if (!Number.isFinite(createdAtMs)) {
    return null;
  }

  const expiresAtRaw = String(value.expiresAt || '').trim();
  const expiresAt = expiresAtRaw || new Date(createdAtMs + STATUS_EXPIRY_MS).toISOString();
  const expiresAtMs = new Date(expiresAt).getTime();
  if (!Number.isFinite(expiresAtMs)) {
    return null;
  }

  if (Date.now() >= expiresAtMs) {
    return null;
  }

  const text = sanitizeText(value.text).slice(0, STATUS_TEXT_MAX_LENGTH);
  const mediaUrl = sanitizeMediaDataUrl(value.mediaUrl);
  const mediaType = sanitizeMediaType(value.mediaType, mediaUrl);
  const mediaMimeType = sanitizeMediaMimeType(value.mediaMimeType);
  const width = sanitizeStatusDimension(value.width);
  const height = sanitizeStatusDimension(value.height);
  const durationMs = sanitizeStatusDurationMs(value.durationMs);
  const views = normalizeStatusViews(value.views);
  const likes = normalizeStatusLikes(value.likes);

  if (type === 'text' && !text) {
    return null;
  }

  if ((type === 'image' || type === 'video') && (!mediaUrl || mediaType !== type)) {
    return null;
  }

  return {
    statusId: String(value.statusId || `status-${createdAtMs}`).trim().slice(0, 90),
    type,
    text,
    mediaUrl,
    mediaType,
    mediaMimeType,
    width,
    height,
    durationMs: type === 'video' ? durationMs : 0,
    views,
    likes,
    createdAt,
    expiresAt
  };
}

function sanitizeStatusList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const now = Date.now();
  const seenIds = new Set();

  return value
    .map((item) => sanitizeStatusRecord(item))
    .filter((item) => {
      if (!item) {
        return false;
      }

      const expiresAtMs = new Date(item.expiresAt).getTime();
      if (!Number.isFinite(expiresAtMs) || expiresAtMs <= now) {
        return false;
      }

      const key = String(item.statusId || '').toLowerCase();
      if (!key || seenIds.has(key)) {
        return false;
      }

      seenIds.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 100);
}

function getActiveStatusesForUser(user) {
  const statusList = [];

  if (Array.isArray(user?.statuses)) {
    statusList.push(...user.statuses);
  }

  if (user?.status) {
    statusList.push(user.status);
  }

  return sanitizeStatusList(statusList);
}

function getActiveStatusForUser(user) {
  return getActiveStatusesForUser(user)[0] || null;
}

const IMAGE_UPLOAD_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.heic', '.heif']);
const VIDEO_UPLOAD_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogv', '.ogg', '.mkv']);

function getMediaTypeFromUploadFile(file) {
  const mimeType = String(file?.mimetype || '').trim().toLowerCase();
  if (mimeType.startsWith('image/')) {
    return 'image';
  }

  if (mimeType.startsWith('video/')) {
    return 'video';
  }

  const extension = path.extname(String(file?.originalname || '')).trim().toLowerCase();
  if (IMAGE_UPLOAD_EXTENSIONS.has(extension)) {
    return 'image';
  }

  if (VIDEO_UPLOAD_EXTENSIONS.has(extension)) {
    return 'video';
  }

  return '';
}

const mediaUploadStorage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, mediaUploadsDir);
  },
  filename(_req, file, callback) {
    const extension = path.extname(String(file.originalname || '')).slice(0, 10);
    const safeExtension = /^[a-zA-Z0-9.]+$/.test(extension) ? extension : '';
    const randomPart = Math.random().toString(36).slice(2, 10);
    callback(null, `${Date.now()}-${randomPart}${safeExtension}`);
  }
});

const mediaUploadMiddleware = multer({
  storage: mediaUploadStorage,
  limits: {
    fileSize: MAX_MEDIA_UPLOAD_BYTES
  },
  fileFilter(_req, file, callback) {
    if (getMediaTypeFromUploadFile(file)) {
      callback(null, true);
      return;
    }

    callback(new Error('Only image and video files are allowed.'));
  }
});

function sanitizeEmail(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .slice(0, 120);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
}

function parseEnvBoolean(value, fallback) {
  const normalized = String(value ?? '')
    .trim()
    .replace(/^['\"]|['\"]$/g, '')
    .toLowerCase();

  if (!normalized) {
    return fallback;
  }

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function getMongoConfig() {
  const uri = String(process.env.MONGODB_URI || '').trim();
  const dbName = String(process.env.MONGODB_DB_NAME || 'mychattingapplication').trim();

  if (!uri) {
    throw new Error('MongoDB is required. Set MONGODB_URI and MONGODB_DB_NAME in .env.');
  }

  return {
    uri,
    dbName: dbName || 'mychattingapplication'
  };
}

async function getMongoCollections() {
  const mongo = getMongoConfig();

  if (!mongoClientPromise) {
    const client = new MongoClient(mongo.uri, {
      serverSelectionTimeoutMS: 8000
    });
    mongoClientPromise = client.connect();
  }

  if (!mongoCollectionsPromise) {
    mongoCollectionsPromise = mongoClientPromise.then(async (client) => {
      const db = client.db(mongo.dbName);
      const users = db.collection('users');
      const messages = db.collection('messages');
      const meta = db.collection('meta');

      await users.createIndex({ email: 1 }, { unique: true });
      await users.createIndex({ usernameLower: 1 }, { unique: true });
      await messages.createIndex({ messageId: 1 });

      return { users, messages, meta };
    });
  }

  return mongoCollectionsPromise;
}

async function getMongoUsersCollection() {
  const collections = await getMongoCollections();
  return collections.users;
}

async function initializeDataStore() {
  ensureJsonFile(usersFilePath, []);
  ensureJsonFile(messagesFilePath, []);

  const jsonUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf8')).map(normalizeUser);
  const jsonMessages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8')).map(normalizeStoredMessage);

  const collections = await getMongoCollections();
  const migrationKey = 'json_to_mongo_v1';
  const migrationState = await collections.meta.findOne({ _id: migrationKey });

  if (!migrationState) {
    const existingUsersCount = await collections.users.countDocuments();
    const existingMessagesCount = await collections.messages.countDocuments();

    if (existingUsersCount === 0 && jsonUsers.length > 0) {
      await collections.users.insertMany(
        jsonUsers.map((user) => ({
          ...user,
          usernameLower: String(user.username || '').toLowerCase()
        }))
      );
    }

    if (existingMessagesCount === 0 && jsonMessages.length > 0) {
      await collections.messages.insertMany(jsonMessages);
    }

    await collections.meta.updateOne(
      { _id: migrationKey },
      {
        $set: {
          migratedAt: new Date().toISOString(),
          sourceUsers: jsonUsers.length,
          sourceMessages: jsonMessages.length
        }
      },
      { upsert: true }
    );
  }

  usersCache = (await collections.users.find({}, { projection: { _id: 0 } }).toArray()).map(normalizeUser);
  messagesCache = (await collections.messages.find({}, { projection: { _id: 0 } }).toArray()).map(normalizeStoredMessage);
  writeMessages(messagesCache);
  await messagesWriteQueue;
  lastCacheRefreshAt = Date.now();
}

async function refreshCachesFromMongo({ force = false } = {}) {
  const now = Date.now();
  if (!force && now - lastCacheRefreshAt < CACHE_REFRESH_TTL_MS) {
    return;
  }

  if (cacheRefreshInFlight) {
    await cacheRefreshInFlight;
    return;
  }

  cacheRefreshInFlight = (async () => {
    const collections = await getMongoCollections();
    const [freshUsers, freshMessages] = await Promise.all([
      collections.users.find({}, { projection: { _id: 0 } }).toArray(),
      collections.messages.find({}, { projection: { _id: 0 } }).toArray()
    ]);

    usersCache = freshUsers.map(normalizeUser);
    messagesCache = freshMessages.map(normalizeStoredMessage);
    lastCacheRefreshAt = Date.now();
  })()
    .catch((error) => {
      console.error('Failed to refresh cache from MongoDB:', error);
    })
    .finally(() => {
      cacheRefreshInFlight = null;
    });

  await cacheRefreshInFlight;
}

async function flushWrites() {
  await Promise.all([usersWriteQueue, messagesWriteQueue]);
}

async function shutdownMongo() {
  const client = await mongoClientPromise;
  if (client) {
    await client.close();
  }
}

function generateOtpCode() {
  const minimum = 10 ** (OTP_LENGTH - 1);
  const maximum = (10 ** OTP_LENGTH) - 1;
  return String(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
}

async function sendRegistrationOtpEmail(email, username, otpCode) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM with real values (not example placeholders).');
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
    tls: smtp.tls
  });

  await transporter.sendMail({
    from: smtp.from,
    to: email,
    subject: 'Your OTP code - My Secure Chat',
    text: [
      `Hi ${username},`,
      '',
      `Your OTP code is: ${otpCode}`,
      '',
      'This code will expire in 5 minutes.',
      'If you did not request this, ignore this email.'
    ].join('\n')
  });
}

async function sendPasswordResetOtpEmail(email, username, otpCode) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM with real values (not example placeholders).');
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
    tls: smtp.tls
  });

  await transporter.sendMail({
    from: smtp.from,
    to: email,
    subject: 'Password reset OTP - My Secure Chat',
    text: [
      `Hi ${username},`,
      '',
      `Your password reset OTP is: ${otpCode}`,
      '',
      'This code will expire in 5 minutes.',
      'If you did not request this, ignore this email.'
    ].join('\n')
  });
}

async function sendPasswordResetSuccessEmail(email, username) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
    tls: smtp.tls
  });

  await transporter.sendMail({
    from: smtp.from,
    to: email,
    subject: 'Password reset successful - My Secure Chat',
    text: [
      `Hi ${username},`,
      '',
      'Your password was reset successfully.',
      'If you did not perform this action, change your password immediately and contact support.',
      '',
      'For security, your active sessions were signed out.'
    ].join('\n')
  });
}

async function sendRegistrationSuccessEmail(email, username) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
    tls: smtp.tls
  });

  await transporter.sendMail({
    from: smtp.from,
    to: email,
    subject: 'Registration successful - My Secure Chat',
    text: [
      `Hi ${username},`,
      '',
      'You have successfully registered in My Secure Chat.',
      'Your account is now active.',
      '',
      'If you did not request this, ignore this email.'
    ].join('\n')
  });
}

function getSmtpConfig() {
  const readSmtpEnv = (value) => String(value || '').trim().replace(/^['\"]|['\"]$/g, '').trim();
  const host = readSmtpEnv(process.env.SMTP_HOST);
  const port = Number.parseInt(readSmtpEnv(process.env.SMTP_PORT) || '587', 10);
  const user = readSmtpEnv(process.env.SMTP_USER);
  const rawPass = readSmtpEnv(process.env.SMTP_PASS);
  const pass = host.toLowerCase().includes('gmail') ? rawPass.replace(/\s+/g, '') : rawPass;
  const fromAddress = readSmtpEnv(process.env.SMTP_FROM) || user;
  const fromName = readSmtpEnv(process.env.SMTP_FROM_NAME) || 'My Secure Chat';
  const from = fromAddress.includes('<') && fromAddress.includes('>')
    ? fromAddress
    : `"${fromName.replace(/\"/g, '')}" <${fromAddress}>`;
  const secure = parseEnvBoolean(process.env.SMTP_SECURE, false);
  const tlsRejectUnauthorized = parseEnvBoolean(process.env.SMTP_TLS_REJECT_UNAUTHORIZED, true);
  const usesPlaceholderCredentials =
    isSameEmail(user, 'your-email@gmail.com') ||
    pass.toLowerCase() === 'your-app-password' ||
    pass.toLowerCase() === 'your-password';

  if (!host || !Number.isFinite(port) || port <= 0 || !user || !pass || !fromAddress || usesPlaceholderCredentials) {
    return null;
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass },
    from,
    tls: {
      rejectUnauthorized: tlsRejectUnauthorized
    }
  };
}

function formatEmailSendError(error) {
  const message = String(error?.message || '').trim();
  const lower = message.toLowerCase();
  const response = String(error?.response || '').toLowerCase();
  const rawResponse = String(error?.response || '').trim();
  const smtpCode = Number(error?.responseCode || 0);
  const authCode = String(error?.code || '').toUpperCase();

  if (lower.includes('self-signed certificate')) {
    return 'SMTP certificate issue: self-signed certificate in chain. For local testing only, set SMTP_TLS_REJECT_UNAUTHORIZED=false in .env and restart the server.';
  }

  if (
    smtpCode === 535 ||
    authCode === 'EAUTH' ||
    lower.includes('invalid login') ||
    lower.includes('username and password not accepted') ||
    lower.includes('badcredentials') ||
    lower.includes('535-5.7.8') ||
    response.includes('535-5.7.8') ||
    response.includes('badcredentials')
  ) {
    const providerHint = rawResponse ? ` SMTP provider response: ${rawResponse}` : '';
    return `SMTP login failed (535). For Gmail, use your full Gmail address in SMTP_USER and a 16-character Google App Password in SMTP_PASS (not your normal Gmail password). Confirm 2-Step Verification is enabled, then restart the server.${providerHint}`;
  }

  return message || 'Unable to send registration email.';
}

function sanitizeAvatarUrl(value) {
  const raw = String(value || '').trim();

  if (!raw) {
    return { ok: true, value: '' };
  }

  if (raw.startsWith('data:image/')) {
    if (raw.length > MAX_AVATAR_DATA_URL_LENGTH) {
      return {
        ok: false,
        error: 'Profile image is too large. Please choose a smaller image (under 6 MB).'
      };
    }

    return { ok: true, value: raw };
  }

  if (/^https?:\/\//i.test(raw)) {
    return { ok: true, value: raw.slice(0, 2000) };
  }

  return { ok: true, value: '' };
}

function sanitizeProfileVisibility(value) {
  return String(value || '').trim().toLowerCase() === 'private' ? 'private' : 'public';
}

function sanitizeOnlineVisibility(value) {
  return String(value || '').trim().toLowerCase() === 'hidden' ? 'hidden' : 'visible';
}

function isOnlineStatusVisibleToOthers(user) {
  return sanitizeOnlineVisibility(user?.onlineVisibility) === 'visible';
}

function canViewerSeeProfileDetails(users, viewerUsername, targetUser) {
  if (!targetUser) {
    return false;
  }

  if (isSameUsername(viewerUsername, targetUser.username)) {
    return true;
  }

  if (sanitizeProfileVisibility(targetUser.profileVisibility) === 'public') {
    return true;
  }

  if (!areFriends(users, viewerUsername, targetUser.username)) {
    return false;
  }

  return !isBlockedEitherDirection(users, viewerUsername, targetUser.username);
}

function getProfileFromUser(user) {
  return {
    about: user?.about || 'Available to chat',
    avatarUrl: user?.avatarUrl || '',
    profileVisibility: sanitizeProfileVisibility(user?.profileVisibility),
    onlineVisibility: sanitizeOnlineVisibility(user?.onlineVisibility)
  };
}

app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
if (String(process.env.TRUST_PROXY || '').toLowerCase() === 'true') {
  app.set('trust proxy', 1);
}
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.use('/api', async (_req, _res, next) => {
  try {
    await refreshCachesFromMongo();
    next();
  } catch (error) {
    next(error);
  }
});

app.post('/api/media-upload', (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: 'You must be logged in to upload media.' });
  }

  mediaUploadMiddleware.single('media')(req, res, (error) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File is too large. Please choose a smaller file.' });
      }

      return res.status(400).json({ error: error.message || 'Upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const mimeType = sanitizeMediaMimeType(req.file.mimetype);
    const mediaType = getMediaTypeFromUploadFile(req.file);
    if (!mediaType) {
      return res.status(400).json({ error: 'Unsupported media type.' });
    }

    return res.json({
      ok: true,
      mediaUrl: `/uploads/${req.file.filename}`,
      mediaType,
      mediaMimeType: mimeType,
      size: Number(req.file.size || 0),
      originalName: String(req.file.originalname || '').slice(0, 240)
    });
  });
});

app.post('/api/register/request-otp', async (req, res) => {
  try {
    const email = sanitizeEmail(req.body?.email);
    const username = sanitizeText(req.body?.username).slice(0, 30);
    const password = String(req.body?.password || '').trim();

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters.' });
    }

    const smtp = getSmtpConfig();
    if (!smtp) {
      return res.status(500).json({
        error:
          'Email OTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in .env.'
      });
    }

    const users = readUsers();
    const emailExists = users.some((user) => isSameEmail(user.email, email));
    if (emailExists) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    const usernameExists = users.some((user) => isSameUsername(user.username, username));
    if (usernameExists) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    const usersCollection = await getMongoUsersCollection();
    const existingMongoUser = await usersCollection.findOne({
      $or: [{ email }, { usernameLower: username.toLowerCase() }]
    });

    if (existingMongoUser) {
      if (isSameEmail(existingMongoUser.email, email)) {
        return res.status(409).json({ error: 'Email already exists.' });
      }

      return res.status(409).json({ error: 'Username already exists.' });
    }

    const now = Date.now();
    const existingPending = pendingRegistrations.get(email);
    if (existingPending && existingPending.lastOtpSentAt + OTP_RESEND_COOLDOWN_MS > now) {
      const waitSeconds = Math.ceil((existingPending.lastOtpSentAt + OTP_RESEND_COOLDOWN_MS - now) / 1000);
      return res.status(429).json({ error: `Please wait ${waitSeconds}s before requesting another OTP.` });
    }

    const otpCode = generateOtpCode();
    const otpHash = await bcrypt.hash(otpCode, OTP_BCRYPT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, 10);

    pendingRegistrations.set(email, {
      email,
      username,
      passwordHash,
      otpHash,
      attempts: 0,
      expiresAt: now + OTP_EXPIRY_MS,
      lastOtpSentAt: now
    });

    try {
      await sendRegistrationOtpEmail(email, username, otpCode);
    } catch (error) {
      pendingRegistrations.delete(email);
      console.warn(`OTP email failed for ${email}: ${formatEmailSendError(error)}`);
      return res.status(500).json({ error: formatEmailSendError(error) || 'Unable to send OTP email.' });
    }

    return res.json({
      ok: true,
      email,
      message: 'OTP sent to your email. Enter the code within 5 minutes to create your account.'
    });
  } catch (error) {
    console.error('Register request OTP API error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.post('/api/register/verify-otp', async (req, res) => {
  try {
    const email = sanitizeEmail(req.body?.email);
    const otp = String(req.body?.otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'OTP must be a 6-digit code.' });
    }

    const pending = pendingRegistrations.get(email);
    if (!pending) {
      return res.status(400).json({ error: 'No active OTP request found. Please request a new OTP.' });
    }

    if (Date.now() > pending.expiresAt) {
      pendingRegistrations.delete(email);
      return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
    }

    if (pending.attempts >= OTP_MAX_ATTEMPTS) {
      pendingRegistrations.delete(email);
      return res.status(429).json({ error: 'Maximum OTP attempts reached. Please request a new OTP.' });
    }

    const otpMatches = await bcrypt.compare(otp, pending.otpHash);
    if (!otpMatches) {
      pending.attempts += 1;

      if (pending.attempts >= OTP_MAX_ATTEMPTS) {
        pendingRegistrations.delete(email);
        return res.status(429).json({ error: 'Maximum OTP attempts reached. Please request a new OTP.' });
      }

      const remainingAttempts = OTP_MAX_ATTEMPTS - pending.attempts;
      return res.status(400).json({ error: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.` });
    }

    const usersCollection = await getMongoUsersCollection();
    const users = readUsers();

    const emailExists = users.some((user) => isSameEmail(user.email, pending.email));
    if (emailExists) {
      pendingRegistrations.delete(email);
      return res.status(409).json({ error: 'Email already exists.' });
    }

    const usernameExists = users.some((user) => isSameUsername(user.username, pending.username));
    if (usernameExists) {
      pendingRegistrations.delete(email);
      return res.status(409).json({ error: 'Username already exists.' });
    }

    const existingMongoUser = await usersCollection.findOne({
      $or: [{ email: pending.email }, { usernameLower: pending.username.toLowerCase() }]
    });

    if (existingMongoUser) {
      pendingRegistrations.delete(email);
      if (isSameEmail(existingMongoUser.email, pending.email)) {
        return res.status(409).json({ error: 'Email already exists.' });
      }

      return res.status(409).json({ error: 'Username already exists.' });
    }

    const createdAt = new Date().toISOString();
    const userRecord = {
      email: pending.email,
      username: pending.username,
      usernameLower: pending.username.toLowerCase(),
      passwordHash: pending.passwordHash,
      about: 'Available to chat',
      avatarUrl: '',
      profileVisibility: 'public',
      onlineVisibility: 'visible',
      friends: [],
      blockedUsers: [],
      incomingRequests: [],
      outgoingRequests: [],
      profilePhotoViews: {},
      createdAt
    };

    try {
      await usersCollection.insertOne(userRecord);
    } catch (error) {
      if (error && error.code === 11000) {
        pendingRegistrations.delete(email);
        return res.status(409).json({ error: 'Email or username already exists.' });
      }

      throw error;
    }

    users.push({
      email: userRecord.email,
      username: userRecord.username,
      passwordHash: userRecord.passwordHash,
      about: userRecord.about,
      avatarUrl: userRecord.avatarUrl,
      profileVisibility: userRecord.profileVisibility,
      onlineVisibility: userRecord.onlineVisibility,
      friends: userRecord.friends,
      blockedUsers: userRecord.blockedUsers,
      incomingRequests: userRecord.incomingRequests,
      outgoingRequests: userRecord.outgoingRequests,
      profilePhotoViews: userRecord.profilePhotoViews,
      createdAt: userRecord.createdAt
    });
    writeUsers(users);

    pendingRegistrations.delete(email);

    try {
      await sendRegistrationSuccessEmail(userRecord.email, userRecord.username);
    } catch (error) {
      console.warn(`Registration confirmation email failed for ${userRecord.email}: ${formatEmailSendError(error)}`);
    }

    return res.json({
      ok: true,
      email: userRecord.email,
      message: 'Email verified and account created successfully. Please log in.'
    });
  } catch (error) {
    console.error('Register verify OTP API error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.post('/api/password-reset/request-otp', async (req, res) => {
  try {
    const email = sanitizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const smtp = getSmtpConfig();
    if (!smtp) {
      return res.status(500).json({
        error:
          'Email OTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in .env.'
      });
    }

    const users = readUsers();
    const user = users.find((item) => isSameEmail(item.email, email));

    if (!user) {
      // Do not reveal account existence for this endpoint.
      return res.json({
        ok: true,
        email,
        message: 'If this email is registered, an OTP has been sent. Enter the code within 5 minutes.'
      });
    }

    const now = Date.now();
    const existingPending = pendingPasswordResets.get(email);
    if (existingPending && existingPending.lastOtpSentAt + OTP_RESEND_COOLDOWN_MS > now) {
      const waitSeconds = Math.ceil((existingPending.lastOtpSentAt + OTP_RESEND_COOLDOWN_MS - now) / 1000);
      return res.status(429).json({ error: `Please wait ${waitSeconds}s before requesting another OTP.` });
    }

    const otpCode = generateOtpCode();
    const otpHash = await bcrypt.hash(otpCode, OTP_BCRYPT_ROUNDS);

    pendingPasswordResets.set(email, {
      email,
      username: user.username,
      otpHash,
      attempts: 0,
      verified: false,
      verifiedAt: 0,
      expiresAt: now + OTP_EXPIRY_MS,
      lastOtpSentAt: now
    });

    try {
      await sendPasswordResetOtpEmail(email, user.username, otpCode);
    } catch (error) {
      pendingPasswordResets.delete(email);
      console.warn(`Password reset OTP email failed for ${email}: ${formatEmailSendError(error)}`);
      return res.status(500).json({ error: formatEmailSendError(error) || 'Unable to send OTP email.' });
    }

    return res.json({
      ok: true,
      email,
      message: 'If this email is registered, an OTP has been sent. Enter the code within 5 minutes.'
    });
  } catch (error) {
    console.error('Password reset request OTP API error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.post('/api/password-reset/verify-otp', async (req, res) => {
  try {
    const email = sanitizeEmail(req.body?.email);
    const otp = String(req.body?.otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'OTP must be a 6-digit code.' });
    }

    const pending = pendingPasswordResets.get(email);
    if (!pending) {
      return res.status(400).json({ error: 'No active OTP request found. Please request a new OTP.' });
    }

    if (Date.now() > pending.expiresAt) {
      pendingPasswordResets.delete(email);
      return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
    }

    if (pending.attempts >= OTP_MAX_ATTEMPTS) {
      pendingPasswordResets.delete(email);
      return res.status(429).json({ error: 'Maximum OTP attempts reached. Please request a new OTP.' });
    }

    const otpMatches = await bcrypt.compare(otp, pending.otpHash);
    if (!otpMatches) {
      pending.attempts += 1;

      if (pending.attempts >= OTP_MAX_ATTEMPTS) {
        pendingPasswordResets.delete(email);
        return res.status(429).json({ error: 'Maximum OTP attempts reached. Please request a new OTP.' });
      }

      const remainingAttempts = OTP_MAX_ATTEMPTS - pending.attempts;
      return res.status(400).json({ error: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.` });
    }

    pending.attempts = 0;
    pending.verified = true;
    pending.verifiedAt = Date.now();
    pending.expiresAt = pending.verifiedAt + PASSWORD_RESET_VERIFIED_EXPIRY_MS;

    return res.json({ ok: true, email, message: 'OTP verified. You can reset your password now.' });
  } catch (error) {
    console.error('Password reset verify OTP API error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.post('/api/password-reset/reset', async (req, res) => {
  try {
    const email = sanitizeEmail(req.body?.email);
    const newPassword = String(req.body?.newPassword || '').trim();

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters.' });
    }

    const pending = pendingPasswordResets.get(email);
    if (!pending || !pending.verified) {
      return res.status(400).json({ error: 'Please verify OTP before resetting password.' });
    }

    if (Date.now() > pending.expiresAt) {
      pendingPasswordResets.delete(email);
      return res.status(400).json({ error: 'Reset session expired. Please request OTP again.' });
    }

    const users = readUsers();
    const user = users.find((item) => isSameEmail(item.email, email));

    if (!user) {
      pendingPasswordResets.delete(email);
      return res.status(404).json({ error: 'User not found.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    delete user.password;
    writeUsers(users);
    pendingPasswordResets.delete(email);

    connectedUsers.forEach((connectedUser, socketId) => {
      if (!isSameUsername(connectedUser.username, user.username)) {
        return;
      }

      io.to(socketId).emit('system-message', 'Password reset completed. Please log in again.');
      const targetSocket = io.sockets.sockets.get(socketId);
      if (targetSocket) {
        targetSocket.disconnect(true);
      }
      connectedUsers.delete(socketId);
    });

    broadcastUsers();

    try {
      await sendPasswordResetSuccessEmail(user.email, user.username);
    } catch (error) {
      console.warn(`Password reset confirmation email failed for ${user.email}: ${formatEmailSendError(error)}`);
    }

    return res.json({ ok: true, message: 'Password reset successful. Please log in with your new password.' });
  } catch (error) {
    console.error('Password reset API error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.post('/api/login', async (req, res) => {
  const loginIdentifier = String(req.body?.email || req.body?.username || req.body?.identifier || '').trim();
  const password = String(req.body?.password || '').trim();

  if (!loginIdentifier || !password) {
    return res.status(400).json({ error: 'Email or username and password are required.' });
  }

  if (loginIdentifier.includes('@') && !isValidEmail(loginIdentifier)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const users = readUsers();
  const user = findUserByLoginIdentifier(users, loginIdentifier);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const validPassword = await isValidPasswordForUser(user, password);

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.password) {
    user.passwordHash = await bcrypt.hash(password, 10);
    delete user.password;
    writeUsers(users);
  }

  req.session.username = user.username;
  return res.json({ ok: true, username: user.username, email: user.email || '', profile: getProfileFromUser(user) });
});

app.get('/api/session', (req, res) => {
  const username = req.session.username || null;
  const users = readUsers();
  const user = username
    ? users.find((item) => item.username.toLowerCase() === String(username).toLowerCase())
    : null;

  res.json({
    authenticated: Boolean(username),
    username,
    email: user?.email || null,
    profile: getProfileFromUser(user)
  });
});

app.post('/api/profile', (req, res) => {
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ error: 'You must be logged in to update profile.' });
  }

  const users = readUsers();
  const user = users.find((item) => item.username.toLowerCase() === String(username).toLowerCase());

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const safeAvatar = sanitizeAvatarUrl(req.body?.avatarUrl);
  if (!safeAvatar.ok) {
    return res.status(413).json({ error: safeAvatar.error });
  }

  user.about = sanitizeText(req.body?.about).slice(0, 80) || 'Available to chat';
  user.avatarUrl = safeAvatar.value;
  user.profileVisibility = sanitizeProfileVisibility(req.body?.profileVisibility);
  user.onlineVisibility = sanitizeOnlineVisibility(req.body?.onlineVisibility);
  writeUsers(users);

  connectedUsers.forEach((connectedUser, socketId) => {
    if (connectedUser.username.toLowerCase() === user.username.toLowerCase()) {
      connectedUsers.set(socketId, {
        ...connectedUser,
        about: user.about,
        avatarUrl: user.avatarUrl,
        onlineVisibility: user.onlineVisibility
      });
    }
  });

  broadcastUsers();
  return res.json({ ok: true, profile: getProfileFromUser(user) });
});

app.post('/api/profile/photo-view-open', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }

  const ownerUsername = sanitizeText(req.body?.ownerUsername).slice(0, 30);
  if (!ownerUsername) {
    return res.status(400).json({ error: 'Profile owner username is required.' });
  }

  if (isSameUsername(currentUsername, ownerUsername)) {
    return res.json({ ok: true, recorded: false });
  }

  const users = readUsers();
  const viewer = findUser(users, currentUsername);
  const owner = findUser(users, ownerUsername);

  if (!viewer || !owner) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!areFriends(users, viewer.username, owner.username)) {
    return res.status(403).json({ error: 'Only friends can open this profile photo.' });
  }

  if (isBlockedEitherDirection(users, viewer.username, owner.username)) {
    return res.status(403).json({ error: 'You cannot open this profile photo.' });
  }

  if (!sanitizeAvatarUrl(owner.avatarUrl).value) {
    return res.json({ ok: true, recorded: false });
  }

  const normalizedViews = normalizeProfilePhotoViews(owner.profilePhotoViews);
  const viewerKey = viewer.username.toLowerCase();
  const previous = normalizedViews[viewerKey] || { username: viewer.username, count: 0 };

  normalizedViews[viewerKey] = {
    username: viewer.username,
    count: (previous.count || 0) + 1,
    lastViewedAt: new Date().toISOString()
  };

  owner.profilePhotoViews = normalizedViews;
  writeUsers(users);

  return res.json({ ok: true, recorded: true });
});

app.get('/api/profile/photo-views', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({
    ok: true,
    views: getProfilePhotoViewsForUser(currentUser)
  });
});

app.post('/api/change-password', async (req, res) => {
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ error: 'You must be logged in to change password.' });
  }

  const oldPassword = String(req.body?.oldPassword || '').trim();
  const newPassword = String(req.body?.newPassword || '').trim();

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old password and new password are required.' });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters.' });
  }

  const users = readUsers();
  const user = users.find((item) => item.username.toLowerCase() === String(username).toLowerCase());

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const validPassword = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Old password is incorrect.' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  writeUsers(users);

  // Force logout on all active sockets for this user for security.
  connectedUsers.forEach((connectedUser, socketId) => {
    if (!isSameUsername(connectedUser.username, user.username)) {
      return;
    }

    io.to(socketId).emit('system-message', 'Password changed. Please log in again.');
    const targetSocket = io.sockets.sockets.get(socketId);
    if (targetSocket) {
      targetSocket.disconnect(true);
    }
    connectedUsers.delete(socketId);
  });

  broadcastUsers();

  req.session.destroy(() => {
    res.json({ ok: true, message: 'Password changed successfully. Please log in with your new password.' });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/friends', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to load friends.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);
  if (!currentUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({
    ok: true,
    friends: buildUsersListForUser(currentUser.username, users),
    blockedUsers: currentUser.blockedUsers,
    incomingRequests: currentUser.incomingRequests,
    outgoingRequests: currentUser.outgoingRequests
  });
});

app.get('/api/friends/search', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to search users.' });
  }

  const query = sanitizeText(req.query?.q).slice(0, 30).toLowerCase();
  if (!query) {
    return res.json({ ok: true, results: [] });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const onlineSet = new Set(Array.from(connectedUsers.values()).map((item) => String(item.username).toLowerCase()));
  const minimumMatchRatio = 0.7;

  const results = users
    .filter((user) => {
      const username = String(user.username || '');
      const normalizedUsername = username.toLowerCase();

      if (!normalizedUsername.includes(query)) {
        return false;
      }

      if (query.length / Math.max(normalizedUsername.length, 1) < minimumMatchRatio) {
        return false;
      }

      if (isSameUsername(username, currentUser.username)) {
        return false;
      }

      return true;
    })
    .map((user) => {
      const username = user.username;
      const canSeeProfile = canViewerSeeProfileDetails(users, currentUser.username, user);
      let relation = 'none';

      if (hasUsernameInList(currentUser.friends, username)) {
        relation = 'friend';
      } else if (hasUsernameInList(currentUser.blockedUsers, username)) {
        relation = 'blocked';
      } else if (hasUsernameInList(currentUser.outgoingRequests, username)) {
        relation = 'outgoing';
      } else if (hasUsernameInList(currentUser.incomingRequests, username)) {
        relation = 'incoming';
      }

      return {
        username,
        online: canSeeProfile ? onlineSet.has(String(username || '').toLowerCase()) : false,
        about: canSeeProfile ? user.about || 'Available to chat' : '',
        avatarUrl: canSeeProfile ? user.avatarUrl || '' : '',
        isProfileVisible: canSeeProfile,
        relation,
        matchRatio: query.length / Math.max(String(username || '').length, 1)
      };
    })
    .sort((a, b) => {
      if (b.matchRatio !== a.matchRatio) {
        return b.matchRatio - a.matchRatio;
      }

      const aName = String(a.username || '').toLowerCase();
      const bName = String(b.username || '').toLowerCase();
      const aStartsWithQuery = aName.startsWith(query);
      const bStartsWithQuery = bName.startsWith(query);

      if (aStartsWithQuery !== bStartsWithQuery) {
        return aStartsWithQuery ? -1 : 1;
      }

      return aName.localeCompare(bName);
    })
    .map(({ matchRatio, ...entry }) => entry)
    .slice(0, 20);

  return res.json({ ok: true, results });
});

app.post('/api/friends/request', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to add friends.' });
  }

  const targetUsername = sanitizeText(req.body?.username).slice(0, 30);
  if (!targetUsername) {
    return res.status(400).json({ error: 'Please enter a valid username.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);
  const targetUser = findUser(users, targetUsername);

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!targetUser) {
    return res.status(404).json({ error: 'That user does not exist.' });
  }

  if (isSameUsername(currentUser.username, targetUser.username)) {
    return res.status(400).json({ error: 'You cannot add yourself.' });
  }

  if (isBlockedBy(users, currentUser.username, targetUser.username)) {
    return res.status(409).json({ error: 'Unblock this user first to send a request.' });
  }

  if (isBlockedBy(users, targetUser.username, currentUser.username)) {
    return res.status(409).json({ error: 'This user has blocked you.' });
  }

  if (hasUsernameInList(currentUser.friends, targetUser.username)) {
    return res.status(409).json({ error: 'This user is already your friend.' });
  }

  if (hasUsernameInList(currentUser.outgoingRequests, targetUser.username)) {
    return res.status(409).json({ error: 'Friend request already sent.' });
  }

  if (hasUsernameInList(currentUser.incomingRequests, targetUser.username)) {
    return res.status(409).json({ error: 'This user already sent you a request. Accept it in Friends.' });
  }

  ensureUsernameInList(currentUser.outgoingRequests, targetUser.username);
  ensureUsernameInList(targetUser.incomingRequests, currentUser.username);
  writeUsers(users);

  notifyFriendStateChanged([currentUser.username, targetUser.username]);
  broadcastUsers();

  return res.json({ ok: true, message: 'Friend request sent. They will see it when they come online.' });
});

app.post('/api/friends/respond', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to respond to requests.' });
  }

  const fromUsername = sanitizeText(req.body?.username).slice(0, 30);
  const action = String(req.body?.action || '').toLowerCase();

  if (!fromUsername || !['accept', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid request response.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);
  const fromUser = findUser(users, fromUsername);

  if (!currentUser || !fromUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (isBlockedEitherDirection(users, currentUser.username, fromUser.username)) {
    return res.status(409).json({ error: 'Cannot respond while one of you is blocked.' });
  }

  if (!hasUsernameInList(currentUser.incomingRequests, fromUser.username)) {
    return res.status(404).json({ error: 'Friend request not found.' });
  }

  currentUser.incomingRequests = removeUsernameFromList(currentUser.incomingRequests, fromUser.username);
  fromUser.outgoingRequests = removeUsernameFromList(fromUser.outgoingRequests, currentUser.username);

  if (action === 'accept') {
    ensureUsernameInList(currentUser.friends, fromUser.username);
    ensureUsernameInList(fromUser.friends, currentUser.username);
  }

  writeUsers(users);
  notifyFriendStateChanged([currentUser.username, fromUser.username]);
  broadcastUsers();

  return res.json({ ok: true, action });
});

app.post('/api/friends/cancel', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to cancel requests.' });
  }

  const targetUsername = sanitizeText(req.body?.username).slice(0, 30);
  if (!targetUsername) {
    return res.status(400).json({ error: 'Please enter a valid username.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);
  const targetUser = findUser(users, targetUsername);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!hasUsernameInList(currentUser.outgoingRequests, targetUser.username)) {
    return res.status(404).json({ error: 'Friend request not found.' });
  }

  currentUser.outgoingRequests = removeUsernameFromList(currentUser.outgoingRequests, targetUser.username);
  targetUser.incomingRequests = removeUsernameFromList(targetUser.incomingRequests, currentUser.username);

  writeUsers(users);
  notifyFriendStateChanged([currentUser.username, targetUser.username]);
  broadcastUsers();

  return res.json({ ok: true, message: 'Friend request cancelled.' });
});

app.post('/api/friends/remove', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to remove friends.' });
  }

  const targetUsername = sanitizeText(req.body?.username).slice(0, 30);
  if (!targetUsername) {
    return res.status(400).json({ error: 'Please enter a valid username.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);
  const targetUser = findUser(users, targetUsername);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  currentUser.friends = removeUsernameFromList(currentUser.friends, targetUser.username);
  targetUser.friends = removeUsernameFromList(targetUser.friends, currentUser.username);

  currentUser.outgoingRequests = removeUsernameFromList(currentUser.outgoingRequests, targetUser.username);
  currentUser.incomingRequests = removeUsernameFromList(currentUser.incomingRequests, targetUser.username);
  targetUser.outgoingRequests = removeUsernameFromList(targetUser.outgoingRequests, currentUser.username);
  targetUser.incomingRequests = removeUsernameFromList(targetUser.incomingRequests, currentUser.username);

  writeUsers(users);
  notifyFriendStateChanged([currentUser.username, targetUser.username]);
  broadcastUsers();

  return res.json({ ok: true, message: 'Friend removed.' });
});

app.post('/api/friends/block', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to manage blocks.' });
  }

  const targetUsername = sanitizeText(req.body?.username).slice(0, 30);
  const action = String(req.body?.action || '').toLowerCase();

  if (!targetUsername || !['block', 'unblock'].includes(action)) {
    return res.status(400).json({ error: 'Invalid block request.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);
  const targetUser = findUser(users, targetUsername);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (isSameUsername(currentUser.username, targetUser.username)) {
    return res.status(400).json({ error: 'You cannot block yourself.' });
  }

  if (action === 'block') {
    ensureUsernameInList(currentUser.blockedUsers, targetUser.username);

    // Clean pending requests both ways when blocking.
    currentUser.outgoingRequests = removeUsernameFromList(currentUser.outgoingRequests, targetUser.username);
    currentUser.incomingRequests = removeUsernameFromList(currentUser.incomingRequests, targetUser.username);
    targetUser.outgoingRequests = removeUsernameFromList(targetUser.outgoingRequests, currentUser.username);
    targetUser.incomingRequests = removeUsernameFromList(targetUser.incomingRequests, currentUser.username);
  } else {
    currentUser.blockedUsers = removeUsernameFromList(currentUser.blockedUsers, targetUser.username);
  }

  writeUsers(users);
  notifyFriendStateChanged([currentUser.username, targetUser.username]);
  broadcastUsers();

  return res.json({
    ok: true,
    action,
    message: action === 'block' ? 'User blocked.' : 'User unblocked.'
  });
});

app.get('/api/messages/:username', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to load messages.' });
  }

  const targetUsername = sanitizeText(req.params.username).slice(0, 30);

  if (!targetUsername) {
    return res.status(400).json({ error: 'A valid username is required.' });
  }

  const users = readUsers();
  const targetUser = findUser(users, targetUsername);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!areFriends(users, currentUsername, targetUser.username)) {
    return res.status(403).json({ error: 'You can only view messages with accepted friends.' });
  }

  if (isBlockedEitherDirection(users, currentUsername, targetUser.username)) {
    return res.status(403).json({ error: 'Messages are unavailable because one of you is blocked.' });
  }

  const messages = getConversationMessages(currentUsername, targetUser.username);
  return res.json({ ok: true, messages });
});

app.delete('/api/messages/:username/:messageId', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to delete messages.' });
  }

  const targetUsername = sanitizeText(req.params.username).slice(0, 30);
  const targetMessageId = String(req.params.messageId || '').trim();
  const scope = String(req.query.scope || 'self').toLowerCase();

  if (!targetUsername || !targetMessageId) {
    return res.status(400).json({ error: 'A valid username and message id are required.' });
  }

  if (!['self', 'everyone'].includes(scope)) {
    return res.status(400).json({ error: 'Invalid delete scope.' });
  }

  const users = readUsers();
  const targetUser = findUser(users, targetUsername);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!areFriends(users, currentUsername, targetUser.username)) {
    return res.status(403).json({ error: 'You can only delete messages with accepted friends.' });
  }

  if (isBlockedEitherDirection(users, currentUsername, targetUser.username)) {
    return res.status(403).json({ error: 'Messages are unavailable because one of you is blocked.' });
  }

  const allMessages = readMessages();
  const targetMessage = allMessages.find(
    (message) =>
      String(message.messageId || '') === targetMessageId &&
      isConversationMessage(message, currentUsername, targetUser.username)
  );

  if (!targetMessage) {
    return res.status(404).json({ error: 'Message not found.' });
  }

  if (scope === 'everyone' && !isSameUsername(targetMessage.fromUsername, currentUsername)) {
    return res.status(403).json({ error: 'Only sender can delete this message for everyone.' });
  }

  if (scope === 'everyone') {
    targetMessage.deletedFor = normalizeUsernameList([
      ...(targetMessage.deletedFor || []),
      currentUsername,
      targetUser.username
    ]);
  } else {
    targetMessage.deletedFor = normalizeUsernameList([...(targetMessage.deletedFor || []), currentUsername]);
  }

  writeMessages(allMessages);

  if (scope === 'everyone') {
    const receiverOnline = getConnectedUserByUsername(targetUser.username);
    if (receiverOnline) {
      io.to(receiverOnline.socketId).emit('message-deleted', {
        messageId: targetMessageId,
        withUsername: currentUsername,
        scope: 'everyone'
      });
    }
  }

  return res.json({ ok: true, scope });
});

app.delete('/api/messages/:username', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to delete messages.' });
  }

  const targetUsername = sanitizeText(req.params.username).slice(0, 30);

  if (!targetUsername) {
    return res.status(400).json({ error: 'A valid username is required.' });
  }

  const users = readUsers();
  const targetUser = findUser(users, targetUsername);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!areFriends(users, currentUsername, targetUser.username)) {
    return res.status(403).json({ error: 'You can only delete messages with accepted friends.' });
  }

  if (isBlockedEitherDirection(users, currentUsername, targetUser.username)) {
    return res.status(403).json({ error: 'Messages are unavailable because one of you is blocked.' });
  }

  const selectedDate = sanitizeDateOnly(req.query?.date);
  if (req.query?.date !== undefined && !selectedDate) {
    return res.status(400).json({ error: 'A valid date is required in YYYY-MM-DD format.' });
  }

  const allMessages = readMessages();
  let deletedCount = 0;

  allMessages.forEach((message) => {
    if (!isConversationMessage(message, currentUsername, targetUser.username)) {
      return;
    }

    if (hasUsernameInList(message.deletedFor, currentUsername)) {
      return;
    }

    if (selectedDate) {
      const createdDate = String(message.createdAt || '').slice(0, 10);
      if (createdDate !== selectedDate) {
        return;
      }
    }

    message.deletedFor = normalizeUsernameList([...(message.deletedFor || []), currentUsername]);
    deletedCount += 1;
  });

  writeMessages(allMessages);
  return res.json({ ok: true, deletedCount });
});

app.get('/api/contacts', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to load contacts.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({
    ok: true,
    contacts: buildUsersListForUser(currentUser.username, users)
  });
});

app.get('/api/status', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to load statuses.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const myStatuses = getActiveStatusesForUser(currentUser);
  const myStatus = myStatuses[0] || null;
  const myStatusViewers = myStatus ? getStatusViewsForUser(currentUser) : [];
  const friendStatuses = currentUser.friends
    .map((friendUsername) => {
      const friend = findUser(users, friendUsername);
      if (!friend) {
        return null;
      }

      if (isBlockedEitherDirection(users, currentUser.username, friend.username)) {
        return null;
      }

      const activeStatuses = getActiveStatusesForUser(friend);
      if (activeStatuses.length === 0) {
        return null;
      }

      return {
        username: friend.username,
        about: friend.about || 'Available to chat',
        avatarUrl: friend.avatarUrl || '',
        status: activeStatuses[0],
        statuses: activeStatuses
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.statuses[0].createdAt).getTime() - new Date(a.statuses[0].createdAt).getTime());

  return res.json({
    ok: true,
    myStatus,
    myStatuses,
    myStatusViewers,
    friendStatuses
  });
});

app.post('/api/status/view', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to view status.' });
  }

  const ownerUsername = sanitizeText(req.body?.ownerUsername).slice(0, 30);
  const statusId = String(req.body?.statusId || '').trim().slice(0, 90);

  if (!ownerUsername || !statusId) {
    return res.status(400).json({ error: 'Status owner and status id are required.' });
  }

  if (isSameUsername(ownerUsername, currentUsername)) {
    return res.json({ ok: true });
  }

  const users = readUsers();
  const owner = findUser(users, ownerUsername);
  const viewer = findUser(users, currentUsername);

  if (!owner || !viewer) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!areFriends(users, owner.username, viewer.username)) {
    return res.status(403).json({ error: 'You can only view friends status.' });
  }

  if (isBlockedEitherDirection(users, owner.username, viewer.username)) {
    return res.status(403).json({ error: 'Status is unavailable.' });
  }

  const activeStatuses = getActiveStatusesForUser(owner);
  const statusIndex = activeStatuses.findIndex((item) => String(item?.statusId || '') === statusId);

  if (statusIndex < 0) {
    return res.status(404).json({ error: 'Status not found or expired.' });
  }

  const activeStatus = activeStatuses[statusIndex];
  const normalizedViews = normalizeStatusViews(activeStatus.views);
  const viewerKey = viewer.username.toLowerCase();
  const existing = normalizedViews[viewerKey] || {
    username: viewer.username,
    count: 0,
    lastViewedAt: ''
  };

  normalizedViews[viewerKey] = {
    username: viewer.username,
    count: Math.max(0, Number.parseInt(existing.count, 10) || 0) + 1,
    lastViewedAt: new Date().toISOString()
  };

  activeStatuses[statusIndex] = {
    ...activeStatus,
    views: normalizedViews
  };

  owner.statuses = activeStatuses;
  owner.status = activeStatuses[0] || null;

  writeUsers(users);
  return res.json({ ok: true });
});

app.post('/api/status/like', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to like status.' });
  }

  const ownerUsername = sanitizeText(req.body?.ownerUsername).slice(0, 30);
  const statusId = String(req.body?.statusId || '').trim().slice(0, 90);
  const liked = Boolean(req.body?.liked);

  if (!ownerUsername || !statusId) {
    return res.status(400).json({ error: 'Status owner and status id are required.' });
  }

  const users = readUsers();
  const owner = findUser(users, ownerUsername);
  const liker = findUser(users, currentUsername);

  if (!owner || !liker) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!isSameUsername(owner.username, liker.username)) {
    if (!areFriends(users, owner.username, liker.username)) {
      return res.status(403).json({ error: 'You can only like friends status.' });
    }

    if (isBlockedEitherDirection(users, owner.username, liker.username)) {
      return res.status(403).json({ error: 'Status is unavailable.' });
    }
  }

  const activeStatuses = getActiveStatusesForUser(owner);
  const statusIndex = activeStatuses.findIndex((item) => String(item?.statusId || '') === statusId);

  if (statusIndex < 0) {
    return res.status(404).json({ error: 'Status not found or expired.' });
  }

  const activeStatus = activeStatuses[statusIndex];
  const normalizedLikes = normalizeStatusLikes(activeStatus.likes);
  const likerKey = liker.username.toLowerCase();

  if (liked) {
    normalizedLikes[likerKey] = {
      username: liker.username,
      likedAt: new Date().toISOString()
    };
  } else {
    delete normalizedLikes[likerKey];
  }

  activeStatuses[statusIndex] = {
    ...activeStatus,
    likes: normalizedLikes
  };

  owner.statuses = activeStatuses;
  owner.status = activeStatuses[0] || null;

  writeUsers(users);
  return res.json({ ok: true, likes: normalizedLikes });
});

app.post('/api/status', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to post status.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const type = sanitizeStatusType(req.body?.type);
  if (!type) {
    return res.status(400).json({ error: 'Status type is required.' });
  }

  const text = sanitizeText(req.body?.text).slice(0, STATUS_TEXT_MAX_LENGTH);
  const mediaUrl = sanitizeMediaDataUrl(req.body?.mediaUrl);
  const mediaType = sanitizeMediaType(req.body?.mediaType, mediaUrl);
  const mediaMimeType = sanitizeMediaMimeType(req.body?.mediaMimeType);
  const width = sanitizeStatusDimension(req.body?.width);
  const height = sanitizeStatusDimension(req.body?.height);
  const durationMs = sanitizeStatusDurationMs(req.body?.durationMs);

  if (type === 'text' && !text) {
    return res.status(400).json({ error: 'Text status cannot be empty.' });
  }

  if (type === 'image' || type === 'video') {
    if (!mediaUrl || mediaType !== type) {
      return res.status(400).json({ error: 'Valid media is required for this status.' });
    }

    if (type === 'image' && (width < STATUS_MIN_HD_WIDTH || height < STATUS_MIN_HD_HEIGHT)) {
      return res.status(400).json({
        error: `Only HD status is allowed. Minimum ${STATUS_MIN_HD_WIDTH}x${STATUS_MIN_HD_HEIGHT}.`
      });
    }
  }

  const now = Date.now();
  const statusRecord = {
    statusId: `status-${now}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    text,
    mediaUrl: type === 'text' ? '' : mediaUrl,
    mediaType: type === 'text' ? '' : mediaType,
    mediaMimeType: type === 'text' ? '' : mediaMimeType,
    width: type === 'text' ? 0 : width,
    height: type === 'text' ? 0 : height,
    durationMs: type === 'video' ? durationMs : 0,
    views: {},
    likes: {},
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + STATUS_EXPIRY_MS).toISOString()
  };

  const existingStatuses = getActiveStatusesForUser(currentUser);
  currentUser.statuses = [statusRecord, ...existingStatuses].slice(0, 100);
  currentUser.status = currentUser.statuses[0] || null;
  writeUsers(users);

  return res.json({ ok: true, status: statusRecord });
});

app.delete('/api/status/:statusId', (req, res) => {
  const currentUsername = req.session.username;

  if (!currentUsername) {
    return res.status(401).json({ error: 'You must be logged in to delete status.' });
  }

  const statusId = String(req.params.statusId || '').trim().slice(0, 90);
  if (!statusId) {
    return res.status(400).json({ error: 'Status id is required.' });
  }

  const users = readUsers();
  const currentUser = findUser(users, currentUsername);

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const activeStatuses = getActiveStatusesForUser(currentUser);
  const nextStatuses = activeStatuses.filter((item) => String(item?.statusId || '').trim() !== statusId);

  if (nextStatuses.length === activeStatuses.length) {
    return res.status(404).json({ error: 'Status not found or already expired.' });
  }

  currentUser.statuses = nextStatuses;
  currentUser.status = nextStatuses[0] || null;
  writeUsers(users);

  return res.json({ ok: true });
});

app.use((error, _req, res, next) => {
  if (!error) {
    next();
    return;
  }

  if (error.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request is too large. Please choose a smaller image.' });
    return;
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    res.status(400).json({ error: 'Invalid JSON payload.' });
    return;
  }

  next(error);
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

app.get('/app-config.js', (_req, res) => {
  const runtimeServerUrl = String(process.env.PUBLIC_SERVER_URL || process.env.SERVER_URL || '')
    .trim()
    .replace(/\/$/, '');

  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  res.send(`window.__CHAT_CONFIG__ = { SERVER_URL: ${JSON.stringify(runtimeServerUrl)} };`);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((error, req, res, _next) => {
  console.error('Unhandled server error:', error);

  if (res.headersSent) {
    return;
  }

  if (req.path.startsWith('/api/')) {
    res.status(500).json({ error: 'Server error. Please try again.' });
    return;
  }

  res.status(500).send('Internal Server Error');
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, onlineUsers: connectedUsers.size });
});

io.on('connection', (socket) => {
  socket.use((_packet, next) => {
    refreshCachesFromMongo()
      .then(() => next())
      .catch((error) => {
        console.error('Socket cache refresh failed:', error);
        next(error);
      });
  });

  socket.on('register-user', ({ username }) => {
    const safeUsername = sanitizeText(username);
    const sessionUsername = sanitizeText(socket.request?.session?.username || '').slice(0, 30);
    const users = readUsers();

    if (!sessionUsername) {
      socket.emit('username-error', 'Session expired. Please log in again.');
      return;
    }

    if (!safeUsername || !isSameUsername(safeUsername, sessionUsername)) {
      socket.emit('username-error', 'Socket authentication failed. Please log in again.');
      return;
    }

    const registeredUser = users.find((user) => user.username.toLowerCase() === sessionUsername.toLowerCase());

    if (!registeredUser) {
      socket.emit('username-error', 'This account does not exist. Please create an account first.');
      return;
    }

    const usernameTaken = Array.from(connectedUsers.values()).some(
      (user) => user.username.toLowerCase() === sessionUsername.toLowerCase() && user.socketId !== socket.id
    );

    if (usernameTaken) {
      socket.emit('username-error', 'That username is already online. Please choose another one.');
      return;
    }

    connectedUsers.set(socket.id, {
      socketId: socket.id,
      username: registeredUser.username,
      about: registeredUser.about || 'Available to chat',
      avatarUrl: registeredUser.avatarUrl || '',
      onlineVisibility: sanitizeOnlineVisibility(registeredUser.onlineVisibility)
    });

    socket.emit('system-message', `Welcome ${registeredUser.username}! Choose a friend from your list.`);
    if (isOnlineStatusVisibleToOthers(registeredUser)) {
      socket.broadcast.emit('system-message', `${registeredUser.username} is now online.`);
    }
    broadcastUsers();
  });

  socket.on('private-message', ({
    toSocketId,
    toUsername,
    message,
    mediaUrl,
    mediaType,
    mediaMimeType,
    audioUrl,
    audioMimeType,
    audioDurationMs,
    mood,
    messageId,
    replyTo
  }) => {
    const sender = connectedUsers.get(socket.id);
    const safeMessage = sanitizeText(message).slice(0, 300);
    const safeMessageHash = hashMessageText(safeMessage).slice(0, 80);
    const safeMediaUrl = sanitizeMediaDataUrl(mediaUrl);
    const safeMediaType = sanitizeMediaType(mediaType, safeMediaUrl);
    const safeMediaMimeType = sanitizeMediaMimeType(mediaMimeType);
    const safeAudioUrl = sanitizeVoiceAudioUrl(audioUrl);
    const safeAudioMimeType = sanitizeVoiceMimeType(audioMimeType);
    const safeAudioDurationMs = sanitizeVoiceDurationMs(audioDurationMs);
    const safeMood = sanitizeMood(mood);
    const safeTargetSocketId = String(toSocketId || '');
    const safeTargetUsername = sanitizeText(toUsername).slice(0, 30);
    const safeMessageId = String(messageId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    const safeReplyTo = sanitizeReplyPayload(replyTo, sender?.username || '');

    if (!sender || (!safeMessage && !safeAudioUrl && !safeMediaUrl) || (!safeTargetSocketId && !safeTargetUsername)) {
      return;
    }

    const users = readUsers();
    let targetUser = null;

    if (safeTargetUsername) {
      targetUser = findUser(users, safeTargetUsername);
    }

    if (!targetUser && safeTargetSocketId) {
      const receiverBySocket = connectedUsers.get(safeTargetSocketId);
      if (receiverBySocket) {
        targetUser = findUser(users, receiverBySocket.username);
      }
    }

    if (!targetUser) {
      socket.emit('system-message', 'User not found.');
      return;
    }

    if (!areFriends(users, sender.username, targetUser.username)) {
      socket.emit('system-message', 'You can only message accepted friends.');
      return;
    }

    if (isBlockedEitherDirection(users, sender.username, targetUser.username)) {
      socket.emit('system-message', 'Message blocked. One of you has blocked the other user.');
      return;
    }

    const payload = {
      messageId: safeMessageId,
      fromUsername: sender.username,
      toUsername: targetUser.username,
      message: safeMessage,
      messageHash: safeMessageHash,
      mediaUrl: safeMediaUrl,
      mediaType: safeMediaType,
      mediaMimeType: safeMediaMimeType,
      audioUrl: safeAudioUrl,
      audioMimeType: safeAudioMimeType,
      audioDurationMs: safeAudioDurationMs,
      mood: safeMood,
      replyTo: safeReplyTo,
      reactions: {},
      sentAt: new Date().toLocaleTimeString()
    };

    const allMessages = readMessages();
    allMessages.push({
      messageId: payload.messageId,
      fromUsername: payload.fromUsername,
      toUsername: payload.toUsername,
      message: payload.message,
      messageHash: payload.messageHash,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
      mediaMimeType: payload.mediaMimeType,
      audioUrl: payload.audioUrl,
      audioMimeType: payload.audioMimeType,
      audioDurationMs: payload.audioDurationMs,
      mood: payload.mood,
      replyTo: payload.replyTo,
      reactions: payload.reactions,
      sentAt: payload.sentAt,
      seen: false,
      deletedFor: [],
      createdAt: new Date().toISOString()
    });
    writeMessages(allMessages);

    const receiverOnline = getConnectedUserByUsername(targetUser.username);
    if (receiverOnline) {
      io.to(receiverOnline.socketId).emit('private-message', payload);
    }

    socket.emit('private-message', payload);
  });

  socket.on('message-reaction', ({ messageId, withUsername, reaction }) => {
    const sender = connectedUsers.get(socket.id);
    const safeMessageId = String(messageId || '').trim();
    const safeWithUsername = sanitizeText(withUsername).slice(0, 30);
    const safeReaction = sanitizeReactionEmoji(reaction);

    if (!sender || !safeMessageId || !safeWithUsername || !safeReaction) {
      return;
    }

    const users = readUsers();
    const targetUser = findUser(users, safeWithUsername);
    if (!targetUser || !areFriends(users, sender.username, targetUser.username)) {
      return;
    }

    if (isBlockedEitherDirection(users, sender.username, targetUser.username)) {
      return;
    }

    const allMessages = readMessages();
    const targetMessage = allMessages.find(
      (message) =>
        String(message.messageId || '') === safeMessageId &&
        isConversationMessage(message, sender.username, targetUser.username)
    );

    if (!targetMessage) {
      return;
    }

    const reactions = normalizeMessageReactions(targetMessage.reactions);

    ALLOWED_REACTIONS.forEach((emoji) => {
      reactions[emoji] = removeUsernameFromList(reactions[emoji], sender.username);
    });

    const alreadySelected = hasUsernameInList(targetMessage.reactions?.[safeReaction], sender.username);
    if (!alreadySelected) {
      reactions[safeReaction] = normalizeUsernameList([...(reactions[safeReaction] || []), sender.username]);
    }

    targetMessage.reactions = reactions;
    writeMessages(allMessages);

    const senderPayload = {
      messageId: safeMessageId,
      withUsername: targetUser.username,
      reactions
    };

    socket.emit('message-reaction', senderPayload);

    const receiverOnline = getConnectedUserByUsername(targetUser.username);
    if (receiverOnline) {
      io.to(receiverOnline.socketId).emit('message-reaction', {
        messageId: safeMessageId,
        withUsername: sender.username,
        reactions
      });
    }
  });

  socket.on('typing-status', ({ toUsername, isTyping }) => {
    const sender = connectedUsers.get(socket.id);
    const safeToUsername = sanitizeText(toUsername).slice(0, 30);

    if (!sender || !safeToUsername || isSameUsername(sender.username, safeToUsername)) {
      return;
    }

    const users = readUsers();
    const targetUser = findUser(users, safeToUsername);
    if (!targetUser || !areFriends(users, sender.username, targetUser.username)) {
      return;
    }

    if (isBlockedEitherDirection(users, sender.username, targetUser.username)) {
      return;
    }

    const receiverOnline = getConnectedUserByUsername(targetUser.username);
    if (!receiverOnline) {
      return;
    }

    io.to(receiverOnline.socketId).emit('typing-status', {
      fromUsername: sender.username,
      isTyping: Boolean(isTyping)
    });
  });

  socket.on('message-seen', ({ messageId, fromUsername, toUsername }) => {
    const safeMessageId = String(messageId || '');
    const safeFromUsername = sanitizeText(fromUsername).slice(0, 30);
    const safeToUsername = sanitizeText(toUsername).slice(0, 30);

    if (!safeMessageId || !safeFromUsername || !safeToUsername) {
      return;
    }

    const users = readUsers();
    if (!areFriends(users, safeFromUsername, safeToUsername)) {
      return;
    }

    if (isBlockedEitherDirection(users, safeFromUsername, safeToUsername)) {
      return;
    }

    const sender = getConnectedUserByUsername(safeFromUsername);

    const allMessages = readMessages();
    const targetMessage = allMessages.find(
      (message) =>
        String(message.messageId) === safeMessageId &&
        isSameUsername(message.fromUsername, safeFromUsername) &&
        isSameUsername(message.toUsername, safeToUsername)
    );

    if (targetMessage) {
      targetMessage.seen = true;
      targetMessage.seenAt = new Date().toISOString();
      writeMessages(allMessages);
    }

    if (!sender) {
      return;
    }

    io.to(sender.socketId).emit('message-seen', {
      messageId: safeMessageId,
      by: safeToUsername
    });
  });

  socket.on('disconnect', () => {
    const removedUser = connectedUsers.get(socket.id);

    if (!removedUser) {
      return;
    }

    connectedUsers.delete(socket.id);
    if (sanitizeOnlineVisibility(removedUser.onlineVisibility) === 'visible') {
      socket.broadcast.emit('system-message', `${removedUser.username} went offline.`);
    }
    broadcastUsers();
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other app using this port, or run this app on another port.`);
    console.error(`Example: set PORT=3001 before starting, then open http://localhost:3001`);
    process.exit(1);
  }

  console.error('Server failed to start:', error);
  process.exit(1);
});

async function startServer() {
  await initializeDataStore();

  server.listen(PORT, () => {
    console.log(`Chat server running on http://localhost:${PORT}`);
    if (hasCrossOriginClients) {
      console.log(`Allowed client origins: ${allowedOrigins.join(', ')}`);
      console.log(
        'Cross-origin mode is enabled. Make sure SESSION_COOKIE_SECURE=true and HTTPS are used in production.'
      );
    }
  });
}

let shuttingDown = false;
async function gracefulShutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`${signal} received. Flushing pending writes...`);

  try {
    await flushWrites();
    await shutdownMongo();
    console.log('Shutdown completed.');
  } catch (error) {
    console.error('Shutdown error:', error);
  }

  process.exit(0);
}

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});

startServer().catch((error) => {
  console.error('Startup failed:', error);
  process.exit(1);
});
