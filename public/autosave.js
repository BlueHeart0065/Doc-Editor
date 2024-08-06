const editor = document.getElementById('editor')
const title = document.getElementById('title')

const getContent = () => {
    return {title : title.value , content : editor.value } 
}

const autosave = async () => {
    const {title,content} = getContent()

    if (content) {
        try{
            await fetch('/autosave',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({title,content}),
            });
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