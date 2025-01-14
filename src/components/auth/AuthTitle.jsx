import React from 'react';
import { VStack, Heading, Text } from '@chakra-ui/react';

function AuthTitle() {
  return (
    <VStack spacing={2} mb={8}>
      <Heading
        size="2xl"
        bgGradient="linear(to-r, brand.primary, brand.secondary)"
        bgClip="text"
        letterSpacing="tight"
        fontWeight="extrabold"
      >
        STORY FORGE
      </Heading>
      <Text color="brand.text.secondary" fontSize="lg">
        Craft Your Story, Shape Your World
      </Text>
    </VStack>
  );
}

export default AuthTitle; 