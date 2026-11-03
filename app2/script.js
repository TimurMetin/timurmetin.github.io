// DESIGN
const DESIGN = {
    capacity: 100,
    startLevel: 80,
    drainRatePerSecond: 5,
    addAmount: 10,
    timings: {
        ackDurationMs: 150 // Oyun hissiyatı için parıltı süresi kısaltıldı
    }
};

// STATE
let state = {
    level: DESIGN.startLevel,
    isRunning: false,
    feedbackMode: 'full', 
    lastTime: null,
    animationFrameId: null,
    isRevealed: false
};

// INPUT
const input = {
    init() {
        document.getElementById('btn-add').addEventListener('click', () => rule.addLevel());
        document.getElementById('btn-start').addEventListener('click', () => rule.start());
        document.getElementById('btn-pause').addEventListener('click', () => rule.pause());
        document.getElementById('btn-reset').addEventListener('click', () => rule.reset());
        document.getElementById('btn-reveal').addEventListener('click', () => rule.reveal());

        document.querySelectorAll('input[name="mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.feedbackMode = e.target.value;
                rule.reset();
            });
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) rule.pause();
        });
    }
};

// RULE
const rule = {
    addLevel() {
        state.level = Math.min(DESIGN.capacity, state.level + DESIGN.addAmount);
        output.acknowledgeInput();
        if (!state.isRunning) output.render();
    },
    start() {
        if (state.isRunning) return; 
        state.isRunning = true;
        state.lastTime = performance.now();
        this.tick(performance.now());
        output.render();
    },
    pause() {
        state.isRunning = false;
        if (state.animationFrameId) {
            cancelAnimationFrame(state.animationFrameId);
            state.animationFrameId = null;
        }
        output.render();
    },
    reset() {
        this.pause();
        state.level = DESIGN.startLevel;
        state.isRevealed = false;
        output.render();
    },
    reveal() {
        state.isRevealed = true;
        output.render();
    },
    tick(currentTime) {
        if (!state.isRunning) return;

        const deltaTime = (currentTime - state.lastTime) / 1000;
        state.lastTime = currentTime;

        state.level -= DESIGN.drainRatePerSecond * deltaTime;
        if (state.level <= 0) {
            state.level = 0;
            this.pause();
        }

        output.render();
        state.animationFrameId = requestAnimationFrame((time) => this.tick(time));
    }
};

// OUTPUT
const output = {
    render() {
        const liquid = document.getElementById('indigo-liquid');
        const levelText = document.getElementById('level-text');
        const statusText = document.getElementById('status-text');
        const shutter = document.getElementById('blind-shutter');
        const revealBtn = document.getElementById('btn-reveal');
        
        // Hoca kuralı: 0 ve sınırların mantıksal gösterimi
        let statusStr = state.level === 0 ? 'EMPTY' : (state.isRunning ? 'DRAINING' : 'PAUSED');
        
        // CSS ile sıvı yüksekliğini ayarla
        liquid.style.height = `${state.level}%`;
        
        if (state.feedbackMode === 'full' || state.isRevealed) {
            shutter.hidden = true;
            revealBtn.hidden = true;
            levelText.textContent = Math.round(state.level);
            statusText.textContent = statusStr;
        } else {
            // Blind Mode (Kör Uçuş)
            shutter.hidden = false;
            revealBtn.hidden = false;
            levelText.textContent = "???";
            statusText.textContent = "BLIND";
        }
    },
    acknowledgeInput() {
        const btn = document.getElementById('btn-add');
        const ackText = document.getElementById('action-ack');
        
        // Buton efektini tetikle
        btn.classList.add('pressed');
        ackText.textContent = "+10 PUMPED";
        
        setTimeout(() => {
            btn.classList.remove('pressed');
            ackText.textContent = "";
        }, DESIGN.timings.ackDurationMs);
    }
};

input.init();
output.render();