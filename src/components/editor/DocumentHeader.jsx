import { Box, Input } from '@chakra-ui/react';
import { useCallback } from 'react';
import useDocumentStore from '../../stores/documentStore';

function DocumentHeader({ title, onTitleChange }) {
  const { currentDoc, updateDocument } = useDocumentStore();
  
  const handleTitleChange = useCallback(async (e) => {
    const newTitle = e.target.value;
    onTitleChange(newTitle);
    
    if (currentDoc?.id) {
      await updateDocument(currentDoc.id, { title: newTitle });
    }
  }, [onTitleChange, currentDoc, updateDocument]);

  return (
    <Box 
      w="full" 
      bg="brand.dark.100" 
      px={6}
      py={4}
    >
      <Input
        value={title || ''}
        onChange={handleTitleChange}
        placeholder="Untitled Document"
        variant="filled"
        size="md"
        fontSize="lg"
        fontWeight="medium"
        bg="brand.dark.200"
        border="none"
        _hover={{ bg: 'brand.dark.300' }}
        _focus={{ 
          bg: 'brand.dark.300',
          boxShadow: 'none'
        }}
      />
    </Box>
  );
}

export default DocumentHeader; 