function initMenu() {

    // ---- light theme toggle ----
    document.querySelectorAll('.light-option').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.light-option').forEach(o => o.classList.remove('active'));
            el.classList.add('active');
            window.light1?.color.set(el.style.background);
        });
    });

    // ---- quit modal ----
    const quitModal = document.querySelector('#quit-modal');
    const quitYes = document.querySelector('#quit-yes');
    const quitNo = document.querySelector('#quit-no');

    function showQuitModal() {
        quitModal?.classList.add('active');
    }

    function hideQuitModal() {
        quitModal?.classList.remove('active');
    }

    function closeTab() {
        window.close();
    }

    quitYes?.addEventListener('click', closeTab);
    quitNo?.addEventListener('click', hideQuitModal);
    document.querySelector('[data-action="quit"]')?.addEventListener('click', showQuitModal);

    if (quitModal) {
        quitModal.addEventListener('click', (e) => {
            if (e.target === quitModal) hideQuitModal();
        });
    }

    // ---- projects view ----
    const backBtn = document.querySelector('#back-btn');
    const projectsOverlay = document.querySelector('#projects-overlay');
    const menuEls = [
        document.querySelector('#title'),
        document.querySelector('#description'),
        document.querySelector('#menu'),
        document.querySelector('#hint'),
        document.querySelector('#light-toggle'),
    ];

    function showMenuElements() {
        menuEls.forEach(el => { if (el) el.classList.remove('menu-hidden'); });
    }

    function hideMenuElements() {
        menuEls.forEach(el => { if (el) el.classList.add('menu-hidden'); });
        if (backBtn) backBtn.classList.add('visible');
        if (projectsOverlay) projectsOverlay.classList.add('visible');
    }

    function hideProjectsOverlay() {
        if (backBtn) backBtn.classList.remove('visible');
        if (projectsOverlay) projectsOverlay.classList.remove('visible');
    }

    document.querySelector('[data-action="projects"]')?.addEventListener('click', () => {
        hideMenuElements();
        window.goToProjectsView?.();
    });

    backBtn?.addEventListener('click', () => {
        hideProjectsOverlay();
        window.backToMenu?.();
    });

    window.onProjectsViewEntered = () => {};
    window.onProjectsViewExited = () => {
        showMenuElements();
    };

    // ---- keyboard shortcuts ----
    document.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();

        if (key === 'ESCAPE' && quitModal?.classList.contains('active')) {
            hideQuitModal();
            return;
        }

        if (key === 'Q' && quitModal?.classList.contains('active')) {
            return;
        }

        if (key === 'ESCAPE' && backBtn?.classList.contains('visible')) {
            hideProjectsOverlay();
            window.backToMenu?.();
            return;
        }

        const map = {
            'G': () => window.open('https://github.com/Jiwonieee19', '_blank'),
            'Q': showQuitModal,
            'W': () => {
                if (backBtn?.classList.contains('visible')) return;
                hideMenuElements();
                window.goToProjectsView?.();
            },
        };
        if (map[key]) map[key]();
    });
}

fetch('menu.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('menu-container').innerHTML = html;
        initMenu();
        window.menuReady = true;
    });
