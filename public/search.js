async function searchDocuments(query) {
  const response = await fetch(`/docs/search?q=${encodeURIComponent(query)}`,{
    method : 'GET',
    headers : {'Content-Type' : 'application/json'},
  });
  const results = await response.json();
  const resultsContainer = document.getElementById('Doc-list');
  resultsContainer.innerHTML = '';
  searcBar = document.getElementById('search-bar')
  searcBar.addEventListener('blur', function(){
    if(searcBar.value == ''){
      resultsContainer.innerHTML = '';
    }
  });

  if (results.length > 0) {
    results.forEach(doc => {
      const resultItem = document.createElement('li');
      resultItem.innerHTML = `<p>${doc.title}</p><p>${doc.content.substring(0, 100)}...</p><a href="/docs/${doc._id}/edit">View Document</a>`;
      resultsContainer.appendChild(resultItem);
    });
  } else {
    resultsContainer.innerHTML = '<p>No documents found.</p>';
  }
}
  
document.getElementById('search-bar').addEventListener('input', function(event) {
  const query = event.target.value;
  searchDocuments(query);
})



  