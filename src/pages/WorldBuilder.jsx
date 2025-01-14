import React from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

function WorldBuilder() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading
            size="xl"
            bgGradient="linear(to-r, brand.primary, brand.secondary)"
            bgClip="text"
          >
            World Builder
          </Heading>
          <Button
            leftIcon={<FiPlus />}
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'lg',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
          >
            New World
          </Button>
        </HStack>

        <Box
          p={8}
          textAlign="center"
          bg="brand.dark.100"
          borderRadius="lg"
          borderColor="brand.dark.300"
          borderWidth="1px"
        >
          <Text color="brand.text.secondary">
            No worlds yet. Create one to get started!
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}

export default WorldBuilder; 