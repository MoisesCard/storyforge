import React, { useState, useEffect } from 'react';
import {
  Grid,
  Text,
  useToast,
  Spinner,
  Center,
  useDisclosure,
} from '@chakra-ui/react';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import CharacterCard from './CharacterCard';
import EditCharacterModal from './EditCharacterModal';

function CharacterList() {
  const { currentUser } = useAuth();
  const [characters, setCharacters] = useState([]);
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

  if (characters.length === 0) {
    return (
      <Center h="200px">
        <Text color="brand.text.secondary">
          No characters yet. Create one to get started!
        </Text>
      </Center>
    );
  }

  return (
    <>
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

      <EditCharacterModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        character={editingCharacter}
        onSave={handleSaveCharacter}
      />
    </>
  );
}

export default CharacterList; 