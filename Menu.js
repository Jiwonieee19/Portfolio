// light theme toggle
document.querySelectorAll('.light-option').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.light-option').forEach(o => o.classList.remove('active'));
        el.classList.add('active');

        light1.color.set(el.style.background);
    });
});

// quit confirmation modal
const quitModal = document.querySelector('#quit-modal');
const quitYes = document.querySelector('#quit-yes');
const quitNo = document.querySelector('#quit-no');

function showQuitModal() {
    if (quitModal) {
        quitModal.classList.add('active');
    }
}

function hideQuitModal() {
    if (quitModal) {
        quitModal.classList.remove('active');
    }
}

function closeTab() {
    window.close();
}

// YES button
if (quitYes) {
    quitYes.addEventListener('click', closeTab);
}

// NO button
if (quitNo) {
    quitNo.addEventListener('click', hideQuitModal);
}

// QUIT button click
document.querySelector('[data-action="quit"]')?.addEventListener('click', showQuitModal);

// keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();

    // Close modal on Escape
    if (key === 'ESCAPE' && quitModal?.classList.contains('active')) {
        hideQuitModal();
        return;
    }

    // Don't open quit modal if it's already open
    if (key === 'Q' && quitModal?.classList.contains('active')) {
        return;
    }

    const map = {
        'G': () => window.open('https://github.com/Jiwonieee19', '_blank'),
        'Q': showQuitModal,
    };
    if (map[key]) map[key]();
});

// Close modal when clicking outside the box
if (quitModal) {
    quitModal.addEventListener('click', (e) => {
        if (e.target === quitModal) {
            hideQuitModal();
        }
    });
}
