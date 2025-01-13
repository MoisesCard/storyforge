import React, { useMemo, useCallback } from 'react';
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
  const { normalizeNode, isInline } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    // Ensure blocks have required properties
    if (Element.isElement(node) && !editor.isInline(node)) {
      if (typeof node.type !== 'string') {
        Transforms.setNodes(editor, { type: 'paragraph' }, { at: path });
        return;
      }
      if (typeof node.align !== 'string') {
        Transforms.setNodes(editor, { align: 'left' }, { at: path });
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
    
    const style = {
      textAlign: element.align || 'left',
      fontFamily: element.marks?.fontFamily || 'Arial',
      fontSize: element.marks?.fontSize || '11pt',
    };

    switch (element.type) {
      case 'bullet-list':
        return (
          <li 
            style={{
              ...style,
              listStyleType: 'none',
              paddingLeft: '1.5em',
              position: 'relative'
            }} 
            {...attributes}
          >
            <span
              style={{
                position: 'absolute',
                left: '0.5em',
              }}
            >
              •
            </span>
            {children}
          </li>
        );
      default:
        return <p style={style} {...attributes}>{children}</p>;
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

  return (
    <Flex direction="column" h="100%" bg="brand.dark.100">
      <EditorMenuBar title={title} />
      <Slate 
        editor={editor} 
        initialValue={value}
        value={value}
        onChange={onChange}
      >
        <EditorToolbar saveStatus={saveStatus} />
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