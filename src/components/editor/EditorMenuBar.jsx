import React from 'react';
import { 
  Flex, 
  Text,
} from '@chakra-ui/react';

const EditorMenuBar = ({ title = 'Untitled Document' }) => {
  return (
    <Flex 
      justify="space-between" 
      align="center" 
      px={4} 
      py={2} 
      borderBottom="1px" 
      borderColor="brand.dark.300"
      bg="brand.dark.200"
    >
      <Text color="brand.text.secondary">{title}</Text>
    </Flex>
  );
};

export default EditorMenuBar; 