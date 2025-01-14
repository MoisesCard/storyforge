import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Tooltip,
  Link,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FiHome, 
  FiBook, 
  FiUsers, 
  FiMap,
} from 'react-icons/fi';

const SidebarItem = ({ icon, label, to }) => (
  <Tooltip label={label} placement="right">
    <Link 
      as={RouterLink} 
      to={to}
      _hover={{ textDecoration: 'none' }}
    >
      <VStack
        p={3}
        borderRadius="md"
        transition="all 0.2s"
        _hover={{
          bg: 'brand.dark.300',
          transform: 'translateY(-2px)',
        }}
      >
        <Icon 
          as={icon} 
          boxSize={6} 
          color="brand.text.secondary"
          _groupHover={{ color: 'brand.primary' }}
        />
        <Text 
          fontSize="xs" 
          color="brand.text.secondary"
          _groupHover={{ color: 'brand.primary' }}
        >
          {label}
        </Text>
      </VStack>
    </Link>
  </Tooltip>
);

function Sidebar() {
  return (
    <Box
      w="80px"
      bg="brand.dark.100"
      borderRight="1px"
      borderColor="brand.dark.300"
      py={8}
    >
      <VStack spacing={6}>
        <SidebarItem 
          icon={FiHome} 
          label="Home" 
          to="/" 
        />
        <SidebarItem 
          icon={FiBook} 
          label="Library" 
          to="/library" 
        />
        <SidebarItem 
          icon={FiUsers} 
          label="Characters" 
          to="/characters" 
        />
        <SidebarItem 
          icon={FiMap} 
          label="World" 
          to="/world-builder" 
        />
      </VStack>
    </Box>
  );
}

export default Sidebar; 