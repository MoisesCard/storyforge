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

export const DEFAULT_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
    align: 'left',
    fontFamily: 'Arial',
    fontSize: '11pt',
  },
];

export const validateSlateValue = (value) => {
  // If value is undefined or null, return default
  if (!value) {
    console.log('Value was null/undefined, returning default');
    return DEFAULT_VALUE;
  }

  // If value is not an array, return default
  if (!Array.isArray(value)) {
    console.log('Value was not an array, returning default');
    return DEFAULT_VALUE;
  }

  // If array is empty, return default
  if (value.length === 0) {
    console.log('Value was empty array, returning default');
    return DEFAULT_VALUE;
  }

  // Validate each element has required properties
  const isValid = value.every(node => 
    node && 
    typeof node === 'object' && 
    Array.isArray(node.children) &&
    node.children.length > 0
  );

  if (!isValid) {
    console.log('Value had invalid elements, returning default');
    return DEFAULT_VALUE;
  }

  return value;
}; 