const I18N = (() => {
  const STORAGE_KEY = 'lang_preference';
  const DEFAULT_LANG = 'zh';
  const SUPPORTED_LANGS = ['zh', 'en'];

  const translations = {
    zh: {
      'app.title.player': '内网音频广播 - 播放器',
      'app.title.dj': '内网音频广播 - DJ 控制台',
      'header.player': '🎵 内网音频广播',
      'header.dj': '🎛️ DJ 控制台',
      'nav.player': '播放器',
      'nav.dj': 'DJ 控制台',
      'channel.list': '频道列表',
      'channel.select': '选择频道',
      'channel.selectPrompt': '选择一个频道开始收听',
      'channel.loadError': '无法加载频道列表',
      'channel.listenersOnline': '{count} 人在线',
      'channel.playing': '播放中',
      'channel.stopped': '已停止',
      'channel.paused': '已暂停',
      'player.browserNotSupported': '您的浏览器不支持音频播放。',
      'player.listenersLabel': '在线收听',
      'dj.nowPlaying': '正在播放',
      'dj.channelVolume': '频道音量',
      'dj.listenersLabel': '在线收听',
      'dj.playlistLabel': '播放列表',
      'dj.playlistEmpty': '播放列表为空',
      'lang.switch': '语言',
      'lang.zh': '中文',
      'lang.en': 'English'
    },
    en: {
      'app.title.player': 'LAN Audio Broadcast - Player',
      'app.title.dj': 'LAN Audio Broadcast - DJ Console',
      'header.player': '🎵 LAN Audio Broadcast',
      'header.dj': '🎛️ DJ Console',
      'nav.player': 'Player',
      'nav.dj': 'DJ Console',
      'channel.list': 'Channels',
      'channel.select': 'Select Channel',
      'channel.selectPrompt': 'Select a channel to start listening',
      'channel.loadError': 'Failed to load channels',
      'channel.listenersOnline': '{count} online',
      'channel.playing': 'Playing',
      'channel.stopped': 'Stopped',
      'channel.paused': 'Paused',
      'player.browserNotSupported': 'Your browser does not support audio playback.',
      'player.listenersLabel': 'Listening',
      'dj.nowPlaying': 'Now Playing',
      'dj.channelVolume': 'Channel Volume',
      'dj.listenersLabel': 'Listening',
      'dj.playlistLabel': 'Playlist',
      'dj.playlistEmpty': 'Playlist is empty',
      'lang.switch': 'Language',
      'lang.zh': '中文',
      'lang.en': 'English'
    }
  };

  let currentLang = DEFAULT_LANG;
  const listeners = [];

  function detectLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      return stored;
    }
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('zh')) return 'zh';
    if (browserLang.startsWith('en')) return 'en';
    return DEFAULT_LANG;
  }

  function init() {
    currentLang = detectLanguage();
    localStorage.setItem(STORAGE_KEY, currentLang);
    applyToDOM();
    updateLangSwitcher();
  }

  function t(key, params) {
    const dict = translations[currentLang] || {};
    let text = dict[key];
    if (text === undefined) {
      text = (translations[DEFAULT_LANG] || {})[key] || key;
    }
    if (params) {
      Object.keys(params).forEach(k => {
        text = text.replace(`{${k}}`, params[k]);
      });
    }
    return text;
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, currentLang);
    applyToDOM();
    updateLangSwitcher();
    listeners.forEach(fn => fn(lang));
  }

  function getLang() {
    return currentLang;
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function applyToDOM() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = t(key);
    });

    const pageTitleKey = document.body.getAttribute('data-i18n-page-title');
    if (pageTitleKey) {
      document.title = t(pageTitleKey);
    }
  }

  function updateLangSwitcher() {
    document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  function formatNumber(num) {
    if (typeof num !== 'number') return String(num);
    try {
      return num.toLocaleString(currentLang === 'zh' ? 'zh-CN' : 'en-US');
    } catch (e) {
      return String(num);
    }
  }

  function formatDate(date, options) {
    if (!(date instanceof Date)) return String(date);
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const merged = Object.assign({}, defaultOptions, options || {});
    try {
      return date.toLocaleString(
        currentLang === 'zh' ? 'zh-CN' : 'en-US',
        merged
      );
    } catch (e) {
      return date.toISOString();
    }
  }

  function formatDateShort(date) {
    if (!(date instanceof Date)) return String(date);
    try {
      return date.toLocaleDateString(
        currentLang === 'zh' ? 'zh-CN' : 'en-US',
        { year: 'numeric', month: '2-digit', day: '2-digit' }
      );
    } catch (e) {
      return date.toISOString().slice(0, 10);
    }
  }

  function formatTime(date) {
    if (!(date instanceof Date)) return String(date);
    try {
      return date.toLocaleTimeString(
        currentLang === 'zh' ? 'zh-CN' : 'en-US',
        { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
      );
    } catch (e) {
      return date.toISOString().slice(11, 19);
    }
  }

  return {
    init,
    t,
    setLang,
    getLang,
    onChange,
    formatNumber,
    formatDate,
    formatDateShort,
    formatTime,
    applyToDOM,
    SUPPORTED_LANGS,
    DEFAULT_LANG
  };
})();
