import { Box, Flex, useToast } from '@chakra-ui/react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useState, useCallback, useRef, useEffect } from 'react';
import EditorToolbar from '../components/editor/EditorToolbar';
import DocumentHeader from '../components/editor/DocumentHeader';
import DocumentList from '../components/editor/DocumentList';
import AISidebar from '../components/editor/AISidebar';
import useDocumentStore from '../stores/documentStore';
import { useSearchParams } from 'react-router-dom';
import useProjectStore from '../stores/projectStore';

function Editor() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  console.log('Editor mounted with projectId:', projectId);
  
  const { fetchProject } = useProjectStore();
  
  // State declarations
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Refs
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);
  const autoSaveTimerRef = useRef(null);

  // Hooks
  const toast = useToast();
  const { 
    currentDoc, 
    createDocument, 
    updateDocument 
  } = useDocumentStore();

  // Callbacks
  const handleEditorChange = useCallback((value) => {
    setContent(value);
  }, []);

  const handleTitleChange = useCallback(async (newTitle) => {
    setTitle(newTitle);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      if (currentDoc?.id) {
        await updateDocument(currentDoc.id, { 
          content, 
          title,
          projectId,
          updatedAt: new Date()
        });
      } else {
        await createDocument({
          title: title || `Untitled ${new Date().toLocaleDateString()}`,
          content,
          projectId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      toast({
        title: "Saved successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error saving",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  }, [content, title, currentDoc, projectId, createDocument, updateDocument, toast]);

  const handleFormat = useCallback((formatType) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const model = editor.getModel();
    
    if (!selection || !model) return;

    if (formatType === 'list') {
      const lineNumber = selection.startLineNumber;
      const lineContent = model.getLineContent(lineNumber);
      const newContent = `- ${lineContent}`;
      
      model.pushEditOperations(
        [],
        [{
          range: {
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: lineContent.length + 1
          },
          text: newContent
        }],
        () => null
      );
      return;
    }

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      [{
        range: {
          startLineNumber: selection.startLineNumber,
          startColumn: selection.startColumn,
          endLineNumber: selection.endLineNumber,
          endColumn: selection.endColumn
        },
        options: {
          inlineClassName: `editor-${formatType}`,
          stickiness: 1
        }
      }]
    );
  }, []);

  const handleEditorDidMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  // Effects
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId).then(project => {
        // Create initial document if none exists
        if (!project.documents || project.documents.length === 0) {
          createDocument({
            title: project.title,
            content: '',
            projectId: project.id
          });
        }
      });
    }
  }, [projectId, fetchProject, createDocument]);

  useEffect(() => {
    if (currentDoc) {
      setContent(currentDoc.content);
      setTitle(currentDoc.title);
    }
  }, [currentDoc]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (currentDoc?.id && (content !== currentDoc.content || title !== currentDoc.title)) {
      autoSaveTimerRef.current = setTimeout(handleSave, 3000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, title, currentDoc, handleSave]);

  // Render
  return (
    <Flex h="calc(100vh - 64px)" gap={0}>
      <Box 
        w="240px" 
        bg="brand.dark.100" 
        borderRight="1px" 
        borderColor="brand.dark.300"
        overflowY="auto"
      >
        <DocumentList />
      </Box>
      <Box flex={1} display="flex" flexDirection="column">
        <Box borderBottom="1px" borderColor="brand.dark.300">
          <DocumentHeader 
            title={title} 
            onTitleChange={handleTitleChange}
          />
          <EditorToolbar 
            onSave={handleSave} 
            isSaving={isSaving}
            onFormat={handleFormat}
          />
        </Box>
        <Box flex={1} position="relative">
          <MonacoEditor
            height="100%"
            defaultLanguage="plaintext"
            value={content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              lineNumbers: 'off',
              fontSize: 16,
              padding: { top: 16, left: 16, right: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </Box>
      </Box>
      <Box 
        w="280px" 
        bg="brand.dark.100" 
        borderLeft="1px" 
        borderColor="brand.dark.300"
      >
        <AISidebar content={content} />
      </Box>
    </Flex>
  );
}

export default Editor; 