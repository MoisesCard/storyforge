import React, { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Text,
  Button,
  useDisclosure,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Flex,
  Spinner,
  Center,
  Image,
  Tag,
} from '@chakra-ui/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import RelationshipDiagram from './RelationshipDiagram';
import { FiUsers } from 'react-icons/fi';

function RelationshipView() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [characters, setCharacters] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        const q = query(
          collection(db, 'projects'),
          where('userId', '==', currentUser.uid)
        );

        const snapshot = await getDocs(q);
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser]);

  // Fetch characters for selected project
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!selectedProject) return;
      setLoading(true);

      try {
        const q = query(
          collection(db, 'characters'),
          where('projectId', '==', selectedProject.id)
        );

        const snapshot = await getDocs(q);
        const charactersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCharacters(charactersData);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [selectedProject]);

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.primary" />
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={4} color="white">
          Select a Project
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {projects.map(project => (
            <Card
              key={project.id}
              bg={selectedProject?.id === project.id ? 'brand.dark.300' : 'brand.dark.200'}
              _hover={{
                bg: 'brand.dark.300',
                transform: 'translateY(-2px)',
                cursor: 'pointer',
              }}
              transition="all 0.2s"
              onClick={() => setSelectedProject(project)}
              borderWidth="1px"
              borderColor={selectedProject?.id === project.id ? 'brand.primary' : 'brand.dark.300'}
            >
              <CardBody>
                <VStack spacing={2} align="start">
                  <Heading size="sm" color="white">
                    {project.title}
                  </Heading>
                  <Text color="brand.text.secondary" fontSize="sm">
                    {project.genre}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {selectedProject && (
        <Box mt={6}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color="white">
              Characters in this Project
            </Heading>
            {characters.length >= 2 && (
              <Button
                leftIcon={<Icon as={FiUsers} />}
                onClick={onOpen}
                bg="linear-gradient(135deg, brand.primary, brand.secondary)"
                color="white"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                transition="all 0.2s"
              >
                View Relationships
              </Button>
            )}
          </Flex>

          {characters.length === 0 ? (
            <Card bg="brand.dark.200" p={6}>
              <Text color="brand.text.secondary" textAlign="center">
                No characters have been added to this project yet.
              </Text>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {characters.map(character => (
                <Card
                  key={character.id}
                  bg="brand.dark.200"
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <Flex align="center" gap={4}>
                      <Box
                        w="50px"
                        h="50px"
                        borderRadius="full"
                        bg="brand.dark.300"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="2px solid"
                        borderColor="brand.primary"
                      >
                        {character.imageUrl ? (
                          <Image
                            src={character.imageUrl}
                            alt={character.name}
                            borderRadius="full"
                            boxSize="100%"
                            objectFit="cover"
                          />
                        ) : (
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color="brand.primary"
                          >
                            {character.name[0]}
                          </Text>
                        )}
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Heading size="sm" color="white">
                          {character.name}
                        </Heading>
                        <Text color="brand.text.secondary" fontSize="sm">
                          {character.role}
                        </Text>
                        {character.traits && character.traits.length > 0 && (
                          <Flex gap={2} flexWrap="wrap" mt={2}>
                            {character.traits.slice(0, 2).map((trait, index) => (
                              <Tag
                                key={index}
                                size="sm"
                                variant="subtle"
                                colorScheme="purple"
                              >
                                {trait}
                              </Tag>
                            ))}
                            {character.traits.length > 2 && (
                              <Tag
                                size="sm"
                                variant="subtle"
                                colorScheme="purple"
                              >
                                +{character.traits.length - 2}
                              </Tag>
                            )}
                          </Flex>
                        )}
                      </VStack>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}

          <RelationshipDiagram 
            characters={characters}
            isOpen={isOpen}
            onClose={onClose}
            projectId={selectedProject?.id}
          />
        </Box>
      )}

      {!selectedProject && !loading && (
        <Card bg="brand.dark.200" p={6}>
          <Text color="brand.text.secondary" textAlign="center">
            Select a project to view character relationships.
          </Text>
        </Card>
      )}
    </VStack>
  );
}

export default RelationshipView; 