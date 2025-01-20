import React, { useState, useEffect } from 'react';
import {
  Grid,
  Text,
  useToast,
  Spinner,
  Center,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
  VStack,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import CharacterCard from './CharacterCard';
import EditCharacterModal from './EditCharacterModal';

function CharacterList() {
  const { currentUser } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
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
      setFilteredCharacters(charactersData); // Initialize filtered characters
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

  // Filter characters based on search query
  useEffect(() => {
    const filtered = characters.filter(character => {
      const searchLower = searchQuery.toLowerCase();
      return (
        character.name?.toLowerCase().includes(searchLower) ||
        character.role?.toLowerCase().includes(searchLower) ||
        character.description?.toLowerCase().includes(searchLower) ||
        character.traits?.some(trait => trait.toLowerCase().includes(searchLower))
      );
    });
    setFilteredCharacters(filtered);
  }, [searchQuery, characters]);

  // Delete character handler
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

  // Edit character handler
  const handleEditCharacter = (character) => {
    setEditingCharacter(character);
    onEditOpen();
  };

  // Save character handler
  const handleSaveCharacter = async (updatedCharacter) => {
    try {
      await updateDoc(doc(db, 'characters', editingCharacter.id), updatedCharacter);
      toast({
        title: 'Character updated',
        status: 'success',
        duration: 3000,
      });
      onEditClose();
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
      <Center h="200px">
        <Spinner size="xl" color="brand.primary" />
      </Center>
    );
  }

  return (
    <VStack spacing={6} width="100%">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search characters by name, role, or traits..."
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

      {filteredCharacters.length === 0 ? (
        <Center h="200px">
          <Text color="brand.text.secondary">
            {characters.length === 0
              ? "No characters yet. Create one to get started!"
              : "No characters found matching your search."}
          </Text>
        </Center>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} width="100%">
          {filteredCharacters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onDelete={handleDeleteCharacter}
              onEdit={handleEditCharacter}
            />
          ))}
        </Grid>
      )}

      <EditCharacterModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        character={editingCharacter}
        onSave={handleSaveCharacter}
      />
    </VStack>
  );
}

export default CharacterList; 