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

    // ---- projects / ml view ----
    const backBtn = document.querySelector('#back-btn');
    const projectsOverlay = document.querySelector('#projects-overlay');
    const mlOverlay = document.querySelector('#ml-overlay');
    const menuEls = [
        document.querySelector('#title'),
        document.querySelector('#description'),
        document.querySelector('#menu'),
        document.querySelector('#hint'),
        document.querySelector('#light-toggle'),
        document.querySelector('#contact'),
    ];

    function showMenuElements() {
        menuEls.forEach(el => { if (el) el.classList.remove('menu-hidden'); });
    }

    function hideMenuElements() {
        menuEls.forEach(el => { if (el) el.classList.add('menu-hidden'); });
        if (backBtn) backBtn.classList.add('visible');
    }

    function hideOverlays() {
        if (backBtn) backBtn.classList.remove('visible');
        if (projectsOverlay) projectsOverlay.classList.remove('visible');
        if (mlOverlay) mlOverlay.classList.remove('visible');
    }

    // ---- no games modal ----
    const noGamesModal = document.querySelector('#no-games-modal');
    const noGamesBack = document.querySelector('#no-games-back');

    function showNoGamesModal() {
        noGamesModal?.classList.add('active');
    }

    function hideNoGamesModal() {
        noGamesModal?.classList.remove('active');
    }

    noGamesBack?.addEventListener('click', hideNoGamesModal);
    if (noGamesModal) {
        noGamesModal.addEventListener('click', (e) => {
            if (e.target === noGamesModal) hideNoGamesModal();
        });
    }

    document.querySelector('[data-action="play"]')?.addEventListener('click', showNoGamesModal);

    document.querySelector('[data-action="projects"]')?.addEventListener('click', () => {
        if (mlOverlay) mlOverlay.classList.remove('visible');
        hideMenuElements();
        if (projectsOverlay) projectsOverlay.classList.add('visible');
        window.goToProjectsView?.();
    });

    document.querySelector('[data-action="ml"]')?.addEventListener('click', () => {
        if (projectsOverlay) projectsOverlay.classList.remove('visible');
        hideMenuElements();
        if (mlOverlay) mlOverlay.classList.add('visible');
        window.goToMlView?.();
    });

    backBtn?.addEventListener('click', () => {
        hideOverlays();
        window.backToMenu?.();
    });

    window.onProjectsViewEntered = () => {};
    window.onProjectsViewExited = () => {
        showMenuElements();
    };

    // ---- keyboard shortcuts ----
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const upper = key.toUpperCase();

        if (key === 'Escape') {
            if (quitModal?.classList.contains('active')) { hideQuitModal(); return; }
            if (noGamesModal?.classList.contains('active')) { hideNoGamesModal(); return; }
            if (backBtn?.classList.contains('visible')) { hideOverlays(); window.backToMenu?.(); return; }
        }

        if (key === 'Enter') {
            if (backBtn?.classList.contains('visible')) return;
            if (quitModal?.classList.contains('active')) return;
            showNoGamesModal();
            return;
        }

        if (upper === 'Q' && quitModal?.classList.contains('active')) return;

        const map = {
            'G': () => window.open('https://github.com/Jiwonieee19', '_blank'),
            'Q': showQuitModal,
            'W': () => {
                if (backBtn?.classList.contains('visible')) return;
                if (mlOverlay) mlOverlay.classList.remove('visible');
                hideMenuElements();
                if (projectsOverlay) projectsOverlay.classList.add('visible');
                window.goToProjectsView?.();
            },
            'M': () => {
                if (backBtn?.classList.contains('visible')) return;
                if (projectsOverlay) projectsOverlay.classList.remove('visible');
                hideMenuElements();
                if (mlOverlay) mlOverlay.classList.add('visible');
                window.goToMlView?.();
            },
        };
        if (map[upper]) map[upper]();
    });
}

Promise.all([
    fetch('menu.html').then(r => r.text()),
    fetch('projects.html').then(r => r.text()),
    fetch('ml.html').then(r => r.text()),
]).then(([menuHtml, projectsHtml, mlHtml]) => {
    document.getElementById('menu-container').innerHTML = menuHtml;
    document.getElementById('projects-container').innerHTML = projectsHtml;
    document.getElementById('ml-container').innerHTML = mlHtml;
    initMenu();
    window.menuReady = true;
});
