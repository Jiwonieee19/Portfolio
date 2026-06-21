// light theme toggle
document.querySelectorAll('.light-option').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.light-option').forEach(o => o.classList.remove('active'));
        el.classList.add('active');

        light1.color.set(el.style.background);
    });
});

// keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    const map = {
        'G': () => window.open('https://github.com/Jiwonieee19', '_blank'),
    };
    if (map[key]) map[key]();
});
