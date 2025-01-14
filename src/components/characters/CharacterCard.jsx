import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

function CharacterCard({ character, onDelete }) {
  return (
    <Box
      bg="brand.dark.100"
      p={6}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        bg: 'linear-gradient(45deg, brand.primary, brand.secondary)',
        zIndex: 0,
        borderRadius: 'xl',
        opacity: 0,
        transition: 'opacity 0.3s',
      }}
      _hover={{
        transform: 'translateY(-4px)',
        '&::before': { opacity: 0.3 },
      }}
      transition="all 0.3s"
    >
      <VStack align="start" spacing={4} position="relative" zIndex={1}>
        <HStack w="full" justify="space-between">
          <Heading size="md" color="white">
            {character.name}
          </Heading>
          <HStack>
            <IconButton
              icon={<FiEdit2 />}
              variant="ghost"
              size="sm"
              aria-label="Edit character"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.1)',
              }}
            />
            <IconButton
              icon={<FiTrash2 />}
              variant="ghost"
              colorScheme="red"
              size="sm"
              aria-label="Delete character"
              onClick={() => onDelete(character.id)}
              _hover={{
                bg: 'rgba(255, 0, 0, 0.2)',
              }}
            />
          </HStack>
        </HStack>

        <Badge colorScheme="blue">{character.role}</Badge>
        
        <Text color="brand.text.secondary" noOfLines={3}>
          {character.description}
        </Text>

        <VStack align="start" spacing={2} w="full">
          <Text color="brand.text.secondary" fontSize="sm">
            Age: {character.age}
          </Text>
          <Text color="brand.text.secondary" fontSize="sm">
            Occupation: {character.occupation}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}

export default CharacterCard; 