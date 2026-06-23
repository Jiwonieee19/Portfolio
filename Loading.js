// Generate random loading percentages between 0-100
function generateLoadingSequence() {
    const sequence = [0];
    let current = 0;
    
    // Generate 5-8 random intermediate values
    const steps = 5 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < steps; i++) {
        // Each step increases by 8-25%
        const increment = 8 + Math.floor(Math.random() * 18);
        current = Math.min(current + increment, 99);
        if (!sequence.includes(current)) {
            sequence.push(current);
        }
    }
    
    sequence.push(100); // Always end at 100
    return sequence;
}

// Asset preloader for GLB models and other resources
class AssetPreloader {
    constructor() {
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.assets = [];
        this.isComplete = false;
        this.loadingSequence = generateLoadingSequence();
        this.currentSequenceIndex = 0;
    }

    // Register assets to preload
    registerAsset(url, type = 'model') {
        this.assets.push({ url, type });
        this.totalAssets++;
    }

    // Preload all registered assets
    async preloadAssets() {
        const promises = this.assets.map((asset) => this.loadAsset(asset));
        await Promise.all(promises);
        this.isComplete = true;
        return true;
    }

    // Load individual asset
    async loadAsset(asset) {
        try {
            const response = await fetch(asset.url);
            if (!response.ok) {
                throw new Error(`Failed to load ${asset.url}: ${response.status}`);
            }
            // Read the blob to ensure it's fully loaded
            await response.blob();
            this.loadedAssets++;
            this.updateProgress();
            return true;
        } catch (error) {
            console.error(`Error loading asset: ${asset.url}`, error);
            this.loadedAssets++;
            this.updateProgress();
            return false;
        }
    }

    // Get current progress from sequence
    getProgress() {
        if (this.loadingSequence.length === 0) return 0;
        return this.loadingSequence[this.currentSequenceIndex];
    }

    // Update UI progress
    updateProgress() {
        const progress = this.getProgress();
        const progressBar = document.querySelector('#loading-bar-fill');
        const progressText = document.querySelector('#loading-percent');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `LOADING ${progress}%`;
        }

        // Expose percentage globally
        window.currentLoadingPercent = progress;
    }
}

// Initialize preloader
const preloader = new AssetPreloader();

// Register assets
preloader.registerAsset('./models/dino.glb', 'model');
preloader.registerAsset('./models/Donut.glb', 'model');
preloader.registerAsset('./chrome-dino-sprite.png', 'image');

// Show loading screen and preload assets
async function startLoading() {
    const loadingScreen = document.querySelector('#loading-screen');
    const menuContainer = document.querySelector('#menu-container');

    // Show loading screen
    if (loadingScreen) {
        loadingScreen.classList.add('active');
    }

    // Hide menu content initially
    if (menuContainer) {
        menuContainer.classList.remove('show');
    }

    // Get random loading duration between 2000-3000ms, nows its 2300s always
    const loadingDuration = 2300;

    // Calculate time intervals for each progress step
    const sequence = preloader.loadingSequence;
    const stepInterval = loadingDuration / (sequence.length - 1);

    // Start preloading assets
    const startTime = performance.now();
    await preloader.preloadAssets();

    // Update progress based on elapsed time
    const progressInterval = setInterval(() => {
        const elapsedTime = performance.now() - startTime;
        const progress = Math.min(elapsedTime / loadingDuration, 1);
        
        // Find which step we're at based on progress
        const stepIndex = Math.floor(progress * (sequence.length - 1));
        preloader.currentSequenceIndex = Math.min(stepIndex, sequence.length - 1);
        preloader.updateProgress();

        if (elapsedTime >= loadingDuration) {
            clearInterval(progressInterval);
            preloader.currentSequenceIndex = sequence.length - 1;
            preloader.updateProgress();
            completeLoading();
        }
    }, 16); // Update every frame (~60fps)
}

function completeLoading() {
    const loadingScreen = document.querySelector('#loading-screen');
    const menuContainer = document.querySelector('#menu-container');

    // Wait for menu.html to be injected if not ready yet
    if (!window.menuReady) {
        requestAnimationFrame(completeLoading);
        return;
    }

    // Show menu first
    if (menuContainer) {
        menuContainer.classList.add('show');
    }

    // Signal that loading is complete (start idle timer in Dino.js)
    if (window.completeLoadingAnimation) {
        window.completeLoadingAnimation();
    }

    // Fade out loading screen
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');

        // Remove loading screen after fade animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // Match this with CSS animation duration
    }
}

// Start loading when DOM is ready
document.addEventListener('DOMContentLoaded', startLoading);
