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
    const sessionEnded = document.querySelector('#session-ended');

    function showQuitModal() {
        quitModal?.classList.add('active');
    }

    function hideQuitModal() {
        quitModal?.classList.remove('active');
    }

    // ---- farewell screen ----
    let sessionEndedVisits = 0;

    function showSessionEnded() {
        sessionEndedVisits++;
        sessionEnded?.classList.add('active');
        hideMenuElements();
        hideOverlays();
    }

    function hideSessionEnded() {
        sessionEnded?.classList.remove('active');
        showMenuElements();
    }

    // Runs only if the tab survived window.close().
    function leavePortfolio() {
        // Back to wherever they came from. replace() so a later Back press
        // can't drop them into the portfolio again.
        const ref = document.referrer;

        if (ref) {
            try {
                if (new URL(ref, location.href).origin !== location.origin) {
                    location.replace(ref);
                    return;
                }
            } catch {
                // Malformed referrer, fall through.
            }
        }

        if (history.length > 1) {
            history.back();
            return;
        }

        // Direct visit, nothing to go back to. Re-opening via "_self" makes
        // the tab script-opened, which is what close() requires.
        window.open('', '_self');
        window.close();

        setTimeout(showSessionEnded, 150);
    }

    // Closes the tab, else navigates away, else shows the screen.
    function attemptExit() {
        window.close();

        setTimeout(leavePortfolio, 100);
    }

    // Any key means leave, but don't trap the visitor on a dead key.
    function exitFromSessionEnded() {
        if (sessionEndedVisits > 1) {
            hideSessionEnded();
            return;
        }
        attemptExit();
    }

    quitYes?.addEventListener('click', showSessionEnded);
    quitNo?.addEventListener('click', hideQuitModal);
    document.querySelector('[data-action="quit"]')?.addEventListener('click', showQuitModal);

    if (quitModal) {
        quitModal.addEventListener('click', (e) => {
            if (e.target === quitModal) hideQuitModal();
        });
    }

    sessionEnded?.addEventListener('click', exitFromSessionEnded);

    // ---- projects / ml view ----
    const backBtn = document.querySelector('#back-btn');
    const projectsOverlay = document.querySelector('#projects-overlay');
    const mlOverlay = document.querySelector('#ml-overlay');
    const aboutmeOverlay = document.querySelector('#aboutme-overlay');
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

    function showOverlay(overlay) {
        if (!overlay) return;

        // The view markup is injected once at load and reused, so scroll
        // positions persist between visits. Rewind while the overlay is still
        // hidden - doing it after the fade-in makes the jump visible.
        const scroller = overlay.querySelector('.projects-scroll, .aboutme-content');
        if (scroller) scroller.scrollTop = 0;

        overlay.classList.add('visible');
    }

    function hideOverlays() {
        if (backBtn) backBtn.classList.remove('visible');
        if (projectsOverlay) projectsOverlay.classList.remove('visible');
        if (mlOverlay) mlOverlay.classList.remove('visible');
        if (aboutmeOverlay) aboutmeOverlay.classList.remove('visible');
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
        showOverlay(projectsOverlay);
        window.goToProjectsView?.();
    });

    document.querySelector('[data-action="ml"]')?.addEventListener('click', () => {
        if (projectsOverlay) projectsOverlay.classList.remove('visible');
        hideMenuElements();
        showOverlay(mlOverlay);
        window.goToMlView?.();
    });

    document.querySelector('[data-action="about"]')?.addEventListener('click', () => {
        if (projectsOverlay) projectsOverlay.classList.remove('visible');
        if (mlOverlay) mlOverlay.classList.remove('visible');
        hideMenuElements();
        showOverlay(aboutmeOverlay);
        window.goToAboutView?.();
    });

    backBtn?.addEventListener('click', () => {
        hideOverlays();
        window.backToMenu?.();
    });

    window.onProjectsViewEntered = () => {};
    window.onProjectsViewExited = () => {
        showMenuElements();
    };

    window.onAboutViewExited = () => {
        showMenuElements();
    };

    // ---- keyboard shortcuts ----
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const upper = key.toUpperCase();

        // Session-ended screen: any key attempts a real exit.
        if (sessionEnded?.classList.contains('active')) {
            e.preventDefault();
            exitFromSessionEnded();
            return;
        }

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
                showOverlay(projectsOverlay);
                window.goToProjectsView?.();
            },
            'M': () => {
                if (backBtn?.classList.contains('visible')) return;
                if (projectsOverlay) projectsOverlay.classList.remove('visible');
                hideMenuElements();
                showOverlay(mlOverlay);
                window.goToMlView?.();
            },
            'A': () => {
                if (backBtn?.classList.contains('visible')) return;
                if (projectsOverlay) projectsOverlay.classList.remove('visible');
                if (mlOverlay) mlOverlay.classList.remove('visible');
                hideMenuElements();
                showOverlay(aboutmeOverlay);
                window.goToAboutView?.();
            },
        };
        if (map[upper]) map[upper]();
    });
}

Promise.all([
    fetch('menu.html').then(r => r.text()),
    fetch('projects.html').then(r => r.text()),
    fetch('ml.html').then(r => r.text()),
    fetch('aboutme.html').then(r => r.text()),
]).then(([menuHtml, projectsHtml, mlHtml, aboutmeHtml]) => {
    document.getElementById('menu-container').innerHTML = menuHtml;
    document.getElementById('projects-container').innerHTML = projectsHtml;
    document.getElementById('ml-container').innerHTML = mlHtml;
    document.getElementById('aboutme-container').innerHTML = aboutmeHtml;
    initMenu();
    window.menuReady = true;
});
