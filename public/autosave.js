const editor = document.getElementById('editor')
const title = document.getElementById('title')
const documentID = localStorage.getItem('documentId') || null;

const getContent = () => {
    return {title : title.value , content : editor.value , documentID : documentID} 
}

const autosave = async () => {
    const {title,content} = getContent()

    if (title || content) {
        try{
            const response = await fetch('/autosave',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({title,content,documentID}),
            });

            const result = await response.json();
            if(!documentID && result.documentId){
                documentID = result.documentId;
                localStorage.setItem('documentId',documentID);
            }
            console.log('Content autosaved');
        } catch(error){
            console.error('Failed to autosave', error);
        }
    }
};

function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedAutosave = debounce(autosave, 2000);

editor.addEventListener('input', debouncedAutosave);
title.addEventListener('input', debouncedAutosave);