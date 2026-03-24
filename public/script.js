const runtimeConfig = window.__CHAT_CONFIG__ || {};
const configuredServerUrl = String(runtimeConfig.SERVER_URL || '')
  .trim()
  .replace(/\/$/, '');
const apiBaseUrl = configuredServerUrl;

const socket = io(configuredServerUrl || undefined, {
  autoConnect: false,
  withCredentials: true
});

const authCard = document.getElementById('auth-card');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageForm = document.getElementById('message-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const registerEmailInput = document.getElementById('register-email');
const registerUsernameInput = document.getElementById('register-username');
const registerPasswordInput = document.getElementById('register-password');
const registerSubmitButton = document.getElementById('register-submit-button');
const registerOtpSection = document.getElementById('register-otp-section');
const registerOtpInput = document.getElementById('register-otp');
const verifyOtpButton = document.getElementById('verify-otp-button');
const resendOtpButton = document.getElementById('resend-otp-button');
const forgotPasswordLinkButton = document.getElementById('forgot-password-link');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const forgotEmailInput = document.getElementById('forgot-email');
const forgotSendOtpButton = document.getElementById('forgot-send-otp-button');
const forgotOtpSection = document.getElementById('forgot-otp-section');
const forgotOtpInput = document.getElementById('forgot-otp');
const forgotVerifyOtpButton = document.getElementById('forgot-verify-otp-button');
const forgotResendOtpButton = document.getElementById('forgot-resend-otp-button');
const forgotResetSection = document.getElementById('forgot-reset-section');
const forgotNewPasswordInput = document.getElementById('forgot-new-password');
const forgotResetPasswordButton = document.getElementById('forgot-reset-password-button');
const forgotBackToLoginButton = document.getElementById('forgot-back-to-login-button');
const messageInput = document.getElementById('message-input');
const mediaUploadProgress = document.getElementById('media-upload-progress');
const mediaUploadProgressBar = document.getElementById('media-upload-progress-bar');
const mediaUploadProgressText = document.getElementById('media-upload-progress-text');
const mediaFileInput = document.getElementById('media-file-input');
const cameraCaptureButton = document.getElementById('camera-capture-button');
const galleryButton = document.getElementById('gallery-button');
const voiceRecordButton = document.getElementById('voice-record-button');
const replyComposer = document.getElementById('reply-composer');
const replyComposerText = document.getElementById('reply-composer-text');
const replyComposerCancelButton = document.getElementById('reply-composer-cancel');
const messagesContainer = document.getElementById('messages');
const chatSection = document.getElementById('chat-section');
const conversationPanel = document.querySelector('.conversation-panel');
const roomTitle = document.getElementById('room-title');
const statusText = document.getElementById('status-text');
const sidebarFriendsSearchInput = document.getElementById('sidebar-friends-search');
const usersList = document.getElementById('users-list');
const showLoginButton = document.getElementById('show-login');
const showRegisterButton = document.getElementById('show-register');
const authMessage = document.getElementById('auth-message');
const currentUsername = document.getElementById('current-username');
const currentAbout = document.getElementById('current-about');
const profileAvatar = document.getElementById('profile-avatar');
const chatWithLabel = document.getElementById('chat-with-label');
const chatWithStatus = document.getElementById('chat-with-status');
const chatAvatar = document.getElementById('chat-avatar');
const themeToggleButton = document.getElementById('theme-toggle-button');

const statusButton = document.getElementById('status-button');
const friendsButton = document.getElementById('friends-button');
const friendsRequestBadge = document.getElementById('friends-request-badge');
const settingsButton = document.getElementById('settings-button');
const clearChatButton = document.getElementById('clear-chat-button');
const deleteChatDateInput = document.getElementById('delete-chat-date-input');
const chatMenuButton = document.getElementById('chat-menu-button');
const chatMenuPanel = document.getElementById('chat-menu-panel');
const chatMenuAvatar = document.getElementById('chat-menu-avatar');
const chatMenuName = document.getElementById('chat-menu-name');
const chatMenuAbout = document.getElementById('chat-menu-about');
const viewProfileButton = document.getElementById('view-profile-button');
const editContactStyleButton = document.getElementById('edit-contact-style-button');
const removeFriendButton = document.getElementById('remove-friend-button');
const blockFriendButton = document.getElementById('block-friend-button');
const backToListButton = document.getElementById('back-to-list-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsButton = document.getElementById('close-settings-button');
const changePasswordModal = document.getElementById('change-password-modal');
const closeChangePasswordButton = document.getElementById('close-change-password-button');
const contactProfileModal = document.getElementById('contact-profile-modal');
const closeContactProfileButton = document.getElementById('close-contact-profile-button');
const contactProfileAvatar = document.getElementById('contact-profile-avatar');
const contactProfileName = document.getElementById('contact-profile-name');
const contactProfileStatus = document.getElementById('contact-profile-status');
const contactProfileAbout = document.getElementById('contact-profile-about');
const avatarPreviewModal = document.getElementById('avatar-preview-modal');
const closeAvatarPreviewButton = document.getElementById('close-avatar-preview-button');
const avatarPreviewImage = document.getElementById('avatar-preview-image');
const mediaPreviewModal = document.getElementById('media-preview-modal');
const closeMediaPreviewButton = document.getElementById('close-media-preview-button');
const mediaPreviewThumbnail = document.getElementById('media-preview-thumbnail');
const mediaPreviewFilename = document.getElementById('media-preview-filename');
const mediaPreviewCancelButton = document.getElementById('media-preview-cancel-button');
const mediaPreviewSendButton = document.getElementById('media-preview-send-button');
const cameraCaptureModal = document.getElementById('camera-capture-modal');
const closeCameraCaptureButton = document.getElementById('close-camera-capture-button');
const cameraCaptureCancelButton = document.getElementById('camera-capture-cancel-button');
const cameraCaptureSwitchButton = document.getElementById('camera-capture-switch-button');
const cameraCapturePhotoButton = document.getElementById('camera-capture-photo-button');
const cameraCaptureVideoButton = document.getElementById('camera-capture-video-button');
const cameraCapturePreview = document.getElementById('camera-capture-preview');
const cameraCaptureCanvas = document.getElementById('camera-capture-canvas');
const cameraCaptureStatus = document.getElementById('camera-capture-status');
const imageViewerModal = document.getElementById('image-viewer-modal');
const closeImageViewerButton = document.getElementById('close-image-viewer-button');
const imageViewerImage = document.getElementById('image-viewer-image');
const avatarCropModal = document.getElementById('avatar-crop-modal');
const closeAvatarCropButton = document.getElementById('close-avatar-crop-button');
const avatarCropCanvas = document.getElementById('avatar-crop-canvas');
const avatarCropZoom = document.getElementById('avatar-crop-zoom');
const avatarCropCancelButton = document.getElementById('avatar-crop-cancel-button');
const avatarCropApplyButton = document.getElementById('avatar-crop-apply-button');
const photoViewsModal = document.getElementById('photo-views-modal');
const closePhotoViewsButton = document.getElementById('close-photo-views-button');
const photoViewsAvatar = document.getElementById('photo-views-avatar');
const photoViewsTitle = document.getElementById('photo-views-title');


const confirmModal = document.getElementById('confirm-modal');
const confirmModalTitle = document.getElementById('confirm-modal-title');
const confirmModalMessage = document.getElementById('confirm-modal-message');
const confirmCancelButton = document.getElementById('confirm-cancel-button');
const confirmOkButton = document.getElementById('confirm-ok-button');
const contactStyleModal = document.getElementById('contact-style-modal');
const closeContactStyleButton = document.getElementById('close-contact-style-button');
const contactStyleForm = document.getElementById('contact-style-form');
const contactStyleNicknameInput = document.getElementById('contact-style-nickname');
const contactStyleColorInput = document.getElementById('contact-style-color');
const contactStyleColorPreview = document.getElementById('contact-style-color-preview');
const contactStyleMessage = document.getElementById('contact-style-message');
const contactStyleCancelButton = document.getElementById('contact-style-cancel-button');
const forwardModal = document.getElementById('forward-modal');
const closeForwardModalButton = document.getElementById('close-forward-modal-button');
const forwardFriendsList = document.getElementById('forward-friends-list');
const forwardModalError = document.getElementById('forward-modal-error');
const forwardCancelButton = document.getElementById('forward-cancel-button');
const forwardSendButton = document.getElementById('forward-send-button');
const settingsForm = document.getElementById('settings-form');
const settingsUsernameInput = document.getElementById('settings-username');
const settingsAboutInput = document.getElementById('settings-about');
const settingsAvatarInput = document.getElementById('settings-avatar');
const settingsVisibilityInput = document.getElementById('settings-visibility');
const settingsOnlineVisibilityInput = document.getElementById('settings-online-visibility');
const settingsMessage = document.getElementById('settings-message');
const openChangePasswordButton = document.getElementById('open-change-password-button');
const changePasswordForm = document.getElementById('change-password-form');
const oldPasswordInput = document.getElementById('old-password');
const newPasswordInput = document.getElementById('new-password');
const changePasswordButton = document.getElementById('change-password-button');
const changePasswordMessage = document.getElementById('change-password-message');
const settingsLogoutButton = document.getElementById('settings-logout-button');
const friendsModal = document.getElementById('friends-modal');
const closeFriendsButton = document.getElementById('close-friends-button');
const friendsSearchForm = document.getElementById('friends-search-form');
const friendsSearchInput = document.getElementById('friends-search-input');
const friendsSearchSubmit = document.getElementById('friends-search-submit');
const friendsMessage = document.getElementById('friends-message');
const existingFriendsList = document.getElementById('existing-friends-list');
const friendsResultsList = document.getElementById('friends-results-list');
const incomingRequestsList = document.getElementById('incoming-requests-list');
const outgoingRequestsList = document.getElementById('outgoing-requests-list');
const statusModal = document.getElementById('status-modal');
const closeStatusButton = document.getElementById('close-status-button');
const statusTextInput = document.getElementById('status-text-input');
const statusMediaInput = document.getElementById('status-media-input');
const statusMediaHint = document.getElementById('status-media-hint');
const statusPostTextButton = document.getElementById('status-post-text-button');
const statusPostMediaButton = document.getElementById('status-post-media-button');
const statusMessage = document.getElementById('status-message');
const statusFeedList = document.getElementById('status-feed-list');
const statusViewerModal = document.getElementById('status-viewer-modal');
const closeStatusViewerButton = document.getElementById('close-status-viewer-button');
const statusViewerAvatar = document.getElementById('status-viewer-avatar');
const statusViewerName = document.getElementById('status-viewer-name');
const statusViewerTime = document.getElementById('status-viewer-time');
const statusViewerList = document.getElementById('status-viewer-list');
const statusViewerPrevButton = document.getElementById('status-viewer-prev-button');
const statusViewerNextButton = document.getElementById('status-viewer-next-button');
const statusViewerCounter = document.getElementById('status-viewer-counter');
const MAX_AVATAR_DATA_URL_LENGTH = 8000000;
const MAX_VOICE_DATA_URL_LENGTH = 8000000;
const MAX_MEDIA_IMAGE_DATA_URL_LENGTH = 25000000;
const MAX_MEDIA_VIDEO_DATA_URL_LENGTH = 45000000;
const STATUS_TEXT_MAX_LENGTH = 300;
const STATUS_MIN_HD_WIDTH = 1280;
const STATUS_MIN_HD_HEIGHT = 720;
const STATUS_MEDIA_HINT_DEFAULT = 'No media selected.';
const SIDEBAR_LONG_PRESS_MS = 700;
const SIDEBAR_HIDDEN_FRIENDS_KEY_PREFIX = 'chat-hidden-sidebar-friends';
const SIDEBAR_PINNED_CHATS_KEY_PREFIX = 'chat-pinned-sidebar-friends';
const CONTACT_CUSTOMIZATION_KEY_PREFIX = 'chat-contact-customizations';
const REACTION_EMOJIS = ['❤️', '😂', '👍'];
const TYPING_IDLE_MS = 1200;
const MESSAGE_REACTION_LONG_PRESS_MS = 420;
const CHAT_MOODS = ['neutral', 'happy', 'sad', 'angry', 'excited'];
const COMMON_COLOR_NAMES = [
  'red',
  'green',
  'blue',
  'pink',
  'orange',
  'yellow',
  'purple',
  'brown',
  'black',
  'white',
  'gray',
  'grey',
  'teal',
  'cyan',
  'magenta',
  'lime',
  'navy',
  'gold',
  'silver',
  'maroon',
  'olive'
];
const COMMON_COLOR_TYPO_MAP = {
  grren: 'green',
  gren: 'green',
  greeen: 'green',
  geeen: 'green',
  oragne: 'orange',
  organge: 'orange',
  orngae: 'orange',
  orang: 'orange',
  pinl: 'pink',
  pnik: 'pink',
  pinkk: 'pink',
  bule: 'blue',
  blu: 'blue',
  yelow: 'yellow',
  yelllow: 'yellow',
  purpel: 'purple',
  puple: 'purple',
  balck: 'black',
  whtie: 'white',
  gry: 'gray'
};

function normalizeProfileVisibility(value) {
  return String(value || '').trim().toLowerCase() === 'private' ? 'private' : 'public';
}

function normalizeOnlineVisibility(value) {
  return String(value || '').trim().toLowerCase() === 'hidden' ? 'hidden' : 'visible';
}

function normalizeProfileData(profile) {
  return {
    about: String(profile?.about || '').trim() || 'Available to chat',
    avatarUrl: String(profile?.avatarUrl || '').trim(),
    profileVisibility: normalizeProfileVisibility(profile?.profileVisibility),
    onlineVisibility: normalizeOnlineVisibility(profile?.onlineVisibility)
  };
}

function normalizeMessageReactions(value) {
  const normalized = {};

  REACTION_EMOJIS.forEach((emoji) => {
    const usernames = Array.isArray(value?.[emoji]) ? value[emoji] : [];
    const seen = new Set();
    normalized[emoji] = usernames
      .map((name) => String(name || '').trim())
      .filter((name) => {
        const key = name.toLowerCase();
        if (!name || seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
  });

  return normalized;
}

function sanitizeMood(value) {
  const mood = String(value || '').trim().toLowerCase();
  return CHAT_MOODS.includes(mood) ? mood : 'neutral';
}

function normalizeColorKeyword(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
}

function getLevenshteinDistanceWithLimit(source, target, limit) {
  const a = String(source || '');
  const b = String(target || '');

  if (a === b) {
    return 0;
  }

  if (!a.length) {
    return b.length;
  }

  if (!b.length) {
    return a.length;
  }

  if (Math.abs(a.length - b.length) > limit) {
    return limit + 1;
  }

  const previous = new Array(b.length + 1);
  const current = new Array(b.length + 1);

  for (let index = 0; index <= b.length; index += 1) {
    previous[index] = index;
  }

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    let minDistanceInRow = current[0];

    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + substitutionCost);
      minDistanceInRow = Math.min(minDistanceInRow, current[j]);
    }

    if (minDistanceInRow > limit) {
      return limit + 1;
    }

    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}

function autocorrectCommonColorName(value) {
  const keyword = normalizeColorKeyword(value);
  if (!keyword || !/^[a-z]+$/.test(keyword)) {
    return '';
  }

  if (COMMON_COLOR_TYPO_MAP[keyword]) {
    return COMMON_COLOR_TYPO_MAP[keyword];
  }

  const distanceLimit = keyword.length <= 5 ? 1 : 2;
  let bestMatch = '';
  let bestDistance = distanceLimit + 1;

  COMMON_COLOR_NAMES.forEach((name) => {
    const distance = getLevenshteinDistanceWithLimit(keyword, name, distanceLimit);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = name;
    }
  });

  return bestDistance <= distanceLimit ? bestMatch : '';
}

function toTwoDigitHex(value) {
  const normalized = Math.max(0, Math.min(255, Number(value) || 0));
  return normalized.toString(16).padStart(2, '0');
}

function rgbStringToHex(value) {
  const match = String(value || '')
    .trim()
    .match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);

  if (!match) {
    return '';
  }

  const alpha = match[4] === undefined ? 1 : Number(match[4]);
  if (!Number.isFinite(alpha) || alpha < 1) {
    return '';
  }

  const red = Math.round(Number(match[1]));
  const green = Math.round(Number(match[2]));
  const blue = Math.round(Number(match[3]));

  if (![red, green, blue].every((channel) => Number.isFinite(channel))) {
    return '';
  }

  return `#${toTwoDigitHex(red)}${toTwoDigitHex(green)}${toTwoDigitHex(blue)}`;
}

function resolveCssColorToHex(value) {
  const raw = String(value || '').trim();
  if (!raw || !document.body) {
    return '';
  }

  const probe = document.createElement('span');
  probe.style.color = '';
  probe.style.color = raw;

  if (!probe.style.color) {
    return '';
  }

  probe.style.display = 'none';
  document.body.appendChild(probe);
  const computedColor = window.getComputedStyle(probe).color;
  probe.remove();

  return rgbStringToHex(computedColor);
}

function normalizeFriendColorHex(value) {
  const raw = String(value || '').trim().toLowerCase();

  if (!raw) {
    return '';
  }

  if (/^#[0-9a-f]{3}$/.test(raw)) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
  }

  if (/^#[0-9a-f]{6}$/.test(raw)) {
    return raw;
  }

  const directCssColorHex = resolveCssColorToHex(raw);
  if (directCssColorHex) {
    return directCssColorHex;
  }

  const compactKeyword = normalizeColorKeyword(raw);
  if (compactKeyword && compactKeyword !== raw) {
    const compactCssColorHex = resolveCssColorToHex(compactKeyword);
    if (compactCssColorHex) {
      return compactCssColorHex;
    }
  }

  const correctedName = autocorrectCommonColorName(raw);
  return correctedName ? resolveCssColorToHex(correctedName) : '';
}

function normalizeNickname(value) {
  return String(value || '').trim().slice(0, 30);
}

function normalizeContactCustomization(value) {
  if (!value || typeof value !== 'object') {
    return { nickname: '', color: '' };
  }

  return {
    nickname: normalizeNickname(value.nickname),
    color: normalizeFriendColorHex(value.color)
  };
}

function hexToRgbParts(hexColor) {
  const hex = normalizeFriendColorHex(hexColor);
  if (!hex) {
    return null;
  }

  const raw = hex.replace('#', '');
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16)
  };
}

const state = {
  username: '',
  selectedUsername: '',
  contacts: {},
  conversations: {},
  loadedConversations: {},
  theme: localStorage.getItem('chat-theme') || 'light',
  profile: normalizeProfileData(JSON.parse(localStorage.getItem('chat-profile') || 'null')),
  incomingRequests: [],
  outgoingRequests: [],
  blockedUsers: [],
  hiddenSidebarFriends: [],
  pinnedChats: [],
  contactCustomizations: {},
  sidebarFriendsQuery: '',
  typingByUsername: {},
  replyDraft: null,
  profilePhotoViews: [],
  myStatuses: [],
  friendStatuses: [],
  searchResults: [],
  pendingAvatarDataUrl: '',
  isSavingProfile: false,
  friendMessageTimeout: null,
  registerOtpPending: false,
  forgotPasswordOtpPending: false,
  forgotPasswordOtpVerified: false
};

const avatarCropState = {
  image: null,
  minScale: 1,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragOffsetX: 0,
  dragOffsetY: 0
};

let friendsSearchDebounceTimer = null;
let friendsSearchRequestToken = 0;
const sidebarLongPressTimers = new Map();
let voiceMediaRecorder = null;
let voiceMediaStream = null;
let voiceRecordedChunks = [];
let voiceRecordingStartedAt = 0;
let pendingMediaFile = null;
let pendingVideoThumbnailUrl = '';
let cameraCaptureStream = null;
let cameraMediaRecorder = null;
let cameraRecordedChunks = [];
let activeStatusViewerStatuses = [];
let activeStatusViewerIndex = 0;
let activeStatusViewerIsSelf = false;
let activeStatusViewerOwnerUsername = '';
let cameraFacingMode = 'user';
let typingIdleTimer = null;
let typingActiveTarget = '';

function getPinnedChatsStorageKey() {
  return `${SIDEBAR_PINNED_CHATS_KEY_PREFIX}:${state.username || 'guest'}`;
}

function getContactCustomizationStorageKey() {
  return `${CONTACT_CUSTOMIZATION_KEY_PREFIX}:${state.username || 'guest'}`;
}

function loadContactCustomizations() {
  try {
    const raw = localStorage.getItem(getContactCustomizationStorageKey());
    const parsed = raw ? JSON.parse(raw) : {};
    const next = {};

    Object.entries(parsed || {}).forEach(([username, value]) => {
      const safeUsername = String(username || '').trim();
      if (!safeUsername) {
        return;
      }

      next[safeUsername] = normalizeContactCustomization(value);
    });

    state.contactCustomizations = next;
  } catch (_error) {
    state.contactCustomizations = {};
  }
}

function saveContactCustomizations() {
  localStorage.setItem(getContactCustomizationStorageKey(), JSON.stringify(state.contactCustomizations));
}

function pruneContactCustomizations() {
  const existing = new Set(Object.keys(state.contacts).map((name) => name.toLowerCase()));
  let changed = false;

  Object.keys(state.contactCustomizations).forEach((username) => {
    if (!existing.has(username.toLowerCase())) {
      delete state.contactCustomizations[username];
      changed = true;
    }
  });

  if (changed) {
    saveContactCustomizations();
  }
}

function getContactCustomization(username) {
  return normalizeContactCustomization(state.contactCustomizations[username]);
}

function getDisplayName(username) {
  const nickname = getContactCustomization(username).nickname;
  return nickname || username;
}

function detectMoodFromText(rawText) {
  const text = String(rawText || '').trim().toLowerCase();
  if (!text) {
    return 'neutral';
  }

  const excitedWords = ['wow', 'awesome', 'amazing', 'great', 'yay', 'party', 'super', 'fantastic'];
  const happyWords = ['happy', 'nice', 'good', 'love', 'cool', 'thanks', 'thank you', 'smile'];
  const sadWords = ['sad', 'sorry', 'miss', 'alone', 'cry', 'bad day', 'upset'];
  const angryWords = ['angry', 'hate', 'annoyed', 'mad', 'stupid', 'idiot', 'worst'];

  if (angryWords.some((word) => text.includes(word))) {
    return 'angry';
  }

  if (sadWords.some((word) => text.includes(word))) {
    return 'sad';
  }

  if (excitedWords.some((word) => text.includes(word)) || /!{2,}/.test(text)) {
    return 'excited';
  }

  if (happyWords.some((word) => text.includes(word))) {
    return 'happy';
  }

  return 'neutral';
}

async function detectMoodFromVoice({ durationMs }) {
  const duration = Number(durationMs || 0);

  if (duration >= 12000) {
    return 'excited';
  }

  if (duration >= 7000) {
    return 'angry';
  }

  if (duration <= 2500) {
    return 'sad';
  }

  if (duration >= 3500) {
    return 'happy';
  }

  return 'neutral';
}

function getConversationMood(username) {
  const conversation = getConversation(username);
  for (let index = conversation.length - 1; index >= 0; index -= 1) {
    const mood = sanitizeMood(conversation[index]?.mood);
    if (mood !== 'neutral') {
      return mood;
    }
  }

  return 'neutral';
}

function applyConversationTheme() {
  if (!conversationPanel) {
    return;
  }

  conversationPanel.classList.remove('mood-theme-neutral', 'mood-theme-happy', 'mood-theme-sad', 'mood-theme-angry', 'mood-theme-excited');
  conversationPanel.classList.add('mood-theme-neutral');

  if (!state.selectedUsername) {
    conversationPanel.style.removeProperty('--friend-color');
    conversationPanel.style.removeProperty('--friend-color-soft');
    return;
  }

  const customColor = getContactCustomization(state.selectedUsername).color;
  const rgb = hexToRgbParts(customColor);

  if (!rgb) {
    conversationPanel.style.removeProperty('--friend-color');
    conversationPanel.style.removeProperty('--friend-color-soft');
    return;
  }

  conversationPanel.style.setProperty('--friend-color', customColor);
  conversationPanel.style.setProperty('--friend-color-soft', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`);
}

function loadPinnedChats() {
  try {
    const raw = localStorage.getItem(getPinnedChatsStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    state.pinnedChats = Array.isArray(parsed)
      ? parsed
          .map((name) => String(name || '').trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];
  } catch (_error) {
    state.pinnedChats = [];
  }
}

function savePinnedChats() {
  localStorage.setItem(getPinnedChatsStorageKey(), JSON.stringify(state.pinnedChats.slice(0, 3)));
}

function prunePinnedChats() {
  const visibleFriends = new Set(Object.keys(state.contacts).map((name) => name.toLowerCase()));
  const before = state.pinnedChats.length;
  state.pinnedChats = state.pinnedChats
    .filter((name) => visibleFriends.has(name.toLowerCase()))
    .slice(0, 3);

  if (before !== state.pinnedChats.length) {
    savePinnedChats();
  }
}

function isPinnedChat(username) {
  return state.pinnedChats.some((name) => name.toLowerCase() === String(username || '').toLowerCase());
}

function setTypingForContact(username, isTyping) {
  if (!username) {
    return;
  }

  state.typingByUsername[username] = Boolean(isTyping);
}

function stopTypingForContact(username) {
  if (!username) {
    return;
  }

  state.typingByUsername[username] = false;
}

function emitTypingStatusForSelected(isTyping) {
  if (!state.selectedUsername || !socket.connected) {
    return;
  }

  socket.emit('typing-status', {
    toUsername: state.selectedUsername,
    isTyping: Boolean(isTyping)
  });
}

function stopOutgoingTyping() {
  if (typingIdleTimer) {
    clearTimeout(typingIdleTimer);
    typingIdleTimer = null;
  }

  if (!typingActiveTarget) {
    return;
  }

  socket.emit('typing-status', {
    toUsername: typingActiveTarget,
    isTyping: false
  });
  typingActiveTarget = '';
}

function handleComposerTyping() {
  if (!state.selectedUsername) {
    return;
  }

  const hasText = Boolean(String(messageInput.value || '').trim());

  if (!hasText) {
    stopOutgoingTyping();
    return;
  }

  if (typingActiveTarget !== state.selectedUsername) {
    stopOutgoingTyping();
    typingActiveTarget = state.selectedUsername;
    emitTypingStatusForSelected(true);
  }

  if (typingIdleTimer) {
    clearTimeout(typingIdleTimer);
  }

  typingIdleTimer = window.setTimeout(() => {
    stopOutgoingTyping();
  }, TYPING_IDLE_MS);
}

function closeAllReactionPickers() {
  messagesContainer.querySelectorAll('.message.show-reaction-picker').forEach((messageItem) => {
    messageItem.classList.remove('show-reaction-picker');
  });
}

function isMobileView() {
  return window.matchMedia('(max-width: 700px)').matches;
}

function isSelectedChatVisible() {
  if (!state.selectedUsername || document.hidden) {
    return false;
  }

  if (isMobileView()) {
    return chatSection.classList.contains('chat-only-mode');
  }

  return true;
}

function setChatOnlyMode(enabled) {
  chatSection.classList.toggle('chat-only-mode', enabled);
  backToListButton.classList.toggle('hidden', !enabled);

  if (!enabled) {
    closeChatMenu();
  }
}

function syncBodyScrollMode() {
  document.body.classList.toggle('chat-view-active', !chatSection.classList.contains('hidden'));
}

function closeChatMenu() {
  chatMenuPanel.classList.add('hidden');
}

function openContactProfileModal() {
  if (!state.selectedUsername) {
    return;
  }

  const selectedContact = state.contacts[state.selectedUsername] || {};
  setAvatar(contactProfileAvatar, state.selectedUsername, selectedContact.avatarUrl || '');
  contactProfileName.textContent = getDisplayName(state.selectedUsername);
  contactProfileStatus.textContent = selectedContact.online ? 'Online' : 'Offline';
  contactProfileAbout.textContent = selectedContact.about || 'Available to chat';
  contactProfileAvatar.classList.toggle('no-photo', !(selectedContact.avatarUrl || '').trim());
  contactProfileModal.classList.remove('hidden');
}

function closeContactProfileModal() {
  contactProfileModal.classList.add('hidden');
}

function getSelectedContactAvatarUrl() {
  if (!state.selectedUsername) {
    return '';
  }

  const selectedContact = state.contacts[state.selectedUsername] || {};
  return String(selectedContact.avatarUrl || '').trim();
}

function getCurrentUserAvatarUrl() {
  return String(state.profile.avatarUrl || '').trim();
}

function openAvatarPreviewModal(avatarUrl, displayName) {
  avatarPreviewImage.src = avatarUrl;
  avatarPreviewImage.alt = `${displayName || state.selectedUsername || state.username || 'User'} profile photo`;
  avatarPreviewModal.classList.remove('hidden');
}

function closeAvatarPreviewModal() {
  avatarPreviewModal.classList.add('hidden');
  avatarPreviewImage.removeAttribute('src');
}

function resolveMediaUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) {
    return '';
  }

  if (/^(data:|https?:\/\/)/i.test(raw)) {
    return raw;
  }

  if (raw.startsWith('/')) {
    return `${apiBaseUrl}${raw}`;
  }

  return `${apiBaseUrl}/${raw}`;
}

function openImageViewerModal(imageUrl) {
  const resolvedUrl = resolveMediaUrl(imageUrl);
  if (!resolvedUrl || !imageViewerModal || !imageViewerImage) {
    return;
  }

  imageViewerImage.src = resolvedUrl;
  imageViewerModal.classList.remove('hidden');
}

function closeImageViewerModal() {
  if (!imageViewerModal || !imageViewerImage) {
    return;
  }

  imageViewerModal.classList.add('hidden');
  imageViewerImage.removeAttribute('src');
}

function openMediaPreviewModal({ thumbnailUrl, fileName }) {
  if (!mediaPreviewModal || !mediaPreviewThumbnail || !mediaPreviewFilename) {
    return;
  }

  mediaPreviewThumbnail.src = thumbnailUrl;
  mediaPreviewFilename.textContent = fileName || 'Selected media';
  mediaPreviewModal.classList.remove('hidden');
}

function closeMediaPreviewModal(resetSelection = false) {
  if (!mediaPreviewModal || !mediaPreviewThumbnail || !mediaPreviewFilename) {
    return;
  }

  mediaPreviewModal.classList.add('hidden');
  mediaPreviewThumbnail.removeAttribute('src');
  mediaPreviewFilename.textContent = '';

  if (pendingVideoThumbnailUrl) {
    URL.revokeObjectURL(pendingVideoThumbnailUrl);
  }

  pendingVideoThumbnailUrl = '';
  if (resetSelection) {
    pendingMediaFile = null;
  }
}

function setMediaUploadProgress(percent, message) {
  if (!mediaUploadProgress || !mediaUploadProgressBar || !mediaUploadProgressText) {
    return;
  }

  mediaUploadProgress.classList.remove('hidden');
  mediaUploadProgressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  mediaUploadProgressText.textContent = message;
}

function hideMediaUploadProgress() {
  if (!mediaUploadProgress || !mediaUploadProgressBar || !mediaUploadProgressText) {
    return;
  }

  mediaUploadProgress.classList.add('hidden');
  mediaUploadProgressBar.style.width = '0%';
  mediaUploadProgressText.textContent = 'Uploading...';
}

function formatFileSize(bytes) {
  const value = Number(bytes || 0);
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const fixed = size >= 10 || unitIndex === 0 ? 0 : 1;
  return `${size.toFixed(fixed)} ${units[unitIndex]}`;
}

function inferMediaMimeTypeFromName(fileName) {
  const extension = String(fileName || '')
    .trim()
    .toLowerCase()
    .split('.')
    .pop();

  if (!extension) {
    return '';
  }

  const imageTypeByExtension = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp'
  };

  const videoTypeByExtension = {
    webm: 'video/webm',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    m4v: 'video/x-m4v',
    ogv: 'video/ogg'
  };

  return imageTypeByExtension[extension] || videoTypeByExtension[extension] || '';
}

function buildUploadMediaFile(file) {
  const originalName = String(file?.name || '').trim() || `media-${Date.now()}`;
  const currentType = String(file?.type || '').trim().toLowerCase();
  let resolvedType = currentType;

  if (!resolvedType.startsWith('image/') && !resolvedType.startsWith('video/')) {
    resolvedType = inferMediaMimeTypeFromName(originalName);
  }

  if (!resolvedType.startsWith('image/') && !resolvedType.startsWith('video/')) {
    resolvedType = 'video/webm';
  }

  let resolvedName = originalName;
  if (!resolvedName.includes('.')) {
    resolvedName = resolvedType.startsWith('video/') ? `${resolvedName}.webm` : `${resolvedName}.jpg`;
  }

  if (resolvedType === currentType && resolvedName === originalName) {
    return file;
  }

  return new File([file], resolvedName, {
    type: resolvedType,
    lastModified: Date.now()
  });
}

function uploadMediaFileWithProgress(file) {
  return new Promise((resolve, reject) => {
    const uploadFile = buildUploadMediaFile(file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${apiBaseUrl}/api/media-upload`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setMediaUploadProgress(percent, `Uploading ${percent}% (${formatFileSize(event.loaded)} / ${formatFileSize(event.total)})`);
      } else {
        setMediaUploadProgress(0, 'Uploading...');
      }
    };

    xhr.onload = () => {
      try {
        const payload = xhr.responseText ? JSON.parse(xhr.responseText) : {};
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(payload.error || 'Upload failed.'));
          return;
        }

        resolve(payload);
      } catch (_error) {
        reject(new Error('Upload returned an invalid response.'));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed. Check your network and try again.'));
    xhr.onabort = () => reject(new Error('Upload canceled.'));

    const formData = new FormData();
    formData.append('media', uploadFile, uploadFile.name);
    xhr.send(formData);
  });
}

function generateVideoThumbnailFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    const onError = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to preview this video.'));
    };

    video.addEventListener('error', onError, { once: true });

    video.addEventListener(
      'loadeddata',
      () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, video.videoWidth || 320);
          canvas.height = Math.max(1, video.videoHeight || 180);
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Preview failed.');
          }

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          URL.revokeObjectURL(objectUrl);
          resolve(thumbnailDataUrl);
        } catch (_error) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Unable to generate video thumbnail.'));
        }
      },
      { once: true }
    );
  });
}

function getSupportedCameraVideoMimeType() {
  if (typeof window.MediaRecorder === 'undefined') {
    return '';
  }

  const preferredMimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  const supported = preferredMimeTypes.find((mimeType) => window.MediaRecorder.isTypeSupported(mimeType));
  return supported || '';
}

function resetCameraVideoButtonState() {
  if (!cameraCaptureVideoButton) {
    return;
  }

  cameraCaptureVideoButton.textContent = 'Start video';
  cameraCaptureVideoButton.classList.remove('recording');
}

function setCameraCaptureStatus(text, isRecording = false) {
  if (!cameraCaptureStatus) {
    return;
  }

  cameraCaptureStatus.textContent = String(text || 'Camera ready');
  cameraCaptureStatus.classList.toggle('recording', Boolean(isRecording));
}

function getCameraFacingLabel(value) {
  return value === 'environment' ? 'Back' : 'Front';
}

function getOppositeCameraFacingMode(value) {
  return value === 'environment' ? 'user' : 'environment';
}

function updateCameraSwitchButtonLabel() {
  if (!cameraCaptureSwitchButton) {
    return;
  }

  const nextFacingMode = getOppositeCameraFacingMode(cameraFacingMode);
  cameraCaptureSwitchButton.textContent = `Switch to ${getCameraFacingLabel(nextFacingMode)} camera`;
}

async function requestCameraCaptureStream(preferredFacingMode) {
  const desiredFacingMode = preferredFacingMode === 'environment' ? 'environment' : 'user';
  const fallbackFacingMode = getOppositeCameraFacingMode(desiredFacingMode);
  const attempts = [
    { facingMode: desiredFacingMode, audio: true },
    { facingMode: desiredFacingMode, audio: false },
    { facingMode: fallbackFacingMode, audio: false }
  ];

  let lastError = null;

  for (const attempt of attempts) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: attempt.facingMode },
        audio: attempt.audio
      });

      return {
        stream,
        facingMode: attempt.facingMode
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to access camera stream.');
}

async function startCameraCaptureStream(preferredFacingMode = 'user') {
  if (!cameraCapturePreview) {
    return;
  }

  const result = await requestCameraCaptureStream(preferredFacingMode);
  cameraCaptureStream = result.stream;
  cameraFacingMode = result.facingMode;
  cameraCapturePreview.srcObject = result.stream;
  setCameraCaptureStatus(`${getCameraFacingLabel(cameraFacingMode)} camera ready`);
  updateCameraSwitchButtonLabel();
}

async function switchCameraCaptureFacingMode() {
  if (!cameraCapturePreview) {
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    appendMessage('Camera access is not supported in this browser.');
    return;
  }

  if (cameraMediaRecorder && cameraMediaRecorder.state === 'recording') {
    appendMessage('Stop video recording first, then switch camera.');
    return;
  }

  const nextFacingMode = getOppositeCameraFacingMode(cameraFacingMode);
  setCameraCaptureStatus(`Switching to ${getCameraFacingLabel(nextFacingMode).toLowerCase()} camera...`);
  stopCameraCaptureStream();
  cameraCapturePreview.srcObject = null;

  try {
    await startCameraCaptureStream(nextFacingMode);
  } catch (_error) {
    setCameraCaptureStatus('Unable to switch camera');
    appendMessage('Unable to switch camera. Please check camera permissions and try again.');
  }
}

function stopCameraCaptureStream() {
  if (cameraCaptureStream) {
    cameraCaptureStream.getTracks().forEach((track) => track.stop());
  }

  cameraCaptureStream = null;
}

async function queueCapturedMediaFile(file) {
  let previewUrl = '';

  if (String(file.type || '').toLowerCase().startsWith('video/')) {
    try {
      previewUrl = await generateVideoThumbnailFromFile(file);
    } catch (_error) {
      previewUrl = URL.createObjectURL(file);
    }
  } else {
    previewUrl = URL.createObjectURL(file);
  }

  pendingMediaFile = file;
  pendingVideoThumbnailUrl = previewUrl;
  openMediaPreviewModal({
    thumbnailUrl: previewUrl,
    fileName: `${file.name} (${formatFileSize(file.size)})`
  });
}

function closeCameraCaptureModal() {
  if (!cameraCaptureModal || !cameraCapturePreview) {
    return;
  }

  if (cameraMediaRecorder && cameraMediaRecorder.state === 'recording') {
    cameraMediaRecorder.ondataavailable = null;
    cameraMediaRecorder.onstop = null;
    cameraMediaRecorder.stop();
  }

  cameraMediaRecorder = null;
  cameraRecordedChunks = [];
  resetCameraVideoButtonState();
  setCameraCaptureStatus('Camera closed');
  stopCameraCaptureStream();
  cameraCapturePreview.srcObject = null;
  cameraCaptureModal.classList.add('hidden');
}

async function openCameraCaptureModal() {
  if (!cameraCaptureModal || !cameraCapturePreview) {
    return;
  }

  if (!state.selectedUsername) {
    appendMessage('Pick a person from the list before using camera.');
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    appendMessage('Camera access is not supported in this browser.');
    return;
  }

  if (cameraCaptureStream) {
    updateCameraSwitchButtonLabel();
    cameraCaptureModal.classList.remove('hidden');
    return;
  }

  try {
    await startCameraCaptureStream(cameraFacingMode);
    cameraCaptureModal.classList.remove('hidden');
    resetCameraVideoButtonState();
  } catch (_error) {
    appendMessage('Unable to access camera. Please allow camera permission and try again.');
  }
}

async function capturePhotoFromCamera() {
  if (!cameraCapturePreview || !cameraCaptureCanvas || !cameraCaptureStream) {
    return;
  }

  if (cameraMediaRecorder && cameraMediaRecorder.state === 'recording') {
    appendMessage('Stop video recording first, then take a photo.');
    return;
  }

  const width = Math.max(1, cameraCapturePreview.videoWidth || 0);
  const height = Math.max(1, cameraCapturePreview.videoHeight || 0);

  if (!width || !height) {
    appendMessage('Camera preview is not ready yet. Please try again.');
    return;
  }

  cameraCaptureCanvas.width = width;
  cameraCaptureCanvas.height = height;
  const context = cameraCaptureCanvas.getContext('2d');
  if (!context) {
    appendMessage('Unable to capture photo right now.');
    return;
  }

  context.drawImage(cameraCapturePreview, 0, 0, width, height);

  const photoBlob = await new Promise((resolve) => {
    cameraCaptureCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
  });

  if (!photoBlob) {
    appendMessage('Unable to capture photo right now.');
    return;
  }

  const file = new File([photoBlob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
  closeCameraCaptureModal();
  await queueCapturedMediaFile(file);
}

async function toggleCameraVideoRecording() {
  if (!cameraCaptureStream || !cameraCaptureVideoButton) {
    return;
  }

  if (typeof window.MediaRecorder === 'undefined') {
    appendMessage('Video recording is not supported in this browser.');
    return;
  }

  if (cameraMediaRecorder && cameraMediaRecorder.state === 'recording') {
    cameraCaptureVideoButton.disabled = true;
    cameraCaptureVideoButton.textContent = 'Processing...';
    setCameraCaptureStatus('Processing video...', false);
    cameraMediaRecorder.stop();
    return;
  }

  try {
    const mimeType = getSupportedCameraVideoMimeType();
    const recorder = mimeType
      ? new window.MediaRecorder(cameraCaptureStream, { mimeType })
      : new window.MediaRecorder(cameraCaptureStream);

    cameraMediaRecorder = recorder;
    cameraRecordedChunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        cameraRecordedChunks.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const chunks = cameraRecordedChunks.slice();
      cameraMediaRecorder = null;
      cameraRecordedChunks = [];
      cameraCaptureVideoButton.disabled = false;
      resetCameraVideoButtonState();
      setCameraCaptureStatus('Camera ready');

      if (!chunks.length) {
        appendMessage('No video captured. Record a little longer and try again.');
        return;
      }

      const type = recorder.mimeType || 'video/webm';
      const blob = new Blob(chunks, { type });
      const extension = type.includes('mp4') ? 'mp4' : 'webm';
      const file = new File([blob], `camera-video-${Date.now()}.${extension}`, { type });

      closeCameraCaptureModal();
      await queueCapturedMediaFile(file);
    };

    recorder.start();
    cameraCaptureVideoButton.textContent = 'Stop video';
    cameraCaptureVideoButton.classList.add('recording');
    setCameraCaptureStatus('Recording video...', true);
  } catch (_error) {
    cameraMediaRecorder = null;
    cameraRecordedChunks = [];
    resetCameraVideoButtonState();
    setCameraCaptureStatus('Camera ready');
    appendMessage('Unable to start video recording.');
  }
}

function openPhotoViewsModal() {
  if (!state.username) {
    return;
  }

  const avatarUrl = getCurrentUserAvatarUrl();
  setAvatar(photoViewsAvatar, state.username || 'U', avatarUrl);
  photoViewsAvatar.classList.toggle('no-photo', !avatarUrl);
  photoViewsTitle.textContent = `${state.username}'s profile photo`;
  photoViewsModal.classList.remove('hidden');
}

function closePhotoViewsModal() {
  photoViewsModal.classList.add('hidden');
}

function showConfirmModal({ title, message, okText = 'Confirm', cancelText = 'Cancel' }) {
  return new Promise((resolve) => {
    confirmModalTitle.textContent = title || 'Please Confirm';
    confirmModalMessage.textContent = message || 'Are you sure?';
    confirmOkButton.textContent = okText;
    confirmCancelButton.textContent = cancelText;
    confirmModal.classList.remove('hidden');

    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    const onConfirm = () => {
      cleanup();
      resolve(true);
    };

    const onBackdropClick = (event) => {
      if (event.target === confirmModal) {
        onCancel();
      }
    };

    function cleanup() {
      confirmModal.classList.add('hidden');
      confirmCancelButton.removeEventListener('click', onCancel);
      confirmOkButton.removeEventListener('click', onConfirm);
      confirmModal.removeEventListener('click', onBackdropClick);
    }

    confirmCancelButton.addEventListener('click', onCancel);
    confirmOkButton.addEventListener('click', onConfirm);
    confirmModal.addEventListener('click', onBackdropClick);
  });
}

function showDeleteMessageScopeModal(username) {
  return new Promise((resolve) => {
    confirmModalTitle.textContent = 'Delete message';
    confirmModalMessage.textContent = `Choose how to delete this message in chat with ${username}.`;
    confirmCancelButton.textContent = 'Delete for me';
    confirmOkButton.textContent = 'Delete for both';
    confirmModal.classList.remove('hidden');

    const onDeleteForMe = () => {
      cleanup();
      resolve('self');
    };

    const onDeleteForBoth = () => {
      cleanup();
      resolve('everyone');
    };

    const onBackdropClick = (event) => {
      if (event.target === confirmModal) {
        cleanup();
        resolve(null);
      }
    };

    function cleanup() {
      confirmModal.classList.add('hidden');
      confirmCancelButton.removeEventListener('click', onDeleteForMe);
      confirmOkButton.removeEventListener('click', onDeleteForBoth);
      confirmModal.removeEventListener('click', onBackdropClick);
    }

    confirmCancelButton.addEventListener('click', onDeleteForMe);
    confirmOkButton.addEventListener('click', onDeleteForBoth);
    confirmModal.addEventListener('click', onBackdropClick);
  });
}

function showForwardMessageModal(entry, availableFriends, suggestedFriend) {
  return new Promise((resolve) => {
    if (!forwardModal) {
      resolve(null);
      return;
    }

    forwardModalError.textContent = '';
    forwardModalError.dataset.state = '';

    let selectedUsername = '';
    forwardSendButton.disabled = true;
    forwardFriendsList.innerHTML = '';

    availableFriends.forEach((username) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'forward-friend-btn';
      button.textContent = username;

      button.addEventListener('click', () => {
        selectedUsername = username;
        forwardSendButton.disabled = false;
        forwardModalError.textContent = '';
        forwardModalError.dataset.state = '';
        forwardFriendsList.querySelectorAll('.forward-friend-btn').forEach((element) => {
          element.classList.remove('active');
        });
        button.classList.add('active');
      });

      item.appendChild(button);
      forwardFriendsList.appendChild(item);
    });

    if (suggestedFriend) {
      const firstSelectedButton = Array.from(forwardFriendsList.querySelectorAll('.forward-friend-btn')).find(
        (element) => element.textContent === suggestedFriend
      );
      if (firstSelectedButton) {
        firstSelectedButton.click();
      }
    }

    forwardModal.classList.remove('hidden');
    window.setTimeout(() => {
      const firstButton = forwardFriendsList.querySelector('.forward-friend-btn');
      if (firstButton) {
        firstButton.focus();
      }
    }, 0);

    const onCancel = () => {
      cleanup();
      resolve(null);
    };

    const onSubmit = () => {
      if (!selectedUsername) {
        forwardModalError.textContent = 'Select one friend first.';
        forwardModalError.dataset.state = 'error';
        return;
      }

      cleanup();
      resolve(selectedUsername);
    };

    const onKeydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        onSubmit();
      }
    };

    const onBackdropClick = (event) => {
      if (event.target === forwardModal) {
        onCancel();
      }
    };

    function cleanup() {
      forwardModal.classList.add('hidden');
      forwardSendButton.removeEventListener('click', onSubmit);
      forwardCancelButton.removeEventListener('click', onCancel);
      closeForwardModalButton.removeEventListener('click', onCancel);
      forwardModal.removeEventListener('click', onBackdropClick);
      forwardModal.removeEventListener('keydown', onKeydown);
    }

    forwardSendButton.addEventListener('click', onSubmit);
    forwardCancelButton.addEventListener('click', onCancel);
    closeForwardModalButton.addEventListener('click', onCancel);
    forwardModal.addEventListener('click', onBackdropClick);
    forwardModal.addEventListener('keydown', onKeydown);
  });
}

function openFriendsModal() {
  friendsModal.classList.remove('hidden');
  state.searchResults = [];
  renderExistingFriendsList();
  renderFriendsResults();
  renderFriendRequests();
  showFriendsMessage('');
  friendsSearchInput.focus();
}

function closeFriendsModal() {
  friendsModal.classList.add('hidden');
}

function getReadableTextColorForHex(hexColor) {
  const rgb = hexToRgbParts(hexColor);
  if (!rgb) {
    return '#112430';
  }

  const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
  return luminance >= 158 ? '#112430' : '#ffffff';
}

function showContactStyleMessage(message, isError = false) {
  if (!contactStyleMessage) {
    return;
  }

  contactStyleMessage.textContent = String(message || '');
  if (!message) {
    delete contactStyleMessage.dataset.state;
    return;
  }

  contactStyleMessage.dataset.state = isError ? 'error' : 'success';
}

function updateContactStyleColorPreview(rawValue) {
  if (!contactStyleColorPreview) {
    return;
  }

  const normalized = normalizeFriendColorHex(rawValue);

  if (!String(rawValue || '').trim() || !normalized) {
    contactStyleColorPreview.style.removeProperty('background');
    contactStyleColorPreview.style.removeProperty('color');
    contactStyleColorPreview.style.removeProperty('border-color');
    return;
  }

  contactStyleColorPreview.style.background = normalized;
  contactStyleColorPreview.style.color = getReadableTextColorForHex(normalized);
  contactStyleColorPreview.style.borderColor = normalized;
}

function openContactStyleModal(existing) {
  return new Promise((resolve) => {
    if (
      !contactStyleModal ||
      !contactStyleForm ||
      !contactStyleNicknameInput ||
      !contactStyleColorInput ||
      !contactStyleCancelButton ||
      !closeContactStyleButton
    ) {
      resolve(null);
      return;
    }

    contactStyleNicknameInput.value = String(existing?.nickname || '');
    contactStyleColorInput.value = String(existing?.color || '');
    showContactStyleMessage('');
    updateContactStyleColorPreview(contactStyleColorInput.value);
    contactStyleModal.classList.remove('hidden');
    contactStyleNicknameInput.focus();
    contactStyleNicknameInput.setSelectionRange(contactStyleNicknameInput.value.length, contactStyleNicknameInput.value.length);

    const onCancel = () => {
      cleanup();
      resolve(null);
    };

    const onColorInput = () => {
      showContactStyleMessage('');
      updateContactStyleColorPreview(contactStyleColorInput.value);
    };

    const onSubmit = (event) => {
      event.preventDefault();

      const nextNickname = normalizeNickname(contactStyleNicknameInput.value);
      const nextColorRaw = contactStyleColorInput.value;
      const nextColor = normalizeFriendColorHex(nextColorRaw);

      if (String(nextColorRaw || '').trim() && !nextColor) {
        showContactStyleMessage('Use a valid color name or hex, e.g. pink or #22c55e.', true);
        updateContactStyleColorPreview(nextColorRaw);
        return;
      }

      cleanup();
      resolve({ nickname: nextNickname, color: nextColor });
    };

    const onBackdropClick = (event) => {
      if (event.target === contactStyleModal) {
        onCancel();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    function cleanup() {
      contactStyleModal.classList.add('hidden');
      contactStyleForm.removeEventListener('submit', onSubmit);
      contactStyleColorInput.removeEventListener('input', onColorInput);
      contactStyleCancelButton.removeEventListener('click', onCancel);
      closeContactStyleButton.removeEventListener('click', onCancel);
      contactStyleModal.removeEventListener('click', onBackdropClick);
      document.removeEventListener('keydown', onKeyDown);
    }

    contactStyleForm.addEventListener('submit', onSubmit);
    contactStyleColorInput.addEventListener('input', onColorInput);
    contactStyleCancelButton.addEventListener('click', onCancel);
    closeContactStyleButton.addEventListener('click', onCancel);
    contactStyleModal.addEventListener('click', onBackdropClick);
    document.addEventListener('keydown', onKeyDown);
  });
}

function updateChatMenuForSelectedContact() {
  if (!state.selectedUsername) {
    chatMenuName.textContent = 'Select chat';
    chatMenuAbout.textContent = 'No profile info';
    setAvatar(chatMenuAvatar, '?', '');
    if (editContactStyleButton) {
      editContactStyleButton.classList.add('hidden');
    }
    removeFriendButton.classList.add('hidden');
    blockFriendButton.classList.add('hidden');
    return;
  }

  const selectedContact = state.contacts[state.selectedUsername] || {};
  const isBlocked = state.blockedUsers.some((name) => name.toLowerCase() === state.selectedUsername.toLowerCase());

  chatMenuName.textContent = getDisplayName(state.selectedUsername);
  chatMenuAbout.textContent = selectedContact.about || 'Available to chat';
  setAvatar(chatMenuAvatar, state.selectedUsername, selectedContact.avatarUrl || '');
  if (editContactStyleButton) {
    editContactStyleButton.classList.remove('hidden');
  }
  removeFriendButton.classList.remove('hidden');
  blockFriendButton.classList.remove('hidden');
  blockFriendButton.textContent = isBlocked ? 'Unblock friend' : 'Block friend';
}

async function openEditContactStyleFlow() {
  if (!state.selectedUsername) {
    return;
  }

  const username = state.selectedUsername;
  const existing = getContactCustomization(username);
  const result = await openContactStyleModal(existing);
  if (!result) {
    return;
  }

  const nextNickname = normalizeNickname(result.nickname);
  const nextColor = normalizeFriendColorHex(result.color);

  if (!nextNickname && !nextColor) {
    delete state.contactCustomizations[username];
  } else {
    state.contactCustomizations[username] = {
      nickname: nextNickname,
      color: nextColor
    };
  }

  saveContactCustomizations();
  setHeaderForSelectedChat();
  updateChatMenuForSelectedContact();
  renderConversation();
  renderUsers();
}

function getInitials(name) {
  return String(name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?';
}

function setAvatar(element, name, avatarUrl = '') {
  element.textContent = avatarUrl ? '' : getInitials(name);
  element.style.backgroundImage = avatarUrl ? `url("${encodeURI(avatarUrl)}")` : 'none';
}

function applyTheme() {
  document.body.classList.toggle('dark-mode', state.theme === 'dark');
  themeToggleButton.textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

function applyProfile() {
  currentAbout.textContent = state.profile.about || 'Available to chat';
  setAvatar(profileAvatar, state.username || 'U', state.profile.avatarUrl || '');
  updateOwnStatusRing();
}

function openSettingsModal() {
  settingsUsernameInput.value = state.username;
  settingsAboutInput.value = state.profile.about || '';
  settingsAvatarInput.value = '';
  if (settingsVisibilityInput) {
    settingsVisibilityInput.value = normalizeProfileVisibility(state.profile.profileVisibility);
  }
  if (settingsOnlineVisibilityInput) {
    settingsOnlineVisibilityInput.value = normalizeOnlineVisibility(state.profile.onlineVisibility);
  }
  oldPasswordInput.value = '';
  newPasswordInput.value = '';
  showSettingsMessage('');
  showChangePasswordMessage('');
  settingsModal.classList.remove('hidden');
}

function closeSettingsModal() {
  settingsModal.classList.add('hidden');
  state.isSavingProfile = false;
  setSaveProfileBusy(false);
}

function openChangePasswordModal() {
  oldPasswordInput.value = '';
  newPasswordInput.value = '';
  showChangePasswordMessage('');
  changePasswordModal.classList.remove('hidden');
  oldPasswordInput.focus();
}

function closeChangePasswordModal() {
  changePasswordModal.classList.add('hidden');
  setChangePasswordBusy(false);
}

function showChangePasswordMessage(message, isError = false) {
  if (!changePasswordMessage) {
    return;
  }

  changePasswordMessage.textContent = message;
  changePasswordMessage.dataset.state = isError ? 'error' : 'success';
}

function showSettingsMessage(message, isError = false) {
  if (!settingsMessage) {
    return;
  }

  settingsMessage.textContent = message;
  settingsMessage.dataset.state = isError ? 'error' : 'success';
}

function setSaveProfileBusy(isBusy) {
  const saveButton = settingsForm.querySelector('button[type="submit"]');
  if (!saveButton) {
    return;
  }

  saveButton.disabled = isBusy;
  saveButton.textContent = isBusy ? 'Saving...' : 'Save profile';
}

function setChangePasswordBusy(isBusy) {
  if (!changePasswordButton) {
    return;
  }

  changePasswordButton.disabled = isBusy;
  changePasswordButton.textContent = isBusy ? 'Saving...' : 'Save password';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getTimestampFromMessageId(messageId) {
  const rawId = String(messageId || '').trim();
  const match = rawId.match(/^(\d{10,})-/);
  if (!match) {
    return NaN;
  }

  const timestamp = Number(match[1]);
  return Number.isFinite(timestamp) ? timestamp : NaN;
}

function resolveMessageCreatedAt(createdAtValue, messageId) {
  const createdAtRaw = String(createdAtValue || '').trim();
  const parsedCreatedAt = new Date(createdAtRaw).getTime();
  if (Number.isFinite(parsedCreatedAt)) {
    return new Date(parsedCreatedAt).toISOString();
  }

  const messageIdTimestamp = getTimestampFromMessageId(messageId);
  if (Number.isFinite(messageIdTimestamp)) {
    return new Date(messageIdTimestamp).toISOString();
  }

  return new Date().toISOString();
}

function getDayKeyFromTimestamp(timestampMs) {
  const date = new Date(timestampMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getConversationDateLabel(timestampMs) {
  const messageDate = new Date(timestampMs);
  const today = new Date();

  const messageDayStart = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate()).getTime();
  const todayDayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dayDifference = Math.round((todayDayStart - messageDayStart) / (24 * 60 * 60 * 1000));

  if (dayDifference === 0) {
    return 'Today';
  }

  if (dayDifference === 1) {
    return 'Yesterday';
  }

  return messageDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function getConversation(username) {
  if (!state.conversations[username]) {
    state.conversations[username] = [];
  }

  return state.conversations[username];
}

function addConversationMessage(username, messageData) {
  const messageId = messageData.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = resolveMessageCreatedAt(messageData.createdAt, messageId);

  getConversation(username).push({
    ...messageData,
    id: messageId,
    createdAt,
    seen: Boolean(messageData.seen),
    reactions: normalizeMessageReactions(messageData.reactions)
  });
}

function updateConversationMessageReactions(username, messageId, reactions) {
  const conversation = getConversation(username);
  const entry = conversation.find((item) => item.id === messageId);
  if (!entry) {
    return false;
  }

  entry.reactions = normalizeMessageReactions(reactions);
  return true;
}

function toggleReactionForMessage(entry, reaction) {
  const normalized = normalizeMessageReactions(entry.reactions);
  const userKey = String(state.username || '').toLowerCase();
  const alreadySelected = normalized[reaction].some((name) => name.toLowerCase() === userKey);

  REACTION_EMOJIS.forEach((emoji) => {
    normalized[emoji] = normalized[emoji].filter((name) => name.toLowerCase() !== userKey);
  });

  if (!alreadySelected) {
    normalized[reaction] = [...normalized[reaction], state.username];
  }

  entry.reactions = normalized;
}

function getSupportedAudioMimeType() {
  if (typeof window.MediaRecorder === 'undefined') {
    return '';
  }

  const preferredMimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  const supported = preferredMimeTypes.find((mimeType) => window.MediaRecorder.isTypeSupported(mimeType));
  return supported || '';
}

function setVoiceRecordButtonState({ isRecording, disabled, label, title }) {
  if (!voiceRecordButton) {
    return;
  }

  voiceRecordButton.classList.toggle('recording', Boolean(isRecording));
  voiceRecordButton.disabled = Boolean(disabled);
  voiceRecordButton.textContent = label;
  voiceRecordButton.title = title;
  voiceRecordButton.setAttribute('aria-label', title);
}

function resetVoiceRecordButtonState() {
  setVoiceRecordButtonState({
    isRecording: false,
    disabled: false,
    label: '🎤',
    title: 'Record voice message'
  });
}

function stopVoiceRecordingStream() {
  if (voiceMediaStream) {
    voiceMediaStream.getTracks().forEach((track) => track.stop());
  }

  voiceMediaStream = null;
}

function sendVoiceMessage({ audioUrl, audioMimeType, durationMs, mood = 'neutral' }) {
  if (!state.selectedUsername) {
    appendMessage('Pick a person from the list before sending a voice message.');
    return;
  }

  if (state.blockedUsers.some((name) => name.toLowerCase() === state.selectedUsername.toLowerCase())) {
    appendMessage('You blocked this user. Unblock to send messages.');
    return;
  }

  stopOutgoingTyping();

  const contact = state.contacts[state.selectedUsername] || {};
  const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const sentAt = new Date().toLocaleTimeString();
  const replyTo = state.replyDraft
    ? {
        messageId: state.replyDraft.messageId,
        fromUsername: state.replyDraft.fromUsername,
        message: state.replyDraft.message
      }
    : null;
  const messageMood = sanitizeMood(mood);

  addConversationMessage(state.selectedUsername, {
    id: messageId,
    type: 'chat',
    direction: 'outgoing',
    message: '',
    mediaUrl: '',
    mediaType: '',
    mediaMimeType: '',
    audioUrl,
    audioMimeType,
    audioDurationMs: durationMs,
    mood: messageMood,
    replyTo,
    reactions: {},
    sentAt,
    seen: false
  });

  socket.emit('private-message', {
    toUsername: state.selectedUsername,
    toSocketId: contact.socketId || '',
    message: '',
    mediaUrl: '',
    mediaType: '',
    mediaMimeType: '',
    audioUrl,
    audioMimeType,
    audioDurationMs: durationMs,
    mood: messageMood,
    replyTo,
    messageId
  });

  renderConversation();
  renderUsers();
  clearReplyDraft();
  messageInput.focus();
}

function stopVoiceRecording(discard = false) {
  if (!voiceMediaRecorder) {
    return;
  }

  const recorder = voiceMediaRecorder;

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      voiceRecordedChunks.push(event.data);
    }
  };

  recorder.onstop = () => {
    const mimeType = recorder.mimeType || 'audio/webm';
    const durationMs = Math.max(0, Date.now() - voiceRecordingStartedAt);
    const chunks = voiceRecordedChunks.slice();

    voiceMediaRecorder = null;
    voiceRecordedChunks = [];
    voiceRecordingStartedAt = 0;
    stopVoiceRecordingStream();
    resetVoiceRecordButtonState();

    if (discard || !chunks.length) {
      return;
    }

    const audioBlob = new Blob(chunks, { type: mimeType });
    const reader = new FileReader();

    reader.onloadend = async () => {
      const audioUrl = String(reader.result || '');
      if (!audioUrl.startsWith('data:audio/')) {
        appendMessage('Recorded audio format is not supported.');
        return;
      }

      if (audioUrl.length > MAX_VOICE_DATA_URL_LENGTH) {
        appendMessage('Voice note is too large. Keep it shorter and try again.');
        return;
      }

      const shouldSend = await showConfirmModal({
        title: 'Send voice message',
        message: 'Do you want to send this voice recording?',
        okText: 'Send',
        cancelText: 'Cancel'
      });

      if (!shouldSend) {
        return;
      }

      const voiceMood = await detectMoodFromVoice({ durationMs });

      sendVoiceMessage({
        audioUrl,
        audioMimeType: mimeType,
        durationMs,
        mood: voiceMood
      });
    };

    reader.onerror = () => {
      appendMessage('Unable to process the recorded audio. Please try again.');
    };

    reader.readAsDataURL(audioBlob);
  };

  recorder.stop();
}

async function toggleVoiceRecording() {
  if (!voiceRecordButton) {
    return;
  }

  if (!state.selectedUsername) {
    appendMessage('Pick a person from the list before recording a voice message.');
    return;
  }

  if (voiceMediaRecorder && voiceMediaRecorder.state === 'recording') {
    stopVoiceRecording(false);
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof window.MediaRecorder === 'undefined') {
    appendMessage('Voice recording is not supported in this browser.');
    return;
  }

  const mimeType = getSupportedAudioMimeType();

  try {
    setVoiceRecordButtonState({
      isRecording: false,
      disabled: true,
      label: '...',
      title: 'Preparing recorder'
    });

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = mimeType ? new window.MediaRecorder(stream, { mimeType }) : new window.MediaRecorder(stream);

    voiceMediaStream = stream;
    voiceMediaRecorder = mediaRecorder;
    voiceRecordedChunks = [];
    voiceRecordingStartedAt = Date.now();

    mediaRecorder.start();

    setVoiceRecordButtonState({
      isRecording: true,
      disabled: false,
      label: '■',
      title: 'Stop and send recording'
    });
  } catch (_error) {
    stopVoiceRecordingStream();
    voiceMediaRecorder = null;
    voiceRecordedChunks = [];
    resetVoiceRecordButtonState();
    appendMessage('Microphone permission was denied or unavailable.');
  }
}

function getMediaTypeFromDataUrl(dataUrl) {
  const raw = String(dataUrl || '').trim().toLowerCase();
  if (raw.startsWith('data:image/')) {
    return 'image';
  }

  if (raw.startsWith('data:video/')) {
    return 'video';
  }

  return '';
}

function sendGalleryMessage({ mediaUrl, mediaType, mediaMimeType, mood = 'neutral' }) {
  if (!state.selectedUsername) {
    appendMessage('Pick a person from the list before sending a photo or video.');
    return;
  }

  if (state.blockedUsers.some((name) => name.toLowerCase() === state.selectedUsername.toLowerCase())) {
    appendMessage('You blocked this user. Unblock to send messages.');
    return;
  }

  stopOutgoingTyping();

  const contact = state.contacts[state.selectedUsername] || {};
  const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const sentAt = new Date().toLocaleTimeString();
  const replyTo = state.replyDraft
    ? {
        messageId: state.replyDraft.messageId,
        fromUsername: state.replyDraft.fromUsername,
        message: state.replyDraft.message
      }
    : null;
  const messageMood = sanitizeMood(mood);

  addConversationMessage(state.selectedUsername, {
    id: messageId,
    type: 'chat',
    direction: 'outgoing',
    message: '',
    mediaUrl: String(mediaUrl || ''),
    mediaType,
    mediaMimeType,
    audioUrl: '',
    audioMimeType: '',
    audioDurationMs: 0,
    mood: messageMood,
    replyTo,
    reactions: {},
    sentAt,
    seen: false
  });

  socket.emit('private-message', {
    toUsername: state.selectedUsername,
    toSocketId: contact.socketId || '',
    message: '',
    mediaUrl: String(mediaUrl || ''),
    mediaType,
    mediaMimeType,
    audioUrl: '',
    audioMimeType: '',
    audioDurationMs: 0,
    mood: messageMood,
    replyTo,
    messageId
  });

  renderConversation();
  renderUsers();
  clearReplyDraft();
  messageInput.focus();
}

async function handleMediaFileSelection() {
  if (!mediaFileInput) {
    return;
  }

  const [file] = mediaFileInput.files || [];
  mediaFileInput.value = '';

  if (!file) {
    return;
  }

  const mimeType = String(file.type || '').toLowerCase();
  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');

  if (!isImage && !isVideo) {
    appendMessage('Only photos and videos are supported in gallery upload.');
    return;
  }

  if (isVideo) {
    try {
      const thumbnailUrl = await generateVideoThumbnailFromFile(file);
      pendingMediaFile = file;
      pendingVideoThumbnailUrl = thumbnailUrl;
      openMediaPreviewModal({
        thumbnailUrl,
        fileName: `${file.name} (${formatFileSize(file.size)})`
      });
    } catch (error) {
      appendMessage(error.message || 'Unable to preview selected video.');
    }
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  pendingMediaFile = file;
  pendingVideoThumbnailUrl = previewUrl;
  openMediaPreviewModal({
    thumbnailUrl: previewUrl,
    fileName: `${file.name} (${formatFileSize(file.size)})`
  });
}

async function sendSelectedMediaFile(file, options = {}) {
  const isVideo = Boolean(options.isVideo);
  if (!state.selectedUsername) {
    appendMessage('Pick a person from the list before sending media.');
    return;
  }

  if (state.blockedUsers.some((name) => name.toLowerCase() === state.selectedUsername.toLowerCase())) {
    appendMessage('You blocked this user. Unblock to send messages.');
    return;
  }

  const previousGalleryDisabled = Boolean(galleryButton?.disabled);
  const previousCameraDisabled = Boolean(cameraCaptureButton?.disabled);
  const previousVoiceDisabled = Boolean(voiceRecordButton?.disabled);
  const previousSendDisabled = Boolean(messageForm?.querySelector('button[type="submit"]')?.disabled);
  const sendButton = messageForm?.querySelector('button[type="submit"]');

  if (cameraCaptureButton) {
    cameraCaptureButton.disabled = true;
  }
  if (galleryButton) {
    galleryButton.disabled = true;
  }
  if (voiceRecordButton) {
    voiceRecordButton.disabled = true;
  }
  if (sendButton) {
    sendButton.disabled = true;
  }

  setMediaUploadProgress(0, `Preparing upload (${formatFileSize(file.size)})...`);

  try {
    const uploadResult = await uploadMediaFileWithProgress(file);
    const mediaUrl = String(uploadResult.mediaUrl || '').trim();
    const mediaType = String(uploadResult.mediaType || '').trim().toLowerCase();
    const mediaMimeType = String(uploadResult.mediaMimeType || file.type || '').trim();

    if (!mediaUrl || (mediaType !== 'image' && mediaType !== 'video')) {
      throw new Error('Upload completed but media details are invalid.');
    }

    sendGalleryMessage({
      mediaUrl,
      mediaType,
      mediaMimeType: mediaMimeType.slice(0, 80),
      mood: 'neutral'
    });
  } catch (error) {
    appendMessage(error.message || (isVideo ? 'Unable to upload video.' : 'Unable to upload photo.'));
  } finally {
    hideMediaUploadProgress();

    if (cameraCaptureButton) {
      cameraCaptureButton.disabled = previousCameraDisabled;
    }
    if (galleryButton) {
      galleryButton.disabled = previousGalleryDisabled;
    }
    if (voiceRecordButton) {
      voiceRecordButton.disabled = previousVoiceDisabled;
    }
    if (sendButton) {
      sendButton.disabled = previousSendDisabled;
    }
  }
}

function getReplyPreviewText(rawText) {
  const text = String(rawText || '').trim();
  if (!text) {
    return '';
  }

  if (text.length <= 80) {
    return text;
  }

  return `${text.slice(0, 80)}...`;
}

function parseForwardedMessage(rawText) {
  const text = String(rawText || '').trim();
  const forwardedPrefix = 'forwarded:';

  if (!text.toLowerCase().startsWith(forwardedPrefix)) {
    return {
      isForwarded: false,
      content: text
    };
  }

  const content = text.slice(forwardedPrefix.length).trim();
  return {
    isForwarded: true,
    content: content || text
  };
}

function renderReplyComposer() {
  if (!replyComposer || !replyComposerText) {
    return;
  }

  if (!state.replyDraft) {
    replyComposer.classList.add('hidden');
    replyComposerText.textContent = '';
    return;
  }

  const isReplyToSelf = String(state.replyDraft.fromUsername || '').toLowerCase() === String(state.username || '').toLowerCase();
  const fromLabel = isReplyToSelf ? 'You' : state.replyDraft.fromUsername;
  replyComposerText.textContent = `Replying to ${fromLabel}: ${getReplyPreviewText(state.replyDraft.message)}`;
  replyComposer.classList.remove('hidden');
}

function setReplyDraftFromMessage(entry) {
  if (!state.selectedUsername || !entry || !entry.id) {
    return;
  }

  const previewMessage =
    String(entry.message || '').trim() ||
    (entry.mediaUrl ? (entry.mediaType === 'video' ? 'Video message' : 'Photo message') : '') ||
    (entry.audioUrl ? 'Voice message' : '');
  if (!previewMessage) {
    return;
  }

  state.replyDraft = {
    messageId: entry.id,
    fromUsername: entry.direction === 'incoming' ? state.selectedUsername : state.username,
    message: previewMessage
  };

  renderReplyComposer();
  messageInput.focus();
}

function clearReplyDraft() {
  state.replyDraft = null;
  renderReplyComposer();
}

function removeMessageFromConversation(username, messageId) {
  if (!username || !messageId) {
    return false;
  }

  const conversation = getConversation(username);
  const nextConversation = conversation.filter((entry) => entry.id !== messageId);
  const changed = nextConversation.length !== conversation.length;

  if (!changed) {
    return false;
  }

  state.conversations[username] = nextConversation;
  if (state.replyDraft && state.replyDraft.messageId === messageId) {
    clearReplyDraft();
  }

  return true;
}

async function deleteMessageOnServer(username, messageId, scope = 'self') {
  const safeScope = scope === 'everyone' ? 'everyone' : 'self';
  return deleteJson(
    `/api/messages/${encodeURIComponent(username)}/${encodeURIComponent(messageId)}?scope=${encodeURIComponent(safeScope)}`
  );
}

async function handleDeleteMessage(entry) {
  if (!state.selectedUsername || !entry?.id) {
    return;
  }

  let scope = 'self';

  if (entry.direction === 'outgoing') {
    const choice = await showDeleteMessageScopeModal(state.selectedUsername);
    if (!choice) {
      return;
    }
    scope = choice;
  } else {
    const confirmed = await showConfirmModal({
      title: 'Delete message',
      message: 'Delete this message for your side?',
      okText: 'Delete',
      cancelText: 'Cancel'
    });

    if (!confirmed) {
      return;
    }
  }

  try {
    await deleteMessageOnServer(state.selectedUsername, entry.id, scope);
    removeMessageFromConversation(state.selectedUsername, entry.id);
    renderConversation();
    renderUsers();
  } catch (error) {
    appendMessage(error.message || 'Unable to delete this message right now.');
  }
}

function findContactUsernameByInput(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) {
    return '';
  }

  return Object.keys(state.contacts).find((username) => username.toLowerCase() === normalized) || '';
}

async function handleForwardMessage(entry) {
  const hasAudio = Boolean(String(entry?.audioUrl || '').trim());
  const hasMedia = Boolean(String(entry?.mediaUrl || '').trim());
  if (!entry?.message && !hasAudio && !hasMedia) {
    return;
  }

  const availableFriends = getSortedContacts().filter((username) => username !== state.username);
  if (!availableFriends.length) {
    appendMessage('No friends available to forward this message.');
    return;
  }

  const suggestedFriend = availableFriends.find((username) => username !== state.selectedUsername) || availableFriends[0];
  const targetUsername = await showForwardMessageModal(entry, availableFriends, suggestedFriend);

  if (!targetUsername) {
    return;
  }

  if (state.blockedUsers.some((name) => name.toLowerCase() === targetUsername.toLowerCase())) {
    appendMessage('You blocked this user. Unblock to forward messages.');
    return;
  }

  const contact = state.contacts[targetUsername] || {};
  const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const sentAt = new Date().toLocaleTimeString();
  const forwardedMessage = hasAudio || hasMedia ? '' : `Forwarded: ${entry.message}`;
  const forwardedMood = sanitizeMood(entry.mood);

  addConversationMessage(targetUsername, {
    id: messageId,
    type: 'chat',
    direction: 'outgoing',
    message: forwardedMessage,
    mediaUrl: hasMedia ? entry.mediaUrl : '',
    mediaType: hasMedia ? entry.mediaType : '',
    mediaMimeType: hasMedia ? entry.mediaMimeType : '',
    audioUrl: hasAudio ? entry.audioUrl : '',
    audioMimeType: hasAudio ? entry.audioMimeType : '',
    audioDurationMs: hasAudio ? entry.audioDurationMs : 0,
    mood: forwardedMood,
    replyTo: null,
    sentAt,
    seen: false
  });

  socket.emit('private-message', {
    toUsername: targetUsername,
    toSocketId: contact.socketId || '',
    message: forwardedMessage,
    mediaUrl: hasMedia ? entry.mediaUrl : '',
    mediaType: hasMedia ? entry.mediaType : '',
    mediaMimeType: hasMedia ? entry.mediaMimeType : '',
    audioUrl: hasAudio ? entry.audioUrl : '',
    audioMimeType: hasAudio ? entry.audioMimeType : '',
    audioDurationMs: hasAudio ? entry.audioDurationMs : 0,
    mood: forwardedMood,
    replyTo: null,
    messageId
  });

  if (state.selectedUsername === targetUsername) {
    renderConversation();
  }
  renderUsers();
  appendMessage(`Message forwarded to ${targetUsername}.`);
}

function ensureContact(username, partial = {}) {
  if (!username) {
    return;
  }

  if (!state.contacts[username]) {
    state.contacts[username] = {
      username,
      socketId: '',
      online: false,
      updatedAt: Date.now(),
      ...partial
    };
  } else {
    state.contacts[username] = {
      ...state.contacts[username],
      ...partial,
      updatedAt: Date.now()
    };
  }
}

function getContactStatusText(username) {
  const contact = state.contacts[username];
  if (!contact) {
    return 'Offline';
  }

  return contact.online ? 'Online' : 'Offline';
}

function getSelectedChatStatusText() {
  if (!state.selectedUsername) {
    return 'Offline';
  }

  if (state.typingByUsername[state.selectedUsername]) {
    return `${getDisplayName(state.selectedUsername)} is typing...`;
  }

  return getContactStatusText(state.selectedUsername);
}

function setHeaderForSelectedChat() {
  if (!state.selectedUsername) {
    chatWithLabel.textContent = 'Select chat';
    chatWithStatus.textContent = 'Offline';
    chatAvatar.textContent = '?';
    chatAvatar.style.backgroundImage = 'none';
    chatMenuButton.classList.add('hidden');
    cameraCaptureButton.classList.add('hidden');
    closeChatMenu();
    updateChatMenuForSelectedContact();
    return;
  }

  const selectedContact = state.contacts[state.selectedUsername] || {};
  chatWithLabel.textContent = getDisplayName(state.selectedUsername);
  chatWithStatus.textContent = getSelectedChatStatusText();
  setAvatar(chatAvatar, state.selectedUsername, selectedContact.avatarUrl || '');
  chatMenuButton.classList.remove('hidden');
  cameraCaptureButton.classList.remove('hidden');
  updateChatMenuForSelectedContact();
}

function renderConversation() {
  messagesContainer.innerHTML = '';

  if (!state.selectedUsername) {
    messagesContainer.innerHTML = '<div class="empty-chat">Select a person from the left to open chat.</div>';
    applyConversationTheme();
    return;
  }

  const conversation = getConversation(state.selectedUsername);

  if (conversation.length === 0) {
    messagesContainer.innerHTML = `<div class="empty-chat">No messages with ${escapeHtml(getDisplayName(state.selectedUsername))} yet.</div>`;
    applyConversationTheme();
    return;
  }

  let previousDayKey = '';

  conversation.forEach((entry) => {
    const messageCreatedAt = resolveMessageCreatedAt(entry.createdAt, entry.id);
    const messageCreatedAtMs = new Date(messageCreatedAt).getTime();
    const messageDayKey = getDayKeyFromTimestamp(messageCreatedAtMs);

    if (messageDayKey !== previousDayKey) {
      const separator = document.createElement('div');
      separator.className = 'message-date-separator';
      separator.textContent = getConversationDateLabel(messageCreatedAtMs);
      messagesContainer.appendChild(separator);
      previousDayKey = messageDayKey;
    }

    const item = document.createElement('div');
    item.className = `message ${entry.type} ${entry.direction || ''}`.trim();
    const messageMood = sanitizeMood(entry.mood);
    if (entry.type === 'chat' && ['happy', 'sad', 'angry'].includes(messageMood)) {
      item.classList.add(`mood-${messageMood}`);
    }
    const resolvedMediaUrl = resolveMediaUrl(entry.mediaUrl || '');
    const hasMediaMessage = Boolean(String(entry.mediaUrl || '').trim());
    const mediaType = hasMediaMessage ? (String(entry.mediaType || '').toLowerCase() || getMediaTypeFromDataUrl(entry.mediaUrl)) : '';
    const hasAudioMessage = Boolean(String(entry.audioUrl || '').trim());
    const forwardedData = parseForwardedMessage(entry.message);
    const forwardLabel = entry.direction === 'outgoing' ? 'You forwarded' : 'Forwarded message';
    const forwardHtml = !hasAudioMessage && !hasMediaMessage && forwardedData.isForwarded
      ? `
      <div class="message-forward-snippet">
        <span class="forward-label">${forwardLabel}</span>
        <span>${escapeHtml(getReplyPreviewText(forwardedData.content))}</span>
      </div>
    `
      : '';

    const tickHtml =
      entry.direction === 'outgoing'
        ? `<span class="message-tick ${entry.seen ? 'seen' : ''}">${entry.seen ? '✓✓' : '✓'}</span>`
        : '';

    const replyToMessage = String(entry?.replyTo?.message || '').trim();
    const replyToFrom = String(entry?.replyTo?.fromUsername || '').trim();
    const hasReply = Boolean(replyToMessage);
    const isReplyToSelf = replyToFrom.toLowerCase() === String(state.username || '').toLowerCase();
    const replyLabel = hasReply ? (isReplyToSelf ? 'Reply to You' : `Reply to ${escapeHtml(replyToFrom || 'message')}`) : '';

    const replyHtml = hasReply
      ? `
      <div class="message-reply-snippet">
        <span class="reply-label">${replyLabel}</span>
        <span>${escapeHtml(getReplyPreviewText(replyToMessage))}</span>
      </div>
    `
      : '';

    const audioHtml = hasAudioMessage
      ? `<div class="message-audio-wrap">
          <div class="message-audio-controls">
            <audio class="message-audio" controls preload="metadata" src="${escapeHtml(entry.audioUrl)}"></audio>
            <button type="button" class="audio-speed-btn" data-audio-speed="1">1x</button>
          </div>
        </div>`
      : '';

    const reactions = normalizeMessageReactions(entry.reactions);
    const reactionSummaryItems = REACTION_EMOJIS.map((emoji) => {
      const count = reactions[emoji].length;
      if (count <= 0) {
        return '';
      }

      const reactedByMe = reactions[emoji].some((name) => name.toLowerCase() === String(state.username || '').toLowerCase());
      return `<span class="message-reaction-chip ${reactedByMe ? 'active' : ''}">${escapeHtml(emoji)} ${count}</span>`;
    }).filter(Boolean);

    const reactionPickerHtml = `
      <div class="message-reaction-picker" aria-label="Message reactions">
        ${REACTION_EMOJIS.map((emoji) => {
          const reactedByMe = reactions[emoji].some((name) => name.toLowerCase() === String(state.username || '').toLowerCase());
          return `<button type="button" class="message-reaction-btn ${reactedByMe ? 'active' : ''}" data-message-reaction="${escapeHtml(
            emoji
          )}" aria-label="React ${escapeHtml(emoji)}">${escapeHtml(emoji)}</button>`;
        }).join('')}
      </div>
    `;

    const reactionsSummaryHtml = reactionSummaryItems.length
      ? `<div class="message-reaction-summary">${reactionSummaryItems.join('')}</div>`
      : '';

    const mediaHtml = hasMediaMessage
      ? mediaType === 'video'
        ? `<div class="message-media-wrap"><video class="message-media-video" controls preload="metadata" src="${escapeHtml(
            resolvedMediaUrl
          )}"></video></div>`
        : `<div class="message-media-wrap"><img class="message-media-image" src="${escapeHtml(resolvedMediaUrl)}" alt="Shared photo" loading="lazy" /></div>`
      : '';

    const textBodyHtml = !hasAudioMessage && !hasMediaMessage
      ? `<div class="message-body">${escapeHtml(forwardedData.content)}</div>`
      : `<div class="message-body message-body-audio">${hasAudioMessage ? 'Voice message' : mediaType === 'video' ? 'Video' : 'Photo'}</div>`;

    item.innerHTML = `
      <div class="message-meta">${escapeHtml(entry.sentAt)} ${tickHtml}</div>
      ${forwardHtml}
      ${replyHtml}
      ${mediaHtml}
      ${audioHtml}
      ${textBodyHtml}
      ${reactionPickerHtml}
      ${reactionsSummaryHtml}
      <div class="message-actions">
        <button type="button" class="message-action-btn" data-message-action="reply">Reply</button>
        <button type="button" class="message-action-btn" data-message-action="forward" title="Forward" aria-label="Forward message">↗</button>
        <button type="button" class="message-action-btn" data-message-action="delete">Delete</button>
      </div>
    `;

    const replyButton = item.querySelector('[data-message-action="reply"]');
    if (replyButton) {
      replyButton.addEventListener('click', () => {
        setReplyDraftFromMessage(entry);
      });
    }

    const forwardButton = item.querySelector('[data-message-action="forward"]');
    if (forwardButton) {
      forwardButton.addEventListener('click', async () => {
        await handleForwardMessage(entry);
      });
    }

    const deleteButton = item.querySelector('[data-message-action="delete"]');
    if (deleteButton) {
      deleteButton.addEventListener('click', async () => {
        await handleDeleteMessage(entry);
      });
    }

    const imageElement = item.querySelector('.message-media-image');
    if (imageElement) {
      imageElement.addEventListener('click', () => {
        openImageViewerModal(entry.mediaUrl);
      });
    }

    item.querySelectorAll('[data-message-reaction]').forEach((reactionButton) => {
      reactionButton.addEventListener('click', () => {
        const selectedReaction = String(reactionButton.getAttribute('data-message-reaction') || '');
        if (!REACTION_EMOJIS.includes(selectedReaction) || !state.selectedUsername) {
          return;
        }

        toggleReactionForMessage(entry, selectedReaction);
        renderConversation();

        socket.emit('message-reaction', {
          messageId: entry.id,
          withUsername: state.selectedUsername,
          reaction: selectedReaction
        });

        closeAllReactionPickers();
      });
    });

    let reactionPressTimer = null;

    const startReactionPress = (event) => {
      if (event.target.closest('.message-actions, .message-audio-controls, .message-reaction-picker')) {
        return;
      }

      reactionPressTimer = window.setTimeout(() => {
        closeAllReactionPickers();
        item.classList.add('show-reaction-picker');
        reactionPressTimer = null;
      }, MESSAGE_REACTION_LONG_PRESS_MS);
    };

    const clearReactionPress = () => {
      if (reactionPressTimer) {
        clearTimeout(reactionPressTimer);
        reactionPressTimer = null;
      }
    };

    item.addEventListener('pointerdown', startReactionPress);
    item.addEventListener('pointerup', clearReactionPress);
    item.addEventListener('pointercancel', clearReactionPress);
    item.addEventListener('pointerleave', clearReactionPress);

    item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      closeAllReactionPickers();
      item.classList.add('show-reaction-picker');
    });

    const audioSpeedButton = item.querySelector('.audio-speed-btn');
    const audioElement = item.querySelector('.message-audio');
    if (audioSpeedButton && audioElement) {
      audioSpeedButton.addEventListener('click', () => {
        const current = Number(audioSpeedButton.getAttribute('data-audio-speed') || '1');
        const next = current >= 1.5 ? 1 : 1.5;
        audioElement.playbackRate = next;
        audioSpeedButton.setAttribute('data-audio-speed', String(next));
        audioSpeedButton.textContent = `${next}x`;
      });
    }

    messagesContainer.appendChild(item);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  applyConversationTheme();
}

function getLastPreview(username) {
  const conversation = getConversation(username);
  const lastMessage = conversation[conversation.length - 1];
  if (!lastMessage) {
    return 'No messages yet';
  }

  if (lastMessage.mediaUrl) {
    return String(lastMessage.mediaType || '').toLowerCase() === 'video' ? 'Video' : 'Photo';
  }

  if (lastMessage.audioUrl) {
    return 'Voice message';
  }

  const forwardedData = parseForwardedMessage(lastMessage.message);
  return forwardedData.isForwarded ? `Forwarded: ${forwardedData.content}` : lastMessage.message;
}

function getUnreadMessageCount(username) {
  const conversation = getConversation(username);
  return conversation.reduce((count, entry) => {
    if (entry.direction !== 'incoming') {
      return count;
    }

    return entry.ackSent ? count : count + 1;
  }, 0);
}

function getSortedContacts() {
  const names = Object.keys(state.contacts).filter((name) => name !== state.username);

  const pinOrder = new Map(
    state.pinnedChats.map((name, index) => [String(name || '').toLowerCase(), index])
  );

  return names.sort((a, b) => {
    const pinA = pinOrder.has(a.toLowerCase());
    const pinB = pinOrder.has(b.toLowerCase());

    if (pinA !== pinB) {
      return pinA ? -1 : 1;
    }

    if (pinA && pinB) {
      return pinOrder.get(a.toLowerCase()) - pinOrder.get(b.toLowerCase());
    }

    const contactA = state.contacts[a];
    const contactB = state.contacts[b];

    if (contactA.online !== contactB.online) {
      return contactA.online ? -1 : 1;
    }

    return (contactB.updatedAt || 0) - (contactA.updatedAt || 0);
  });
}

function getHiddenSidebarStorageKey() {
  return `${SIDEBAR_HIDDEN_FRIENDS_KEY_PREFIX}:${state.username || 'guest'}`;
}

function loadHiddenSidebarFriends() {
  try {
    const raw = localStorage.getItem(getHiddenSidebarStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    state.hiddenSidebarFriends = Array.isArray(parsed)
      ? parsed.filter((name) => typeof name === 'string' && name.trim())
      : [];
  } catch (_error) {
    state.hiddenSidebarFriends = [];
  }
}

function saveHiddenSidebarFriends() {
  localStorage.setItem(getHiddenSidebarStorageKey(), JSON.stringify(state.hiddenSidebarFriends));
}

function isFriendHiddenFromSidebar(username) {
  return state.hiddenSidebarFriends.some((name) => name.toLowerCase() === String(username || '').toLowerCase());
}

function hideFriendFromSidebar(username) {
  if (!username || isFriendHiddenFromSidebar(username)) {
    return;
  }

  state.hiddenSidebarFriends.push(username);
  saveHiddenSidebarFriends();
}

function showFriendInSidebar(username) {
  if (!username) {
    return;
  }

  const before = state.hiddenSidebarFriends.length;
  state.hiddenSidebarFriends = state.hiddenSidebarFriends.filter(
    (name) => name.toLowerCase() !== username.toLowerCase()
  );

  if (state.hiddenSidebarFriends.length !== before) {
    saveHiddenSidebarFriends();
  }
}

function pruneHiddenSidebarFriends() {
  const visibleFriends = new Set(getSortedContacts().map((name) => name.toLowerCase()));
  const before = state.hiddenSidebarFriends.length;
  state.hiddenSidebarFriends = state.hiddenSidebarFriends.filter((name) => visibleFriends.has(name.toLowerCase()));

  if (before !== state.hiddenSidebarFriends.length) {
    saveHiddenSidebarFriends();
  }
}

function renderExistingFriendsList() {
  existingFriendsList.innerHTML = '';
  const contacts = getSortedContacts();

  if (contacts.length === 0) {
    const item = document.createElement('li');
    item.className = 'friends-empty';
    item.textContent = 'No friends yet.';
    existingFriendsList.appendChild(item);
    return;
  }

  contacts.forEach((username) => {
    const contact = state.contacts[username] || {};
    const item = document.createElement('li');
    const encoded = encodeURIComponent(username);

    item.innerHTML = `
      <div class="friend-row-top">
        <div class="friend-row-name">
          <span class="user-avatar" data-existing-friend-avatar="${escapeHtml(username)}"></span>
          <div>
            <strong>${escapeHtml(getDisplayName(username))}</strong>
            <div class="friend-row-status">${escapeHtml(contact.about || 'Available to chat')}</div>
          </div>
        </div>
      </div>
      <div class="friend-row-actions friend-directory-actions">
        <button type="button" data-open-friend-chat="${encoded}">Open chat</button>
      </div>
    `;

    const avatar = item.querySelector('[data-existing-friend-avatar]');
    if (avatar) {
      setAvatar(avatar, username, contact.avatarUrl || '');
    }

    existingFriendsList.appendChild(item);
  });
}

async function removeFriendByUsername(targetUsername, sourceLabel = 'Friend removed.') {
  const result = await postJson('/api/friends/remove', { username: targetUsername });
  showFriendsMessage(result.message || sourceLabel);

  await loadFriendsFromServer();
  renderExistingFriendsList();
  renderFriendRequests();
  renderUsers();
  setHeaderForSelectedChat();
  renderConversation();
}

function clearSidebarLongPress(username) {
  const timer = sidebarLongPressTimers.get(username);
  if (timer) {
    clearTimeout(timer);
    sidebarLongPressTimers.delete(username);
  }
}

function armSidebarLongPress(button, username) {
  clearSidebarLongPress(username);

  const timer = window.setTimeout(async () => {
    sidebarLongPressTimers.delete(username);
    button.dataset.skipNextClick = '1';

    const isHidden = isFriendHiddenFromSidebar(username);
    const actionText = isHidden ? 'Unhide' : 'Hide';

    const confirmed = await showConfirmModal({
      title: `${actionText} from sidebar`,
      message: isHidden
        ? `Show ${username} again in your top sidebar list?`
        : `Hide ${username} from sidebar? You can search and open chat again anytime.`,
      okText: actionText,
      cancelText: 'Cancel'
    });

    if (!confirmed) {
      return;
    }

    if (isHidden) {
      showFriendInSidebar(username);
      state.sidebarFriendsQuery = '';
      sidebarFriendsSearchInput.value = '';
    } else {
      hideFriendFromSidebar(username);
    }

    renderUsers();
    showFriendsMessage(isHidden ? 'Friend is visible in sidebar now.' : 'Friend hidden from sidebar. Use search to find them.');
  }, SIDEBAR_LONG_PRESS_MS);

  sidebarLongPressTimers.set(username, timer);
}

async function selectChat(username) {
  if (state.selectedUsername && state.selectedUsername !== username) {
    stopTypingForContact(state.selectedUsername);
  }

  stopOutgoingTyping();
  clearReplyDraft();
  state.selectedUsername = username;
  closeChatMenu();

  if (isMobileView()) {
    setChatOnlyMode(true);
  }

  setHeaderForSelectedChat();
  renderUsers();
  renderConversation();

  if (!state.loadedConversations[username]) {
    try {
      await loadConversationFromServer(username);
    } catch (error) {
      appendMessage(error.message || 'Unable to load messages right now.');
    }
  }

  if (state.selectedUsername !== username) {
    return;
  }

  markCurrentConversationAsSeen();
  renderConversation();
  messageInput.focus();
}

function markCurrentConversationAsSeen() {
  if (!isSelectedChatVisible()) {
    return;
  }

  const conversation = getConversation(state.selectedUsername);
  let changed = false;
  conversation.forEach((entry) => {
    if (entry.direction === 'incoming' && !entry.ackSent) {
      changed = true;
      entry.ackSent = true;
      socket.emit('message-seen', {
        messageId: entry.id,
        fromUsername: state.selectedUsername,
        toUsername: state.username
      });
    }
  });

  if (changed) {
    renderUsers();
  }
}

function showAuthMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.dataset.state = isError ? 'error' : 'success';
}

function setRegisterFieldsDisabled(disabled) {
  registerEmailInput.readOnly = disabled;
  registerUsernameInput.readOnly = disabled;
  registerPasswordInput.readOnly = disabled;
}

function setRegisterBusy(isBusy, label = 'Send OTP') {
  if (!registerSubmitButton) {
    return;
  }

  registerSubmitButton.disabled = isBusy;
  registerSubmitButton.textContent = isBusy ? label : state.registerOtpPending ? 'OTP Sent' : 'Send OTP';
}

function resetRegisterOtpFlow(options = {}) {
  const { clearForm = false } = options;

  state.registerOtpPending = false;
  registerOtpSection.classList.add('hidden');
  registerOtpInput.required = false;
  registerOtpInput.value = '';
  verifyOtpButton.disabled = false;
  resendOtpButton.disabled = false;
  setRegisterFieldsDisabled(false);
  setRegisterBusy(false);

  if (clearForm) {
    registerEmailInput.value = '';
    registerUsernameInput.value = '';
    registerPasswordInput.value = '';
  }
}

function setForgotPasswordEmailReadOnly(readOnly) {
  if (!forgotEmailInput) {
    return;
  }

  forgotEmailInput.readOnly = Boolean(readOnly);
}

function resetForgotPasswordFlow(options = {}) {
  const { clearForm = false } = options;

  state.forgotPasswordOtpPending = false;
  state.forgotPasswordOtpVerified = false;

  if (forgotOtpSection) {
    forgotOtpSection.classList.add('hidden');
  }

  if (forgotResetSection) {
    forgotResetSection.classList.add('hidden');
  }

  if (forgotOtpInput) {
    forgotOtpInput.value = '';
    forgotOtpInput.required = false;
  }

  if (forgotNewPasswordInput) {
    forgotNewPasswordInput.value = '';
    forgotNewPasswordInput.required = false;
  }

  if (forgotSendOtpButton) {
    forgotSendOtpButton.disabled = false;
    forgotSendOtpButton.textContent = 'Send OTP';
  }

  if (forgotVerifyOtpButton) {
    forgotVerifyOtpButton.disabled = false;
  }

  if (forgotResendOtpButton) {
    forgotResendOtpButton.disabled = false;
  }

  if (forgotResetPasswordButton) {
    forgotResetPasswordButton.disabled = false;
  }

  setForgotPasswordEmailReadOnly(false);

  if (clearForm && forgotEmailInput) {
    forgotEmailInput.value = '';
  }
}

function openForgotPasswordPanel() {
  resetRegisterOtpFlow();
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  forgotPasswordForm.classList.remove('hidden');
  showLoginButton.classList.add('active');
  showRegisterButton.classList.remove('active');
  showAuthMessage('Enter your email to receive a password reset OTP.');
  forgotEmailInput.focus();
}

function showFriendsMessage(message, isError = false) {
  friendsMessage.textContent = message;
  friendsMessage.dataset.state = isError ? 'error' : 'success';

  if (state.friendMessageTimeout) {
    clearTimeout(state.friendMessageTimeout);
    state.friendMessageTimeout = null;
  }

  if (!message) {
    return;
  }

  state.friendMessageTimeout = window.setTimeout(() => {
    friendsMessage.textContent = '';
    friendsMessage.dataset.state = '';
    state.friendMessageTimeout = null;
  }, 3000);
}

function showStatusMessage(message, isError = false) {
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = String(message || '');
  statusMessage.dataset.state = message ? (isError ? 'error' : 'success') : '';
}

function formatStatusTime(isoTime) {
  const timestamp = new Date(String(isoTime || '')).getTime();
  if (!Number.isFinite(timestamp)) {
    return 'Just now';
  }

  const diffMs = Date.now() - timestamp;
  if (!Number.isFinite(diffMs) || diffMs <= 30000) {
    return 'Just now';
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function sanitizeStatusType(value) {
  const type = String(value || '').trim().toLowerCase();
  return ['text', 'image', 'video'].includes(type) ? type : '';
}

function normalizeStatusArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set();

  return value
    .filter((item) => item && typeof item === 'object')
    .filter((item) => {
      const statusId = String(item.statusId || '').trim();
      if (!statusId) {
        return false;
      }

      const key = statusId.toLowerCase();
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

function getStatusesForUsername(username) {
  const target = String(username || '').trim().toLowerCase();
  if (!target) {
    return [];
  }

  if (target === String(state.username || '').toLowerCase()) {
    return normalizeStatusArray(state.myStatuses);
  }

  const entry = (state.friendStatuses || []).find(
    (item) => String(item?.username || '').toLowerCase() === target
  );

  if (Array.isArray(entry?.statuses)) {
    return normalizeStatusArray(entry.statuses);
  }

  if (entry?.status) {
    return normalizeStatusArray([entry.status]);
  }

  return [];
}

function getStatusForUsername(username) {
  return getStatusesForUsername(username)[0] || null;
}

function hasActiveStatus(username) {
  return getStatusesForUsername(username).length > 0;
}

function hasStatusViewedByCurrentUser(status) {
  const currentUsername = String(state.username || '').trim().toLowerCase();
  if (!currentUsername) {
    return false;
  }

  const views = status?.views;
  if (!views || typeof views !== 'object') {
    return false;
  }

  if (Array.isArray(views)) {
    return views.some((viewer) => String(viewer?.username || '').trim().toLowerCase() === currentUsername);
  }

  return Object.values(views).some((viewer) => String(viewer?.username || '').trim().toLowerCase() === currentUsername);
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
    const username = String(entry.username || key).trim();
    if (!username) {
      return acc;
    }

    const likeKey = username.toLowerCase();
    acc[likeKey] = {
      username,
      likedAt: String(entry.likedAt || '')
    };
    return acc;
  }, {});
}

function hasStatusLike(status) {
  const currentUsername = String(state.username || '').trim().toLowerCase();
  if (!currentUsername) {
    return false;
  }

  const likes = normalizeStatusLikes(status?.likes);
  return Boolean(likes[currentUsername]);
}

function hasStatusLikeByViewer(status, viewerUsername) {
  const viewerKey = String(viewerUsername || '').trim().toLowerCase();
  if (!viewerKey) {
    return false;
  }

  const likes = normalizeStatusLikes(status?.likes);
  return Boolean(likes[viewerKey]);
}

function hasUnviewedStatus(username) {
  const target = String(username || '').trim().toLowerCase();
  const current = String(state.username || '').trim().toLowerCase();
  if (!target || target === current) {
    return false;
  }

  const statuses = getStatusesForUsername(username);
  if (!statuses.length) {
    return false;
  }

  return statuses.some((status) => !hasStatusViewedByCurrentUser(status));
}

function updateOwnStatusRing() {
  if (!profileAvatar) {
    return;
  }

  profileAvatar.classList.toggle('status-ring', hasActiveStatus(state.username));
}

async function markStatusAsViewed(ownerUsername, statusId) {
  const owner = String(ownerUsername || '').trim();
  const id = String(statusId || '').trim();
  if (!owner || !id) {
    return;
  }

  if (owner.toLowerCase() === String(state.username || '').toLowerCase()) {
    return;
  }

  await postJson('/api/status/view', {
    ownerUsername: owner,
    statusId: id
  });
}

async function setStatusLikeOnServer({ ownerUsername, statusId, liked }) {
  const owner = String(ownerUsername || '').trim();
  const id = String(statusId || '').trim();
  if (!owner || !id) {
    throw new Error('Status owner and status id are required.');
  }

  return postJson('/api/status/like', {
    ownerUsername: owner,
    statusId: id,
    liked: Boolean(liked)
  });
}

async function deleteStatusOnServer(statusId) {
  const id = String(statusId || '').trim();
  if (!id) {
    throw new Error('Status id is required.');
  }

  return deleteJson(`/api/status/${encodeURIComponent(id)}`);
}

function buildForwardStatusEntry(status) {
  const type = sanitizeStatusType(status?.type);
  const mediaType = sanitizeStatusType(status?.mediaType);
  const rawText = String(status?.text || '').trim();
  const fallbackLabel = 'Status update';
  const hasMedia = Boolean(String(status?.mediaUrl || '').trim()) && (mediaType === 'image' || mediaType === 'video');

  return {
    message: hasMedia ? rawText : `Status: ${rawText || fallbackLabel}`,
    mediaUrl: hasMedia ? String(status.mediaUrl || '').trim() : '',
    mediaType: hasMedia ? mediaType : '',
    mediaMimeType: hasMedia ? String(status.mediaMimeType || '').trim() : '',
    audioUrl: '',
    audioMimeType: '',
    audioDurationMs: 0,
    mood: 'neutral',
    type
  };
}

async function handleForwardStatus(status) {
  const statusId = String(status?.statusId || '').trim();
  if (!statusId) {
    return;
  }

  await handleForwardMessage(buildForwardStatusEntry(status));
}

async function handleDeleteStatus(status) {
  const statusId = String(status?.statusId || '').trim();
  if (!statusId) {
    return;
  }

  const confirmed = await showConfirmModal({
    title: 'Delete status',
    message: 'Delete this status update?',
    okText: 'Delete',
    cancelText: 'Cancel'
  });

  if (!confirmed) {
    return;
  }

  try {
    await deleteStatusOnServer(statusId);
    await loadStatusFeedFromServer();

    if (!statusViewerModal.classList.contains('hidden')) {
      openStatusViewerForUser(state.username);
    }
  } catch (error) {
    appendMessage(error.message || 'Unable to delete this status right now.');
  }
}

function openStatusViewerForUser(username) {
  if (!statusViewerModal || !statusViewerList) {
    return;
  }

  const safeUsername = String(username || '').trim();
  if (!safeUsername) {
    return;
  }

  const statuses = getStatusesForUsername(safeUsername);
  if (statuses.length === 0) {
    return;
  }

  const isSelf = safeUsername.toLowerCase() === String(state.username || '').toLowerCase();
  const displayName = isSelf ? 'You' : getDisplayName(safeUsername);
  const avatarUrl = isSelf ? state.profile.avatarUrl || '' : state.contacts[safeUsername]?.avatarUrl || '';

  activeStatusViewerStatuses = statuses;
  activeStatusViewerIndex = 0;
  activeStatusViewerIsSelf = isSelf;
  activeStatusViewerOwnerUsername = safeUsername;

  setAvatar(statusViewerAvatar, safeUsername, avatarUrl);
  statusViewerAvatar.classList.remove('status-ring', 'status-ring-unviewed', 'status-ring-viewed');
  statusViewerAvatar.classList.add(isSelf ? 'status-ring' : 'status-ring-viewed');
  statusViewerName.textContent = displayName;

  renderActiveStatusViewerItem();

  statusViewerModal.classList.remove('hidden');

  if (!isSelf) {
    const markTasks = statuses
      .map((status) => String(status?.statusId || '').trim())
      .filter(Boolean)
      .map((statusId) => markStatusAsViewed(safeUsername, statusId));

    void Promise.all(markTasks)
      .then(() => loadStatusFeedFromServer())
      .catch(() => {
        // Keep status viewing smooth even if view tracking fails.
      });
  }
}

function getStatusIconSvg(name) {
  const icons = {
    delete: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 6h18"></path>
        <path d="M8 6V4h8v2"></path>
        <path d="M19 6l-1 14H6L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
      </svg>
    `,
    forward: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 17L17 7"></path>
        <path d="M9 7h8v8"></path>
      </svg>
    `,
    view: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `,
    image: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="5" width="18" height="14" rx="2"></rect>
        <circle cx="9" cy="10" r="1.5"></circle>
        <path d="M21 16l-5-5-6 6-3-3-4 4"></path>
      </svg>
    `,
    video: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="5" width="14" height="14" rx="2"></rect>
        <path d="M17 10l4-3v10l-4-3z"></path>
      </svg>
    `
  };

  return icons[name] || '';
}

function buildStatusViewerHtml(status, isSelf) {
  const type = sanitizeStatusType(status?.type);
  const mediaType = sanitizeStatusType(status?.mediaType);
  const resolvedMediaUrl = resolveMediaUrl(status?.mediaUrl || '');
  const text = String(status?.text || '').trim();
  const bodyText = text;
  const hasMedia = Boolean(resolvedMediaUrl) && (type === 'image' || type === 'video');
  const bodyHtml = bodyText ? `<div class="status-body${hasMedia ? ' status-caption' : ''}">${escapeHtml(bodyText)}</div>` : '';

  let viewersHtml = '';
  if (isSelf) {
    const viewers = Object.values(status?.views || {})
      .filter((viewer) => String(viewer?.username || '').trim())
      .sort((a, b) => {
        const countA = Math.max(0, Number.parseInt(a?.count, 10) || 0);
        const countB = Math.max(0, Number.parseInt(b?.count, 10) || 0);
        if (countB !== countA) {
          return countB - countA;
        }

        return String(a?.username || '').localeCompare(String(b?.username || ''));
      });

    const items = viewers.length
      ? viewers
          .map((viewer) => {
            const usernameLabel = String(viewer?.username || '').trim();
            const count = Math.max(1, Number.parseInt(viewer?.count, 10) || 1);
            const when = formatStatusTime(viewer?.lastViewedAt);
            const viewsLabel = `${count} view${count === 1 ? '' : 's'}`;
            const liked = hasStatusLikeByViewer(status, usernameLabel);
            return `<li class="status-viewer-row"><span class="status-viewer-name-line"><strong>${escapeHtml(usernameLabel)}</strong>${
              liked ? '<span class="status-viewer-liked-heart" aria-label="Liked this status" title="Liked this status">♥</span>' : ''
            }</span><span class="status-viewer-meta"><span class="status-viewer-count">${escapeHtml(viewsLabel)}</span><span aria-hidden="true">•</span><span>${escapeHtml(when)}</span></span></li>`;
          })
          .join('')
      : '<li class="friends-empty">No viewers yet.</li>';

    viewersHtml = `
      <div class="status-viewers-inline">
        <strong>Status viewers</strong>
        <ul class="friends-results-list">${items}</ul>
      </div>
    `;
  }

  return `
    <article class="status-item${hasMedia ? ' has-media' : ''}">
      <div class="status-item-top">
        <small>${escapeHtml(formatStatusTime(status?.createdAt))}</small>
        <button type="button" class="status-like-button${hasStatusLike(status) ? ' liked' : ''}" data-status-like-button="true" data-status-id="${escapeHtml(
          String(status?.statusId || '')
        )}" aria-label="Like this status" aria-pressed="${hasStatusLike(status) ? 'true' : 'false'}" title="Like status">${
          hasStatusLike(status) ? '♥' : '♡'
        }</button>
      </div>
      ${bodyHtml}
      ${
        type === 'video' && resolvedMediaUrl
          ? `<video class="status-media" controls preload="metadata" src="${escapeHtml(resolvedMediaUrl)}"></video>`
          : type === 'image' && resolvedMediaUrl
            ? `<img class="status-media" data-status-image="${escapeHtml(resolvedMediaUrl)}" src="${escapeHtml(
                resolvedMediaUrl
              )}" alt="Status photo" loading="lazy" />`
            : ''
      }
      ${
        isSelf
          ? `<div class="status-item-actions">
          <button type="button" class="ghost-button status-action-icon" data-status-action="delete" data-status-id="${escapeHtml(
            String(status?.statusId || '')
          )}" aria-label="Delete status" title="Delete status">${getStatusIconSvg('delete')}</button>
          <button type="button" class="status-action-icon" data-status-action="forward" data-status-id="${escapeHtml(
            String(status?.statusId || '')
          )}" aria-label="Forward status" title="Forward status">${getStatusIconSvg('forward')}</button>
        </div>`
          : ''
      }
      ${viewersHtml}
    </article>
  `;
}

function renderActiveStatusViewerItem() {
  if (!statusViewerList) {
    return;
  }

  const statuses = Array.isArray(activeStatusViewerStatuses) ? activeStatusViewerStatuses : [];
  if (!statuses.length) {
    statusViewerList.innerHTML = '';
    if (statusViewerTime) {
      statusViewerTime.textContent = '';
    }
    if (statusViewerCounter) {
      statusViewerCounter.textContent = '0 / 0';
    }
    if (statusViewerPrevButton) {
      statusViewerPrevButton.disabled = true;
    }
    if (statusViewerNextButton) {
      statusViewerNextButton.disabled = true;
    }
    return;
  }

  activeStatusViewerIndex = Math.max(0, Math.min(activeStatusViewerIndex, statuses.length - 1));
  const currentStatus = statuses[activeStatusViewerIndex];
  statusViewerList.innerHTML = buildStatusViewerHtml(currentStatus, activeStatusViewerIsSelf);

  if (statusViewerTime) {
    statusViewerTime.textContent = '';
  }
  if (statusViewerCounter) {
    statusViewerCounter.textContent = `${activeStatusViewerIndex + 1} / ${statuses.length}`;
  }
  if (statusViewerPrevButton) {
    statusViewerPrevButton.disabled = activeStatusViewerIndex <= 0;
  }
  if (statusViewerNextButton) {
    statusViewerNextButton.disabled = activeStatusViewerIndex >= statuses.length - 1;
  }

  statusViewerList.querySelectorAll('[data-status-image]').forEach((imageElement) => {
    imageElement.addEventListener('click', () => {
      const imageUrl = String(imageElement.getAttribute('data-status-image') || '').trim();
      if (imageUrl) {
        openImageViewerModal(imageUrl);
      }
    });
  });

  if (activeStatusViewerIsSelf) {
    const deleteButton = statusViewerList.querySelector('[data-status-action="delete"]');
    const forwardButton = statusViewerList.querySelector('[data-status-action="forward"]');

    if (deleteButton) {
      deleteButton.addEventListener('click', async () => {
        await handleDeleteStatus(currentStatus);
      });
    }

    if (forwardButton) {
      forwardButton.addEventListener('click', async () => {
        await handleForwardStatus(currentStatus);
      });
    }
  }

  const statusLikeButton = statusViewerList.querySelector('[data-status-like-button="true"]');
  if (statusLikeButton) {
    statusLikeButton.addEventListener('click', async () => {
      const statusId = String(statusLikeButton.getAttribute('data-status-id') || '').trim();
      const ownerUsername = String(activeStatusViewerOwnerUsername || '').trim();
      if (!statusId || !ownerUsername) {
        return;
      }

      const currentLiked = statusLikeButton.getAttribute('aria-pressed') === 'true';
      const nextLiked = !currentLiked;
      statusLikeButton.disabled = true;
      let liked = currentLiked;

      try {
        await setStatusLikeOnServer({
          ownerUsername,
          statusId,
          liked: nextLiked
        });
        await loadStatusFeedFromServer();
        liked = nextLiked;
      } catch (error) {
        appendMessage(error.message || 'Unable to update status like right now.');
        liked = currentLiked;
      } finally {
        statusLikeButton.disabled = false;
      }
      statusLikeButton.classList.toggle('liked', liked);
      statusLikeButton.setAttribute('aria-pressed', liked ? 'true' : 'false');
      statusLikeButton.textContent = liked ? '♥' : '♡';
    });
  }
}

function shiftStatusViewer(direction) {
  const delta = Number(direction) || 0;
  if (!delta || !activeStatusViewerStatuses.length) {
    return;
  }

  const nextIndex = activeStatusViewerIndex + delta;
  if (nextIndex < 0 || nextIndex >= activeStatusViewerStatuses.length) {
    return;
  }

  activeStatusViewerIndex = nextIndex;
  renderActiveStatusViewerItem();
}

function handleStatusViewerNavigationKeydown(event) {
  if (!statusViewerModal || statusViewerModal.classList.contains('hidden')) {
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    shiftStatusViewer(-1);
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    shiftStatusViewer(1);
  }
}

function closeStatusViewer() {
  if (!statusViewerModal || !statusViewerList) {
    return;
  }

  statusViewerModal.classList.add('hidden');
  statusViewerList.querySelectorAll('video.status-media').forEach((videoElement) => {
    try {
      videoElement.pause();
    } catch (_error) {
      // Ignore video pause errors while closing.
    }
  });
  statusViewerList.innerHTML = '';
  activeStatusViewerStatuses = [];
  activeStatusViewerIndex = 0;
  activeStatusViewerIsSelf = false;
  activeStatusViewerOwnerUsername = '';
}

function renderStatusFeed() {
  if (!statusFeedList) {
    return;
  }

  statusFeedList.innerHTML = '';
  const myStatuses = normalizeStatusArray(state.myStatuses);

  if (myStatuses.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'friends-empty';
    emptyItem.textContent = 'No status posted yet. Post one now.';
    statusFeedList.appendChild(emptyItem);
    return;
  }

  myStatuses.forEach((status) => {
    const type = sanitizeStatusType(status.type);
    const resolvedMediaUrl = resolveMediaUrl(status.mediaUrl || '');
    const bodyText = String(status.text || '').trim();
    const bodyHtml = bodyText ? `<div class="status-body">${escapeHtml(bodyText)}</div>` : '';

    const listItem = document.createElement('li');
    listItem.className = 'status-item';
    listItem.innerHTML = `
      <div class="status-item-top">
        <small>${escapeHtml(formatStatusTime(status.createdAt))}</small>
        <button type="button" class="status-like-button${hasStatusLike(status) ? ' liked' : ''}" data-status-like-button="true" data-status-id="${escapeHtml(
          String(status.statusId || '')
        )}" aria-label="Like this status" aria-pressed="${hasStatusLike(status) ? 'true' : 'false'}" title="Like status">${
          hasStatusLike(status) ? '♥' : '♡'
        }</button>
      </div>
      ${bodyHtml}
      ${
        type === 'video' && resolvedMediaUrl
          ? `<video class="status-media" controls preload="metadata" src="${escapeHtml(resolvedMediaUrl)}"></video>`
          : type === 'image' && resolvedMediaUrl
            ? `<img class="status-media" src="${escapeHtml(resolvedMediaUrl)}" alt="Status photo" loading="lazy" />`
            : ''
      }
      <div class="status-item-actions">
        <button type="button" class="ghost-button" data-status-action="delete">Delete status</button>
        <button type="button" data-status-action="forward">Forward status</button>
      </div>
    `;

    const imageElement = listItem.querySelector('img.status-media');
    if (imageElement) {
      imageElement.addEventListener('click', () => {
        openImageViewerModal(status.mediaUrl || '');
      });
    }

    const deleteButton = listItem.querySelector('[data-status-action="delete"]');
    if (deleteButton) {
      deleteButton.addEventListener('click', async () => {
        await handleDeleteStatus(status);
      });
    }

    const forwardButton = listItem.querySelector('[data-status-action="forward"]');
    if (forwardButton) {
      forwardButton.addEventListener('click', async () => {
        await handleForwardStatus(status);
      });
    }

    const likeButton = listItem.querySelector('[data-status-like-button="true"]');
    if (likeButton) {
      likeButton.addEventListener('click', async () => {
        const statusId = String(likeButton.getAttribute('data-status-id') || '').trim();
        if (!statusId) {
          return;
        }

        const currentLiked = likeButton.getAttribute('aria-pressed') === 'true';
        const nextLiked = !currentLiked;
        likeButton.disabled = true;
        let liked = currentLiked;

        try {
          await setStatusLikeOnServer({
            ownerUsername: state.username,
            statusId,
            liked: nextLiked
          });
          await loadStatusFeedFromServer();
          liked = nextLiked;
        } catch (error) {
          appendMessage(error.message || 'Unable to update status like right now.');
          liked = currentLiked;
        } finally {
          likeButton.disabled = false;
        }
        likeButton.classList.toggle('liked', liked);
        likeButton.setAttribute('aria-pressed', liked ? 'true' : 'false');
        likeButton.textContent = liked ? '♥' : '♡';
      });
    }

    statusFeedList.appendChild(listItem);
  });
}

async function loadStatusFeedFromServer() {
  const result = await getJson('/api/status');
  const myStatusesFromServer = Array.isArray(result?.myStatuses)
    ? result.myStatuses
    : result?.myStatus
      ? [result.myStatus]
      : [];

  state.myStatuses = normalizeStatusArray(myStatusesFromServer);
  state.friendStatuses = Array.isArray(result?.friendStatuses) ? result.friendStatuses : [];
  updateOwnStatusRing();
  renderStatusFeed();
  renderUsers();
}

function setStatusComposerBusy(isBusy) {
  if (statusPostTextButton) {
    statusPostTextButton.disabled = isBusy;
  }

  if (statusPostMediaButton) {
    statusPostMediaButton.disabled = isBusy;
  }

  if (statusTextInput) {
    statusTextInput.disabled = isBusy;
  }

  if (statusMediaInput) {
    statusMediaInput.disabled = isBusy;
  }
}

function openStatusModal() {
  if (!state.username) {
    return;
  }

  showStatusMessage('');
  if (statusMediaHint) {
    statusMediaHint.textContent = STATUS_MEDIA_HINT_DEFAULT;
  }
  renderStatusFeed();
  statusModal.classList.remove('hidden');

  loadStatusFeedFromServer().catch((error) => {
    showStatusMessage(error.message || 'Unable to load statuses right now.', true);
  });
}

function closeStatusModal() {
  statusModal.classList.add('hidden');
  showStatusMessage('');
}

function getStatusMediaType(file) {
  const mimeType = String(file?.type || '').trim().toLowerCase();
  if (mimeType.startsWith('image/')) {
    return 'image';
  }

  if (mimeType.startsWith('video/')) {
    return 'video';
  }

  return '';
}

function readStatusMediaDimensions(file, mediaType) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);

    if (mediaType === 'image') {
      const image = new Image();
      image.onload = () => {
        const width = Number(image.naturalWidth || image.width || 0);
        const height = Number(image.naturalHeight || image.height || 0);
        URL.revokeObjectURL(objectUrl);
        resolve({ width, height, durationMs: 0 });
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Unable to read selected image. Try another file.'));
      };

      image.src = objectUrl;
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const width = Number(video.videoWidth || 0);
      const height = Number(video.videoHeight || 0);
      const durationMs = Math.max(0, Math.round((Number(video.duration) || 0) * 1000));
      URL.revokeObjectURL(objectUrl);
      resolve({ width, height, durationMs });
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read selected video. Try another file.'));
    };

    video.src = objectUrl;
  });
}

async function uploadStatusMediaFile(file) {
  const uploadFile = buildUploadMediaFile(file);
  const formData = new FormData();
  formData.append('media', uploadFile, uploadFile.name);

  const response = await fetch(`${apiBaseUrl}/api/media-upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  return parseResponseAsJson(response);
}

async function postTextStatus() {
  const text = String(statusTextInput?.value || '').trim();
  if (!text) {
    showStatusMessage('Write something before posting text status.', true);
    return;
  }

  if (text.length > STATUS_TEXT_MAX_LENGTH) {
    showStatusMessage(`Text must be under ${STATUS_TEXT_MAX_LENGTH} characters.`, true);
    return;
  }

  setStatusComposerBusy(true);
  showStatusMessage('Posting text status...');

  try {
    await postJson('/api/status', {
      type: 'text',
      text
    });

    statusTextInput.value = '';
    await loadStatusFeedFromServer();
    closeStatusModal();
  } catch (error) {
    showStatusMessage(error.message || 'Unable to post text status.', true);
  } finally {
    setStatusComposerBusy(false);
  }
}

async function postMediaStatus() {
  const [file] = statusMediaInput?.files || [];
  if (!file) {
    showStatusMessage('Choose a photo or video first.', true);
    return;
  }

  const mediaType = getStatusMediaType(file);
  if (!mediaType) {
    showStatusMessage('Only photo or video files are allowed for status.', true);
    return;
  }

  setStatusComposerBusy(true);
  showStatusMessage('Checking media quality...');

  try {
    const { width, height, durationMs } = await readStatusMediaDimensions(file, mediaType);
    if (mediaType === 'image' && (width < STATUS_MIN_HD_WIDTH || height < STATUS_MIN_HD_HEIGHT)) {
      showStatusMessage(`Only HD media is allowed. Minimum ${STATUS_MIN_HD_WIDTH}x${STATUS_MIN_HD_HEIGHT}.`, true);
      return;
    }

    showStatusMessage('Uploading media...');
    const uploadResult = await uploadStatusMediaFile(file);
    const mediaUrl = String(uploadResult?.mediaUrl || '').trim();
    const uploadedMediaType = String(uploadResult?.mediaType || mediaType).trim().toLowerCase();

    if (!mediaUrl || (uploadedMediaType !== 'image' && uploadedMediaType !== 'video')) {
      throw new Error('Upload completed but media details are invalid.');
    }

    await postJson('/api/status', {
      type: uploadedMediaType,
      text: String(statusTextInput?.value || '').trim(),
      mediaUrl,
      mediaType: uploadedMediaType,
      mediaMimeType: String(uploadResult?.mediaMimeType || file.type || '').slice(0, 80),
      width,
      height,
      durationMs: uploadedMediaType === 'video' ? durationMs : 0
    });

    statusMediaInput.value = '';
    statusTextInput.value = '';
    if (statusMediaHint) {
      statusMediaHint.textContent = STATUS_MEDIA_HINT_DEFAULT;
    }
    await loadStatusFeedFromServer();
    closeStatusModal();
  } catch (error) {
    showStatusMessage(error.message || 'Unable to post media status.', true);
  } finally {
    setStatusComposerBusy(false);
  }
}

function updateFriendsRequestBadge() {
  if (!friendsRequestBadge) {
    return;
  }

  const count = Array.isArray(state.incomingRequests) ? state.incomingRequests.length : 0;
  if (count <= 0) {
    friendsRequestBadge.classList.add('hidden');
    friendsRequestBadge.textContent = '0';
    return;
  }

  friendsRequestBadge.classList.remove('hidden');
  friendsRequestBadge.textContent = count > 99 ? '99+' : String(count);
}

function showLoginTab() {
  resetRegisterOtpFlow();
  resetForgotPasswordFlow();
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  forgotPasswordForm.classList.add('hidden');
  showLoginButton.classList.add('active');
  showRegisterButton.classList.remove('active');
}

function showRegisterTab() {
  resetForgotPasswordFlow();
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  forgotPasswordForm.classList.add('hidden');
  showRegisterButton.classList.add('active');
  showLoginButton.classList.remove('active');
}

async function parseResponseAsJson(response) {
  const responseText = await response.text();
  let payload = {};

  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch (_error) {
    const trimmed = responseText.trim();
    const looksLikeHtml = trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html');

    payload = {
      error:
        response.ok
          ? 'Unexpected server response.'
          : looksLikeHtml
            ? 'Server returned HTML instead of JSON. Open the app using your backend URL and try again.'
            : `Server returned an invalid response (status ${response.status}).`
    };
  }

  if (!response.ok) {
    throw new Error(payload.error || 'Something went wrong.');
  }

  return payload;
}

async function postJson(url, body) {
  const response = await fetch(`${apiBaseUrl}${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return parseResponseAsJson(response);
}

async function getJson(url) {
  const response = await fetch(`${apiBaseUrl}${url}`, {
    credentials: 'include'
  });
  return parseResponseAsJson(response);
}

async function deleteJson(url) {
  const response = await fetch(`${apiBaseUrl}${url}`, {
    method: 'DELETE'
    ,credentials: 'include'
  });
  return parseResponseAsJson(response);
}

async function enterChat(username) {
  state.username = username;
  state.contacts = {};
  state.conversations = {};
  state.loadedConversations = {};
  state.sidebarFriendsQuery = '';
  if (sidebarFriendsSearchInput) {
    sidebarFriendsSearchInput.value = '';
  }
  loadHiddenSidebarFriends();
  loadPinnedChats();
  loadContactCustomizations();
  currentUsername.textContent = username;
  roomTitle.textContent = 'My Chats';
  statusText.textContent = '';
  applyProfile();
  authCard.classList.add('hidden');
  chatSection.classList.remove('hidden');
  syncBodyScrollMode();

  try {
    await loadFriendsFromServer();
  } catch (error) {
    appendMessage(error.message || 'Unable to load friends right now.');
  }

  renderFriendRequests();
  renderFriendsResults();
  setHeaderForSelectedChat();
  renderConversation();
  renderUsers();

  try {
    await loadStatusFeedFromServer();
  } catch (_error) {
    // Keep chat usable even if status feed fails to load.
  }

  try {
    await ensureSocketConnected();
    socket.emit('register-user', { username });
  } catch (error) {
    showAuthMessage(error.message || 'Unable to connect to server.', true);
  }
}

function ensureSocketConnected(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    if (socket.connected) {
      resolve();
      return;
    }

    const onConnect = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error('Unable to connect to server.'));
    };

    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error('Unable to connect to server.'));
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
    }

    socket.on('connect', onConnect);
    socket.on('connect_error', onError);
    socket.connect();
  });
}

function updateProfileOnServer(about, avatarUrl, profileVisibility, onlineVisibility) {
  return postJson('/api/profile', {
    about,
    avatarUrl,
    profileVisibility: normalizeProfileVisibility(profileVisibility),
    onlineVisibility: normalizeOnlineVisibility(onlineVisibility)
  });
}

function changePasswordOnServer(oldPassword, newPassword) {
  return postJson('/api/change-password', {
    oldPassword,
    newPassword
  });
}

function requestPasswordResetOtpOnServer(email) {
  return postJson('/api/password-reset/request-otp', {
    email
  });
}

function verifyPasswordResetOtpOnServer(email, otp) {
  return postJson('/api/password-reset/verify-otp', {
    email,
    otp
  });
}

function resetPasswordWithOtpOnServer(email, newPassword) {
  return postJson('/api/password-reset/reset', {
    email,
    newPassword
  });
}

function trackProfilePhotoOpen(ownerUsername) {
  return postJson('/api/profile/photo-view-open', {
    ownerUsername
  });
}

function getProfilePhotoViews() {
  return getJson('/api/profile/photo-views');
}

function applyLoggedOutUi(message) {
  if (voiceMediaRecorder && voiceMediaRecorder.state === 'recording') {
    stopVoiceRecording(true);
  } else {
    stopVoiceRecordingStream();
    resetVoiceRecordButtonState();
  }

  socket.disconnect();
  state.username = '';
  state.selectedUsername = '';
  state.contacts = {};
  state.incomingRequests = [];
  state.outgoingRequests = [];
  state.blockedUsers = [];
  state.hiddenSidebarFriends = [];
  state.pinnedChats = [];
  state.contactCustomizations = {};
  state.typingByUsername = {};
  state.replyDraft = null;
  state.myStatuses = [];
  state.friendStatuses = [];
  state.searchResults = [];
  state.conversations = {};
  state.loadedConversations = {};
  pendingMediaFile = null;
  stopOutgoingTyping();
  closeCameraCaptureModal();
  closeMediaPreviewModal(true);
  closeImageViewerModal();
  hideMediaUploadProgress();
  if (mediaFileInput) {
    mediaFileInput.value = '';
  }
  updateFriendsRequestBadge();
  usersList.innerHTML = '';
  incomingRequestsList.innerHTML = '';
  outgoingRequestsList.innerHTML = '';
  friendsResultsList.innerHTML = '';
  messagesContainer.innerHTML = '';
  chatSection.classList.remove('chat-only-mode');
  chatSection.classList.add('hidden');
  authCard.classList.remove('hidden');
  syncBodyScrollMode();
  clearChatButton.classList.remove('hidden');
  chatMenuButton.classList.add('hidden');
  cameraCaptureButton.classList.add('hidden');
  closeChatMenu();
  closeContactProfileModal();
  closeChangePasswordModal();
  closeFriendsModal();
  closeStatusModal();
  closeStatusViewer();
  backToListButton.classList.add('hidden');
  closeSettingsModal();
  renderReplyComposer();
  showLoginTab();
  showAuthMessage(message || 'Logged out successfully.');
}

function mapServerMessageToConversationEntry(message) {
  const isOutgoing = message.fromUsername === state.username;

  return {
    id: message.messageId,
    type: 'chat',
    direction: isOutgoing ? 'outgoing' : 'incoming',
    message: message.message,
    mediaUrl: String(message.mediaUrl || ''),
    mediaType: String(message.mediaType || ''),
    mediaMimeType: String(message.mediaMimeType || ''),
    audioUrl: String(message.audioUrl || ''),
    audioMimeType: String(message.audioMimeType || ''),
    audioDurationMs: Number(message.audioDurationMs || 0),
    mood: sanitizeMood(message.mood),
    replyTo: message.replyTo || null,
    reactions: normalizeMessageReactions(message.reactions),
    sentAt: message.sentAt,
    createdAt: resolveMessageCreatedAt(message.createdAt, message.messageId),
    seen: isOutgoing ? Boolean(message.seen) : false,
    ackSent: isOutgoing ? true : Boolean(message.seen)
  };
}

async function loadConversationFromServer(username) {
  const result = await getJson(`/api/messages/${encodeURIComponent(username)}`);
  const messages = Array.isArray(result.messages) ? result.messages : [];
  state.conversations[username] = messages.map(mapServerMessageToConversationEntry);
  state.loadedConversations[username] = true;
}

function deleteConversationOnServer(username) {
  return deleteJson(`/api/messages/${encodeURIComponent(username)}`);
}

function deleteConversationByDateOnServer(username, date) {
  return deleteJson(`/api/messages/${encodeURIComponent(username)}?date=${encodeURIComponent(date)}`);
}

async function loadFriendsFromServer() {
  const result = await getJson('/api/friends');
  const friends = Array.isArray(result.friends) ? result.friends : [];
  const nextContacts = {};

  friends.forEach((friend) => {
    if (!friend.username || friend.username === state.username) {
      return;
    }

    const existing = state.contacts[friend.username] || {};
    nextContacts[friend.username] = {
      username: friend.username,
      online: typeof friend.online === 'boolean' ? friend.online : Boolean(friend.socketId),
      socketId: friend.socketId || '',
      about: friend.about || existing.about || 'Available to chat',
      avatarUrl: friend.avatarUrl || existing.avatarUrl || '',
      updatedAt: existing.updatedAt || Date.now()
    };
  });

  state.contacts = nextContacts;
  state.incomingRequests = Array.isArray(result.incomingRequests) ? result.incomingRequests : [];
  state.outgoingRequests = Array.isArray(result.outgoingRequests) ? result.outgoingRequests : [];
  state.blockedUsers = Array.isArray(result.blockedUsers) ? result.blockedUsers : [];
  pruneHiddenSidebarFriends();
  prunePinnedChats();
  pruneContactCustomizations();
  updateFriendsRequestBadge();

  if (state.selectedUsername && !state.contacts[state.selectedUsername]) {
    state.selectedUsername = '';
  }
}

async function searchFriends(query) {
  const result = await getJson(`/api/friends/search?q=${encodeURIComponent(query)}`);
  const normalizedQuery = String(query || '').trim().toLowerCase();
  const results = Array.isArray(result.results) ? result.results : [];
  state.searchResults = results.filter((user) => isNameMatchAtLeastThreshold(user?.username, normalizedQuery));
}

function relationLabel(relation) {
  if (relation === 'friend') {
    return 'Already friend';
  }

  if (relation === 'blocked') {
    return 'Blocked';
  }

  if (relation === 'outgoing') {
    return 'Request sent';
  }

  if (relation === 'incoming') {
    return 'Requested you';
  }

  return 'Send request';
}

function renderFriendsResults() {
  friendsResultsList.innerHTML = '';

  if (state.searchResults.length === 0) {
    const item = document.createElement('li');
    item.className = 'friends-empty';
    item.textContent = 'Start typing to find registered users.';
    friendsResultsList.appendChild(item);
    return;
  }

  state.searchResults.forEach((user) => {
    const item = document.createElement('li');
    const encoded = encodeURIComponent(user.username);
    const disabled = user.relation !== 'none';
    const canSeeProfile = user.isProfileVisible !== false;
    const profileStatusText = canSeeProfile
      ? `${user.online ? 'Online' : 'Offline'} • ${user.about || 'Available to chat'}`
      : 'Private profile';

    item.innerHTML = `
      <div class="friend-row-top">
        <div class="friend-row-name">
          <span class="user-avatar" data-avatar="${escapeHtml(user.username)}"></span>
          <div>
            <strong>${escapeHtml(user.username)}</strong>
            <div class="friend-row-status"><span class="friend-row-status-dot ${canSeeProfile && user.online ? 'online' : ''}"></span>${escapeHtml(profileStatusText)}</div>
          </div>
        </div>
      </div>
      <div class="friend-row-actions">
        <button type="button" data-send-request="${encoded}" ${disabled ? 'disabled' : ''}>${relationLabel(user.relation)}</button>
      </div>
    `;

    const avatar = item.querySelector('[data-avatar]');
    if (avatar) {
      setAvatar(avatar, user.username, canSeeProfile ? user.avatarUrl || '' : '');
    }

    friendsResultsList.appendChild(item);
  });
}

function renderFriendRequests() {
  incomingRequestsList.innerHTML = '';
  outgoingRequestsList.innerHTML = '';

  if (!state.incomingRequests.length) {
    const item = document.createElement('li');
    item.className = 'friends-empty';
    item.textContent = 'No incoming requests';
    incomingRequestsList.appendChild(item);
  } else {
    state.incomingRequests.forEach((username) => {
      const encoded = encodeURIComponent(username);
      const item = document.createElement('li');
      item.innerHTML = `
        <div class="friend-row-top">
          <div class="friend-row-name"><strong>${escapeHtml(username)}</strong></div>
        </div>
        <div class="friend-row-actions">
          <button type="button" data-respond-action="accept" data-respond-username="${encoded}">Accept</button>
          <button type="button" class="ghost-button" data-respond-action="reject" data-respond-username="${encoded}">Reject</button>
        </div>
      `;
      incomingRequestsList.appendChild(item);
    });
  }

  if (!state.outgoingRequests.length) {
    const item = document.createElement('li');
    item.className = 'friends-empty';
    item.textContent = 'No sent requests';
    outgoingRequestsList.appendChild(item);
  } else {
    state.outgoingRequests.forEach((username) => {
      const encoded = encodeURIComponent(username);
      const item = document.createElement('li');
      item.innerHTML = `
        <div class="friend-row-top">
          <div class="friend-row-name"><strong>Pending: ${escapeHtml(username)}</strong></div>
        </div>
        <div class="friend-row-actions">
          <button type="button" class="ghost-button" data-cancel-request="${encoded}">Cancel request</button>
        </div>
      `;
      outgoingRequestsList.appendChild(item);
    });
  }
}

async function runFriendsSearch(rawQuery, options = {}) {
  const { showCompleteMessage = false } = options;
  const query = String(rawQuery || '').trim();

  if (!query) {
    friendsSearchRequestToken += 1;
    state.searchResults = [];
    renderFriendsResults();
    showFriendsMessage('');
    friendsSearchSubmit.disabled = false;
    return;
  }

  const currentToken = ++friendsSearchRequestToken;
  friendsSearchSubmit.disabled = true;

  try {
    await searchFriends(query);
    if (currentToken !== friendsSearchRequestToken) {
      return;
    }

    renderFriendsResults();

    if (!state.searchResults.length) {
      showFriendsMessage('No registered user matches this name.', true);
      return;
    }

    if (showCompleteMessage) {
      showFriendsMessage('Showing matching registered users.');
    } else {
      showFriendsMessage('');
    }
  } catch (error) {
    if (currentToken !== friendsSearchRequestToken) {
      return;
    }

    showFriendsMessage(error.message || 'Unable to search users.', true);
  } finally {
    if (currentToken === friendsSearchRequestToken) {
      friendsSearchSubmit.disabled = false;
    }
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read selected file. Try another file.'));

    reader.readAsDataURL(file);
  });
}

function clampCropOffsets() {
  if (!avatarCropState.image) {
    return;
  }

  const canvasSize = avatarCropCanvas.width;
  const imageWidth = avatarCropState.image.naturalWidth || avatarCropState.image.width;
  const imageHeight = avatarCropState.image.naturalHeight || avatarCropState.image.height;
  const scaledWidth = imageWidth * avatarCropState.scale;
  const scaledHeight = imageHeight * avatarCropState.scale;
  const maxOffsetX = Math.max(0, (scaledWidth - canvasSize) / 2);
  const maxOffsetY = Math.max(0, (scaledHeight - canvasSize) / 2);

  avatarCropState.offsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, avatarCropState.offsetX));
  avatarCropState.offsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, avatarCropState.offsetY));
}

function drawAvatarCropCanvas() {
  if (!avatarCropCanvas || !avatarCropState.image) {
    return;
  }

  const context = avatarCropCanvas.getContext('2d');
  if (!context) {
    return;
  }

  clampCropOffsets();

  const canvasSize = avatarCropCanvas.width;
  const imageWidth = avatarCropState.image.naturalWidth || avatarCropState.image.width;
  const imageHeight = avatarCropState.image.naturalHeight || avatarCropState.image.height;
  const drawWidth = imageWidth * avatarCropState.scale;
  const drawHeight = imageHeight * avatarCropState.scale;
  const drawX = (canvasSize - drawWidth) / 2 + avatarCropState.offsetX;
  const drawY = (canvasSize - drawHeight) / 2 + avatarCropState.offsetY;

  context.clearRect(0, 0, canvasSize, canvasSize);
  context.drawImage(avatarCropState.image, drawX, drawY, drawWidth, drawHeight);
}

function closeAvatarCropModal() {
  avatarCropState.image = null;
  avatarCropState.dragging = false;
  avatarCropCanvas.classList.remove('dragging');
  avatarCropModal.classList.add('hidden');
}

async function openAvatarCropModal(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = new Image();

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error('Unable to open selected image. Try another file.'));
    image.src = dataUrl;
  });

  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  if (!imageWidth || !imageHeight) {
    throw new Error('Selected image is not valid. Please choose another image.');
  }
  
  const canvasSize = avatarCropCanvas.width;
  const minScale = Math.max(canvasSize / imageWidth, canvasSize / imageHeight);
  
  avatarCropState.image = image;
  avatarCropState.minScale = minScale;
  avatarCropState.scale = minScale;
  avatarCropState.offsetX = 0;
  avatarCropState.offsetY = 0;
  avatarCropState.dragging = false;

  avatarCropZoom.value = '1';
  drawAvatarCropCanvas();
  avatarCropModal.classList.remove('hidden');
}

function exportCroppedAvatarDataUrl() {
  if (!avatarCropState.image) {
    return '';
  }
  
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = 512;
  outputCanvas.height = 512;
  const outputContext = outputCanvas.getContext('2d');
  if (!outputContext) {
    return '';
  }

  const previewSize = avatarCropCanvas.width;
  const imageWidth = avatarCropState.image.naturalWidth || avatarCropState.image.width;
  const imageHeight = avatarCropState.image.naturalHeight || avatarCropState.image.height;
  const scaleRatio = outputCanvas.width / previewSize;
  const drawWidth = imageWidth * avatarCropState.scale * scaleRatio;
  const drawHeight = imageHeight * avatarCropState.scale * scaleRatio;
  const drawX = ((previewSize - imageWidth * avatarCropState.scale) / 2 + avatarCropState.offsetX) * scaleRatio;
  const drawY = ((previewSize - imageHeight * avatarCropState.scale) / 2 + avatarCropState.offsetY) * scaleRatio;

  outputContext.drawImage(avatarCropState.image, drawX, drawY, drawWidth, drawHeight);
  return outputCanvas.toDataURL('image/jpeg', 0.92);
}

function appendMessage(text, type = 'system') {
  const item = document.createElement('div');
  item.className = `message ${type}`;
  item.textContent = text;
  messagesContainer.appendChild(item);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function isNameMatchAtLeastThreshold(name, query, threshold = 0.7) {
  const normalizedName = String(name || '').trim().toLowerCase();
  const normalizedQuery = String(query || '').trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  if (!normalizedName.includes(normalizedQuery)) {
    return false;
  }

  return normalizedQuery.length / Math.max(normalizedName.length, 1) >= threshold;
}

function renderUsers() {
  usersList.innerHTML = '';
  const normalizedQuery = String(state.sidebarFriendsQuery || '').trim().toLowerCase();
  const contacts = getSortedContacts().filter((username) => {
    const queryMatch = isNameMatchAtLeastThreshold(username, normalizedQuery);
    if (!queryMatch) {
      return false;
    }

    if (normalizedQuery) {
      return true;
    }

    return !isFriendHiddenFromSidebar(username);
  });

  if (contacts.length === 0) {
    const item = document.createElement('li');
    if (normalizedQuery) {
      item.textContent = 'No matching friends';
    } else {
      item.textContent = 'No friends yet';
    }
    usersList.appendChild(item);
    return;
  }

  contacts.forEach((username) => {
    const contact = state.contacts[username];
    const unreadCount = getUnreadMessageCount(username);
    const unreadText = unreadCount > 99 ? '99+' : String(unreadCount);
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `user-select ${state.selectedUsername === username ? 'active' : ''}`;
    button.innerHTML = `
      <span class="user-row-main">
        <span class="user-avatar" data-avatar-for="${escapeHtml(username)}"></span>
        <span class="user-text-wrap">
          <span class="user-name-row">
            <span class="user-name">${escapeHtml(getDisplayName(username))}</span>
            ${unreadCount > 0 ? `<span class="user-unread-badge">${unreadText}</span>` : ''}
          </span>
          <span class="user-preview">${escapeHtml(getLastPreview(username))}</span>
        </span>
      </span>
      <span class="user-row-actions">
        <span class="user-pin-btn ${isPinnedChat(username) ? 'active' : ''}" data-pin-chat="${escapeHtml(
          username
        )}" role="button" tabindex="0" aria-label="Pin chat" title="Pin chat">📌</span>
      </span>
    `;

    const avatarElement = button.querySelector('[data-avatar-for]');
    if (avatarElement) {
      setAvatar(avatarElement, username, contact.avatarUrl || '');

      const friendHasStatus = hasActiveStatus(username);
      const friendHasUnviewedStatus = hasUnviewedStatus(username);
      avatarElement.classList.toggle('status-ring-unviewed', friendHasStatus && friendHasUnviewedStatus);
      avatarElement.classList.toggle('status-ring-viewed', friendHasStatus && !friendHasUnviewedStatus);
      avatarElement.classList.remove('status-ring');
      avatarElement.classList.toggle('status-ring-clickable', friendHasStatus);

      if (friendHasStatus) {
        avatarElement.addEventListener('click', (event) => {
          event.stopPropagation();
          openStatusViewerForUser(username);
        });
      }
    }

    button.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      armSidebarLongPress(button, username);
    });

    button.addEventListener('pointerup', () => {
      clearSidebarLongPress(username);
    });

    button.addEventListener('pointercancel', () => {
      clearSidebarLongPress(username);
    });

    button.addEventListener('pointerleave', () => {
      clearSidebarLongPress(username);
    });

    button.addEventListener('click', () => {
      if (button.dataset.skipNextClick === '1') {
        button.dataset.skipNextClick = '';
        return;
      }

      const wasHidden = isFriendHiddenFromSidebar(username);
      if (normalizedQuery && wasHidden) {
        showFriendInSidebar(username);
        state.sidebarFriendsQuery = '';
        sidebarFriendsSearchInput.value = '';
      }

      selectChat(username);
    });

    const pinButton = button.querySelector('[data-pin-chat]');
    if (pinButton) {
      pinButton.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
      });

      pinButton.addEventListener('pointerup', (event) => {
        event.stopPropagation();
      });

      const togglePinnedState = (event) => {
        event.stopPropagation();

        const targetName = String(pinButton.getAttribute('data-pin-chat') || '');
        if (!targetName) {
          return;
        }

        if (isPinnedChat(targetName)) {
          state.pinnedChats = state.pinnedChats.filter((name) => name.toLowerCase() !== targetName.toLowerCase());
          savePinnedChats();
          renderUsers();
          return;
        }

        if (state.pinnedChats.length >= 3) {
          showFriendsMessage('You can pin only 3 chats.', true);
          return;
        }

        state.pinnedChats.push(targetName);
        savePinnedChats();
        renderUsers();
      };

      pinButton.addEventListener('click', togglePinnedState);
      pinButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          togglePinnedState(event);
        }
      });
    }

    button.addEventListener('contextmenu', async (event) => {
      event.preventDefault();

      const isHidden = isFriendHiddenFromSidebar(username);
      const actionText = isHidden ? 'Unhide' : 'Hide';

      const confirmed = await showConfirmModal({
        title: `${actionText} from sidebar`,
        message: isHidden
          ? `Show ${username} again in your top sidebar list?`
          : `Hide ${username} from sidebar? You can search and open chat again anytime.`,
        okText: actionText,
        cancelText: 'Cancel'
      });

      if (!confirmed) {
        return;
      }

      if (isHidden) {
        showFriendInSidebar(username);
        state.sidebarFriendsQuery = '';
        sidebarFriendsSearchInput.value = '';
      } else {
        hideFriendFromSidebar(username);
      }

      renderUsers();
      showFriendsMessage(isHidden ? 'Friend is visible in sidebar now.' : 'Friend hidden from sidebar. Use search to find them.');
    });

    item.appendChild(button);
    usersList.appendChild(item);
  });
}

showLoginButton.addEventListener('click', showLoginTab);
showRegisterButton.addEventListener('click', showRegisterTab);

if (forgotPasswordLinkButton) {
  forgotPasswordLinkButton.addEventListener('click', () => {
    openForgotPasswordPanel();
  });
}

if (forgotBackToLoginButton) {
  forgotBackToLoginButton.addEventListener('click', () => {
    resetForgotPasswordFlow({ clearForm: true });
    showLoginTab();
    showAuthMessage('Back to login.');
  });
}

if (forgotSendOtpButton) {
  forgotSendOtpButton.addEventListener('click', async () => {
    const email = String(forgotEmailInput?.value || '').trim();

    if (!email) {
      showAuthMessage('Please enter your email.', true);
      return;
    }

    forgotSendOtpButton.disabled = true;
    forgotSendOtpButton.textContent = 'Sending OTP...';

    try {
      const result = await requestPasswordResetOtpOnServer(email);
      state.forgotPasswordOtpPending = true;
      state.forgotPasswordOtpVerified = false;
      forgotOtpSection.classList.remove('hidden');
      forgotOtpInput.required = true;
      forgotResetSection.classList.add('hidden');
      forgotNewPasswordInput.required = false;
      setForgotPasswordEmailReadOnly(true);
      showAuthMessage(result.message || 'OTP sent. Enter and verify the OTP.');
      forgotOtpInput.focus();
    } catch (error) {
      showAuthMessage(error.message || 'Unable to send OTP.', true);
    } finally {
      forgotSendOtpButton.disabled = false;
      forgotSendOtpButton.textContent = 'Send OTP';
    }
  });
}

if (forgotVerifyOtpButton) {
  forgotVerifyOtpButton.addEventListener('click', async () => {
    if (!state.forgotPasswordOtpPending) {
      showAuthMessage('Send OTP first.', true);
      return;
    }

    const email = String(forgotEmailInput?.value || '').trim();
    const otp = String(forgotOtpInput?.value || '').trim();

    if (!/^\d{6}$/.test(otp)) {
      showAuthMessage('Please enter a valid 6-digit OTP.', true);
      return;
    }

    forgotVerifyOtpButton.disabled = true;
    forgotResendOtpButton.disabled = true;

    try {
      const result = await verifyPasswordResetOtpOnServer(email, otp);
      state.forgotPasswordOtpVerified = true;
      forgotResetSection.classList.remove('hidden');
      forgotNewPasswordInput.required = true;
      showAuthMessage(result.message || 'OTP verified. Set a new password.');
      forgotNewPasswordInput.focus();
    } catch (error) {
      showAuthMessage(error.message || 'OTP verification failed.', true);
    } finally {
      forgotVerifyOtpButton.disabled = false;
      forgotResendOtpButton.disabled = false;
    }
  });
}

if (forgotResendOtpButton) {
  forgotResendOtpButton.addEventListener('click', async () => {
    if (!state.forgotPasswordOtpPending) {
      showAuthMessage('Send OTP first.', true);
      return;
    }

    const email = String(forgotEmailInput?.value || '').trim();
    forgotVerifyOtpButton.disabled = true;
    forgotResendOtpButton.disabled = true;

    try {
      const result = await requestPasswordResetOtpOnServer(email);
      state.forgotPasswordOtpVerified = false;
      forgotResetSection.classList.add('hidden');
      forgotNewPasswordInput.required = false;
      forgotNewPasswordInput.value = '';
      forgotOtpInput.value = '';
      showAuthMessage(result.message || 'A new OTP has been sent.');
      forgotOtpInput.focus();
    } catch (error) {
      showAuthMessage(error.message || 'Unable to resend OTP.', true);
    } finally {
      forgotVerifyOtpButton.disabled = false;
      forgotResendOtpButton.disabled = false;
    }
  });
}

if (forgotResetPasswordButton) {
  forgotResetPasswordButton.addEventListener('click', async () => {
    if (!state.forgotPasswordOtpVerified) {
      showAuthMessage('Verify OTP before resetting password.', true);
      return;
    }

    const email = String(forgotEmailInput?.value || '').trim();
    const newPassword = String(forgotNewPasswordInput?.value || '');

    if (!newPassword || newPassword.trim().length < 4) {
      showAuthMessage('New password must be at least 4 characters.', true);
      return;
    }

    forgotResetPasswordButton.disabled = true;
    forgotResetPasswordButton.textContent = 'Resetting...';

    try {
      const result = await resetPasswordWithOtpOnServer(email, newPassword);
      const emailValue = String(forgotEmailInput?.value || '').trim();
      resetForgotPasswordFlow({ clearForm: true });
      showLoginTab();
      loginEmailInput.value = emailValue;
      loginPasswordInput.value = '';
      showAuthMessage(result.message || 'Password reset successful. Please log in.');
      loginPasswordInput.focus();
    } catch (error) {
      showAuthMessage(error.message || 'Unable to reset password.', true);
    } finally {
      forgotResetPasswordButton.disabled = false;
      forgotResetPasswordButton.textContent = 'Reset Password';
    }
  });
}

themeToggleButton.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('chat-theme', state.theme);
  applyTheme();
});

settingsButton.addEventListener('click', openSettingsModal);
closeSettingsButton.addEventListener('click', closeSettingsModal);
openChangePasswordButton.addEventListener('click', () => {
  closeSettingsModal();
  openChangePasswordModal();
});
closeChangePasswordButton.addEventListener('click', closeChangePasswordModal);
friendsButton.addEventListener('click', openFriendsModal);
closeFriendsButton.addEventListener('click', closeFriendsModal);
statusButton.addEventListener('click', openStatusModal);
closeStatusButton.addEventListener('click', closeStatusModal);

if (statusPostTextButton) {
  statusPostTextButton.addEventListener('click', async () => {
    await postTextStatus();
  });
}

if (statusPostMediaButton) {
  statusPostMediaButton.addEventListener('click', async () => {
    await postMediaStatus();
  });
}

if (statusMediaInput) {
  statusMediaInput.addEventListener('change', () => {
    const [file] = statusMediaInput.files || [];
    if (!statusMediaHint) {
      return;
    }

    if (!file) {
      statusMediaHint.textContent = STATUS_MEDIA_HINT_DEFAULT;
      return;
    }

    statusMediaHint.textContent = `Selected: ${file.name}`;
  });
}

if (closeStatusViewerButton) {
  closeStatusViewerButton.addEventListener('click', closeStatusViewer);
}

if (statusViewerPrevButton) {
  statusViewerPrevButton.addEventListener('click', () => {
    shiftStatusViewer(-1);
  });
}

if (statusViewerNextButton) {
  statusViewerNextButton.addEventListener('click', () => {
    shiftStatusViewer(1);
  });
}

document.addEventListener('keydown', handleStatusViewerNavigationKeydown);

if (statusViewerModal) {
  statusViewerModal.addEventListener('click', (event) => {
    if (event.target === statusViewerModal) {
      closeStatusViewer();
    }
  });
}

if (replyComposerCancelButton) {
  replyComposerCancelButton.addEventListener('click', () => {
    clearReplyDraft();
    messageInput.focus();
  });
}

sidebarFriendsSearchInput.addEventListener('input', () => {
  state.sidebarFriendsQuery = sidebarFriendsSearchInput.value;
  renderUsers();
});

changePasswordModal.addEventListener('click', (event) => {
  if (event.target === changePasswordModal) {
    closeChangePasswordModal();
  }
});

friendsModal.addEventListener('click', (event) => {
  if (event.target === friendsModal) {
    closeFriendsModal();
  }
});

statusModal.addEventListener('click', (event) => {
  if (event.target === statusModal) {
    closeStatusModal();
  }
});

friendsSearchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await runFriendsSearch(friendsSearchInput.value, { showCompleteMessage: true });
});

friendsSearchInput.addEventListener('input', () => {
  const query = friendsSearchInput.value;

  if (friendsSearchDebounceTimer) {
    clearTimeout(friendsSearchDebounceTimer);
    friendsSearchDebounceTimer = null;
  }

  if (!String(query || '').trim()) {
    void runFriendsSearch('');
    return;
  }

  friendsSearchDebounceTimer = window.setTimeout(() => {
    void runFriendsSearch(query);
    friendsSearchDebounceTimer = null;
  }, 220);
});

friendsResultsList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-send-request]');
  if (!button) {
    return;
  }

  const username = decodeURIComponent(button.dataset.sendRequest || '');
  if (!username) {
    return;
  }

  button.disabled = true;
  try {
    const result = await postJson('/api/friends/request', { username });
    showFriendsMessage(result.message || 'Friend request sent.');
    await loadFriendsFromServer();
    renderFriendRequests();
    await searchFriends(friendsSearchInput.value.trim());
    renderFriendsResults();
    renderUsers();
  } catch (error) {
    button.disabled = false;
    showFriendsMessage(error.message || 'Unable to send friend request.', true);
  }
});

existingFriendsList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-open-friend-chat]');
  if (!button) {
    return;
  }

  const username = decodeURIComponent(button.dataset.openFriendChat || '');
  if (!username || !state.contacts[username]) {
    showFriendsMessage('This friend is not available right now. Refresh and try again.', true);
    return;
  }

  showFriendInSidebar(username);
  renderUsers();
  closeFriendsModal();
  await selectChat(username);
});

incomingRequestsList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-respond-action][data-respond-username]');
  if (!button) {
    return;
  }

  const action = button.dataset.respondAction;
  const username = decodeURIComponent(button.dataset.respondUsername || '');
  if (!action || !username) {
    return;
  }

  button.disabled = true;
  try {
    await postJson('/api/friends/respond', { username, action });
    showFriendsMessage(action === 'accept' ? 'Friend request accepted.' : 'Friend request rejected.');
    await loadFriendsFromServer();
    renderFriendRequests();
    renderUsers();
    setHeaderForSelectedChat();
  } catch (error) {
    showFriendsMessage(error.message || 'Unable to update request.', true);
    button.disabled = false;
  }
});

outgoingRequestsList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-cancel-request]');
  if (!button) {
    return;
  }

  const username = decodeURIComponent(button.dataset.cancelRequest || '');
  if (!username) {
    return;
  }

  const shouldCancel = await showConfirmModal({
    title: 'Cancel friend request',
    message: `Cancel pending request to ${username}?`,
    okText: 'Yes, cancel',
    cancelText: 'Keep pending'
  });

  if (!shouldCancel) {
    return;
  }

  button.disabled = true;
  try {
    const result = await postJson('/api/friends/cancel', { username });
    showFriendsMessage(result.message || 'Friend request cancelled.');
    await loadFriendsFromServer();
    renderFriendRequests();
    await searchFriends(friendsSearchInput.value.trim());
    renderFriendsResults();
    renderUsers();
    setHeaderForSelectedChat();
  } catch (error) {
    showFriendsMessage(error.message || 'Unable to cancel request.', true);
    button.disabled = false;
  }
});

chatMenuButton.addEventListener('click', (event) => {
  event.stopPropagation();
  if (!state.selectedUsername) {
    return;
  }

  updateChatMenuForSelectedContact();
  chatMenuPanel.classList.toggle('hidden');
});

chatMenuPanel.addEventListener('click', (event) => {
  event.stopPropagation();
});

viewProfileButton.addEventListener('click', () => {
  closeChatMenu();
  openContactProfileModal();
});

if (editContactStyleButton) {
  editContactStyleButton.addEventListener('click', async () => {
    closeChatMenu();
    await openEditContactStyleFlow();
  });
}

removeFriendButton.addEventListener('click', async () => {
  if (!state.selectedUsername) {
    return;
  }

  const targetUsername = state.selectedUsername;

  const confirmed = await showConfirmModal({
    title: 'Remove Friend',
    message: `Remove ${targetUsername} from your friends list?`,
    okText: 'Remove',
    cancelText: 'Cancel'
  });
  if (!confirmed) {
    return;
  }

  closeChatMenu();

  try {
    await removeFriendByUsername(targetUsername);
  } catch (error) {
    showFriendsMessage(error.message || 'Unable to remove friend.', true);
  }
});

blockFriendButton.addEventListener('click', async () => {
  if (!state.selectedUsername) {
    return;
  }

  const targetUsername = state.selectedUsername;
  const isBlocked = state.blockedUsers.some((name) => name.toLowerCase() === targetUsername.toLowerCase());
  const action = isBlocked ? 'unblock' : 'block';

  const confirmed = await showConfirmModal({
    title: action === 'block' ? 'Block Friend' : 'Unblock Friend',
    message:
      action === 'block'
        ? `Block ${targetUsername}? You won't be able to send messages until you unblock.`
        : `Unblock ${targetUsername}?`,
    okText: action === 'block' ? 'Block' : 'Unblock',
    cancelText: 'Cancel'
  });

  if (!confirmed) {
    return;
  }

  closeChatMenu();

  try {
    const result = await postJson('/api/friends/block', { username: targetUsername, action });
    showFriendsMessage(result.message || (action === 'block' ? 'User blocked.' : 'User unblocked.'));
    await loadFriendsFromServer();
    renderFriendRequests();
    renderUsers();
    setHeaderForSelectedChat();
    renderConversation();
  } catch (error) {
    showFriendsMessage(error.message || 'Unable to update block status.', true);
  }
});

closeContactProfileButton.addEventListener('click', closeContactProfileModal);

contactProfileAvatar.addEventListener('click', () => {
  if (!state.selectedUsername) {
    return;
  }

  if (hasActiveStatus(state.selectedUsername)) {
    openStatusViewerForUser(state.selectedUsername);
    return;
  }

  const avatarUrl = getSelectedContactAvatarUrl();
  if (!avatarUrl) {
    return;
  }

  openAvatarPreviewModal(avatarUrl, state.selectedUsername || 'User');

  if (state.selectedUsername) {
    trackProfilePhotoOpen(state.selectedUsername).catch(() => {
      // Avoid blocking image preview for telemetry-style tracking failures.
    });
  }
});

photoViewsAvatar.addEventListener('click', () => {
  const avatarUrl = getCurrentUserAvatarUrl();
  if (!avatarUrl) {
    return;
  }

  openAvatarPreviewModal(avatarUrl, state.username || 'User');
});

closeAvatarPreviewButton.addEventListener('click', closeAvatarPreviewModal);

if (closeMediaPreviewButton) {
  closeMediaPreviewButton.addEventListener('click', () => {
    closeMediaPreviewModal(true);
  });
}

if (mediaPreviewCancelButton) {
  mediaPreviewCancelButton.addEventListener('click', () => {
    closeMediaPreviewModal(true);
  });
}

if (mediaPreviewSendButton) {
  mediaPreviewSendButton.addEventListener('click', async () => {
    if (!pendingMediaFile) {
      closeMediaPreviewModal(true);
      return;
    }

    const file = pendingMediaFile;
    closeMediaPreviewModal(false);
    pendingMediaFile = null;
    const isVideoFile = String(file.type || '').toLowerCase().startsWith('video/');
    await sendSelectedMediaFile(file, { isVideo: isVideoFile });
  });
}

if (closeImageViewerButton) {
  closeImageViewerButton.addEventListener('click', closeImageViewerModal);
}

contactProfileModal.addEventListener('click', (event) => {
  if (event.target === contactProfileModal) {
    closeContactProfileModal();
  }
});

avatarPreviewModal.addEventListener('click', (event) => {
  if (event.target === avatarPreviewModal) {
    closeAvatarPreviewModal();
  }
});

if (mediaPreviewModal) {
  mediaPreviewModal.addEventListener('click', (event) => {
    if (event.target === mediaPreviewModal) {
      closeMediaPreviewModal(true);
    }
  });
}

if (cameraCaptureModal) {
  cameraCaptureModal.addEventListener('click', (event) => {
    if (event.target === cameraCaptureModal) {
      closeCameraCaptureModal();
    }
  });
}

if (imageViewerModal) {
  imageViewerModal.addEventListener('click', (event) => {
    if (event.target === imageViewerModal) {
      closeImageViewerModal();
    }
  });
}

profileAvatar.addEventListener('click', () => {
  if (hasActiveStatus(state.username)) {
    closePhotoViewsModal();
    openStatusViewerForUser(state.username);
    return;
  }

  const avatarUrl = getCurrentUserAvatarUrl();
  if (!avatarUrl) {
    return;
  }

  closePhotoViewsModal();
  openAvatarPreviewModal(avatarUrl, state.username || 'User');
});

closePhotoViewsButton.addEventListener('click', closePhotoViewsModal);

photoViewsModal.addEventListener('click', (event) => {
  if (event.target === photoViewsModal) {
    closePhotoViewsModal();
  }
});

document.addEventListener('click', () => {
  closeChatMenu();
  closeAllReactionPickers();
});

settingsAvatarInput.addEventListener('change', () => {
  const [file] = settingsAvatarInput.files || [];

  if (!file) {
    state.pendingAvatarDataUrl = '';
    showSettingsMessage('');
    return;
  }

  const isImage = String(file.type || '').startsWith('image/');
  if (!isImage) {
    settingsAvatarInput.value = '';
    state.pendingAvatarDataUrl = '';
    showSettingsMessage('Please choose an image file.', true);
    return;
  }

  state.pendingAvatarDataUrl = '__PENDING_FILE__';
  showSettingsMessage('Opening crop tool...');

  openAvatarCropModal(file).catch((error) => {
    settingsAvatarInput.value = '';
    state.pendingAvatarDataUrl = '';
    showSettingsMessage(error.message || 'Unable to load selected image.', true);
  });
});

avatarCropZoom.addEventListener('input', () => {
  if (!avatarCropState.image) {
    return;
  }

  const zoomValue = Number(avatarCropZoom.value || 1);
  avatarCropState.scale = avatarCropState.minScale * zoomValue;
  drawAvatarCropCanvas();
});

avatarCropCanvas.addEventListener('pointerdown', (event) => {
  if (!avatarCropState.image) {
    return;
  }

  avatarCropState.dragging = true;
  avatarCropState.dragStartX = event.clientX;
  avatarCropState.dragStartY = event.clientY;
  avatarCropState.dragOffsetX = avatarCropState.offsetX;
  avatarCropState.dragOffsetY = avatarCropState.offsetY;
  avatarCropCanvas.classList.add('dragging');
  avatarCropCanvas.setPointerCapture(event.pointerId);
});

avatarCropCanvas.addEventListener('pointermove', (event) => {
  if (!avatarCropState.dragging) {
    return;
  }

  avatarCropState.offsetX = avatarCropState.dragOffsetX + (event.clientX - avatarCropState.dragStartX);
  avatarCropState.offsetY = avatarCropState.dragOffsetY + (event.clientY - avatarCropState.dragStartY);
  drawAvatarCropCanvas();
});

function endAvatarCropDrag(pointerId) {
  avatarCropState.dragging = false;
  avatarCropCanvas.classList.remove('dragging');
  if (typeof pointerId === 'number') {
    try {
      avatarCropCanvas.releasePointerCapture(pointerId);
    } catch (_error) {
      // Pointer capture may already be released.
    }
  }
}

avatarCropCanvas.addEventListener('pointerup', (event) => {
  endAvatarCropDrag(event.pointerId);
});

avatarCropCanvas.addEventListener('pointercancel', (event) => {
  endAvatarCropDrag(event.pointerId);
});

closeAvatarCropButton.addEventListener('click', () => {
  state.pendingAvatarDataUrl = '';
  settingsAvatarInput.value = '';
  showSettingsMessage('Photo selection canceled.');
  closeAvatarCropModal();
});

avatarCropCancelButton.addEventListener('click', () => {
  state.pendingAvatarDataUrl = '';
  settingsAvatarInput.value = '';
  showSettingsMessage('Photo selection canceled.');
  closeAvatarCropModal();
});

avatarCropApplyButton.addEventListener('click', () => {
  const croppedDataUrl = exportCroppedAvatarDataUrl();
  if (!croppedDataUrl) {
    showSettingsMessage('Unable to crop image. Please try again.', true);
    return;
  }

  if (croppedDataUrl.length > MAX_AVATAR_DATA_URL_LENGTH) {
    showSettingsMessage('Cropped image is too large. Try a smaller source image.', true);
    return;
  }

  state.pendingAvatarDataUrl = croppedDataUrl;
  settingsAvatarInput.value = '';
  closeAvatarCropModal();
  showSettingsMessage('Photo cropped and ready. Click Save profile to apply.');
});

avatarCropModal.addEventListener('click', (event) => {
  if (event.target === avatarCropModal) {
    state.pendingAvatarDataUrl = '';
    settingsAvatarInput.value = '';
    showSettingsMessage('Photo selection canceled.');
    closeAvatarCropModal();
  }
});

backToListButton.addEventListener('click', () => {
  setChatOnlyMode(false);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    return;
  }

  markCurrentConversationAsSeen();
  renderConversation();
});

settingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (state.isSavingProfile) {
    return;
  }

  state.isSavingProfile = true;
  setSaveProfileBusy(true);
  showSettingsMessage('Saving profile...');

  try {
    const about = settingsAboutInput.value.trim() || 'Available to chat';
    const profileVisibility = normalizeProfileVisibility(settingsVisibilityInput?.value);
    const onlineVisibility = normalizeOnlineVisibility(settingsOnlineVisibilityInput?.value);
    const [avatarFile] = settingsAvatarInput.files || [];

    let avatarUrl = state.profile.avatarUrl || '';

    if (state.pendingAvatarDataUrl && state.pendingAvatarDataUrl !== '__PENDING_FILE__') {
      avatarUrl = state.pendingAvatarDataUrl;
    } else if (avatarFile) {
      avatarUrl = await readFileAsDataUrl(avatarFile);
      if (avatarUrl.length > MAX_AVATAR_DATA_URL_LENGTH) {
        throw new Error('Image is too large. Please choose a smaller image (under 6 MB).');
      }
    }

    const result = await updateProfileOnServer(about, avatarUrl, profileVisibility, onlineVisibility);

    state.profile = normalizeProfileData({
      about: result.profile?.about || about,
      avatarUrl: result.profile?.avatarUrl || avatarUrl,
      profileVisibility: result.profile?.profileVisibility || profileVisibility,
      onlineVisibility: result.profile?.onlineVisibility || onlineVisibility
    });
    localStorage.setItem('chat-profile', JSON.stringify(state.profile));
    currentUsername.textContent = settingsUsernameInput.value.trim() || state.username;
    applyProfile();
    state.pendingAvatarDataUrl = '';
    showSettingsMessage('Profile saved successfully.');
    closeSettingsModal();
  } catch (error) {
    showSettingsMessage(error.message || 'Unable to save profile.', true);
  } finally {
    state.isSavingProfile = false;
    setSaveProfileBusy(false);
  }
});

settingsLogoutButton.addEventListener('click', async () => {
  await postJson('/api/logout', {});
  applyLoggedOutUi('Logged out successfully.');
});

changePasswordForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const oldPassword = oldPasswordInput.value;
  const newPassword = newPasswordInput.value;

  if (!oldPassword || !newPassword) {
    showChangePasswordMessage('Please fill both old and new password.', true);
    return;
  }

  if (newPassword.length < 4) {
    showChangePasswordMessage('New password must be at least 4 characters.', true);
    return;
  }

  setChangePasswordBusy(true);
  showChangePasswordMessage('Updating password...');

  try {
    const result = await changePasswordOnServer(oldPassword, newPassword);
    oldPasswordInput.value = '';
    newPasswordInput.value = '';
    applyLoggedOutUi(result.message || 'Password changed. Please log in with your new password.');
  } catch (error) {
    showChangePasswordMessage(error.message || 'Unable to change password.', true);
  } finally {
    setChangePasswordBusy(false);
  }
});

clearChatButton.addEventListener('click', async () => {
  if (!state.selectedUsername) {
    return;
  }

  const chatUsername = state.selectedUsername;
  const selectedDate = String(deleteChatDateInput?.value || '').trim();
  const hasDateFilter = /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);

  if (selectedDate && !hasDateFilter) {
    appendMessage('Selected date is invalid. Please use YYYY-MM-DD.');
    return;
  }

  const confirmed = await showConfirmModal({
    title: hasDateFilter ? 'Delete messages by date' : 'Delete all chat messages',
    message: hasDateFilter
      ? `Delete only messages from ${selectedDate}?`
      : 'No date selected. Delete all messages in this chat?',
    okText: 'Delete',
    cancelText: 'Cancel'
  });

  if (!confirmed) {
    return;
  }

  try {
    const result = hasDateFilter
      ? await deleteConversationByDateOnServer(chatUsername, selectedDate)
      : await deleteConversationOnServer(chatUsername);
    await loadConversationFromServer(chatUsername);
    state.loadedConversations[chatUsername] = true;
    if (hasDateFilter) {
      appendMessage(`Deleted ${Number(result.deletedCount || 0)} messages from ${selectedDate}.`);
    } else {
      appendMessage(`Deleted ${Number(result.deletedCount || 0)} messages from this chat.`);
    }
  } catch (error) {
    appendMessage(error.message || 'Unable to clear messages right now.');
  }

  closeChatMenu();
  renderConversation();
  renderUsers();
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const result = await postJson('/api/login', {
      email: loginEmailInput.value.trim(),
      password: loginPasswordInput.value
    });

    state.profile = normalizeProfileData(result.profile || state.profile);
    localStorage.setItem('chat-profile', JSON.stringify(state.profile));
    showAuthMessage('Login successful.');
    await enterChat(result.username);
  } catch (error) {
    showAuthMessage(error.message, true);
  }
});

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!state.forgotPasswordOtpPending) {
      forgotSendOtpButton?.click();
      return;
    }

    if (!state.forgotPasswordOtpVerified) {
      forgotVerifyOtpButton?.click();
      return;
    }

    forgotResetPasswordButton?.click();
  });
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (state.registerOtpPending) {
    showAuthMessage('Enter OTP and click Verify OTP to finish registration.', true);
    return;
  }

  const registerPayload = {
    email: registerEmailInput.value.trim(),
    username: registerUsernameInput.value.trim(),
    password: registerPasswordInput.value
  };

  if (!registerPayload.email || !registerPayload.username || !registerPayload.password) {
    showAuthMessage('Email, username, and password are required.', true);
    return;
  }

  setRegisterBusy(true, 'Sending OTP...');

  try {
    const result = await postJson('/api/register/request-otp', registerPayload);
    state.registerOtpPending = true;
    registerOtpSection.classList.remove('hidden');
    registerOtpInput.required = true;
    registerOtpInput.value = result.devOtp ? String(result.devOtp) : '';
    setRegisterFieldsDisabled(true);
    setRegisterBusy(false);
    if (result.devOtp) {
      showAuthMessage(`${result.message || 'OTP generated for development.'} Use OTP: ${result.devOtp}`);
    } else {
      showAuthMessage(result.message || 'OTP sent to your email. Enter it to complete registration.');
    }
    registerOtpInput.focus();
  } catch (error) {
    showAuthMessage(error.message, true);
    setRegisterBusy(false);
  }
});

verifyOtpButton.addEventListener('click', async () => {
  if (!state.registerOtpPending) {
    showAuthMessage('Send OTP first to verify your email.', true);
    return;
  }

  const otp = registerOtpInput.value.trim();
  if (!/^\d{6}$/.test(otp)) {
    showAuthMessage('Please enter a valid 6-digit OTP.', true);
    return;
  }

  verifyOtpButton.disabled = true;
  resendOtpButton.disabled = true;
  setRegisterBusy(true, 'Verifying...');

  try {
    const fallbackEmail = registerEmailInput.value.trim();
    const result = await postJson('/api/register/verify-otp', {
      email: fallbackEmail,
      otp
    });

    resetRegisterOtpFlow({ clearForm: true });
    showLoginTab();
    loginEmailInput.value = result.email || fallbackEmail;
    loginPasswordInput.value = '';
    showAuthMessage(result.message || 'Account created successfully. Please log in.');
    loginPasswordInput.focus();
  } catch (error) {
    showAuthMessage(error.message || 'OTP verification failed.', true);
    verifyOtpButton.disabled = false;
    resendOtpButton.disabled = false;
    setRegisterBusy(false);
  }
});

resendOtpButton.addEventListener('click', async () => {
  if (!state.registerOtpPending) {
    showAuthMessage('Start registration first, then resend OTP if needed.', true);
    return;
  }

  verifyOtpButton.disabled = true;
  resendOtpButton.disabled = true;

  try {
    const result = await postJson('/api/register/request-otp', {
      email: registerEmailInput.value.trim(),
      username: registerUsernameInput.value.trim(),
      password: registerPasswordInput.value
    });
    if (result.devOtp) {
      showAuthMessage(`${result.message || 'New OTP generated for development.'} Use OTP: ${result.devOtp}`);
    } else {
      showAuthMessage(result.message || 'A new OTP has been sent.');
    }
    registerOtpInput.value = result.devOtp ? String(result.devOtp) : '';
    registerOtpInput.focus();
  } catch (error) {
    showAuthMessage(error.message || 'Unable to resend OTP.', true);
  } finally {
    verifyOtpButton.disabled = false;
    resendOtpButton.disabled = false;
  }
});

if (voiceRecordButton) {
  resetVoiceRecordButtonState();
  voiceRecordButton.addEventListener('click', async () => {
    await toggleVoiceRecording();
  });
}

if (galleryButton && mediaFileInput) {
  galleryButton.addEventListener('click', () => {
    if (!state.selectedUsername) {
      appendMessage('Pick a person from the list before sending a photo or video.');
      return;
    }

    mediaFileInput.click();
  });

  mediaFileInput.addEventListener('change', async () => {
    await handleMediaFileSelection();
  });
}

if (cameraCaptureButton) {
  cameraCaptureButton.addEventListener('click', async () => {
    await openCameraCaptureModal();
  });
}

if (closeCameraCaptureButton) {
  closeCameraCaptureButton.addEventListener('click', () => {
    closeCameraCaptureModal();
  });
}

if (cameraCaptureCancelButton) {
  cameraCaptureCancelButton.addEventListener('click', () => {
    closeCameraCaptureModal();
  });
}

if (cameraCapturePhotoButton) {
  cameraCapturePhotoButton.addEventListener('click', async () => {
    await capturePhotoFromCamera();
  });
}

if (cameraCaptureVideoButton) {
  resetCameraVideoButtonState();
  cameraCaptureVideoButton.addEventListener('click', async () => {
    await toggleCameraVideoRecording();
  });
}

if (cameraCaptureSwitchButton) {
  updateCameraSwitchButtonLabel();
  cameraCaptureSwitchButton.addEventListener('click', async () => {
    await switchCameraCaptureFacingMode();
  });
}

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  if (!state.selectedUsername) {
    appendMessage('Pick a person from the list before sending a message.');
    return;
  }

  if (state.blockedUsers.some((name) => name.toLowerCase() === state.selectedUsername.toLowerCase())) {
    appendMessage('You blocked this user. Unblock to send messages.');
    return;
  }

  stopOutgoingTyping();
  const contact = state.contacts[state.selectedUsername] || {};

  const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const sentAt = new Date().toLocaleTimeString();
  const messageMood = detectMoodFromText(message);
  const replyTo = state.replyDraft
    ? {
        messageId: state.replyDraft.messageId,
        fromUsername: state.replyDraft.fromUsername,
        message: state.replyDraft.message
      }
    : null;

  addConversationMessage(state.selectedUsername, {
    id: messageId,
    type: 'chat',
    direction: 'outgoing',
    message,
    mediaUrl: '',
    mediaType: '',
    mediaMimeType: '',
    audioUrl: '',
    audioMimeType: '',
    audioDurationMs: 0,
    mood: messageMood,
    replyTo,
    reactions: {},
    sentAt,
    seen: false
  });

  socket.emit('private-message', {
    toUsername: state.selectedUsername,
    toSocketId: contact.socketId || '',
    message,
    mediaUrl: '',
    mediaType: '',
    mediaMimeType: '',
    audioUrl: '',
    audioMimeType: '',
    audioDurationMs: 0,
    mood: messageMood,
    replyTo,
    messageId
  });

  renderConversation();
  renderUsers();
  clearReplyDraft();
  messageInput.value = '';
  messageInput.focus();
});

messageInput.addEventListener('input', () => {
  handleComposerTyping();
});

messageInput.addEventListener('blur', () => {
  stopOutgoingTyping();
});

socket.on('private-message', ({
  messageId,
  fromUsername,
  toUsername,
  message,
  mediaUrl,
  mediaType,
  mediaMimeType,
  audioUrl,
  audioMimeType,
  audioDurationMs,
  mood,
  sentAt,
  replyTo,
  reactions
}) => {
  const otherPerson = fromUsername === state.username ? toUsername : fromUsername;
  const isIncoming = fromUsername !== state.username;

  if (!state.contacts[otherPerson] && isIncoming) {
    return;
  }

  if (isIncoming) {
    ensureContact(otherPerson, { online: true });
  }

  if (isIncoming) {
    addConversationMessage(otherPerson, {
      id: messageId,
      type: 'chat',
      direction: 'incoming',
      message,
      mediaUrl: String(mediaUrl || ''),
      mediaType: String(mediaType || ''),
      mediaMimeType: String(mediaMimeType || ''),
      audioUrl: String(audioUrl || ''),
      audioMimeType: String(audioMimeType || ''),
      audioDurationMs: Number(audioDurationMs || 0),
      mood: sanitizeMood(mood),
      replyTo: replyTo || null,
      reactions: normalizeMessageReactions(reactions),
      sentAt,
      seen: false,
      ackSent: false
    });

    stopTypingForContact(otherPerson);
  }

  setHeaderForSelectedChat();
  renderUsers();

  if (state.selectedUsername === otherPerson && isSelectedChatVisible()) {
    markCurrentConversationAsSeen();
    renderConversation();
  }
});

socket.on('message-seen', ({ messageId }) => {
  Object.values(state.conversations).forEach((conversation) => {
    const targetMessage = conversation.find((entry) => entry.id === messageId);
    if (targetMessage) {
      targetMessage.seen = true;
    }
  });

  renderConversation();
  renderUsers();
});

socket.on('message-deleted', ({ messageId, withUsername }) => {
  const targetUsername = String(withUsername || '');
  let changed = false;

  if (targetUsername) {
    changed = removeMessageFromConversation(targetUsername, messageId);
  } else {
    Object.keys(state.conversations).forEach((username) => {
      if (removeMessageFromConversation(username, messageId)) {
        changed = true;
      }
    });
  }

  if (!changed) {
    return;
  }

  renderConversation();
  renderUsers();
});

socket.on('message-reaction', ({ messageId, withUsername, reactions }) => {
  const username = String(withUsername || '').trim();
  if (!username || !messageId) {
    return;
  }

  if (!updateConversationMessageReactions(username, String(messageId), reactions)) {
    return;
  }

  renderConversation();
  renderUsers();
});

socket.on('typing-status', ({ fromUsername, isTyping }) => {
  const username = String(fromUsername || '').trim();
  if (!username || !state.contacts[username]) {
    return;
  }

  setTypingForContact(username, Boolean(isTyping));
  setHeaderForSelectedChat();
});

socket.on('system-message', (message) => {
  if (!state.selectedUsername && !Object.keys(state.contacts).length) {
    messagesContainer.innerHTML = `<div class="message system">${escapeHtml(message)}</div>`;
    return;
  }

  const item = document.createElement('div');
  item.className = 'message system';
  item.textContent = message;
  messagesContainer.appendChild(item);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

socket.on('users-list', (users) => {
  const onlineSet = new Set();

  users.forEach((user) => {
    if (user.username === state.username) {
      return;
    }

    if (!state.contacts[user.username]) {
      return;
    }

    const isOnline = typeof user.online === 'boolean' ? user.online : Boolean(user.socketId);

    if (isOnline) {
      onlineSet.add(user.username);
    }

    ensureContact(user.username, {
      online: isOnline,
      socketId: isOnline ? user.socketId : '',
      about: user.about || 'Available to chat',
      avatarUrl: user.avatarUrl || ''
    });
  });

  Object.keys(state.contacts).forEach((username) => {
    if (username === state.username) {
      return;
    }

    if (!onlineSet.has(username)) {
      ensureContact(username, { online: false, socketId: '' });
    }
  });

  setHeaderForSelectedChat();
  renderUsers();
  if (isSelectedChatVisible()) {
    markCurrentConversationAsSeen();
  }
  renderConversation();
});

socket.on('friends-updated', async () => {
  try {
    await loadFriendsFromServer();
    await loadStatusFeedFromServer();
    renderFriendRequests();
    renderUsers();
    setHeaderForSelectedChat();
    renderConversation();
  } catch (_error) {
    showFriendsMessage('Unable to refresh friends right now.', true);
  }
});

socket.on('username-error', (message) => {
  appendMessage(message);
  chatSection.classList.add('hidden');
  authCard.classList.remove('hidden');
  syncBodyScrollMode();
  showAuthMessage(message, true);
  showLoginTab();
  loginEmailInput.focus();
});

socket.on('connect', () => {
  statusText.textContent = '';
});

socket.on('disconnect', () => {
  statusText.textContent = '';
  stopOutgoingTyping();
  appendMessage('You were disconnected from the server.');
});

window.addEventListener('load', async () => {
  syncBodyScrollMode();
  applyTheme();
  try {
    const response = await fetch(`${apiBaseUrl}/api/session`, {
      credentials: 'include'
    });
    const session = await response.json();

    if (session.authenticated && session.username) {
      state.profile = normalizeProfileData(session.profile || state.profile);
      localStorage.setItem('chat-profile', JSON.stringify(state.profile));
      await enterChat(session.username);
    }
  } catch (_error) {
    showAuthMessage('Unable to restore session.', true);
  }
});

