/*************************************************
 * ADVANCED DSA VISUALIZER - ENGINE & AUDIO SYNTHESIZER
 *************************************************/

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playPitch(val, minVal = 10, maxVal = 100, duration = 0.08) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // Map array value to audio frequency (200Hz to 1200Hz)
            const minFreq = 200;
            const maxFreq = 1100;
            const freq = minFreq + ((val - minVal) / (maxVal - minVal || 1)) * (maxFreq - minFreq);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context error fallback
        }
    }
}

class VisualizerEngine {
    constructor() {
        this.audio = new AudioEngine();
        this.speed = 300; // ms
        this.isPlaying = false;
        this.isPaused = false;
        this.isStopped = false;
        this.history = [];
        this.stepIndex = -1;
        
        // Metrics
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = null;
        this.timerInterval = null;

        // UI references
        this.playBtn = null;
        this.pauseBtn = null;
        this.stepFwdBtn = null;
        this.stepBackBtn = null;
    }

    setSpeed(ms) {
        this.speed = Math.max(10, Math.min(1000, ms));
    }

    resetMetrics() {
        this.comparisons = 0;
        this.swaps = 0;
        this.stepIndex = -1;
        this.history = [];
        this.updateMetricsUI();
        this.stopTimer();
        document.getElementById("metric-time").innerText = "0.0s";
    }

    startTimer() {
        this.stopTimer();
        this.startTime = performance.now();
        this.timerInterval = setInterval(() => {
            if (this.isPlaying && !this.isPaused) {
                const elapsed = ((performance.now() - this.startTime) / 1000).toFixed(1);
                document.getElementById("metric-time").innerText = `${elapsed}s`;
            }
        }, 100);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    addComparison() {
        this.comparisons++;
        this.updateMetricsUI();
    }

    addSwap() {
        this.swaps++;
        this.updateMetricsUI();
    }

    updateMetricsUI() {
        const compEl = document.getElementById("metric-comparisons");
        const swapEl = document.getElementById("metric-swaps");
        const stepEl = document.getElementById("metric-steps");

        if (compEl) compEl.innerText = this.comparisons;
        if (swapEl) swapEl.innerText = this.swaps;
        if (stepEl) stepEl.innerText = Math.max(0, this.stepIndex + 1);
    }

    async recordFrame(snapshot, renderCallback) {
        this.history.push({ snapshot, renderCallback });
        this.stepIndex = this.history.length - 1;
        this.updateMetricsUI();

        if (renderCallback) {
            renderCallback(snapshot);
        }

        await this.delay();
    }

    async delay() {
        if (this.isStopped) throw new Error("STOPPED");
        
        while (this.isPaused && !this.isStopped) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        if (this.isStopped) throw new Error("STOPPED");

        await new Promise(resolve => setTimeout(resolve, this.speed));
    }

    pause() {
        this.isPaused = true;
        this.isPlaying = false;
        this.updateControlsUI();
    }

    resume() {
        this.isPaused = false;
        this.isPlaying = true;
        this.updateControlsUI();
    }

    stop() {
        this.isStopped = true;
        this.isPlaying = false;
        this.isPaused = false;
        this.stopTimer();
        this.updateControlsUI();
    }

    stepForward() {
        if (this.stepIndex < this.history.length - 1) {
            this.stepIndex++;
            const item = this.history[this.stepIndex];
            if (item && item.renderCallback) {
                item.renderCallback(item.snapshot);
            }
            this.updateMetricsUI();
        }
    }

    stepBackward() {
        if (this.stepIndex > 0) {
            this.stepIndex--;
            const item = this.history[this.stepIndex];
            if (item && item.renderCallback) {
                item.renderCallback(item.snapshot);
            }
            this.updateMetricsUI();
        }
    }

    updateControlsUI() {
        const playBtn = document.getElementById("btn-play");
        if (playBtn) {
            if (this.isPlaying) {
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
                playBtn.className = "btn btn-secondary";
            } else {
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
                playBtn.className = "btn btn-primary";
            }
        }
    }
}

// Global Engine Instance
const engine = new VisualizerEngine();
