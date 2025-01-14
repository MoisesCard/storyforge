import React, { useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Button,
  useDisclosure,
  VStack,
  Container,
  Text,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import CharacterCard from '../components/characters/CharacterCard';
import NewCharacterModal from '../components/characters/NewCharacterModal';

function Characters() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [characters, setCharacters] = useState([]);

  const handleCreateCharacter = (characterData) => {
    setCharacters([...characters, { id: Date.now(), ...characterData }]);
    onClose();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading
            size="xl"
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            Characters
          </Heading>
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
                onDelete={(id) => {
                  setCharacters(characters.filter(c => c.id !== id));
                }}
              />
            ))}
          </Grid>
        )}

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