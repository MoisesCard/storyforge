import React from 'react';
import {
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiChevronDown,
  FiMessageSquare,
  FiVideo,
  FiLock,
  FiShare2,
  FiSave,
} from 'react-icons/fi';

const EditorMenuBar = ({ onSave, isSaving }) => {
  const menuStyles = {
    menuList: {
      bg: 'brand.dark.200',
      borderColor: 'brand.dark.300',
    },
    menuItem: {
      bg: 'brand.dark.200',
      color: 'brand.text.primary',
      _hover: {
        bg: 'brand.dark.300',
      },
      _focus: {
        bg: 'brand.dark.300',
      },
    },
  };

  return (
    <HStack
      w="100%"
      px={2}
      py={1}
      borderBottom="1px"
      borderColor="brand.dark.300"
      bg="brand.dark.100"
      color="brand.text.primary"
      spacing={4}
      align="center"
    >
      {/* Left side */}
      <HStack spacing={4}>
        {/* File Menu */}
        <Menu>
          <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown />} variant="ghost">
            File
          </MenuButton>
          <MenuList sx={menuStyles.menuList}>
            <MenuItem sx={menuStyles.menuItem}>New</MenuItem>
            <MenuItem sx={menuStyles.menuItem}>Open</MenuItem>
            <MenuItem sx={menuStyles.menuItem}>Make a copy</MenuItem>
            <MenuItem sx={menuStyles.menuItem}>Download</MenuItem>
            <MenuItem sx={menuStyles.menuItem}>Share</MenuItem>
          </MenuList>
        </Menu>

        {/* Edit Menu */}
        <Menu>
          <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown />} variant="ghost">
            Edit
          </MenuButton>
          <MenuList sx={menuStyles.menuList}>
            <MenuItem sx={menuStyles.menuItem}>Undo</MenuItem>
            <MenuItem sx={menuStyles.menuItem}>Redo</MenuItem>
            <MenuItem sx={menuStyles.menuItem}>Cut</MenuItem>
            <MenuItem sx={menuStyles.menuItem}>Copy</MenuItem>
            <MenuItem sx={menuStyles.menuItem}>Paste</MenuItem>
          </MenuList>
        </Menu>

        {/* View Menu */}
        <Menu>
          <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown />} variant="ghost">
            View
          </MenuButton>
          <MenuList>
            <MenuItem>Mode</MenuItem>
            <MenuItem>Show ruler</MenuItem>
            <MenuItem>Show outline</MenuItem>
            <MenuItem>Show equation toolbar</MenuItem>
          </MenuList>
        </Menu>

        {/* Insert Menu */}
        <Menu>
          <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown />} variant="ghost">
            Insert
          </MenuButton>
          <MenuList>
            <MenuItem>Image</MenuItem>
            <MenuItem>Table</MenuItem>
            <MenuItem>Drawing</MenuItem>
            <MenuItem>Link</MenuItem>
            <MenuItem>Comment</MenuItem>
          </MenuList>
        </Menu>

        {/* Format Menu */}
        <Menu>
          <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown />} variant="ghost">
            Format
          </MenuButton>
          <MenuList>
            <MenuItem>Text</MenuItem>
            <MenuItem>Paragraph styles</MenuItem>
            <MenuItem>Align & indent</MenuItem>
            <MenuItem>Line & paragraph spacing</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Right side */}
      <HStack spacing={2} ml="auto">
        <Button
          leftIcon={<FiSave />}
          size="sm"
          colorScheme="pink"
          onClick={onSave}
          isLoading={isSaving}
          loadingText="Saving"
        >
          Save
        </Button>

        <Tooltip label="Comment">
          <IconButton
            icon={<FiMessageSquare />}
            variant="ghost"
            size="sm"
            aria-label="Comments"
            color="brand.text.primary"
          />
        </Tooltip>

        <Tooltip label="Video call">
          <IconButton
            icon={<FiVideo />}
            variant="ghost"
            size="sm"
            aria-label="Video call"
            color="brand.text.primary"
          />
        </Tooltip>

        <Button
          leftIcon={<FiLock />}
          rightIcon={<FiChevronDown />}
          size="sm"
          variant="ghost"
          color="brand.text.primary"
        >
          Editing
        </Button>

        <Button
          leftIcon={<FiShare2 />}
          size="sm"
          colorScheme="pink"
        >
          Share
        </Button>
      </HStack>
    </HStack>
  );
};

export default EditorMenuBar; 