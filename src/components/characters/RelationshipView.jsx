import React, { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import RelationshipDiagram from './RelationshipDiagram';

function RelationshipView({ onEdit, onDelete }) {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [characters, setCharacters] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;

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
    };

    fetchProjects();
  }, [currentUser]);

  // Fetch characters for selected project
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!selectedProject) return;

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
    };

    fetchCharacters();
  }, [selectedProject]);

  return (
    <VStack spacing={4} align="stretch">
      <Accordion allowToggle>
        {projects.map(project => (
          <AccordionItem key={project.id}>
            <h2>
              <AccordionButton
                _expanded={{ bg: 'brand.dark.200', color: 'white' }}
                onClick={() => setSelectedProject(project)}
              >
                <Box flex="1" textAlign="left">
                  {project.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {characters.length === 0 ? (
                <Text color="brand.text.secondary">
                  No characters found in this project.
                </Text>
              ) : (
                <Box>
                  <Button
                    mb={4}
                    onClick={onOpen}
                    colorScheme="purple"
                    size="sm"
                  >
                    Edit Relationships
                  </Button>
                  <RelationshipDiagram 
                    characters={characters}
                    isOpen={isOpen}
                    onClose={onClose}
                    projectId={selectedProject?.id}
                  />
                </Box>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
}

export default RelationshipView; 