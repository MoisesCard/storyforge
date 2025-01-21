import React from 'react';
import { 
  IconButton, 
  Select, 
  Divider,
  Text,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { 
  FiBold, FiItalic, FiUnderline, 
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify,
  FiList, FiLink, FiCheck,
} from 'react-icons/fi';
import { GoQuote } from 'react-icons/go';
import { useSlate } from 'slate-react';
import { CustomEditor } from './EditorUtils';

const ToolbarButton = ({ icon, label, isActive, ...props }) => (
  <IconButton
    icon={icon}
    aria-label={label}
    variant="ghost"
    size="sm"
    color="gray.100"
    bg={isActive ? "whiteAlpha.200" : "transparent"}
    _hover={{
      bg: "whiteAlpha.300"
    }}
    _active={{
      bg: "whiteAlpha.400"
    }}
    {...props}
  />
);

const EditorToolbar = ({ saveStatus, wordCount, charCount }) => {
  const editor = useSlate();
  const format = CustomEditor.getCurrentFormat(editor);

  const handleFontFamilyChange = (event) => {
    event.preventDefault();
    console.log('Font family change triggered:', event.target.value);
    CustomEditor.toggleFontFamily(editor, event.target.value);
  };

  const handleFontSizeChange = (event) => {
    if (!event.target.value) return;
    const size = event.target.value;
    CustomEditor.toggleFontSize(editor, size);
  };

  return (
    <Flex 
      p={2} 
      bg="brand.dark.200" 
      borderRadius="md"
      align="center"
      mb={2}
      gap={2}
    >
      {/* Font family select with more options */}
      <Select 
        size="sm" 
        maxW="120px"
        color="gray.100"
        bg="whiteAlpha.100"
        borderColor="whiteAlpha.200"
        _hover={{
          borderColor: "whiteAlpha.300"
        }}
        value={format.fontFamily || 'Arial'}
        onChange={handleFontFamilyChange}
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Calibri">Calibri</option>
        <option value="Georgia">Georgia</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Verdana">Verdana</option>
        <option value="Tahoma">Tahoma</option>
        <option value="Trebuchet MS">Trebuchet MS</option>
        <option value="Garamond">Garamond</option>
        <option value="Courier New">Courier New</option>
      </Select>

      {/* Font size select */}
      <Select
        size="sm"
        w="80px"
        color="gray.100"
        bg="whiteAlpha.100"
        borderColor="whiteAlpha.200"
        _hover={{
          borderColor: "whiteAlpha.300"
        }}
        value={format.fontSize?.replace('pt', '') || '11'}
        onChange={handleFontSizeChange}
      >
        <option value="6">6</option>
        <option value="8">8</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="24">24</option>
        <option value="30">30</option>
        <option value="36">36</option>
        <option value="48">48</option>
        <option value="60">60</option>
        <option value="72">72</option>
      </Select>

      <Divider orientation="vertical" h="20px" borderColor="whiteAlpha.200" />

      {/* Formatting buttons */}
      <ToolbarButton
        icon={<FiBold />}
        label="Bold"
        isActive={CustomEditor.isMarkActive(editor, 'bold')}
        onClick={() => CustomEditor.toggleMark(editor, 'bold')}
      />
      <ToolbarButton
        icon={<FiItalic />}
        label="Italic"
        isActive={CustomEditor.isMarkActive(editor, 'italic')}
        onClick={() => CustomEditor.toggleMark(editor, 'italic')}
      />
      <ToolbarButton
        icon={<FiUnderline />}
        label="Underline"
        isActive={CustomEditor.isMarkActive(editor, 'underline')}
        onClick={() => CustomEditor.toggleMark(editor, 'underline')}
      />

      {/* Header buttons */}
      <ToolbarButton
        icon={
          <Text fontWeight="bold" fontSize="sm">H1</Text>
        }
        label="Heading 1"
        isActive={CustomEditor.isHeadingActive(editor, 1)}
        onClick={() => CustomEditor.toggleHeading(editor, 1)}
        color={CustomEditor.isHeadingActive(editor, 1) ? "white" : "inherit"}
        bg={CustomEditor.isHeadingActive(editor, 1) ? "brand.primary" : "transparent"}
        _hover={{
          bg: CustomEditor.isHeadingActive(editor, 1) ? "brand.primary" : "brand.dark.300",
        }}
      />

      <ToolbarButton
        icon={
          <Text fontWeight="bold" fontSize="sm">H2</Text>
        }
        label="Heading 2"
        isActive={CustomEditor.isHeadingActive(editor, 2)}
        onClick={() => CustomEditor.toggleHeading(editor, 2)}
        color={CustomEditor.isHeadingActive(editor, 2) ? "white" : "inherit"}
        bg={CustomEditor.isHeadingActive(editor, 2) ? "brand.primary" : "transparent"}
        _hover={{
          bg: CustomEditor.isHeadingActive(editor, 2) ? "brand.primary" : "brand.dark.300",
        }}
      />

      <Divider orientation="vertical" h="20px" borderColor="whiteAlpha.200" />

      {/* Alignment */}
      <ToolbarButton
        icon={<FiAlignLeft />}
        label="Align left"
        isActive={CustomEditor.isAlignActive(editor, 'left')}
        onClick={() => CustomEditor.toggleAlign(editor, 'left')}
      />
      <ToolbarButton
        icon={<FiAlignCenter />}
        label="Align center"
        isActive={CustomEditor.isAlignActive(editor, 'center')}
        onClick={() => CustomEditor.toggleAlign(editor, 'center')}
      />
      <ToolbarButton
        icon={<FiAlignRight />}
        label="Align right"
        isActive={CustomEditor.isAlignActive(editor, 'right')}
        onClick={() => CustomEditor.toggleAlign(editor, 'right')}
      />
      <ToolbarButton
        icon={<FiAlignJustify />}
        label="Justify"
        isActive={CustomEditor.isAlignActive(editor, 'justify')}
        onClick={() => CustomEditor.toggleAlign(editor, 'justify')}
      />

      <Divider orientation="vertical" h="20px" borderColor="whiteAlpha.200" />

      {/* Lists */}
      <ToolbarButton
        icon={<FiList />}
        label="Bullet list"
        isActive={CustomEditor.isBulletActive(editor)}
        onClick={() => CustomEditor.toggleBulletList(editor)}
      />

      {/* Add Block Quote */}
      <ToolbarButton
        icon={<GoQuote />}
        label="Block quote"
        isActive={CustomEditor.isBlockQuoteActive(editor)}
        onClick={() => CustomEditor.toggleBlockQuote(editor)}
      />

      {/* Link */}
      <ToolbarButton
        icon={<FiLink />}
        label="Insert link"
      />

      {/* Status text */}
      <Text ml="auto" fontSize="sm" color="gray.300" display="flex" alignItems="center" gap={1}>
        {saveStatus === 'saving' && 'Saving...'}
        {saveStatus === 'saved' && (
          <>
            Saved
            <Icon as={FiCheck} color="green.400" />
          </>
        )}
        {saveStatus === 'error' && 'Error saving'}
      </Text>

      {/* Word/character count */}
      <Text fontSize="sm" color="gray.300">
        {`${wordCount} words, ${charCount} characters`}
      </Text>
    </Flex>
  );
};

export default EditorToolbar; 