import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Center,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '../components/editor/Editor';
import useDocumentStore from '../stores/documentStore';
import { debounce } from 'lodash';
import { FiSave } from 'react-icons/fi';
import { validateSlateValue, DEFAULT_VALUE } from '../utils/editorUtils';

function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('Untitled Document');
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const { fetchDocument, updateDocument } = useDocumentStore();

  // Create a ref for the debounced save function
  const debouncedSaveRef = useRef();

  // Initialize the debounced save function
  useEffect(() => {
    debouncedSaveRef.current = debounce(async (content) => {
      try {
        await updateDocument(projectId, { content: validateSlateValue(content) });
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
        setValue(doc?.content || DEFAULT_VALUE);
        setTitle(doc?.title || 'Untitled Document');
        setError(null);
      } catch (error) {
        console.error('Error loading document:', error);
        setError(error.message);
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

  const handleSave = useCallback(async () => {
    try {
      setSaveStatus('saving');
      await updateDocument(projectId, { content: value });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving document:', error);
      setSaveStatus('error');
      setError(error.message);
    }
  }, [projectId, value, updateDocument]);

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
    <Box h="100vh" bg="brand.dark.100">
      {/* Header section */}
      <Box 
        p={4} 
        borderBottom="1px" 
        borderColor="brand.dark.300"
        bg="brand.dark.200"
      >
        <HStack justify="space-between" align="center">
          <Heading 
            size="xl"
            bgGradient="linear(to-r, purple.400, pink.400)"
            bgClip="text"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            {title}
          </Heading>
          
          <IconButton
            icon={<FiSave />}
            aria-label="Save"
            variant="solid"
            bg="brand.dark.400"
            color="white"
            _hover={{ bg: 'brand.primary' }}
            onClick={handleSave}
            size="md"
          />
        </HStack>
      </Box>

      <Editor 
        value={validateSlateValue(value)}
        onChange={handleChange}
        projectId={projectId}
        saveStatus={saveStatus}
      />
    </Box>
  );
}

export default EditorPage; 