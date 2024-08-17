const fontSelector = document.getElementById('fontSelector');
let currentFont = fontSelector.value;

// Function to apply the selected font to the selected text or new text
function applyFont() {
    const selectedFont = fontSelector.value;
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
        // Apply font to the selected text
        document.execCommand('fontName', false, selectedFont);
    } else {
        // Apply font to the new text
        currentFont = selectedFont;
        editor.style.fontFamily = selectedFont;
    }

    // Directly reflect the font change in the editor
    editor.focus();
}

// Event listener to change the font when a new font is selected
fontSelector.addEventListener('change', applyFont);
editor.addEventListener('input', () => {
    document.execCommand('fontName', false, currentFont);
});