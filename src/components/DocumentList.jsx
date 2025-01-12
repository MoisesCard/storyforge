import { VStack, Box, Text } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';

// Helper function to safely format dates
const formatDate = (timestamp) => {
  try {
    // Log what we received
    console.log('Attempting to format timestamp:', {
      value: timestamp,
      type: typeof timestamp,
      isDate: timestamp instanceof Date,
      hasToDate: timestamp?.toDate,
      hasSeconds: timestamp?.seconds
    });

    // If no timestamp, try clientUpdatedAt
    if (!timestamp && this?.clientUpdatedAt) {
      return format(parseISO(this.clientUpdatedAt), 'MMM d, yyyy');
    }

    let dateToFormat;

    // If it's a Firestore Timestamp
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
      try {
        dateToFormat = timestamp.toDate();
      } catch (e) {
        console.warn('Error converting Firestore timestamp:', e);
        // Try using clientUpdatedAt as fallback
        if (this?.clientUpdatedAt) {
          return format(parseISO(this.clientUpdatedAt), 'MMM d, yyyy');
        }
        return '---';
      }
    }
    // If it's already a Date
    else if (timestamp instanceof Date) {
      dateToFormat = timestamp;
    }
    // If it's a Firestore timestamp object (with seconds)
    else if (typeof timestamp === 'object' && 'seconds' in timestamp) {
      dateToFormat = new Date(timestamp.seconds * 1000);
    }
    // If it's a number (milliseconds since epoch)
    else if (typeof timestamp === 'number') {
      dateToFormat = new Date(timestamp);
    }
    // If it's an ISO string
    else if (typeof timestamp === 'string') {
      try {
        dateToFormat = parseISO(timestamp);
      } catch (e) {
        console.warn('Error parsing ISO string:', e);
        return '---';
      }
    }

    // Validate the date before formatting
    if (!dateToFormat || !(dateToFormat instanceof Date) || isNaN(dateToFormat.getTime())) {
      console.warn('Invalid date:', dateToFormat);
      // Try using clientUpdatedAt as fallback
      if (this?.clientUpdatedAt) {
        return format(parseISO(this.clientUpdatedAt), 'MMM d, yyyy');
      }
      return '---';
    }

    // Format the valid date
    return format(dateToFormat, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error in formatDate:', {
      error,
      timestamp,
      timestampType: typeof timestamp,
      timestampValue: JSON.stringify(timestamp)
    });
    return '---';
  }
};

const DocumentList = ({ documents = [] }) => {
  // Log the documents we receive
  console.log('DocumentList received:', {
    documentsLength: documents?.length,
    firstDocument: documents?.[0],
    allDocuments: documents
  });

  if (!documents || documents.length === 0) {
    return (
      <VStack spacing={4} align="stretch" w="100%">
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Text>No documents yet</Text>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {documents.map((doc) => {
        // Log each document as we process it
        console.log('Processing document:', {
          id: doc?.id,
          title: doc?.title,
          updatedAt: doc?.updatedAt,
          clientUpdatedAt: doc?.clientUpdatedAt,
          updatedAtType: typeof doc?.updatedAt
        });

        return (
          <Box key={doc?.id || 'temp'} p={4} borderWidth="1px" borderRadius="md">
            <Text>{doc?.title || 'Untitled'}</Text>
            <Text fontSize="sm" color="gray.500">
              Last modified: {formatDate.call(doc, doc?.updatedAt)}
            </Text>
          </Box>
        );
      })}
    </VStack>
  );
};

export default DocumentList; 