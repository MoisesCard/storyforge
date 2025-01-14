import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ProjectCard from '../components/projects/ProjectCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NewProjectModal from '../components/modals/NewProjectModal';

function Library() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch projects from Firebase
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      }));

      projectsData.sort((a, b) => b.updatedAt - a.updatedAt);
      setProjects(projectsData);
      setFilteredProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects:', error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  // Filter projects based on search query
  useEffect(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Spinner size="xl" color="brand.primary" />
          <Text color="brand.text.secondary">Loading your projects...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Text color="red.500">Error: {error}</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading
            size="xl"
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            Library
          </Heading>
          <Button
            leftIcon={<FiPlus />}
            onClick={onOpen}
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
          >
            New Project
          </Button>
        </HStack>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search projects by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="brand.dark.100"
            borderColor="brand.dark.300"
            _hover={{
              borderColor: 'brand.primary',
            }}
            _focus={{
              borderColor: 'brand.primary',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)',
            }}
          />
        </InputGroup>

        {filteredProjects.length === 0 ? (
          <Box
            p={8}
            textAlign="center"
            bg="brand.dark.100"
            borderRadius="lg"
            borderColor="brand.dark.300"
            borderWidth="1px"
          >
            <Text color="brand.text.secondary">
              {searchQuery 
                ? "No projects found matching your search"
                : "No projects yet. Create one to get started!"}
            </Text>
          </Box>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Grid>
        )}
      </VStack>

      <NewProjectModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}

export default Library; 