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
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import CharacterCard from '../components/characters/CharacterCard';
import NewCharacterModal from '../components/characters/NewCharacterModal';
import RelationshipView from '../components/characters/RelationshipView';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

function Characters() {
  const { currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
        <Heading
          size="xl"
          bgGradient="linear(to-r, brand.primary, brand.secondary)"
          bgClip="text"
        >
          Characters
        </Heading>

        <Tabs variant="soft-rounded" colorScheme="pink">
          <TabList>
            <Tab>Character List</Tab>
            <Tab>Relationships</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box display="flex" justifyContent="flex-end" mb={4}>
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
                  New Character
                </Button>
              </Box>

              {characters.length === 0 ? (
                <Box 
                  p={8} 
                  textAlign="center" 
                  bg="brand.dark.100" 
                  borderRadius="lg"
                  borderColor="brand.dark.300"
                  borderWidth="1px"
                >
                  <Text color="brand.text.secondary">
                    No characters yet. Create one to get started!
                  </Text>
                </Box>
              ) : (
                <Grid 
                  templateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
                  gap={6}
                >
                  {characters.map(character => (
                    <CharacterCard 
                      key={character.id} 
                      character={character} 
                      onDelete={handleDeleteCharacter}
                    />
                  ))}
                </Grid>
              )}
            </TabPanel>

            <TabPanel>
              <RelationshipView />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <NewCharacterModal 
          isOpen={isOpen} 
          onClose={onClose}
          onCreateCharacter={handleCreateCharacter}
        />
      </VStack>
    </Container>
  );
}

export default Characters; 