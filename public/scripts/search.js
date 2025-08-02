let searchTimeout;

async function searchDocuments(query) {
    if (!query.trim()) {
        hideSearchResults();
        return;
    }

    try {
        const response = await fetch(`/docs/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        const results = await response.json();
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
        showSearchError();
    }
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    const resultsContainer = document.getElementById('Doc-list');
    
    resultsContainer.innerHTML = '';
    
    if (results.length > 0) {
        results.forEach(doc => {
            const resultItem = document.createElement('li');
            const contentPreview = doc.content ? 
                doc.content.replace(/<[^>]*>/g, '').substring(0, 100) : 
                'No content preview available';
            
            resultItem.innerHTML = `
                <p>${escapeHtml(doc.title)}</p>
                <p>${escapeHtml(contentPreview)}${contentPreview.length >= 100 ? '...' : ''}</p>
                <a href="/docs/${doc._id}/edit">Open Document</a>
            `;
            
            resultItem.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    window.location.href = `/docs/${doc._id}/edit`;
                }
            });
            
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<li><p>No documents found matching your search.</p></li>';
    }
    
    searchResultsContainer.style.display = 'block';
}

function hideSearchResults() {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.style.display = 'none';
}

function showSearchError() {
    const resultsContainer = document.getElementById('Doc-list');
    resultsContainer.innerHTML = '<li><p style="color: red;">Search failed. Please try again.</p></li>';
    document.getElementById('search-results').style.display = 'block';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Debounced search function
function debounceSearch(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchDocuments(query), 300);
}

// Event listeners
document.getElementById('search-bar').addEventListener('input', function(event) {
    const query = event.target.value;
    debounceSearch(query);
});

document.getElementById('search-bar').addEventListener('focus', function() {
    const query = this.value;
    if (query.trim()) {
        debounceSearch(query);
    }
});

document.getElementById('search-bar').addEventListener('blur', function() {
    // Delay hiding to allow clicks on search results
    setTimeout(() => {
        if (!document.querySelector('#search-results:hover')) {
            hideSearchResults();
        }
    }, 200);
});

// Close search results when clicking the close button
document.getElementById('close-search').addEventListener('click', function() {
    hideSearchResults();
    document.getElementById('search-bar').value = '';
});

// Close search results when clicking outside
document.addEventListener('click', function(event) {
    const searchBar = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');
    
    if (!searchBar.contains(event.target) && !searchResults.contains(event.target)) {
        hideSearchResults();
    }
});

// Close search results on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideSearchResults();
        document.getElementById('search-bar').blur();
    }
});
  