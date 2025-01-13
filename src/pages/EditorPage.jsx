import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '../components/editor/Editor';
import useDocumentStore from '../stores/documentStore';
import { debounce } from 'lodash';

// Initial value for the editor
const DEFAULT_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [title, setTitle] = useState('Untitled Document');
  const [error, setError] = useState(null);
  const { fetchDocument, updateDocument } = useDocumentStore();

  // Create a ref for the debounced save function
  const debouncedSaveRef = useRef();

  // Initialize the debounced save function
  useEffect(() => {
    debouncedSaveRef.current = debounce(async (content) => {
      try {
        await updateDocument(projectId, { content });
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving document:', error);
        setSaveStatus('error');
        setError(error.message);
      }
    }, 1000);

    return () => {
      debouncedSaveRef.current?.cancel();
    };
  }, [projectId, updateDocument]);

  // Load document content
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const doc = await fetchDocument(projectId);
        setValue(doc.content || DEFAULT_VALUE);
        setTitle(doc.title || 'Untitled Document');
        setError(null);
      } catch (error) {
        console.error('Error loading document:', error);
        setError(error.message);
        // Optionally navigate back to library on fatal errors
        // if (error.code === 'permission-denied') navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    loadDocument();
  }, [projectId, fetchDocument, navigate]);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    setSaveStatus('saving');
    debouncedSaveRef.current?.(newValue);
  }, []);

  if (error) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Text color="red.500">Error: {error}</Text>
          <Text>Please try refreshing the page</Text>
        </VStack>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box h="100vh">
      <Editor 
        value={value}
        onChange={handleChange}
        projectId={projectId}
        saveStatus={saveStatus}
        title={title}
      />
    </Box>
  );
}

export default EditorPage; 