// Document operations handling
let documentToDelete = null;

// Delete document functionality
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const documentId = event.target.getAttribute('data-id');
        documentToDelete = documentId;
        showDeleteConfirmation();
    }
    
    if (event.target.classList.contains('duplicate-btn')) {
        const documentId = event.target.getAttribute('data-id');
        duplicateDocument(documentId);
    }
});

function showDeleteConfirmation() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'flex';
}

function hideDeleteConfirmation() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'none';
    documentToDelete = null;
}

async function deleteDocument(documentId) {
    try {
        const response = await fetch(`/docs/${documentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Remove the document from the UI
            const documentWrapper = document.querySelector(`[data-id="${documentId}"]`).closest('.document-wrapper');
            documentWrapper.remove();
            
            // Update document count
            updateDocumentCount();
            
            showNotification('Document deleted successfully', 'success');
        } else {
            throw new Error('Failed to delete document');
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        showNotification('Failed to delete document', 'error');
    }
}

async function duplicateDocument(documentId) {
    try {
        const response = await fetch(`/docs/${documentId}/duplicate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification('Document duplicated successfully', 'success');
            // Refresh the page to show the new document
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to duplicate document');
        }
    } catch (error) {
        console.error('Error duplicating document:', error);
        showNotification('Failed to duplicate document', 'error');
    }
}

function updateDocumentCount() {
    const documentWrappers = document.querySelectorAll('.document-wrapper');
    const count = documentWrappers.length;
    document.getElementById('doc-count').textContent = count;
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Modal event listeners
document.getElementById('confirm-delete').addEventListener('click', function() {
    if (documentToDelete) {
        deleteDocument(documentToDelete);
        hideDeleteConfirmation();
    }
});

document.getElementById('cancel-delete').addEventListener('click', function() {
    hideDeleteConfirmation();
});

// Close modal when clicking outside
document.getElementById('confirmation-modal').addEventListener('click', function(event) {
    if (event.target === this) {
        hideDeleteConfirmation();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideDeleteConfirmation();
    }
});