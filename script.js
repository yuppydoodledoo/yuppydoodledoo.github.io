window.addEventListener("DOMContentLoaded", () => {
    // 1. Existing Navbar/Wrapper logic
    const nav = document.querySelector('.navbar');
    const wrapper = document.querySelector('.wrapper');

    if (nav) nav.classList.add("nav-entrance");
    if (wrapper) wrapper.classList.add("content-entrance");

    // 2. Flowers.
    const petalCount = 6;
    // Soft two-tone pastels: [petal edge colour, petal highlight/glow]
    const palettes = [
        ['#ff9ec4', '#ffe1f0'],  // pink
        ['#c79bf2', '#efe0ff'],  // lavender
        ['#ff8fb0', '#ffd6e2'],  // rose
        ['#9db8ff', '#e0eaff'],  // periwinkle
        ['#ffb38a', '#ffe6d3'],  // peach
    ];

    // Build one flower head (petals + centre), optionally with a stem.
    function buildFlower(edge, glow, delayBase, withStem) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        if (withStem) {
            const stem = document.createElement('div');
            stem.className = 'stem';
            const leaf = document.createElement('div');
            leaf.className = 'stem-leaf';
            stem.appendChild(leaf);
            flower.appendChild(stem);
        }
        for (let j = 0; j < petalCount; j++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.setProperty('--rotation', `${j * (360 / petalCount)}deg`);
            petal.style.setProperty('--delay', `${(delayBase + j * 0.05).toFixed(2)}s`);
            petal.style.setProperty('--edge', edge);
            petal.style.setProperty('--glow', glow);
            flower.appendChild(petal);
        }
        const core = document.createElement('div');
        core.className = 'core';
        core.style.setProperty('--delay', `${(delayBase + petalCount * 0.05).toFixed(2)}s`);
        flower.appendChild(core);
        return flower;
    }

    // 2a. Fixed corner garden — four flowers that grow and bloom once on load.
    const corner = document.getElementById('corner-garden');
    if (corner) {
        for (let i = 0; i < 4; i++) {
            const [edge, glow] = palettes[i % palettes.length];
            const flower = buildFlower(edge, glow, i * 0.22, true);
            flower.classList.add(`flower-${i + 1}`);
            corner.appendChild(flower);
        }
        requestAnimationFrame(() => requestAnimationFrame(() => {
            corner.classList.add('grown');
            corner.classList.add('in');
        }));
    }

    // 2b. Cursor trail — a flower blooms wherever the mouse comes to rest,
    //     but only over empty page background, never on top of text/images.
    const garden = document.getElementById('garden');
    if (!garden) return; // Safety check

    const SETTLE = 260;      // ms the mouse must hold still before a flower blooms
    const LIFETIME = 2600;   // ms fully bloomed before it starts to fade
    const FADE = 1000;       // ms fade-out (matches the .flower opacity transition)
    const MAX_FLOWERS = 24;  // safety cap on how many exist at once
    const live = [];

    // The overlays are pointer-events:none, so elementFromPoint sees straight
    // through them. A point is "empty" only when the topmost thing there is the
    // page background itself — never a paragraph, link, list, heading or image.
    function isEmptyBackground(x, y) {
        const el = document.elementFromPoint(x, y);
        return !!el && (el === document.body || el === document.documentElement);
    }

    function spawnFlower(x, y) {
        const [edge, glow] = palettes[Math.floor(Math.random() * palettes.length)];
        const flower = buildFlower(edge, glow, 0, false);
        flower.style.left = x + 'px';
        flower.style.top = y + 'px';
        // Random size for an organic, scattered look
        flower.style.transform = `scale(${(0.5 + Math.random() * 0.7).toFixed(2)})`;

        garden.appendChild(flower);
        live.push(flower);

        // Bloom on the next frame so the transition animates.
        requestAnimationFrame(() => requestAnimationFrame(() => flower.classList.add('open')));

        // Fade out, then remove from the DOM.
        setTimeout(() => {
            flower.classList.add('fade');
            setTimeout(() => {
                flower.remove();
                const i = live.indexOf(flower);
                if (i > -1) live.splice(i, 1);
            }, FADE);
        }, LIFETIME);

        // Safety cap: drop the oldest if we somehow pile up too many.
        while (live.length > MAX_FLOWERS) {
            live.shift().remove();
        }
    }

    // Debounce on movement: only bloom once the cursor settles on empty space.
    let settleTimer, lastX = 0, lastY = 0;
    window.addEventListener('mousemove', (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
            if (isEmptyBackground(lastX, lastY)) spawnFlower(lastX, lastY);
        }, SETTLE);
    });
});