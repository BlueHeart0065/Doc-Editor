const title = document.getElementById('title');
const documentId = document.getElementById('id');
const editor = document.getElementById('editor'); // Fix the variable reference

const getContent = () => {
    return {
        title: title.value, 
        content: quill.root.innerHTML,
        documentId: documentId.innerHTML
    };
};

const autosave = async () => {
    let {title: docTitle, content, documentId: docId} = getContent();
    const route = '/docs/' + docId + "/edit";
    
    if (docTitle || content) {
        // Emit start event
        window.dispatchEvent(new CustomEvent('autosave-start'));
        
        try{
            const response = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title: docTitle, content, documentId: docId}),
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('Document autosaved');
                showSaveStatus('Saved', 'success');
                window.dispatchEvent(new CustomEvent('autosave-success'));
            } else {
                throw new Error(result.error || 'Failed to save');
            }
        } catch(error){
            console.error('Failed to autosave', error);
            showSaveStatus('Save failed', 'error');
            window.dispatchEvent(new CustomEvent('autosave-error'));
        }
    }
};

function showSaveStatus(message, type) {
    // Remove existing status indicator
    const existingStatus = document.querySelector('.save-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create new status indicator
    const statusElement = document.createElement('div');
    statusElement.className = `save-status ${type}`;
    statusElement.textContent = message;
    statusElement.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        padding: 8px 15px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        z-index: 1000;
        transition: opacity 0.3s ease;
        ${type === 'success' ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;
    
    document.body.appendChild(statusElement);
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
        statusElement.style.opacity = '0';
        setTimeout(() => {
            if (statusElement.parentNode) {
                statusElement.parentNode.removeChild(statusElement);
            }
        }, 300);
    }, 2000);
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedAutosave = debounce(autosave, 2000);

// Add event listeners
if (editor && quill) {
    quill.on('text-change', debouncedAutosave);
}

if (title) {
    title.addEventListener('input', debouncedAutosave);
}

// Save on Ctrl+S
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        autosave();
    }
});