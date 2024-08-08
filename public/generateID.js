const createButton = document.getElementById('new');

const getContent = () => {
    return {title : title.value , content : editor.value } 
}

const CreateNewDoc = async () => {
    let {title,content} = getContent();
    try{
        const response = await fetch('/docs/new', {
            method : 'POST',
        });
        console.log(response)
        const {documentId} = response.json();

        await fetch(`/docs/${documentId}/edit`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({title,content,documentId}),
        })
        window.location.href(`/docs/${documentId}/edit`);
    }
    catch(error){
        console.error('Error in fetching new doc route ---->', error);
    }
}

createButton.addEventListener('click',CreateNewDoc);