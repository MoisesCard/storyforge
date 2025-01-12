import { Box, HStack, Button, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import useProjectStore from '../../stores/projectStore';
import NewProjectModal from '../modals/NewProjectModal';
import { useState } from 'react';

function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { createProject } = useProjectStore();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

  const handleCreateProject = async (projectData) => {
    if (isCreating) {
      console.log('Already creating a project, skipping...');
      return;
    }

    try {
      setIsCreating(true);
      console.log('Creating project with data:', projectData);
      const newProject = await createProject(projectData);
      
      if (!newProject || !newProject.id) {
        throw new Error('Failed to create project - no project ID returned');
      }
      
      console.log('Created project:', newProject);
      
      // Close modal first
      onClose();
      
      // Navigate to the editor
      navigate(`/editor/${newProject.id}`);
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error creating project",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box minH="100vh" bg="brand.dark.200">
      {/* Header */}
      <Box as="header" bg="brand.dark.100" py={4} px={8}>
        <HStack justify="space-between">
          <RouterLink to="/">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, brand.primary, brand.secondary)"
              bgClip="text"
            >
              StoryForge
            </Text>
          </RouterLink>
          <Button
            leftIcon={<FiPlus />}
            onClick={onOpen}
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            _hover={{
              transform: 'translateY(-1px)',
              shadow: 'lg',
            }}
          >
            New Project
          </Button>
        </HStack>
      </Box>

      {/* Main content */}
      <Box as="main">
        {children}
      </Box>

      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={isOpen} 
        onClose={onClose}
        onCreateProject={handleCreateProject}
      />
    </Box>
  );
}

export default Layout; 