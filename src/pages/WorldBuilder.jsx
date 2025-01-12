import { Box, Heading } from '@chakra-ui/react';

function WorldBuilder() {
  return (
    <Box 
      bg="brand.dark.100" 
      p={6} 
      borderRadius="lg" 
      borderColor="brand.dark.300"
      borderWidth="1px"
    >
      <Heading 
        size="lg"
        color="brand.text.primary"
      >
        World Builder
      </Heading>
    </Box>
  );
}

export default WorldBuilder; 