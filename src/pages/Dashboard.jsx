import { Box, Container, SimpleGrid, Heading, Text, VStack, Icon, useDisclosure, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiPlus, FiBook, FiClock } from 'react-icons/fi';
import NewProjectModal from '../components/modals/NewProjectModal';
import useProjectStore from '../stores/projectStore';
import { useState, useEffect } from 'react';

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { createProject, fetchProjects, projects } = useProjectStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);

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
      
      // Close modal and navigate in sequence
      onClose();
      navigate(`/editor/${newProject.id}`); // Use path parameter format
      
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

  const recentProject = projects[0] || {
    id: null,
    title: 'No Recent Projects',
    lastEdited: '',
    path: '/'
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects();
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: 'Error loading projects',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadProjects();
  }, [fetchProjects, toast]);

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={16} align="center">
        <Box textAlign="center">
          <Heading 
            size="2xl" 
            mb={6}
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            Welcome to StoryForge
          </Heading>
          <Text 
            fontSize="xl" 
            color="brand.text.secondary"
            maxW="2xl"
            textAlign="center"
          >
            Your creative writing assistant. Start writing, build your world, and bring your stories to life.
          </Text>
        </Box>

        <SimpleGrid columns={[1, null, 3]} spacing={8} w="full">
          {/* New Project Card */}
          <Box
            onClick={onOpen}
            p={8}
            bg="brand.dark.100"
            borderRadius="xl"
            position="relative"
            overflow="hidden"
            cursor="pointer"
            _before={{
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              bg: 'linear-gradient(45deg, brand.primary, brand.secondary)',
              zIndex: 0,
              borderRadius: 'xl',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            _hover={{
              transform: 'translateY(-4px)',
              '&::before': { opacity: 0.3 },
              '& > *': { transform: 'scale(1.05)' },
            }}
            transition="all 0.3s"
          >
            <VStack
              spacing={4}
              position="relative"
              zIndex={1}
              transition="transform 0.3s"
            >
              <Icon as={FiPlus} w={10} h={10} color="brand.primary" />
              <Heading size="md" color="white">New Project</Heading>
              <Text color="brand.text.secondary" textAlign="center" fontSize="sm">
                Start a new writing project
              </Text>
            </VStack>
          </Box>

          {/* Library Card */}
          <Box
            as={RouterLink}
            to="/library"
            p={8}
            bg="brand.dark.100"
            borderRadius="xl"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              bg: 'linear-gradient(45deg, brand.primary, brand.secondary)',
              zIndex: 0,
              borderRadius: 'xl',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            _hover={{
              transform: 'translateY(-4px)',
              '&::before': { opacity: 0.3 },
              '& > *': { transform: 'scale(1.05)' },
            }}
            transition="all 0.3s"
          >
            <VStack
              spacing={4}
              position="relative"
              zIndex={1}
              transition="transform 0.3s"
            >
              <Icon as={FiBook} w={10} h={10} color="brand.primary" />
              <Heading size="md" color="white">Library</Heading>
              <Text color="brand.text.secondary" textAlign="center" fontSize="sm">
                Access your projects
              </Text>
            </VStack>
          </Box>

          {/* Continue Recent Project Card */}
          <Box
            as={RouterLink}
            to={recentProject.id ? `/editor/${recentProject.id}` : '/'}
            p={8}
            bg="brand.dark.100"
            borderRadius="xl"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              bg: 'linear-gradient(45deg, brand.primary, brand.secondary)',
              zIndex: 0,
              borderRadius: 'xl',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            _hover={{
              transform: 'translateY(-4px)',
              '&::before': { opacity: 0.3 },
              '& > *': { transform: 'scale(1.05)' },
            }}
            transition="all 0.3s"
          >
            <VStack
              spacing={4}
              position="relative"
              zIndex={1}
              transition="transform 0.3s"
            >
              <Icon as={FiClock} w={10} h={10} color="brand.primary" />
              <Heading size="md" color="white">Continue Writing</Heading>
              <Text color="brand.text.secondary" textAlign="center" fontSize="sm">
                {recentProject.title}
              </Text>
              <Text color="brand.text.secondary" fontSize="xs">
                Last edited {recentProject.lastEdited}
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>

      <NewProjectModal 
        isOpen={isOpen} 
        onClose={onClose}
        onCreateProject={handleCreateProject}
      />
    </Container>
  );
}

export default Dashboard; 