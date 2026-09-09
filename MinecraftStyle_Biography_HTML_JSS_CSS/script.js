/* ============================================================
   Kobe D. Basanal — Portfolio Shared Script
   ============================================================ */

(function () {
    const themeBtn = document.getElementById('themeBtn');
    const glitchOverlay = document.getElementById('glitchOverlay');
    const glitchTitle = document.querySelector('.glitch-title');
    const originalTitle = glitchTitle ? glitchTitle.getAttribute('data-text') : '';
    const scrambleChars = '▓▒░█▌▐╬╫╪░#%&';

    let inNether = document.body.classList.contains('nether-mode');
    let switching = false;

    /* ---------- Achievement Toast (Minecraft-style pop-up) ---------- */
    function showAchievement(icon, title, subtitle) {
        const toast = document.getElementById('achievementToast');
        if (!toast) return;
        toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${title}${subtitle ? '<br><span style="opacity:.75;font-size:0.85em;">' + subtitle + '</span>' : ''}</span>`;
        toast.classList.remove('show');
        void toast.offsetWidth; // force reflow so the animation can replay
        toast.classList.add('show');
    }
    window.showAchievement = showAchievement;

    // Welcome toast on page load, customizable per page via data-attributes on <body>
    const welcomeIcon = document.body.dataset.toastIcon || '🏆';
    const welcomeTitle = document.body.dataset.toastTitle || 'ACHIEVEMENT UNLOCKED!';
    const welcomeSub = document.body.dataset.toastSub || 'Welcome to my portfolio';
    setTimeout(() => showAchievement(welcomeIcon, welcomeTitle, welcomeSub), 850);
    window.particleChar = inNether ? '🔥' : '⚡';
    window.particleGlow = inNether ? '#ff7a1a' : '#38bdf8';
    window.particleFill = inNether ? '#ffb703' : '#22d3ee';

    function randRange(min, max) { return Math.random() * (max - min) + min; }

    function spawnGlitchRing(x, y) {
        const ring = document.createElement('div');
        ring.className = 'glitch-ring';
        ring.style.left = x + 'px';
        ring.style.top = y + 'px';
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 950);
    }

    function spawnGlitchSlices(count) {
        const slices = [];
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'glitch-slice';
            const top = randRange(0, 100);
            const height = randRange(1.2, 6);
            const shift = randRange(-45, 45);
            const hue = Math.random() < 0.5 ? 'rgba(255,90,20,0.55)' : 'rgba(176,107,255,0.5)';
            el.style.top = top + 'vh';
            el.style.height = height + 'vh';
            el.style.background = hue;
            el.style.transform = `translateX(${shift}px)`;
            document.body.appendChild(el);
            slices.push(el);
        }
        return slices;
    }

    function scrambleTitle(durationMs) {
        if (!glitchTitle) return;
        glitchTitle.classList.add('scrambling');
        const start = performance.now();
        function frame(now) {
            const t = now - start;
            if (t >= durationMs) {
                glitchTitle.textContent = originalTitle;
                glitchTitle.setAttribute('data-text', originalTitle);
                glitchTitle.classList.remove('scrambling');
                return;
            }
            let out = '';
            for (let i = 0; i < originalTitle.length; i++) {
                const ch = originalTitle[i];
                if (ch === ' ') { out += ' '; continue; }
                out += Math.random() < 0.55 ? scrambleChars[Math.floor(Math.random() * scrambleChars.length)] : ch;
            }
            glitchTitle.textContent = out;
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function triggerRealmSwitch(originEl) {
        if (switching) return;
        switching = true;

        const rect = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        glitchOverlay.classList.add('active');
        document.body.classList.add('screen-shake');
        spawnGlitchRing(originX, originY);
        scrambleTitle(750);

        let sliceBatches = [];
        const burst1 = spawnGlitchSlices(9);
        sliceBatches.push(setTimeout(() => spawnGlitchSlices(7).forEach(s => sliceBatches.push(s)), 180));
        sliceBatches.push(setTimeout(() => spawnGlitchSlices(6).forEach(s => sliceBatches.push(s)), 380));

        // Flip realm state mid-glitch so the "reveal" happens inside the noise
        setTimeout(() => {
            inNether = !inNether;
            document.body.classList.toggle('nether-mode', inNether);
            if (themeBtn) themeBtn.textContent = inNether ? '🌳 RETURN HOME' : '🔥 ENTER NETHER';
            window.particleChar = inNether ? '🔥' : '⚡';
            window.particleGlow = inNether ? '#ff7a1a' : '#38bdf8';
            window.particleFill = inNether ? '#ffb703' : '#22d3ee';
            showAchievement(
                inNether ? '🌋' : '🌳',
                'ACHIEVEMENT UNLOCKED!',
                inNether ? 'Entered the Nether Realm' : 'Returned to the Overworld'
            );
        }, 340);

        setTimeout(() => {
            glitchOverlay.classList.remove('active');
            document.body.classList.remove('screen-shake');
            document.querySelectorAll('.glitch-slice').forEach(s => s.remove());
            switching = false;
        }, 900);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => triggerRealmSwitch(themeBtn));
    }

    window.triggerRealmSwitch = triggerRealmSwitch;

    /* ---------- Tabs (used on pages that still have in-page tab decks) ---------- */
    window.openTab = function (tabName, evt) {
        const contents = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-btn');
        contents.forEach(content => content.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('active'));
        const target = document.getElementById(tabName);
        if (target) target.classList.add('active');
        if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
    };

    window.triggerPing = function () {
        alert(inNether
            ? "Ping echoes across the Nether. Thanks for visiting Kobe's portfolio."
            : "Ping acknowledged. Thanks for visiting Kobe's profile.");
    };

    /* ---------- Falling Lightning / Ember Bolts ---------- */
    const lightningEmojis = ['⚡', '🌩️', '⚡', '✨'];
    const lightningContainer = document.getElementById('falling-lightning');
    if (lightningContainer) {
        const boltCount = 30;
        for (let i = 0; i < boltCount; i++) {
            const bolt = document.createElement('div');
            bolt.innerText = lightningEmojis[Math.floor(Math.random() * lightningEmojis.length)];
            bolt.className = 'falling-bolt';
            bolt.style.left = Math.random() * 100 + 'vw';
            bolt.style.animationDuration = (Math.random() * 5 + 4) + 's';
            bolt.style.animationDelay = (Math.random() * 8) + 's';
            bolt.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
            lightningContainer.appendChild(bolt);
        }
    }

    /* ---------- Mouse Cursor Spark / Ember Trail ---------- */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class SparkParticle {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.size = Math.random() * 10 + 6;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.opacity = 1;
                this.char = window.particleChar;
                this.glow = window.particleGlow;
                this.fill = window.particleFill;
            }
            update() { this.x += this.speedX; this.y += this.speedY; this.opacity -= 0.03; }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.shadowBlur = 12;
                ctx.shadowColor = this.glow;
                ctx.fillStyle = this.fill;
                ctx.font = `${this.size}px monospace`;
                ctx.fillText(this.char, this.x, this.y);
                ctx.restore();
            }
        }

        window.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.4) particles.push(new SparkParticle(e.clientX, e.clientY));
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].opacity <= 0) { particles.splice(i, 1); i--; }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ---------- Chibi Speech Bubbles & Dragging ---------- */
    let activeTimeout;
    window.talkChibi = function (element, message) {
        document.querySelectorAll('.chibi-avatar').forEach(c => c.classList.remove('active-bubble'));
        element.classList.add('active-bubble');
        element.style.transform = 'translateY(-20px) scale(1.1)';
        setTimeout(() => { element.style.transform = ''; }, 300);
        clearTimeout(activeTimeout);
        activeTimeout = setTimeout(() => element.classList.remove('active-bubble'), 3000);
    };

    document.querySelectorAll('.chibi-avatar').forEach(chibi => {
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        chibi.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target.closest('.chibi-avatar') === chibi) {
                isDragging = true;
                chibi.style.animation = 'none';
            }
        }
        function dragEnd() { initialX = currentX; initialY = currentY; isDragging = false; }
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                chibi.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }
    });
})();
