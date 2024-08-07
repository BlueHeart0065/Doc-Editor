const editor = document.getElementById('editor')
const title = document.getElementById('title')
let documentId = localStorage.getItem('documentId') || null;

const getContent = () => {
    return {title : title.value , content : editor.value , documentId : documentId} 
}

const autosave = async () => {
    let {title,content,documentId} = getContent();
    console.log(documentId);
    if (title || content) {
        try{
            const response = await fetch('/autosave',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({title,content,documentId}),
            });

            const result = await response.json();
            console.log(result)
            if(!documentId && result.documentId){
                documentId = result.documentId;
                localStorage.setItem('documentId' , documentId);
            }
            console.log('Document autosaved');
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