const app = Vue.createApp({
  data() {
    return {
      config: Config,
      menus: Menus,
      homeSlides: HomeCarousel,
      audioFiles: AudioFiles,

      // ==========================
      // APP
      // ==========================

      isReady: false,
      loading: true,

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
      currentRequirement: 0,
      currentImage: 0,
      imageTimer: null,

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

    init() {
      this.$nextTick(() => {
        // ⬅️ LOAD THEME DARI LOCALSTORAGE
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
    THEME - DENGAN LOCALSTORAGE
    ======================================
    */

    loadTheme() {
      // Cek localStorage
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "dark") {
        this.darkMode = true;
      } else if (savedTheme === "light") {
        this.darkMode = false;
      } else {
        // Jika tidak ada di localStorage, gunakan dari Config
        this.darkMode = Config.theme === "dark";
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

      this.homeTimer = setInterval(() => {
        if (this.showModal) return;
        this.nextHomeSlide();
      }, Config.carouselInterval);
    },

    nextHomeSlide() {
      this.currentHomeSlide++;
      if (this.currentHomeSlide >= this.homeSlides.length) {
        this.currentHomeSlide = 0;
      }
    },

    previousHomeSlide() {
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
      this.idleTimer = setTimeout(() => {
        if (this.showModal) {
          this.closeModal();
        }
      }, Config.autoHome * 1000);
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

        if (this.selectedMenu) {
          this.currentRequirement = this.selectedMenu.requirements.length;
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
      this.currentRequirement = 0;
      this.currentImage = 0;
      this.isPlaying = false;
      this.isIntroPlaying = false;
      this.introCount = 0;
      this.totalIntro = 0;
      this.stopImageCarousel();
    },

    /*
    ======================================
    OPEN MENU
    ======================================
    */

    openMenu(menu) {
      this.resetIdleTimer();
      Audio.stop();

      this.resetModalState();

      this.$nextTick(() => {
        this.selectedMenu = menu;
        this.showModal = true;
        this.currentRequirement = 0;
        this.currentImage = 0;
        this.isPlaying = false;
        this.isIntroPlaying = false;
        this.introCount = 0;
        this.totalIntro = menu.intro ? menu.intro.length : 0;

        this.startImageCarousel();

        if (menu.autoPlay) {
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

    /*
    ======================================
    IMAGE CAROUSEL
    ======================================
    */

    startImageCarousel() {
      this.stopImageCarousel();

      if (Config.imageInterval > 0) {
        this.imageTimer = setInterval(() => {
          this.nextImage();
        }, Config.imageInterval);
      }
    },

    stopImageCarousel() {
      if (this.imageTimer) {
        clearInterval(this.imageTimer);
        this.imageTimer = null;
      }
    },

    nextImage() {
      if (!this.selectedMenu) return;
      this.currentImage++;
      if (this.currentImage >= this.selectedMenu.images.length) {
        this.currentImage = 0;
      }
      this.resetIdleTimer();
    },

    previousImage() {
      if (!this.selectedMenu) return;
      this.currentImage--;
      if (this.currentImage < 0) {
        this.currentImage = this.selectedMenu.images.length - 1;
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
      if (!this.selectedMenu) return;

      this.currentRequirement = 0;
      this.isPlaying = true;
      this.isIntroPlaying = true;
      this.introCount = 0;
      this.totalIntro = this.selectedMenu.intro
        ? this.selectedMenu.intro.length
        : 0;

      Audio.play(this.selectedMenu);
    },

    /*
    ======================================
    REPLAY AUDIO
    ======================================
    */

    replayAudio() {
      if (!this.selectedMenu) return;
      Audio.stop();
      this.playAudio();
    },

    /*
    ======================================
    UPDATE REQUIREMENT
    ======================================
    */

    updateRequirement(index, payload) {
      if (!this.selectedMenu) return;

      if (payload && payload.isIntro) {
        return;
      }

      if (payload && payload.requirementIndex !== undefined) {
        const reqIndex = payload.requirementIndex;
        if (reqIndex < this.selectedMenu.requirements.length) {
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
          this.selectedMenu &&
          this.currentRequirement >= this.selectedMenu.requirements.length
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
    KEYBOARD
    ======================================
    */

    onKeyDown(e) {
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
