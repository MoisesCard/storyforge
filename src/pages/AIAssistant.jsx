import { Box, Heading } from '@chakra-ui/react';

function AIAssistant() {
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
        AI Assistant
      </Heading>
    </Box>
  );
}

export default AIAssistant; 