import { Box, VStack, Button, Text, Divider } from '@chakra-ui/react';
import { FiZap, FiBook, FiEdit3 } from 'react-icons/fi';

function AISidebar({ content }) {
  return (
    <Box 
      w="300px" 
      bg="brand.dark.100" 
      p={4} 
      borderLeft="1px" 
      borderColor="brand.dark.300"
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold" color="brand.text.primary">
          AI Assistant
        </Text>
        <Divider borderColor="brand.dark.300" />
        
        <Button
          leftIcon={<FiZap />}
          variant="outline"
          isDisabled={!content}
        >
          Continue Writing
        </Button>
        
        <Button
          leftIcon={<FiEdit3 />}
          variant="outline"
          isDisabled={!content}
        >
          Improve Writing
        </Button>
        
        <Button
          leftIcon={<FiBook />}
          variant="outline"
          isDisabled={!content}
        >
          Analyze Scene
        </Button>
      </VStack>
    </Box>
  );
}

export default AISidebar; 