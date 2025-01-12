import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Button,
  useToast,
  Flex,
  Textarea,
} from '@chakra-ui/react';
import useProjectStore from '../stores/projectStore';

function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchProject, updateProject, currentProject, isLoading } = useProjectStore();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load project data
  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      try {
        console.log('Loading project:', projectId);
        const project = await fetchProject(projectId);
        if (mounted) {
          console.log('Setting initial content:', project.content);
          setContent(project.content || '');
        }
      } catch (error) {
        console.error('Error loading project:', error);
        if (mounted) {
          toast({
            title: 'Error loading project',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    if (projectId) {
      loadProject();
    }

    return () => {
      mounted = false;
    };
  }, [projectId, fetchProject, toast]);

  // Save changes
  const handleSave = useCallback(async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      console.log('Attempting to save:', {
        projectId,
        contentLength: content.length,
        contentPreview: content.substring(0, 100),
        fullContent: content // Temporarily log full content for debugging
      });

      await updateProject(projectId, { 
        content,
        lastSaved: new Date().toISOString() 
      });

      console.log('Save completed');
      
      toast({
        title: 'Changes saved',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: 'Error saving changes',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, projectId, content, updateProject, toast]);

  // Auto-save setup with debounce
  useEffect(() => {
    if (!content || !currentProject) return;

    const timeoutId = setTimeout(() => {
      if (content !== currentProject.content) {
        console.log('Auto-saving content...');
        handleSave().catch(console.error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [content, currentProject, handleSave]);

  // Handle content changes
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.primary" />
          <Text>Loading project...</Text>
        </VStack>
      </Flex>
    );
  }

  if (!currentProject) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <VStack spacing={4}>
          <Text>Project not found</Text>
          <Button onClick={() => navigate('/')} colorScheme="blue">
            Return to Dashboard
          </Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">{currentProject.title}</Heading>
          <HStack spacing={4}>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save
            </Button>
          </HStack>
        </HStack>

        <Box bg="brand.dark.100" p={6} borderRadius="md">
          <Text>Genre: {currentProject.genre}</Text>
          <Text>Target Audience: {currentProject.targetAudience}</Text>
          <Text>Estimated Length: {currentProject.estimatedLength}</Text>
          <Text>Description: {currentProject.description}</Text>
        </Box>

        <Box bg="brand.dark.100" p={6} borderRadius="md" flex={1}>
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your story here..."
            minH="500px"
            resize="vertical"
            bg="transparent"
            border="none"
            _focus={{
              border: "none",
              boxShadow: "none"
            }}
            fontSize="md"
            lineHeight="1.7"
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default Editor; 