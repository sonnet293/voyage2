// Decorative background movement, independent of authentication and battle logic.
(() => {
    if (new URLSearchParams(location.search).get('embed') === '1') return;

    const body = document.body;
    const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const MAX_X = 12;
    const MAX_Y = 8;
    const FOLLOW_MS = 240;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    let frame = 0, lastTime = 0;

    function draw(now) {
        const elapsed = lastTime ? Math.min(now - lastTime, 64) : 16;
        lastTime = now;
        const blend = 1 - Math.exp(-elapsed / FOLLOW_MS);
        x += (targetX - x) * blend;
        y += (targetY - y) * blend;
        const settled = Math.abs(targetX - x) < .02 && Math.abs(targetY - y) < .02;
        if (settled) { x = targetX; y = targetY; }
        body.style.setProperty('--space-x', `${x.toFixed(3)}px`);
        body.style.setProperty('--space-y', `${y.toFixed(3)}px`);
        frame = settled ? 0 : requestAnimationFrame(draw);
        if (settled) lastTime = 0;
    }

    function start() {
        if (allowed.matches && !document.hidden && !frame) frame = requestAnimationFrame(draw);
    }

    function follow(event) {
        if (!allowed.matches || event.pointerType !== 'mouse') return;
        const clamp = value => Math.max(-1, Math.min(1, value));
        targetX = clamp(event.clientX / innerWidth * 2 - 1) * MAX_X;
        targetY = clamp(event.clientY / innerHeight * 2 - 1) * MAX_Y;
        start();
    }

    function recenter() { targetX = targetY = 0; start(); }

    function reset() {
        cancelAnimationFrame(frame);
        frame = lastTime = x = y = targetX = targetY = 0;
        body.style.removeProperty('--space-x');
        body.style.removeProperty('--space-y');
    }

    function configure() {
        reset();
        body.toggleAttribute('data-space-parallax', allowed.matches);
    }

    window.addEventListener('pointermove', follow, { passive: true });
    document.documentElement.addEventListener('pointerleave', recenter);
    window.addEventListener('blur', recenter);
    window.addEventListener('resize', recenter, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
    window.addEventListener('pagehide', reset);
    window.addEventListener('pageshow', configure);
    allowed.addEventListener('change', configure);
    configure();
})();
