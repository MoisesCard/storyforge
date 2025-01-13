import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  SimpleGrid,
  Badge,
  useToast,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  HStack,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import useProjectStore from '../stores/projectStore';

function Library() {
  const navigate = useNavigate();
  const toast = useToast();
  const { projects, fetchProjects, deleteProject, isLoading } = useProjectStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectToDelete, setProjectToDelete] = React.useState(null);
  const cancelRef = React.useRef();

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

  const handleProjectClick = (projectId) => {
    navigate(`/editor/${projectId}`);
  };

  const handleDeleteClick = (e, project) => {
    e.stopPropagation(); // Prevent navigation to editor
    setProjectToDelete(project);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(projectToDelete.id);
      toast({
        title: 'Project deleted',
        description: `"${projectToDelete.title}" has been deleted`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setProjectToDelete(null);
    } catch (error) {
      toast({
        title: 'Error deleting project',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading
          size="xl"
          bgGradient="linear(to-r, brand.primary, brand.secondary)"
          bgClip="text"
        >
          Your Projects
        </Heading>

        {isLoading ? (
          <Text>Loading projects...</Text>
        ) : projects.length === 0 ? (
          <Text color="brand.text.secondary">No projects yet. Create one to get started!</Text>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {projects.map((project) => (
              <Box
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                bg="brand.dark.100"
                p={6}
                borderRadius="xl"
                cursor="pointer"
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
                }}
                transition="all 0.3s"
              >
                <VStack align="start" spacing={4} position="relative" zIndex={1}>
                  <HStack w="full" justify="space-between">
                    <Heading size="md" color="white">
                      {project.title}
                    </Heading>
                    <IconButton
                      icon={<FiTrash2 />}
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      onClick={(e) => handleDeleteClick(e, project)}
                      _hover={{
                        bg: 'rgba(255, 0, 0, 0.2)',
                      }}
                    />
                  </HStack>
                  <Badge colorScheme="blue">{project.genre}</Badge>
                  <Text color="brand.text.secondary" noOfLines={2}>
                    {project.description}
                  </Text>
                  <Text color="brand.text.secondary" fontSize="sm">
                    Target: {project.targetAudience}
                  </Text>
                  <Text color="brand.text.secondary" fontSize="sm">
                    Length: {project.estimatedLength}
                  </Text>
                  {project.updatedAt && (
                    <Text color="brand.text.secondary" fontSize="xs">
                      Last edited: {new Date(project.updatedAt).toLocaleDateString()}
                    </Text>
                  )}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="brand.dark.100">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Project
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}

export default Library; 