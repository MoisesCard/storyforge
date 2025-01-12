import { 
  Box, 
  VStack, 
  Text, 
  IconButton, 
  HStack, 
  useToast 
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import useDocumentStore from '../../stores/documentStore';

function DocumentList() {
  const { documents, deleteDocument, setCurrentDocument } = useDocumentStore();
  const toast = useToast();

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      toast({
        title: "Document deleted",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error deleting document",
        status: "error",
        duration: 3000,
      });
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    
    // Convert Firestore Timestamp to Date if necessary
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return format(dateObj, 'MMM d, yyyy h:mm a');
  };

  return (
    <VStack spacing={2} align="stretch" p={4}>
      {documents.map((doc) => (
        <Box
          key={doc.id}
          p={4}
          bg="brand.dark.200"
          borderRadius="md"
          cursor="pointer"
          _hover={{ bg: 'brand.dark.300' }}
          onClick={() => setCurrentDocument(doc)}
        >
          <HStack justify="space-between" mb={2}>
            <Text 
              fontWeight="medium" 
              fontSize="md"
              noOfLines={1}
            >
              {doc.title}
            </Text>
            <HStack spacing={1}>
              <IconButton
                icon={<FiTrash2 />}
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(doc.id);
                }}
                aria-label="Delete document"
              />
            </HStack>
          </HStack>
          <Text 
            fontSize="sm" 
            color="brand.text.secondary"
            noOfLines={1}
          >
            {formatDate(doc.updatedAt)}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}

export default DocumentList; 