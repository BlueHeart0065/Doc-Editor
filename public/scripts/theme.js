// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemPreference();
        this.themeToggle = document.getElementById('theme-toggle');
        this.lightIcon = document.getElementById('theme-icon-light');
        this.darkIcon = document.getElementById('theme-icon-dark');
        
        this.init();
    }

    init() {
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Add event listeners
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        this.watchSystemPreference();
        
        // Listen for keyboard shortcut (Ctrl+Shift+T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('doc-editor-theme');
    }

    storeTheme(theme) {
        localStorage.setItem('doc-editor-theme', theme);
    }

    applyTheme(theme) {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateIcons(theme);
        this.storeTheme(theme);
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme, isDark: theme === 'dark' } 
        }));
        
        // Add smooth transition for theme changes
        this.addTransitionClass();
    }

    updateIcons(theme) {
        if (!this.lightIcon || !this.darkIcon) return;
        
        if (theme === 'dark') {
            this.lightIcon.style.display = 'none';
            this.darkIcon.style.display = 'block';
        } else {
            this.lightIcon.style.display = 'block';
            this.darkIcon.style.display = 'none';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add a subtle animation to the toggle button
        if (this.themeToggle) {
            this.themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.themeToggle.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Show a subtle notification
        this.showThemeNotification(newTheme);
    }

    addTransitionClass() {
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    showThemeNotification(theme) {
        const notification = document.createElement('div');
        notification.textContent = `Switched to ${theme} mode`;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 12px 20px;
            background: var(--bg-primary);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: 'Inter', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to check if dark mode is active
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}

// Enhanced theme transitions
const themeTransitionCSS = `
    .theme-transitioning,
    .theme-transitioning *,
    .theme-transitioning *:before,
    .theme-transitioning *:after {
        transition: all 0.3s ease !important;
        transition-delay: 0 !important;
    }
`;

// Add transition styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = themeTransitionCSS;
document.head.appendChild(styleSheet);

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.themeManager) {
            window.themeManager = new ThemeManager();
        }
    });
} else {
    // DOM is already loaded
    window.themeManager = new ThemeManager();
}

// Utility functions for other scripts to use
window.getTheme = () => window.themeManager?.getCurrentTheme() || 'light';
window.isDarkMode = () => window.themeManager?.isDarkMode() || false;
window.toggleTheme = () => window.themeManager?.toggleTheme();

// Add keyboard shortcut hint to theme toggle button
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const originalTitle = themeToggle.getAttribute('title') || 'Toggle theme';
        themeToggle.setAttribute('title', `${originalTitle} (Ctrl+Shift+T)`);
    }
});