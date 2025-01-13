import React from 'react';
import { 
  HStack, 
  IconButton, 
  Select, 
  NumberInput,
  NumberInputField,
  Divider,
  Tooltip,
  Text,
  Icon,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { 
  FiBold, FiItalic, FiUnderline, 
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify,
  FiList, FiLink, FiCheck
} from 'react-icons/fi';
import { useSlate } from 'slate-react';
import { CustomEditor } from './EditorUtils';

const EditorToolbar = ({ saveStatus }) => {
  const editor = useSlate();
  const format = CustomEditor.getCurrentFormat(editor);

  const handleFontFamilyChange = (event) => {
    event.preventDefault();
    console.log('Font family change triggered:', event.target.value);
    CustomEditor.toggleFontFamily(editor, event.target.value);
  };

  const handleFontSizeChange = (value) => {
    if (!value) return;
    console.log('Font size change triggered:', value);
    CustomEditor.toggleFontSize(editor, `${value}pt`);
  };

  return (
    <HStack 
      spacing={2} 
      p={1} 
      borderBottom="1px" 
      borderColor="brand.dark.300"
      bg="brand.dark.100"
      color="brand.text.primary"
      px={4}
    >
      {/* Font Family */}
      <Select 
        size="sm" 
        w="120px" 
        value={format.fontFamily || 'Arial'}
        onChange={handleFontFamilyChange}
        color="brand.text.primary"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Calibri">Calibri</option>
      </Select>

      {/* Font Size */}
      <NumberInput 
        size="sm" 
        w="70px" 
        value={parseInt(format.fontSize) || 11}
        min={6} 
        max={96}
        onChange={handleFontSizeChange}
      >
        <NumberInputField color="brand.text.primary" />
      </NumberInput>

      <Divider orientation="vertical" h="24px" />

      {/* Text Formatting */}
      <Tooltip label="Bold (⌘B)">
        <IconButton 
          icon={<FiBold />} 
          variant="ghost" 
          size="sm" 
          aria-label="Bold"
          isActive={CustomEditor.isMarkActive(editor, 'bold')}
          onClick={() => CustomEditor.toggleMark(editor, 'bold')}
        />
      </Tooltip>
      <Tooltip label="Italic (⌘I)">
        <IconButton 
          icon={<FiItalic />} 
          variant="ghost" 
          size="sm" 
          aria-label="Italic"
          isActive={CustomEditor.isMarkActive(editor, 'italic')}
          onClick={() => CustomEditor.toggleMark(editor, 'italic')}
        />
      </Tooltip>
      <Tooltip label="Underline (⌘U)">
        <IconButton 
          icon={<FiUnderline />} 
          variant="ghost" 
          size="sm" 
          aria-label="Underline"
          isActive={CustomEditor.isMarkActive(editor, 'underline')}
          onClick={() => CustomEditor.toggleMark(editor, 'underline')}
        />
      </Tooltip>

      <Divider orientation="vertical" h="24px" />

      {/* Alignment */}
      <Tooltip label="Align left">
        <IconButton 
          icon={<FiAlignLeft />} 
          variant="ghost" 
          size="sm" 
          aria-label="Align left"
          isActive={CustomEditor.isAlignActive(editor, 'left')}
          onClick={() => CustomEditor.toggleAlign(editor, 'left')}
        />
      </Tooltip>
      <Tooltip label="Align center">
        <IconButton 
          icon={<FiAlignCenter />} 
          variant="ghost" 
          size="sm" 
          aria-label="Align center"
          isActive={CustomEditor.isAlignActive(editor, 'center')}
          onClick={() => CustomEditor.toggleAlign(editor, 'center')}
        />
      </Tooltip>
      <Tooltip label="Align right">
        <IconButton 
          icon={<FiAlignRight />} 
          variant="ghost" 
          size="sm" 
          aria-label="Align right"
          isActive={CustomEditor.isAlignActive(editor, 'right')}
          onClick={() => CustomEditor.toggleAlign(editor, 'right')}
        />
      </Tooltip>
      <Tooltip label="Justify">
        <IconButton 
          icon={<FiAlignJustify />} 
          variant="ghost" 
          size="sm" 
          aria-label="Justify"
          isActive={CustomEditor.isAlignActive(editor, 'justify')}
          onClick={() => CustomEditor.toggleAlign(editor, 'justify')}
        />
      </Tooltip>

      <Divider orientation="vertical" h="24px" />

      {/* Lists */}
      <Tooltip label="Bullet list">
        <IconButton 
          icon={<FiList />} 
          variant="ghost" 
          size="sm" 
          aria-label="Bullet list"
          isActive={CustomEditor.isBulletActive(editor)}
          onClick={() => CustomEditor.toggleBulletList(editor)}
        />
      </Tooltip>

      {/* Link */}
      <Tooltip label="Insert link">
        <IconButton 
          icon={<FiLink />} 
          variant="ghost" 
          size="sm" 
          aria-label="Insert link"
        />
      </Tooltip>

      <Spacer />

      {/* Save Status */}
      <Flex align="center" color="brand.text.secondary" minW="80px" justify="flex-end" mr={4}>
        {saveStatus === 'saving' && (
          <Text fontSize="sm">Saving...</Text>
        )}
        {saveStatus === 'saved' && (
          <Flex align="center" gap={1}>
            <Text fontSize="sm">Saved</Text>
            <Icon as={FiCheck} color="green.400" />
          </Flex>
        )}
      </Flex>
    </HStack>
  );
};

export default EditorToolbar; 