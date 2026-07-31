/**
 * ==========================================================
 * Audio Manager
 * ==========================================================
 *
 * Menggunakan AudioFiles sebagai Object (key-value pair)
 * Requirement menggunakan key (string) dari AudioFiles.
 * ==========================================================
 */

class AudioManager {
  constructor() {
    this.cache = new Map(); // key: string, value: Howl object
    this.queue = [];
    this.index = 0;
    this.current = null;
    this.playing = false;
    this.paused = false;
    this.volume = Config.audioVolume;
    this.rate = Config.audioRate;
    this.callbacks = { preload: null, change: null, finish: null, stop: null };

    this.isIntro = false;
    this.introCount = 0;
    this.totalIntro = 0;
    this.introQueue = [];
  }

  /**
   * ==========================================
   * Callback
   * ==========================================
   */

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  emit(event, payload = null) {
    if (typeof this.callbacks[event] === "function") {
      this.callbacks[event](payload);
    }
  }

  /**
   * ==========================================
   * Preload Semua Audio dari AudioFiles (Object)
   * ==========================================
   */

  preload() {
    const keys = Object.keys(AudioFiles);
    const total = keys.length;
    let loaded = 0;

    if (total === 0) {
      this.emit("preload", { loaded: 0, total: 0 });
      return;
    }

    keys.forEach((key) => {
      const filePath = AudioFiles[key];

      // Cek apakah sudah di-cache
      if (this.cache.has(key)) {
        loaded++;
        this.emit("preload", { loaded, total });
        return;
      }

      const sound = new Howl({
        src: [filePath],
        preload: true,
        volume: this.volume,
        rate: this.rate,
        html5: false,
      });

      // Simpan ke cache dengan key = string
      this.cache.set(key, sound);

      sound.once("load", () => {
        loaded++;
        this.emit("preload", { loaded, total });
      });

      sound.once("loaderror", (id, error) => {
        console.warn(
          `[Audio] Gagal memuat file: ${filePath} (key: ${key})`,
          error,
        );
        loaded++;
        this.emit("preload", { loaded, total });
      });
    });
  }

  /**
   * ==========================================
   * Get Audio dari Cache berdasarkan Key
   * ==========================================
   */

  getAudio(key) {
    const sound = this.cache.get(key);
    if (!sound) {
      console.warn(
        `[Audio] Sound dengan key "${key}" tidak ditemukan di cache`,
      );
    }
    return sound;
  }

  /**
   * ==========================================
   * Play Menu - dengan Intro Array
   * ==========================================
   */

  play(menu) {
    this.stop();

    this.queue = [];
    this.isIntro = false;
    this.introCount = 0;
    this.totalIntro = 0;
    this.introQueue = [];

    // 1. Tambahkan intro ke queue (jika ada)
    if (menu.intro && Array.isArray(menu.intro) && menu.intro.length > 0) {
      menu.intro.forEach((soundKey) => {
        this.queue.push({
          type: "intro",
          soundKey: soundKey,
          text: null,
          requirementIndex: null,
        });
        this.introQueue.push(soundKey);
      });
      this.isIntro = true;
      this.totalIntro = menu.intro.length;
      this.introCount = 0;
    }

    // 2. Tambahkan requirements ke queue
    menu.requirements.forEach((req, index) => {
      this.queue.push({
        type: "requirement",
        soundKey: req.sound,
        text: req.text,
        requirementIndex: index,
      });
    });

    this.index = 0;
    this.playing = true;

    this.playNext();
  }

  /**
   * ==========================================
   * Skip Intro
   * ==========================================
   */

  skipIntro() {
    if (!this.isIntro || !this.playing) {
      return;
    }

    if (this.current) {
      this.current.stop();
    }

    let firstRequirementIndex = -1;
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i].type === "requirement") {
        firstRequirementIndex = i;
        break;
      }
    }

    if (firstRequirementIndex === -1) {
      this.stop();
      return;
    }

    this.index = firstRequirementIndex;
    this.isIntro = false;
    this.introCount = this.totalIntro;

    this.emit("intro-skipped", {
      skipped: true,
      introCount: this.totalIntro,
    });

    this.playNext();
  }

  /**
   * ==========================================
   * Play Berikutnya
   * ==========================================
   */

  playNext() {
    if (this.index >= this.queue.length) {
      this.playing = false;
      this.isIntro = false;
      this.emit("finish");
      return;
    }

    const item = this.queue[this.index];

    if (item.type === "intro") {
      this.introCount++;
      const hasNextIntro = this.queue
        .slice(this.index + 1)
        .some((q) => q.type === "intro");
      this.isIntro = hasNextIntro || this.introCount < this.totalIntro;
    }

    this.emit("change", {
      index: this.index,
      soundKey: item.soundKey,
      type: item.type,
      requirementIndex: item.requirementIndex,
      text: item.text,
      isIntro: item.type === "intro",
      introCount: this.introCount,
      totalIntro: this.totalIntro,
      isLastIntro: item.type === "intro" && this.introCount >= this.totalIntro,
    });

    const howl = this.getAudio(item.soundKey);

    if (!howl) {
      console.warn(
        `[Audio] Sound key "${item.soundKey}" tidak ditemukan, skip ke next`,
      );
      this.index++;
      this.playNext();
      return;
    }

    this.current = howl;

    howl.off("end");
    howl.off("loaderror");

    howl.once("end", () => {
      if (item.type === "intro" && this.introCount >= this.totalIntro) {
        this.isIntro = false;
      }
      this.index++;
      this.playNext();
    });

    howl.once("loaderror", () => {
      console.warn(
        `[Audio] Gagal memutar sound key "${item.soundKey}", skip ke next`,
      );
      if (item.type === "intro" && this.introCount >= this.totalIntro) {
        this.isIntro = false;
      }
      this.index++;
      this.playNext();
    });

    try {
      howl.play();
    } catch (error) {
      console.warn(
        `[Audio] Error playing sound key "${item.soundKey}":`,
        error,
      );
      if (item.type === "intro" && this.introCount >= this.totalIntro) {
        this.isIntro = false;
      }
      this.index++;
      this.playNext();
    }
  }

  /**
   * ==========================================
   * Pause
   * ==========================================
   */

  pause() {
    if (!this.current) return;
    this.current.pause();
    this.paused = true;
  }

  /**
   * ==========================================
   * Resume
   * ==========================================
   */

  resume() {
    if (!this.current) return;
    this.current.play();
    this.paused = false;
  }

  /**
   * ==========================================
   * Stop
   * ==========================================
   */

  stop() {
    if (this.current) {
      this.current.stop();
    }

    this.playing = false;
    this.paused = false;
    this.queue = [];
    this.index = 0;
    this.current = null;
    this.isIntro = false;
    this.introCount = 0;
    this.totalIntro = 0;
    this.introQueue = [];

    this.emit("stop");
  }

  /**
   * ==========================================
   * Replay
   * ==========================================
   */

  replay(menu) {
    this.play(menu);
  }

  /**
   * ==========================================
   * Volume & Rate
   * ==========================================
   */

  setVolume(volume) {
    this.volume = volume;
    Howler.volume(volume);
  }

  setRate(rate) {
    this.rate = rate;
    this.cache.forEach((sound) => {
      sound.rate(rate);
    });
  }

  /**
   * ==========================================
   * Get Status
   * ==========================================
   */

  isPlaying() {
    return this.playing;
  }

  isPaused() {
    return this.paused;
  }

  isIntroPlaying() {
    return this.isIntro;
  }

  getCurrentIndex() {
    return this.index;
  }

  getTotalQueue() {
    return this.queue.length;
  }

  getIntroCount() {
    return this.introCount;
  }

  getTotalIntro() {
    return this.totalIntro;
  }
}

window.Audio = new AudioManager();
