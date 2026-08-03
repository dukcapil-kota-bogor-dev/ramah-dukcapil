const app = Vue.createApp({
  data() {
    return {
      fecthBaseurl: "/data/",

      config: null,
      menus: [],
      homeSlides: [],
      audioFiles: null,

      // ==========================
      // APP
      // ==========================

      isReady: false,
      loading: true,
      isLoadingData: true,

      // ==========================
      // LOADING PROGRESS
      // ==========================

      loadingProgress: 0, // 0-100
      loadingStatus: "Memulai...", // Status text
      loadingFiles: [], // Daftar file yang sudah di-load
      totalFiles: 3, // Total file JSON yang akan di-load
      loadedFiles: 0, // Jumlah file yang sudah di-load

      // ==========================
      // THEME
      // ==========================

      darkMode: false,

      // ==========================
      // CLOCK
      // ==========================

      currentDate: "",
      currentTime: "",

      // ==========================
      // HOME
      // ==========================

      currentHomeSlide: 0,
      homeTimer: null,

      // ==========================
      // MODAL
      // ==========================

      showModal: false,
      selectedMenu: null,
      selectedSubMenu: null,
      currentRequirement: 0,
      currentImage: 0,
      imageTimer: null,

      // ==========================
      // SUB MENU MODAL (PILIHAN)
      // ==========================

      showSubMenuModal: false,
      selectedSubMenuParent: null,

      // ==========================
      // AUDIO
      // ==========================

      isPlaying: false,
      isIntroPlaying: false,
      introCount: 0,
      totalIntro: 0,

      // ==========================
      // PRELOAD
      // ==========================

      preloadLoaded: 0,
      preloadTotal: 0,

      // ==========================
      // IDLE
      // ==========================

      idleTimer: null,

      // ==========================
      // CACHE CONTROL
      // ==========================

      cacheTimestamp: Date.now(),
    };
  },

  computed: {
    clock() {
      return this.currentTime;
    },
    today() {
      return this.currentDate;
    },
    hasIntro() {
      return this.introCount < this.totalIntro;
    },
    introProgress() {
      if (this.totalIntro === 0) return 0;
      return Math.round((this.introCount / this.totalIntro) * 100);
    },
    // Loading status
    isLoading() {
      return this.loading || this.isLoadingData;
    },
    loadingPercentage() {
      return Math.min(this.loadingProgress, 100);
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    /*
    ======================================
    INIT
    ======================================
    */

    async init() {
      this.$nextTick(async () => {
        // Load data from JSON files
        await this.loadAllData();

        if (!this.isReady) {
          console.error("Failed to load data");
          this.loading = false;
          return;
        }

        // Load theme dari localStorage
        this.loadTheme();
        this.applyTheme();
        this.startClock();
        this.startHomeCarousel();
        this.startIdleTimer();
        this.registerAudioEvents();
        this.preloadAudio();

        window.addEventListener("click", this.resetIdleTimer);
        window.addEventListener("touchstart", this.resetIdleTimer);
        window.addEventListener("keydown", this.resetIdleTimer);
        window.addEventListener("keydown", this.onKeyDown);
      });
    },

    /*
    ======================================
    LOAD DATA FROM JSON
    ======================================
    */

    async loadAllData() {
      try {
        this.isLoadingData = true;
        this.loading = true;
        this.loadingProgress = 0;
        this.loadedFiles = 0;
        this.loadingFiles = [];
        this.totalFiles = 3;

        this.updateLoadingStatus("Memuat file konfigurasi...", 10);

        // Load semua file JSON dengan cache busting
        const [configData, audioData, menusData] = await Promise.all([
          this.fetchJSONWithProgress(
            `${this.fecthBaseurl}config.json?_=${this.cacheTimestamp}`,
            "Config",
          ),
          this.fetchJSONWithProgress(
            `${this.fecthBaseurl}audio-files.json?_=${this.cacheTimestamp}`,
            "Audio Files",
          ),
          this.fetchJSONWithProgress(
            `${this.fecthBaseurl}menus.json?_=${this.cacheTimestamp}`,
            "Menus",
          ),
        ]);

        this.updateLoadingStatus("Memproses data...", 80);

        // Set data
        this.config = configData;
        this.audioFiles = audioData;
        this.menus = menusData;
        this.homeSlides = configData.homeCarousel || [];

        // Set global variables untuk kompatibilitas
        window.Config = this.config;
        window.AudioFiles = this.audioFiles;
        window.Menus = this.menus;
        window.HomeCarousel = this.homeSlides;

        this.updateLoadingStatus("Menyiapkan audio...", 90);

        // Update audio config jika audio sudah diinisialisasi
        this.updateAudioConfig();

        this.isReady = true;
        this.isLoadingData = false;
        this.loading = false;
        this.loadingProgress = 100;

        this.updateLoadingStatus("Selesai! ✓", 100);

        console.log("✅ Data loaded successfully");
        console.log("Config:", this.config);
        console.log("Menus:", this.menus.length);
        console.log("Audio files:", Object.keys(this.audioFiles).length);

        // Sembunyikan loading screen setelah delay kecil
        setTimeout(() => {
          this.loading = false;
        }, 500);
      } catch (error) {
        console.error("❌ Failed to load data:", error);
        this.isLoadingData = false;
        this.loading = false;
        this.isReady = false;
        this.loadingProgress = 0;
        this.updateLoadingStatus("Gagal memuat data!", 0);
      }
    },

    async fetchJSONWithProgress(url, label) {
      const startTime = Date.now();

      try {
        this.updateLoadingStatus(
          `Memuat ${label}...`,
          this.loadingProgress + 5,
        );

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        }

        const data = await response.json();

        // Simulasi delay untuk efek visual (minimal 300ms)
        const elapsed = Date.now() - startTime;
        if (elapsed < 300) {
          await new Promise((resolve) => setTimeout(resolve, 300 - elapsed));
        }

        this.loadedFiles++;
        this.loadingFiles.push(label);
        this.loadingProgress = Math.min(
          (this.loadedFiles / this.totalFiles) * 70,
          70,
        );

        this.updateLoadingStatus(
          `✅ ${label} selesai (${this.loadedFiles}/${this.totalFiles})`,
          this.loadingProgress,
        );

        return data;
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        this.updateLoadingStatus(
          `❌ Gagal memuat ${label}`,
          this.loadingProgress,
        );
        throw error;
      }
    },

    updateLoadingStatus(status, progress) {
      this.loadingStatus = status;
      if (progress !== undefined) {
        this.loadingProgress = Math.min(progress, 100);
      }
    },

    /*
    ======================================
    RELOAD DATA (Cache Update)
    ======================================
    */

    async reloadData() {
      // Update timestamp untuk cache busting
      this.cacheTimestamp = Date.now();

      // Reset state
      this.loading = true;
      this.isLoadingData = true;
      this.loadingProgress = 0;
      this.loadedFiles = 0;
      this.loadingFiles = [];

      this.updateLoadingStatus("Memulai refresh data...", 5);

      // Close any open modals
      this.closeAllModals();

      // Reload data
      await this.loadAllData();

      // Re-initialize components that depend on data
      if (this.isReady) {
        this.startHomeCarousel();
        this.preloadAudio();
      }

      // Show feedback via loading status
      if (this.isReady) {
        this.updateLoadingStatus("Data berhasil diperbarui! ✓", 100);
        // Reset loading setelah delay
        setTimeout(() => {
          this.loading = false;
        }, 800);
      } else {
        this.updateLoadingStatus("Gagal memperbarui data!", 0);
        setTimeout(() => {
          this.loading = false;
        }, 1500);
      }
    },

    /*
    ======================================
    THEME - DENGAN LOCALSTORAGE
    ======================================
    */

    loadTheme() {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "dark") {
        this.darkMode = true;
      } else if (savedTheme === "light") {
        this.darkMode = false;
      } else {
        this.darkMode = this.config && this.config.theme === "dark";
      }
    },

    toggleTheme() {
      this.darkMode = !this.darkMode;
      this.applyTheme();
      this.saveTheme();
    },

    applyTheme() {
      try {
        const html = document.documentElement;
        if (html) {
          if (this.darkMode) {
            html.classList.add("dark");
          } else {
            html.classList.remove("dark");
          }
        }
      } catch (error) {
        console.warn("Error applyTheme:", error);
      }
    },

    saveTheme() {
      try {
        localStorage.setItem("theme", this.darkMode ? "dark" : "light");
      } catch (error) {
        console.warn("Error saveTheme:", error);
      }
    },

    /*
    ======================================
    CLOCK
    ======================================
    */

    startClock() {
      const update = () => {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString("id-ID");
        this.currentDate = now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };

      update();
      setInterval(update, 1000);
    },

    /*
    ======================================
    HOME CAROUSEL
    ======================================
    */

    startHomeCarousel() {
      if (this.homeTimer) {
        clearInterval(this.homeTimer);
      }

      const interval = this.config ? this.config.carouselInterval : 5000;

      this.homeTimer = setInterval(() => {
        if (this.showModal || this.showSubMenuModal) return;
        this.nextHomeSlide();
      }, interval);
    },

    nextHomeSlide() {
      if (!this.homeSlides || this.homeSlides.length === 0) return;
      this.currentHomeSlide++;
      if (this.currentHomeSlide >= this.homeSlides.length) {
        this.currentHomeSlide = 0;
      }
    },

    previousHomeSlide() {
      if (!this.homeSlides || this.homeSlides.length === 0) return;
      this.currentHomeSlide--;
      if (this.currentHomeSlide < 0) {
        this.currentHomeSlide = this.homeSlides.length - 1;
      }
    },

    goHomeSlide(index) {
      this.currentHomeSlide = index;
    },

    /*
    ======================================
    IDLE
    ======================================
    */

    startIdleTimer() {
      this.resetIdleTimer();
    },

    resetIdleTimer() {
      clearTimeout(this.idleTimer);
      const timeout = this.config ? this.config.autoHome * 1000 : 60000;
      this.idleTimer = setTimeout(() => {
        if (this.showModal || this.showSubMenuModal) {
          this.closeAllModals();
        }
      }, timeout);
    },

    /*
    ======================================
    AUDIO PRELOAD
    ======================================
    */

    preloadAudio() {
      Audio.on("preload", ({ loaded, total }) => {
        this.preloadLoaded = loaded;
        this.preloadTotal = total;
        if (loaded >= total) {
          this.loading = false;
        }
      });

      Audio.preload();
    },

    /*
    ======================================
    AUDIO CALLBACK
    ======================================
    */

    registerAudioEvents() {
      Audio.on(
        "change",
        ({
          index,
          soundKey,
          type,
          requirementIndex,
          text,
          isIntro,
          introCount,
          totalIntro,
          isLastIntro,
        }) => {
          this.isIntroPlaying = isIntro || false;
          this.introCount = introCount || 0;
          this.totalIntro = totalIntro || 0;

          this.updateRequirement(index, {
            type,
            requirementIndex,
            isIntro: isIntro || false,
            isLastIntro: isLastIntro || false,
            text,
          });
        },
      );

      Audio.on("finish", () => {
        this.isPlaying = false;
        this.isIntroPlaying = false;
        this.introCount = this.totalIntro;

        if (this.selectedSubMenu) {
          this.currentRequirement = this.selectedSubMenu.requirements.length;
        }
      });

      Audio.on("stop", () => {
        this.isPlaying = false;
        this.isIntroPlaying = false;
      });

      Audio.on("intro-skipped", ({ skipped, introCount }) => {
        this.isIntroPlaying = false;
        this.introCount = introCount;
        this.totalIntro = introCount;
      });
    },

    /*
    ======================================
    UPDATE AUDIO CONFIG
    ======================================
    */

    updateAudioConfig() {
      if (window.Audio && typeof window.Audio.updateConfig === "function") {
        window.Audio.updateConfig();
      }
    },

    /*
    ======================================
    SKIP INTRO
    ======================================
    */

    skipIntro() {
      Audio.skipIntro();
    },

    /*
    ======================================
    RESET MODAL STATE
    ======================================
    */

    resetModalState() {
      this.showModal = false;
      this.selectedMenu = null;
      this.selectedSubMenu = null;
      this.currentRequirement = 0;
      this.currentImage = 0;
      this.isPlaying = false;
      this.isIntroPlaying = false;
      this.introCount = 0;
      this.totalIntro = 0;
      this.stopImageCarousel();
    },

    resetSubMenuModalState() {
      this.showSubMenuModal = false;
      this.selectedSubMenuParent = null;
    },

    closeAllModals() {
      Audio.stop();
      this.resetModalState();
      this.resetSubMenuModalState();
    },

    /*
    ======================================
    OPEN MENU - dengan sub-menu
    ======================================
    */

    openMenu(menu) {
      this.resetIdleTimer();
      Audio.stop();

      if (menu.subMenus && menu.subMenus.length > 0) {
        this.selectedSubMenuParent = menu;
        this.showSubMenuModal = true;
        this.showModal = false;
        return;
      }

      this.openSubMenu(menu, menu);
    },

    /*
    ======================================
    OPEN SUB MENU
    ======================================
    */

    openSubMenu(parentMenu, subMenu) {
      this.resetIdleTimer();
      Audio.stop();

      this.resetSubMenuModalState();
      this.resetModalState();

      this.$nextTick(() => {
        this.selectedMenu = parentMenu;
        this.selectedSubMenu = subMenu;
        this.showModal = true;
        this.currentRequirement = 0;
        this.currentImage = 0;
        this.isPlaying = false;
        this.isIntroPlaying = false;
        this.introCount = 0;
        this.totalIntro = subMenu.intro ? subMenu.intro.length : 0;

        this.startImageCarousel();

        if (subMenu.autoPlay) {
          this.playAudio();
        }
      });
    },

    /*
    ======================================
    CLOSE MODAL
    ======================================
    */

    closeModal() {
      Audio.stop();
      this.resetModalState();
    },

    closeSubMenuModal() {
      this.resetSubMenuModalState();
    },

    /*
    ======================================
    IMAGE CAROUSEL
    ======================================
    */

    startImageCarousel() {
      this.stopImageCarousel();

      const interval = this.config ? this.config.imageInterval : 20000;

      if (interval > 0) {
        this.imageTimer = setInterval(() => {
          this.nextImage();
        }, interval);
      }
    },

    stopImageCarousel() {
      if (this.imageTimer) {
        clearInterval(this.imageTimer);
        this.imageTimer = null;
      }
    },

    nextImage() {
      if (!this.selectedSubMenu) return;
      this.currentImage++;
      if (this.currentImage >= this.selectedSubMenu.images.length) {
        this.currentImage = 0;
      }
      this.resetIdleTimer();
    },

    previousImage() {
      if (!this.selectedSubMenu) return;
      this.currentImage--;
      if (this.currentImage < 0) {
        this.currentImage = this.selectedSubMenu.images.length - 1;
      }
      this.resetIdleTimer();
    },

    selectImage(index) {
      this.currentImage = index;
      this.resetIdleTimer();
      this.startImageCarousel();
    },

    /*
    ======================================
    PLAY AUDIO
    ======================================
    */

    playAudio() {
      if (!this.selectedSubMenu) return;

      this.currentRequirement = 0;
      this.isPlaying = true;
      this.isIntroPlaying = true;
      this.introCount = 0;
      this.totalIntro = this.selectedSubMenu.intro
        ? this.selectedSubMenu.intro.length
        : 0;

      Audio.play(this.selectedSubMenu);
    },

    /*
    ======================================
    REPLAY AUDIO
    ======================================
    */

    replayAudio() {
      if (!this.selectedSubMenu) return;
      Audio.stop();
      this.playAudio();
    },

    /*
    ======================================
    UPDATE REQUIREMENT
    ======================================
    */

    updateRequirement(index, payload) {
      if (!this.selectedSubMenu) return;

      if (payload && payload.isIntro) {
        return;
      }

      if (payload && payload.requirementIndex !== undefined) {
        const reqIndex = payload.requirementIndex;
        if (reqIndex < this.selectedSubMenu.requirements.length) {
          this.currentRequirement = reqIndex;
          this.scrollRequirement();
        }
      }
    },

    /*
    ======================================
    REQUIREMENT SCROLL
    ======================================
    */

    scrollRequirement() {
      setTimeout(() => {
        if (
          this.selectedSubMenu &&
          this.currentRequirement >= this.selectedSubMenu.requirements.length
        ) {
          const container = document.querySelector(
            ".overflow-y-auto.px-8.space-y-3",
          );
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
          }
          return;
        }

        const container = document.querySelector(
          ".overflow-y-auto.px-8.space-y-3",
        );
        if (!container) {
          const fallbackContainer = document.querySelector(
            '[class*="overflow-y-auto"]',
          );
          if (!fallbackContainer) return;
          container = fallbackContainer;
        }

        const activeElement = container.querySelector(
          `[data-requirement-index="${this.currentRequirement}"]`,
        );

        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    },

    /*
    ======================================
    GET SUB MENU TITLE
    ======================================
    */

    getSubMenuTitle() {
      if (!this.selectedSubMenuParent) return "";
      return this.selectedSubMenuParent.title;
    },

    getSubMenuIcon() {
      if (!this.selectedSubMenuParent) return "";
      return this.selectedSubMenuParent.icon;
    },

    /*
    ======================================
    KEYBOARD
    ======================================
    */

    onKeyDown(e) {
      if (this.showSubMenuModal) {
        if (e.key === "Escape") {
          this.closeSubMenuModal();
        }
        return;
      }

      if (!this.showModal) return;

      switch (e.key) {
        case "Escape":
          this.closeModal();
          break;
        case "ArrowLeft":
          this.previousImage();
          break;
        case "ArrowRight":
          this.nextImage();
          break;
        case " ":
          e.preventDefault();
          if (this.isIntroPlaying) {
            this.skipIntro();
          } else {
            this.replayAudio();
          }
          break;
      }
    },
  },
});

window.vm = app.mount("#app");
