export const formatText = (content, selectionStart, selectionEnd, formatType) => {
  const selectedText = content.substring(selectionStart, selectionEnd);
  
  // If no text is selected, return without changes
  if (!selectedText) {
    return { content, selectionStart, selectionEnd };
  }

  // We'll handle the actual styling through Monaco's decorations API
  return {
    content,
    selectionStart,
    selectionEnd,
    style: formatType // We'll use this to apply the visual style
  };
}; 