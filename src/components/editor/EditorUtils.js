import { Editor, Transforms, Element } from 'slate';

export const CustomEditor = {
  // Mark handling (Bold, Italic, Underline)
  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  toggleMark(editor, format) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  // Alignment handling
  isAlignActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && !editor.isInline(n),
    }) || [];
    return match ? match[0].align === format : false;
  },

  toggleAlign(editor, format) {
    const isActive = CustomEditor.isAlignActive(editor, format);
    
    Transforms.setNodes(
      editor,
      { 
        align: isActive ? undefined : format 
      },
      { 
        match: n => Element.isElement(n) && !editor.isInline(n)
      }
    );
  },

  // List handling
  isBulletActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && n.type === 'bullet-list',
    }) || [];
    return !!match;
  },

  toggleBulletList(editor) {
    const isList = CustomEditor.isBulletActive(editor);
    
    Transforms.setNodes(
      editor,
      { 
        type: isList ? 'paragraph' : 'bullet-list' 
      },
      { 
        match: n => Element.isElement(n) && !editor.isInline(n)
      }
    );
  },

  // Font handling
  toggleFontFamily(editor, fontFamily) {
    Editor.addMark(editor, 'fontFamily', fontFamily);
  },

  toggleFontSize(editor, fontSize) {
    Editor.addMark(editor, 'fontSize', fontSize);
  },

  // Get current formatting
  getCurrentFormat(editor) {
    const marks = Editor.marks(editor) || {};
    const [match] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && !editor.isInline(n),
    }) || [];

    const block = match ? match[0] : { type: 'paragraph', align: 'left' };

    return {
      bold: marks.bold || false,
      italic: marks.italic || false,
      underline: marks.underline || false,
      align: block.align || 'left',
      fontFamily: marks.fontFamily || 'Arial',
      fontSize: marks.fontSize || '11pt',
      isList: block.type === 'bullet-list',
    };
  }
}; 