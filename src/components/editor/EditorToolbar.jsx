import { Box, HStack, IconButton, Button, ButtonGroup, Spacer } from '@chakra-ui/react';
import { FiBold, FiItalic, FiList, FiSave } from 'react-icons/fi';

function EditorToolbar({ onSave, isSaving, onFormat }) {
  return (
    <Box 
      w="full" 
      bg="brand.dark.100" 
      px={6}
      py={2}
      borderBottom="1px" 
      borderColor="brand.dark.300"
    >
      <HStack spacing={2}>
        <ButtonGroup size="sm" variant="ghost" spacing={1}>
          <IconButton
            icon={<FiBold />}
            onClick={() => onFormat('bold')}
            aria-label="Bold"
          />
          <IconButton
            icon={<FiItalic />}
            onClick={() => onFormat('italic')}
            aria-label="Italic"
          />
          <IconButton
            icon={<FiList />}
            onClick={() => onFormat('list')}
            aria-label="List"
          />
        </ButtonGroup>
        <Spacer />
        <Button
          leftIcon={<FiSave />}
          size="sm"
          colorScheme="brand"
          isLoading={isSaving}
          onClick={onSave}
        >
          Save
        </Button>
      </HStack>
    </Box>
  );
}

export default EditorToolbar; 