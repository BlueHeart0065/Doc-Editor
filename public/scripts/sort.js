async function sortDocuments(sortQuery){
    await fetch(`/docs?q=${(sortQuery)}`,{
        method : 'GET',
        headers : {'Content-Type' : 'application/json'},
    });
}

document.getElementById('sort').addEventListener('change', function(event) {
    const sortQuery = event.target.value;
    sortDocuments(sortQuery);
})