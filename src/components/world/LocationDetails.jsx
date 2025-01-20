import React from 'react';
import { Box, HStack, VStack, Heading, Text, IconButton } from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

function LocationDetails({ location, onEdit, onDelete }) {
  console.log('Location data in details:', {
    location,
    hasCharacters: !!location.linkedCharacters,
    charactersLength: location.linkedCharacters?.length,
    hasEvents: !!location.linkedEvents,
    eventsLength: location.linkedEvents?.length,
    rawData: JSON.stringify(location, null, 2)
  });

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">{location.name}</Heading>
        <HStack>
          <IconButton
            icon={<FiEdit2 />}
            onClick={onEdit}
            variant="ghost"
            aria-label="Edit location"
          />
          <IconButton
            icon={<FiTrash2 />}
            onClick={onDelete}
            variant="ghost"
            colorScheme="red"
            aria-label="Delete location"
          />
        </HStack>
      </HStack>

      <VStack align="stretch" spacing={6}>
        <Box>
          <Text fontWeight="bold" mb={2}>Type</Text>
          <Text>{location.type}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>Description</Text>
          <Text>{location.description}</Text>
        </Box>

        {/* Linked Characters Section */}
        <Box bg="brand.dark.200" p={4} borderRadius="md">
          <Text fontWeight="bold" mb={3}>Linked Characters</Text>
          <VStack align="stretch" spacing={2}>
            {location.linkedCharacters?.map(character => (
              <HStack key={character.value} spacing={3} p={2} borderRadius="md" bg="brand.dark.300">
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="blue.400"
                />
                <Text>
                  {character.name || character.label}
                </Text>
              </HStack>
            ))}
            {(!location.linkedCharacters || location.linkedCharacters.length === 0) && (
              <Text color="brand.text.secondary">No characters linked</Text>
            )}
          </VStack>
        </Box>

        {/* Linked Events Section */}
        <Box bg="brand.dark.200" p={4} borderRadius="md">
          <Text fontWeight="bold" mb={3}>Linked Events</Text>
          <VStack align="stretch" spacing={2}>
            {location.linkedEvents?.map(event => (
              <HStack key={event.value} spacing={3} p={2} borderRadius="md" bg="brand.dark.300">
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="purple.400"
                />
                <VStack align="start" spacing={0}>
                  <Text>
                    {event.label}
                  </Text>
                  <Text fontSize="sm" color="brand.text.secondary">
                    {event.date}
                  </Text>
                </VStack>
              </HStack>
            ))}
            {(!location.linkedEvents || location.linkedEvents.length === 0) && (
              <Text color="brand.text.secondary">No events linked</Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default LocationDetails; 