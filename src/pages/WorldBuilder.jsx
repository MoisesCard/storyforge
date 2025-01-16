import React from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  VStack,
  Text,
  Icon,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { FiMap, FiPlus } from 'react-icons/fi';
import AnimatedTitle from '../components/common/AnimatedTitle';

function WorldBuilder() {
  const [projects, setProjects] = React.useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  React.useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    }, (error) => {
      console.error("Error fetching projects:", error);
      toast({
        title: 'Error fetching projects',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    });

    return () => unsubscribe();
  }, [currentUser, toast]);

  const handleProjectClick = (projectId) => {
    navigate(`/world-builder/${projectId}`);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <AnimatedTitle mb={8}>World Builder</AnimatedTitle>
        <Button
          leftIcon={<FiPlus />}
          bg="linear-gradient(135deg, brand.primary, brand.secondary)"
          color="white"
          _hover={{
            transform: 'translateY(-2px)',
            shadow: 'lg',
          }}
          transition="all 0.2s"
        >
          New World
        </Button>
      </Flex>

      <Box position="relative" mb={8}>
        <VStack spacing={4} align="stretch">
          {projects.map((project) => (
            <Box
              key={project.id}
              bg="brand.dark.200"
              borderRadius="xl"
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleProjectClick(project.id)}
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                '&::before': { opacity: 0.3 },
              }}
              position="relative"
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
            >
              <Flex
                p={6}
                align="center"
                justify="space-between"
                position="relative"
                zIndex={1}
              >
                <Box>
                  <Heading size="md" color="white" mb={2}>
                    {project.title}
                  </Heading>
                  <Text color="brand.text.secondary" fontSize="sm" noOfLines={2}>
                    {project.description || 'No description'}
                  </Text>
                </Box>
                <Icon
                  as={FiMap}
                  boxSize={6}
                  color="brand.primary"
                />
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Container>
  );
}

export default WorldBuilder; 