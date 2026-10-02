// Presentation only: reveal the command-center heading without moving its layout.
(() => {
    const lines = [...document.querySelectorAll('.main-head [data-typewriter]')];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!lines.length || motion.matches) return;

    const segmenter = typeof Intl.Segmenter === 'function'
        ? new Intl.Segmenter('ko', { granularity: 'grapheme' }) : null;
    const sequence = [];
    let duration = 180;

    for (const line of lines) {
        const text = line.textContent;
        const characters = segmenter
            ? [...segmenter.segment(text)].map(item => item.segment) : Array.from(text);
        const speed = Number(line.dataset.typewriterSpeed) || 36;
        const accessible = document.createElement('span');
        accessible.className = 'typewriter-accessible';
        accessible.textContent = text;
        const visual = document.createElement('span');
        visual.setAttribute('aria-hidden', 'true');
        for (const character of characters) {
            const span = document.createElement('span');
            span.className = 'typewriter-character';
            span.textContent = character;
            visual.append(span);
            sequence.push({ span, at: duration });
            duration += speed;
        }
        line.replaceChildren(accessible, visual);
        duration += 180;
    }

    document.querySelector('.main-head').classList.add('has-typewriter');
    let frame;
    let started;
    let index = 0;
    let cursor = null;

    const finish = () => {
    cancelAnimationFrame(frame);

    for (const { span } of sequence) {
        span.classList.add('is-visible');
    }

    // 마지막 글자에 커서를 유지
    if (sequence.length) {
        cursor?.classList.remove('is-cursor');
        cursor = sequence[sequence.length - 1].span;
        cursor.classList.add('is-visible', 'is-cursor');
    }

    motion.removeEventListener('change', onMotionChange);
    window.removeEventListener('pagehide', finish);
};
    const onMotionChange = () => { if (motion.matches) finish(); };
    const tick = now => {
        started ??= now;
        const elapsed = now - started;
        while (index < sequence.length && elapsed >= sequence[index].at) {
            cursor?.classList.remove('is-cursor');
            cursor = sequence[index++].span;
            cursor.classList.add('is-visible', 'is-cursor');
        }
        if (elapsed >= duration + 350) finish();
        else frame = requestAnimationFrame(tick);
    };

    motion.addEventListener('change', onMotionChange);
    window.addEventListener('pagehide', finish, { once: true });
    frame = requestAnimationFrame(tick);
})();
