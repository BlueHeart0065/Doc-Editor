const editor = document.getElementById('editor')
const title = document.getElementById('title')
const documentId = document.getElementById('id');

const getContent = () => {
    return {title : title.value , content : editor.value ,documentId : documentId.innerHTML} 
}

const autosave = async () => {
    let {title,content,documentId} = getContent();
    // console.log(JSON.stringify({documentId}));
    const route = '/docs/' + documentId + "/edit";
    if (title || content) {
        try{
            await fetch(route,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({title,content,documentId}),
            });

            // const result = await response.json();
            // console.log(result)
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