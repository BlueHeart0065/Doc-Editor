async function searchDocuments(query) {
    const response = await fetch(`/docs/search?q=${encodeURIComponent(query)}`);
    const results = await response.json();
    console.log(results);
  }
  
  document.getElementById('search-bar').addEventListener('input', function(event) {
    const query = event.target.value;
    searchDocuments(query);
  });
  