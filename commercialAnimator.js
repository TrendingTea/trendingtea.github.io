// Kinetic Commercial & Teaser Animation Engine for "What the Prompt"

class CommercialAnimator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isPlaying = false;
    this.currentStep = 0;
    this.timer = null;
    this.voiceEnabled = true;
    this.script = window.SHOW_DATA.COMMERCIAL_TEASER_SCRIPT;
  }

  start() {
    if (!this.container) return;
    this.stop();
    this.isPlaying = true;
    this.currentStep = 0;
    window.studioAudio.init();
    window.studioAudio.resume();

    this.container.classList.remove('hidden');
    this.container.classList.add('flex');

    this.renderNextStep();
  }

  renderNextStep() {
    if (!this.isPlaying) return;

    if (this.currentStep >= this.script.length) {
      // Loop or finish
      this.timer = setTimeout(() => {
        this.currentStep = 0;
        this.renderNextStep();
      }, 2500);
      return;
    }

    const step = this.script[this.currentStep];
    const duration = (this.currentStep < this.script.length - 1) 
      ? (this.script[this.currentStep + 1].time - step.time) * 1000 
      : 3000;

    // Trigger Audio Stinger
    if (step.stinger) {
      if (step.stinger === 'bass_drop') window.studioAudio.playBassDrop();
      else if (step.stinger === 'angst_strobe') window.studioAudio.playAngstStrobe();
      else if (step.stinger === 'glitch_riser') window.studioAudio.playGlitchRiser();
      else if (step.stinger === 'mic_drop') window.studioAudio.playMicDrop();
      else if (step.stinger === 'tape_stop') window.studioAudio.playTapeStop();
      else if (step.stinger === 'airhorn') window.studioAudio.playAirhorn();
      else if (step.stinger === 'gavel') window.studioAudio.playGavel();
    }

    // Trigger Voiceover
    if (this.voiceEnabled && step.voiceText) {
      window.studioAudio.speakKineticLine(step.voiceText, 1.0, 0.88);
    }

    // Flash and Shake Screen
    this.flashBackground(step.flashColor);

    // Update Visuals
    const textEl = document.getElementById('commercial-headline');
    const subTextEl = document.getElementById('commercial-subhead');
    const progressEl = document.getElementById('commercial-progress');

    if (textEl) {
      textEl.innerText = step.visualText;
      textEl.className = `font-black tracking-tighter leading-none text-center transform transition-all duration-150 scale-100 ${this.getTextStyleClass(this.currentStep)}`;
      // Re-trigger CSS animation
      textEl.style.animation = 'none';
      textEl.offsetHeight; // reflow
      textEl.style.animation = 'kineticPunch 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    }

    if (subTextEl) {
      subTextEl.innerText = step.subText || '';
    }

    if (progressEl) {
      const pct = ((this.currentStep + 1) / this.script.length) * 100;
      progressEl.style.width = `${pct}%`;
    }

    this.currentStep++;
    this.timer = setTimeout(() => {
      this.renderNextStep();
    }, Math.max(duration, 1200));
  }

  getTextStyleClass(stepIdx) {
    switch (stepIdx) {
      case 0: return 'text-7xl md:text-9xl text-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.8)]';
      case 1: return 'text-7xl md:text-9xl text-cyan-400 drop-shadow-[0_0_35px_rgba(34,211,238,0.8)]';
      case 2: return 'text-6xl md:text-8xl text-purple-400 drop-shadow-[0_0_35px_rgba(192,132,252,0.8)]';
      case 3: return 'text-5xl md:text-7xl text-pink-400 drop-shadow-[0_0_30px_rgba(244,114,182,0.8)]';
      case 4: return 'text-5xl md:text-8xl text-rose-600 drop-shadow-[0_0_40px_rgba(225,29,72,0.9)]';
      case 5: return 'text-4xl md:text-6xl text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]';
      case 6: return 'text-7xl md:text-9xl text-white drop-shadow-[0_0_50px_rgba(255,255,255,1)]';
      case 7: return 'text-5xl md:text-7xl text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.8)]';
      default: return 'text-6xl text-white';
    }
  }

  flashBackground(color) {
    const flashOverlay = document.getElementById('commercial-flash');
    if (flashOverlay) {
      flashOverlay.style.backgroundColor = color || '#ffffff';
      flashOverlay.style.opacity = '0.35';
      setTimeout(() => {
        flashOverlay.style.opacity = '0';
      }, 120);
    }

    const wrapper = document.getElementById('commercial-wrapper');
    if (wrapper) {
      wrapper.classList.add('shake-anim');
      setTimeout(() => {
        wrapper.classList.remove('shake-anim');
      }, 150);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (this.container) {
      this.container.classList.add('hidden');
      this.container.classList.remove('flex');
    }
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    return this.voiceEnabled;
  }
}

window.commercialAnimator = new CommercialAnimator('commercial-modal');
