import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Text,
  VStack,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnimatedTitle from '../components/common/AnimatedTitle';

function WorldBuilder() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
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
        ...doc.data()
      }));
      setProjects(projectsData);
      setFilteredProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  // Filter projects based on search query
  useEffect(() => {
    const filtered = projects.filter(project => {
      const searchLower = searchQuery.toLowerCase();
      return (
        project.title?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.genre?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleProjectClick = (projectId) => {
    navigate(`/world-builder/${projectId}`);
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="200px">
          <Spinner size="xl" color="brand.primary" />
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <AnimatedTitle mb={8}>World Builder</AnimatedTitle>
        </Box>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search worlds by title, description, or genre..."
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
              {projects.length === 0
                ? "No worlds yet. Create one to get started!"
                : "No worlds found matching your search."}
            </Text>
          </Box>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {filteredProjects.map((project) => (
              <Box
                key={project.id}
                bg="brand.dark.100"
                p={6}
                borderRadius="xl"
                cursor="pointer"
                onClick={() => handleProjectClick(project.id)}
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
                  transform: 'translateY(-2px)',
                  '&::before': { opacity: 0.3 },
                }}
                transition="all 0.2s"
              >
                <VStack spacing={2} align="start" position="relative" zIndex={1}>
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    {project.title}
                  </Text>
                  <Text color="brand.text.secondary" fontSize="sm">
                    {project.genre}
                  </Text>
                  {project.description && (
                    <Text color="brand.text.secondary" noOfLines={2}>
                      {project.description}
                    </Text>
                  )}
                </VStack>
              </Box>
            ))}
          </Grid>
        )}
      </VStack>
    </Container>
  );
}

export default WorldBuilder; 