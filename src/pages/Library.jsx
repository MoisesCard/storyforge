import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ProjectCard from '../components/projects/ProjectCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Library() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects:', error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

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
        <Heading
          size="xl"
          bgGradient="linear(to-r, brand.primary, brand.secondary)"
          bgClip="text"
        >
          Library
        </Heading>

        {projects.length === 0 ? (
          <Box
            p={8}
            textAlign="center"
            bg="brand.dark.100"
            borderRadius="lg"
            borderColor="brand.dark.300"
            borderWidth="1px"
          >
            <Text color="brand.text.secondary">
              No projects yet. Create one to get started!
            </Text>
          </Box>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Grid>
        )}
      </VStack>
    </Container>
  );
}

export default Library; 