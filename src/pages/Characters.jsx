import React, { useState } from 'react';
import {
  Box,
  Container,
  Button,
  HStack,
  Flex,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CharacterList from '../components/characters/CharacterList';
import RelationshipView from '../components/characters/RelationshipView';
import NewCharacterModal from '../components/characters/NewCharacterModal';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import AnimatedTitle from '../components/common/AnimatedTitle';

function Characters() {
  const [activeTab, setActiveTab] = useState('list');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuth();
  const toast = useToast();

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

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <AnimatedTitle mb={8}>Characters</AnimatedTitle>
        <Button
          onClick={onOpen}
          bg="linear-gradient(135deg, brand.primary, brand.secondary)"
          color="white"
          _hover={{
            transform: 'translateY(-2px)',
            shadow: 'lg',
          }}
          transition="all 0.2s"
        >
          + New Character
        </Button>
      </Flex>

      <Box position="relative" mb={8}>
        <Box position="relative" width="fit-content">
          <HStack spacing={0} position="relative">
            <Button
              variant="unstyled"
              px={4}
              py={4}
              width="160px"
              position="relative"
              color={activeTab === 'list' ? 'white' : 'brand.text.secondary'}
              onClick={() => setActiveTab('list')}
              zIndex={1}
              fontWeight="medium"
              fontSize="lg"
              transition="color 0.2s"
              textAlign="center"
              height="60px"
            >
              Character List
            </Button>
            <Button
              variant="unstyled"
              px={4}
              py={4}
              width="160px"
              position="relative"
              color={activeTab === 'relationships' ? 'white' : 'brand.text.secondary'}
              onClick={() => setActiveTab('relationships')}
              zIndex={1}
              fontWeight="medium"
              fontSize="lg"
              transition="color 0.2s"
              textAlign="center"
              height="60px"
            >
              Relationships
            </Button>
          </HStack>
          <motion.div
            initial={false}
            animate={{
              x: activeTab === 'list' ? 0 : '160px',
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: 'absolute',
              width: '160px',
              height: '60px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 77, 141, 0.1)',
              border: '2px solid #FF4D8D',
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />
        </Box>

        <Box mt={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%' }}
          >
            {activeTab === 'list' ? <CharacterList /> : <RelationshipView />}
          </motion.div>
        </Box>
      </Box>

      <NewCharacterModal 
        isOpen={isOpen} 
        onClose={onClose} 
        onCreateCharacter={handleCreateCharacter}
      />
    </Container>
  );
}

export default Characters; 