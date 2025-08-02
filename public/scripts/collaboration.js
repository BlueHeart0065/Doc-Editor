// Collaboration and editor enhancement features

// Word count functionality
function updateWordCount() {
    if (!quill) return;
    
    const text = quill.getText();
    const content = quill.root.innerHTML;
    
    // Calculate statistics
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = content.split('</p>').length - 1 || 1;
    
    // Update DOM elements if modal is open
    const wordCountElement = document.getElementById('word-count');
    const charCountElement = document.getElementById('char-count');
    const charCountNoSpacesElement = document.getElementById('char-count-no-spaces');
    const paragraphCountElement = document.getElementById('paragraph-count');
    
    if (wordCountElement) wordCountElement.textContent = words;
    if (charCountElement) charCountElement.textContent = characters;
    if (charCountNoSpacesElement) charCountNoSpacesElement.textContent = charactersNoSpaces;
    if (paragraphCountElement) paragraphCountElement.textContent = paragraphs;
}

// Modal handling
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        if (modalId === 'word-count-modal') {
            updateWordCount();
        }
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Copy to clipboard functionality
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// Export functionality
function exportDocument(format) {
    const title = document.getElementById('title').value || 'Untitled Document';
    const content = quill.root.innerHTML;
    
    if (format === 'html') {
        const blob = new Blob([`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <div>${content}</div>
            </body>
            </html>
        `], { type: 'text/html' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.html`;
        a.click();
        URL.revokeObjectURL(url);
    } else if (format === 'txt') {
        const textContent = quill.getText();
        const blob = new Blob([textContent], { type: 'text/plain' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    const editorContainer = document.querySelector('.editor-container');
    
    if (!document.fullscreenElement) {
        editorContainer.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Notification system
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        ${type === 'success' ? 'background-color: #28a745;' : 
          type === 'error' ? 'background-color: #dc3545;' : 
          type === 'warning' ? 'background-color: #ffc107; color: black;' : 
          'background-color: #17a2b8;'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Word count button
    const wordCountBtn = document.getElementById('word-count-btn');
    if (wordCountBtn) {
        wordCountBtn.addEventListener('click', () => showModal('word-count-modal'));
    }

    // Close word count modal
    const closeWordCount = document.getElementById('close-word-count');
    if (closeWordCount) {
        closeWordCount.addEventListener('click', () => hideModal('word-count-modal'));
    }

    // Fullscreen button
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => showModal('share-modal'));
    }

    // Close share modal
    const closeShare = document.getElementById('close-share');
    if (closeShare) {
        closeShare.addEventListener('click', () => hideModal('share-modal'));
    }

    // Copy link button
    const copyLinkBtn = document.getElementById('copy-link');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', async function() {
            const link = document.getElementById('document-link').value;
            const success = await copyToClipboard(link);
            
            if (success) {
                this.textContent = 'Copied!';
                this.classList.add('copied');
                showNotification('Link copied to clipboard!', 'success');
                
                setTimeout(() => {
                    this.textContent = 'Copy';
                    this.classList.remove('copied');
                }, 2000);
            } else {
                showNotification('Failed to copy link', 'error');
            }
        });
    }

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const dropdown = document.createElement('div');
            dropdown.className = 'export-dropdown';
            dropdown.innerHTML = `
                <button onclick="exportDocument('html')">Export as HTML</button>
                <button onclick="exportDocument('txt')">Export as Text</button>
            `;
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                min-width: 150px;
            `;
            dropdown.style.display = 'block';
            
            dropdown.querySelectorAll('button').forEach(btn => {
                btn.style.cssText = `
                    width: 100%;
                    padding: 10px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    border-radius: 0;
                `;
                btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#f8f9fa');
                btn.addEventListener('mouseleave', () => btn.style.backgroundColor = 'transparent');
            });
            
            this.style.position = 'relative';
            this.appendChild(dropdown);
            
            // Close dropdown when clicking outside
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && e.target !== exportBtn) {
                        if (dropdown.parentNode) {
                            dropdown.parentNode.removeChild(dropdown);
                        }
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 100);
        });
    }

    // FAB actions
    const backToDocsBtn = document.getElementById('back-to-docs');
    if (backToDocsBtn) {
        backToDocsBtn.addEventListener('click', () => {
            window.location.href = '/docs';
        });
    }

    const printDocBtn = document.getElementById('print-doc');
    if (printDocBtn) {
        printDocBtn.addEventListener('click', () => {
            window.print();
        });
    }

    const downloadDocBtn = document.getElementById('download-doc');
    if (downloadDocBtn) {
        downloadDocBtn.addEventListener('click', () => {
            exportDocument('html');
        });
    }

    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modals on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="flex"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });

    // Update word count when editor content changes
    if (typeof quill !== 'undefined') {
        quill.on('text-change', updateWordCount);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl+Shift+W for word count
        if (event.ctrlKey && event.shiftKey && event.key === 'W') {
            event.preventDefault();
            showModal('word-count-modal');
        }
        
        // F11 for fullscreen
        if (event.key === 'F11') {
            event.preventDefault();
            toggleFullscreen();
        }
        
        // Ctrl+Shift+S for share
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            event.preventDefault();
            showModal('share-modal');
        }
    });
});

// Make functions globally available
window.exportDocument = exportDocument;
window.showNotification = showNotification;