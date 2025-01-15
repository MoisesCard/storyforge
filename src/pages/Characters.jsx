import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Button,
  useDisclosure,
  VStack,
  Container,
  Text,
  useToast,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  HStack,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import CharacterCard from '../components/characters/CharacterCard';
import NewCharacterModal from '../components/characters/NewCharacterModal';
import RelationshipView from '../components/characters/RelationshipView';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import EditCharacterModal from '../components/characters/EditCharacterModal';

function Characters() {
  const { currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [editingCharacter, setEditingCharacter] = useState(null);

  // Fetch characters from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'characters'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const charactersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCharacters(charactersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching characters:', error);
      toast({
        title: 'Error fetching characters',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, toast]);

  // Create character in Firestore
  const handleCreateCharacter = async (characterData) => {
    try {
      await addDoc(collection(db, 'characters'), {
        ...characterData,
        userId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      toast({
        title: 'Character created',
        status: 'success',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: 'Error creating character',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Delete character from Firestore
  const handleDeleteCharacter = async (characterId) => {
    try {
      await deleteDoc(doc(db, 'characters', characterId));
      toast({
        title: 'Character deleted',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: 'Error deleting character',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Add edit handler
  const handleEditCharacter = async (character) => {
    setEditingCharacter(character);
    onEditOpen();
  };

  // Add save handler
  const handleSaveCharacter = async (updatedCharacter) => {
    try {
      const characterRef = doc(db, 'characters', updatedCharacter.id);
      await updateDoc(characterRef, {
        ...updatedCharacter,
        updatedAt: new Date(),
      });
      
      toast({
        title: 'Character updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating character:', error);
      toast({
        title: 'Error updating character',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Spinner size="xl" color="brand.primary" />
          <Text color="brand.text.secondary">Loading characters...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading
            size="xl"
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            Characters
          </Heading>
          <Button
            leftIcon={<FiPlus />}
            onClick={onNewOpen}
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
          >
            New Character
          </Button>
        </HStack>

        <Tabs variant="soft-rounded" colorScheme="pink">
          <TabList>
            <Tab>Character List</Tab>
            <Tab>Relationships</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {loading ? (
                <Text>Loading...</Text>
              ) : characters.length === 0 ? (
                <Text>No characters yet. Create one to get started!</Text>
              ) : (
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                  {characters.map(character => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      onDelete={handleDeleteCharacter}
                      onEdit={handleEditCharacter}
                    />
                  ))}
                </Grid>
              )}
            </TabPanel>

            <TabPanel>
              <RelationshipView 
                onEdit={handleEditCharacter}
                onDelete={handleDeleteCharacter}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <NewCharacterModal 
          isOpen={isNewOpen} 
          onClose={onNewClose}
          onCreateCharacter={handleCreateCharacter}
        />
        
        <EditCharacterModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          character={editingCharacter}
          onSave={handleSaveCharacter}
        />
      </VStack>
    </Container>
  );
}

export default Characters; 