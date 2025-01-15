import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiBook } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const CharacterCard = ({ character, onEdit, onDelete }) => {
  const [projectName, setProjectName] = useState('');

  // Fetch project name when component mounts
  useEffect(() => {
    const fetchProjectName = async () => {
      if (!character.projectId) return;
      
      try {
        const projectDoc = await getDoc(doc(db, 'projects', character.projectId));
        if (projectDoc.exists()) {
          setProjectName(projectDoc.data().title);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProjectName();
  }, [character.projectId]);

  return (
    <Box
      bg="brand.dark.100"
      p={4}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="brand.dark.300"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'lg',
      }}
    >
      <HStack spacing={4} align="start">
        <Avatar
          size="lg"
          name={character.name}
          src={character.imageUrl}
          bg="brand.primary"
        />
        <VStack align="start" flex={1} spacing={2}>
          <HStack justify="space-between" w="100%">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" color="white">
                {character.name}
              </Text>
              <Text fontSize="sm" color="brand.text.secondary">
                {character.role}
              </Text>
            </VStack>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
              />
              <MenuList bg="brand.dark.200">
                <MenuItem 
                  icon={<FiEdit2 />} 
                  onClick={() => onEdit(character)}
                  _hover={{ bg: 'brand.dark.300' }}
                >
                  Edit
                </MenuItem>
                <MenuItem 
                  icon={<FiTrash2 />} 
                  onClick={() => onDelete(character.id)}
                  color="red.400"
                  _hover={{ bg: 'brand.dark.300' }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* Project Badge */}
          {projectName && (
            <Tooltip label="Linked Project" placement="top">
              <Badge
                display="flex"
                alignItems="center"
                gap={1}
                colorScheme="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
              >
                <FiBook size={12} />
                {projectName}
              </Badge>
            </Tooltip>
          )}
          
          {/* Character Traits */}
          <HStack spacing={2} wrap="wrap">
            {character.traits.map((trait, index) => (
              <Badge
                key={index}
                colorScheme="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
              >
                {trait}
              </Badge>
            ))}
          </HStack>

          <Text 
            fontSize="sm" 
            color="brand.text.secondary"
            noOfLines={2}
          >
            {character.description}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default CharacterCard; 