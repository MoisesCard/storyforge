import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  Tag,
  IconButton,
  useToast,
  Flex,
  Avatar,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function CharacterCard({ character, onEdit, onDelete }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    const fetchProjectTitle = async () => {
      if (!character.projectId) return;
      try {
        const projectDoc = await getDoc(doc(db, 'projects', character.projectId));
        if (projectDoc.exists()) {
          setProjectTitle(projectDoc.data().title);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProjectTitle();
  }, [character.projectId]);

  const handleDelete = async () => {
    try {
      await onDelete(character.id);
      setIsDeleteOpen(false);
    } catch (error) {
      toast({
        title: 'Error deleting character',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Box
        bg="brand.dark.200"
        borderRadius="xl"
        overflow="hidden"
        position="relative"
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-2px)',
          shadow: 'lg',
        }}
      >
        {/* Header with Avatar and Actions */}
        <Flex 
          p={4} 
          align="center" 
          justify="space-between"
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Flex align="center" gap={3}>
            <Avatar
              size="md"
              name={character.name}
              src={character.imageUrl}
              bg="brand.primary"
            />
            <Box>
              <Heading size="md" color="white">
                {character.name}
              </Heading>
              <Text color="brand.text.secondary" fontSize="sm">
                {character.role}
              </Text>
            </Box>
          </Flex>
          <HStack>
            <IconButton
              icon={<FiEdit2 />}
              variant="ghost"
              size="sm"
              colorScheme="blue"
              onClick={() => onEdit(character)}
              aria-label="Edit character"
              _hover={{
                bg: 'rgba(66, 153, 225, 0.2)',
              }}
            />
            <IconButton
              icon={<FiTrash2 />}
              variant="ghost"
              size="sm"
              colorScheme="red"
              onClick={() => setIsDeleteOpen(true)}
              aria-label="Delete character"
              _hover={{
                bg: 'rgba(245, 101, 101, 0.2)',
              }}
            />
          </HStack>
        </Flex>

        {/* Content */}
        <Box p={4}>
          {/* Project Tag */}
          <Tag
            size="md"
            colorScheme="blue"
            mb={4}
            px={3}
            py={1}
            borderRadius="full"
          >
            {projectTitle || 'Unknown Project'}
          </Tag>

          {/* Description */}
          {character.description && (
            <Text
              color="brand.text.secondary"
              fontSize="sm"
              mb={4}
              noOfLines={2}
            >
              {character.description}
            </Text>
          )}

          {/* Traits */}
          {character.traits && character.traits.length > 0 && (
            <Flex gap={2} flexWrap="wrap">
              {character.traits.map((trait, index) => (
                <Tag
                  key={index}
                  size="sm"
                  variant="subtle"
                  colorScheme="purple"
                  borderRadius="full"
                >
                  {trait}
                </Tag>
              ))}
            </Flex>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="brand.dark.200">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
              Delete Character
            </AlertDialogHeader>

            <AlertDialogBody color="brand.text.secondary">
              Are you sure you want to delete {character.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteOpen(false)}
                variant="ghost"
                _hover={{
                  bg: 'brand.dark.300',
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                _hover={{
                  bg: 'red.600',
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default CharacterCard; 