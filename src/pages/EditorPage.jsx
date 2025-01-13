import React, { useState, useEffect, useCallback } from 'react';
import { Box, Center, Spinner, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Editor from '../components/editor/Editor';
import useDocumentStore from '../stores/documentStore';

// Initial value for the editor
const DEFAULT_VALUE = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

function EditorPage() {
  const { projectId } = useParams();
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Get document store functions
  const { fetchDocument, updateDocument } = useDocumentStore();

  // Load document content
  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true);
        if (projectId) {
          const doc = await fetchDocument(projectId);
          if (doc?.content) {
            setValue(doc.content);
          } else {
            setValue(DEFAULT_VALUE);
          }
        }
      } catch (error) {
        console.error('Error loading document:', error);
        toast({
          title: "Error loading document",
          description: error.message,
          status: "error",
          duration: 5000,
        });
        setValue(DEFAULT_VALUE);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [projectId, fetchDocument, toast]);

  const handleChange = useCallback((newValue) => {
    if (Array.isArray(newValue) && newValue.length > 0) {
      setValue(newValue);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!projectId) return;

    setIsSaving(true);
    try {
      await updateDocument(projectId, {
        content: value,
      });
      
      toast({
        title: "Document saved",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error saving document",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  }, [projectId, value, updateDocument, toast]);

  // Auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (projectId && value !== DEFAULT_VALUE) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [value, projectId, handleSave]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

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
        onSave={handleSave}
        isSaving={isSaving}
      />
    </Box>
  );
}

export default EditorPage; 