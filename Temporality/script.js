const DESIGN = {
    canvasWidth: 400,
    canvasHeight: 300,
    playerSize: 20,
    playerSpeed: 150,
    switchSize: 40,
    maxRecordTimeMs: 15000,
    colors: {
        bg: '#0d0d14',
        player: '#00ffff',
        echo: 'rgba(255, 0, 255, 0.6)',
        switchOff: 'transparent',
        switchOn: '#00ffff',
        switchBorder: '#556'
    },
    startPos: { x: 200, y: 250 },
    switches: {
        a: { x: 80, y: 80 },
        b: { x: 320, y: 80 }
    }
};

let state = {
    phase: 'IDLE',
    player: { x: DESIGN.startPos.x, y: DESIGN.startPos.y },
    echo: { x: DESIGN.startPos.x, y: DESIGN.startPos.y, isVisible: false },
    switches: {
        a: { active: false },
        b: { active: false }
    },
    doorOpen: false,
    lastFrameTime: 0,
    phaseStartTime: 0,
    currentElapsedTime: 0,
    history: [],
    keys: { up: false, down: false, left: false, right: false },
    isPaused: false,
    animationFrameId: null
};

const input = {
    init() {
        window.addEventListener('keydown', (e) => this.handleKey(e.key, true));
        window.addEventListener('keyup', (e) => this.handleKey(e.key, false));
        
        document.getElementById('btn-action').addEventListener('click', () => rule.togglePhase());
        document.getElementById('btn-reset').addEventListener('click', () => rule.reset());

        this.bindDpad('btn-up', 'up');
        this.bindDpad('btn-down', 'down');
        this.bindDpad('btn-left', 'left');
        this.bindDpad('btn-right', 'right');

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                state.isPaused = true;
            } else {
                state.isPaused = false;
                state.lastFrameTime = performance.now();
                rule.loop(performance.now());
            }
        });
    },
    handleKey(key, isPressed) {
        const k = key.toLowerCase();
        if (k === 'w' || k === 'arrowup') state.keys.up = isPressed;
        if (k === 's' || k === 'arrowdown') state.keys.down = isPressed;
        if (k === 'a' || k === 'arrowleft') state.keys.left = isPressed;
        if (k === 'd' || k === 'arrowright') state.keys.right = isPressed;
        
        if (k === ' ' && isPressed) rule.togglePhase();
    },
    bindDpad(btnId, direction) {
        const btn = document.getElementById(btnId);
        btn.addEventListener('mousedown', () => state.keys[direction] = true);
        btn.addEventListener('mouseup', () => state.keys[direction] = false);
        btn.addEventListener('mouseleave', () => state.keys[direction] = false);
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); state.keys[direction] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); state.keys[direction] = false; });
    }
};

const rule = {
    start() {
        state.lastFrameTime = performance.now();
        this.loop(performance.now());
    },
    togglePhase() {
        if (state.phase === 'IDLE') {
            state.phase = 'RECORDING';
            state.history = [];
            state.phaseStartTime = performance.now();
            document.getElementById('instruction-text').textContent = "Recording... Stand on a switch, then press Loop.";
        } else if (state.phase === 'RECORDING') {
            state.phase = 'PLAYING';
            state.phaseStartTime = performance.now();
            state.player = { x: DESIGN.startPos.x, y: DESIGN.startPos.y };
            state.echo.isVisible = true;
            document.getElementById('instruction-text').textContent = "Looping! Your past self (Echo) will repeat your actions. Go to the other switch!";
        }
    },
    reset() {
        state.phase = 'IDLE';
        state.history = [];
        state.player = { x: DESIGN.startPos.x, y: DESIGN.startPos.y };
        state.echo.isVisible = false;
        state.doorOpen = false;
        state.currentElapsedTime = 0;
        document.getElementById('instruction-text').textContent = "Timeline reset. Press Record to start a new loop.";
    },
    checkCollision(rect1, rect2Size, rect2Pos) {
        return (
            rect1.x < rect2Pos.x + rect2Size &&
            rect1.x + DESIGN.playerSize > rect2Pos.x &&
            rect1.y < rect2Pos.y + rect2Size &&
            rect1.y + DESIGN.playerSize > rect2Pos.y
        );
    },
    loop(currentTime) {
        if (state.isPaused) return;

        const deltaTime = (currentTime - state.lastFrameTime) / 1000;
        state.lastFrameTime = currentTime;

        let moveDist = DESIGN.playerSpeed * deltaTime;
        if (state.keys.up) state.player.y = Math.max(0, state.player.y - moveDist);
        if (state.keys.down) state.player.y = Math.min(DESIGN.canvasHeight - DESIGN.playerSize, state.player.y + moveDist);
        if (state.keys.left) state.player.x = Math.max(0, state.player.x - moveDist);
        if (state.keys.right) state.player.x = Math.min(DESIGN.canvasWidth - DESIGN.playerSize, state.player.x + moveDist);

        if (state.phase === 'RECORDING' || state.phase === 'PLAYING') {
            state.currentElapsedTime = currentTime - state.phaseStartTime;
        }

        if (state.phase === 'RECORDING') {
            state.history.push({ 
                time: state.currentElapsedTime, 
                x: state.player.x, 
                y: state.player.y 
            });

            if (state.currentElapsedTime >= DESIGN.maxRecordTimeMs) {
                this.togglePhase();
            }
        } 
        else if (state.phase === 'PLAYING') {
            let echoState = state.history.find(h => h.time >= state.currentElapsedTime);
            if (echoState) {
                state.echo.x = echoState.x;
                state.echo.y = echoState.y;
            } else {
                state.phaseStartTime = currentTime;
            }
        }

        let s1 = DESIGN.switches.a;
        let s2 = DESIGN.switches.b;
        
        state.switches.a.active = false;
        state.switches.b.active = false;

        if (this.checkCollision(state.player, DESIGN.switchSize, s1)) state.switches.a.active = true;
        if (this.checkCollision(state.player, DESIGN.switchSize, s2)) state.switches.b.active = true;

        if (state.echo.isVisible) {
            if (this.checkCollision(state.echo, DESIGN.switchSize, s1)) state.switches.a.active = true;
            if (this.checkCollision(state.echo, DESIGN.switchSize, s2)) state.switches.b.active = true;
        }

        if (state.switches.a.active && state.switches.b.active) {
            state.doorOpen = true;
            document.getElementById('instruction-text').textContent = "PARADOX SOLVED! The Door is Open.";
        } else {
            state.doorOpen = false;
        }

        output.render();
        state.animationFrameId = requestAnimationFrame((time) => this.loop(time));
    }
};

const output = {
    render() {
        document.getElementById('phase-text').textContent = state.phase;
        document.getElementById('time-text').textContent = (state.currentElapsedTime / 1000).toFixed(1) + 's';
        
        const doorEl = document.getElementById('door-text');
        if (state.doorOpen) {
            doorEl.textContent = "OPEN";
            doorEl.style.color = "#00ff00";
        } else {
            doorEl.textContent = "LOCKED";
            doorEl.style.color = "#ff4444";
        }

        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = DESIGN.colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.drawSwitch(ctx, DESIGN.switches.a, state.switches.a.active, "A");
        this.drawSwitch(ctx, DESIGN.switches.b, state.switches.b.active, "B");

        if (state.echo.isVisible) {
            ctx.fillStyle = DESIGN.colors.echo;
            ctx.fillRect(state.echo.x, state.echo.y, DESIGN.playerSize, DESIGN.playerSize);
        }

        ctx.fillStyle = DESIGN.colors.player;
        ctx.fillRect(state.player.x, state.player.y, DESIGN.playerSize, DESIGN.playerSize);
    },
    
    drawSwitch(ctx, pos, isActive, label) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = DESIGN.colors.switchBorder;
        
        if (isActive) {
            ctx.fillStyle = DESIGN.colors.switchOn;
            ctx.fillRect(pos.x, pos.y, DESIGN.switchSize, DESIGN.switchSize);
            ctx.fillStyle = DESIGN.colors.bg;
        } else {
            ctx.fillStyle = DESIGN.colors.switchOff;
            ctx.fillRect(pos.x, pos.y, DESIGN.switchSize, DESIGN.switchSize);
            ctx.strokeRect(pos.x, pos.y, DESIGN.switchSize, DESIGN.switchSize);
            ctx.fillStyle = '#889';
        }
        
        ctx.font = "12px Courier New";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(isActive ? "ON" : "OFF", pos.x + DESIGN.switchSize/2, pos.y + DESIGN.switchSize/2);
    }
};

input.init();
rule.start();