async function sortDocuments(sortQuery) {
    try {
        // Simply redirect with the sort query parameter
        window.location.href = `/docs?q=${encodeURIComponent(sortQuery)}`;
    } catch (error) {
        console.error('Error sorting documents:', error);
    }
}

document.getElementById('sort').addEventListener('change', function(event) {
    const sortQuery = event.target.value;
    sortDocuments(sortQuery);
});

// Set the current sort option based on URL parameters
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentSort = urlParams.get('q');
    
    if (currentSort) {
        const sortSelect = document.getElementById('sort');
        sortSelect.value = currentSort;
    }
});