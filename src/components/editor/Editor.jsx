import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { createEditor, Editor as SlateEditor, Transforms, Element } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Box, Flex } from '@chakra-ui/react';
import EditorMenuBar from './EditorMenuBar';
import EditorToolbar from './EditorToolbar';
import { CustomEditor } from './EditorUtils';
import './Editor.css';

const DEFAULT_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
    align: 'left',
    fontFamily: 'Arial',
    fontSize: '11pt',
  },
];

const withFormatting = editor => {
  const { normalizeNode } = editor;

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    // Ensure blocks have required properties
    if (Element.isElement(node) && !editor.isInline(node)) {
      if (!node.type) {
        Transforms.setNodes(editor, { type: 'paragraph' }, { at: path });
        return;
      }
      if (!node.align) {
        Transforms.setNodes(editor, { align: 'left' }, { at: path });
        return;
      }
      if (!node.fontFamily) {
        Transforms.setNodes(editor, { fontFamily: 'Arial' }, { at: path });
        return;
      }
      if (!node.fontSize) {
        Transforms.setNodes(editor, { fontSize: '11pt' }, { at: path });
        return;
      }
    }

    // Fall back to the original normalization logic
    normalizeNode(entry);
  };

  return editor;
};

const Editor = ({ value = DEFAULT_VALUE, onChange, projectId, saveStatus, title }) => {
  const editor = useMemo(() => {
    const e = withFormatting(withHistory(withReact(createEditor())));
    
    // Normalize nodes to ensure they have required properties
    const { normalizeNode } = e;
    e.normalizeNode = entry => {
      const [node, path] = entry;
      
      if (path.length === 0 && node.children.length === 0) {
        e.insertNode({
          type: 'paragraph',
          children: [{ text: '' }],
          align: 'left',
          fontFamily: 'Arial',
          fontSize: '11pt',
        });
        return;
      }
      
      // Ensure all blocks have required properties
      if (SlateEditor.isBlock(e, node)) {
        const props = {};
        if (!node.type) props.type = 'paragraph';
        if (!node.align) props.align = 'left';
        if (!node.fontFamily) props.fontFamily = 'Arial';
        if (!node.fontSize) props.fontSize = '11pt';
        
        if (Object.keys(props).length > 0) {
          Transforms.setNodes(e, props, { at: path });
          return;
        }
      }
      
      normalizeNode(entry);
    };
    
    return e;
  }, []);

  const renderElement = useCallback(props => {
    const { element, attributes, children } = props;
    
    const baseStyle = {
      textAlign: element.align || 'left',
      fontFamily: element.fontFamily || 'Arial',
    };

    switch (element.type) {
      case 'heading-1':
        return (
          <div 
            {...attributes} 
            style={{
              ...baseStyle,
              fontSize: '24px',
              fontWeight: 'bold',
              lineHeight: '1.4',
              marginTop: '20px',
              marginBottom: '10px',
              color: '#1A202C',
            }}
          >
            {children}
          </div>
        );
      
      case 'heading-2':
        return (
          <div 
            {...attributes} 
            style={{
              ...baseStyle,
              fontSize: '20px',
              fontWeight: 'bold',
              lineHeight: '1.4',
              marginTop: '18px',
              marginBottom: '8px',
              color: '#2D3748',
            }}
          >
            {children}
          </div>
        );

      case 'block-quote':
        return (
          <div 
            {...attributes} 
            style={{
              ...baseStyle,
              borderLeft: '4px solid #718096',
              paddingLeft: '16px',
              marginLeft: '0',
              marginRight: '0',
              marginTop: '16px',
              marginBottom: '16px',
              fontStyle: 'italic',
              color: '#4A5568',
              backgroundColor: 'rgba(0,0,0,0.03)',
              padding: '12px 16px',
              borderRadius: '0 4px 4px 0',
            }}
          >
            {children}
          </div>
        );

      case 'bullet-list':
        return (
          <div 
            style={{
              ...baseStyle,
              paddingLeft: '24px',
              position: 'relative',
              marginTop: '8px',
              marginBottom: '8px',
            }} 
            {...attributes}
          >
            <span
              contentEditable={false}
              style={{
                position: 'absolute',
                left: '8px',
                userSelect: 'none',
                color: '#4A5568',
              }}
            >
              •
            </span>
            {children}
          </div>
        );

      default:
        return (
          <div 
            style={{
              ...baseStyle,
              marginTop: '8px',
              marginBottom: '8px',
              lineHeight: '1.6',
            }} 
            {...attributes}
          >
            {children}
          </div>
        );
    }
  }, []);

  const renderLeaf = useCallback(props => {
    const { attributes, children, leaf } = props;
    let style = {
      fontWeight: leaf.bold ? 'bold' : 'normal',
      fontStyle: leaf.italic ? 'italic' : 'normal',
      textDecoration: leaf.underline ? 'underline' : 'none',
      fontFamily: leaf.fontFamily || 'inherit',
      fontSize: leaf.fontSize || 'inherit',
    };

    return (
      <span {...attributes} style={style}>
        {children}
      </span>
    );
  }, []);

  const handleKeyDown = useCallback(event => {
    if (!event.ctrlKey && !event.metaKey) return;

    switch (event.key) {
      case 'b': {
        event.preventDefault();
        CustomEditor.toggleMark(editor, 'bold');
        break;
      }
      case 'i': {
        event.preventDefault();
        CustomEditor.toggleMark(editor, 'italic');
        break;
      }
      case 'u': {
        event.preventDefault();
        CustomEditor.toggleMark(editor, 'underline');
        break;
      }
      default:
        break;
    }
  }, [editor]);

  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Update counts when content changes
  useEffect(() => {
    // Get text content from all nodes
    const text = value
      .map(node => {
        // Recursively get text from node and its children
        const getNodeText = n => {
          if (typeof n.text === 'string') {
            return n.text;
          }
          if (Array.isArray(n.children)) {
            return n.children.map(getNodeText).join('');
          }
          return '';
        };
        return getNodeText(node);
      })
      .join('\n');

    // Calculate counts
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    setWordCount(words);
    setCharCount(chars);
  }, [value]);

  return (
    <Flex direction="column" h="100%" bg="brand.dark.100">
      <EditorMenuBar title={title} />
      <Slate 
        editor={editor} 
        initialValue={value}
        value={value}
        onChange={onChange}
      >
        <EditorToolbar 
          saveStatus={saveStatus} 
          wordCount={wordCount}
          charCount={charCount}
        />
        <Box 
          flex="1"
          bg="brand.dark.100"
          overflowY="auto"
          pt={4}
        >
          <Box
            w="8.5in"
            minH="11in"
            mx="auto"
            bg="#F0F0F0"
            boxShadow="0 0 10px rgba(0,0,0,0.2)"
            borderRadius="sm"
            p={8}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Type something..."
              spellCheck
              autoFocus
              onKeyDown={handleKeyDown}
              style={{
                minHeight: '100%',
                fontFamily: 'Arial',
                fontSize: '11pt',
                lineHeight: '1.5',
                color: '#1A202C',
              }}
            />
          </Box>
        </Box>
      </Slate>
    </Flex>
  );
};

export default Editor; 