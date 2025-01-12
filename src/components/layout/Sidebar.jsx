import { Box, VStack, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const links = [
    { path: '/editor', label: 'Editor' },
    { path: '/characters', label: 'Characters' },
    { path: '/world-builder', label: 'World Builder' },
    { path: '/library', label: 'Library' }
  ];

  return (
    <Box 
      w="240px" 
      bg="brand.dark.100" 
      h="100vh"
      borderRight="1px" 
      borderColor="brand.dark.300"
      position="sticky"
      top={0}
    >
      <VStack align="stretch" spacing={0}>
        <Box p={6} borderBottom="1px" borderColor="brand.dark.300">
          <Text 
            fontSize="2xl" 
            fontWeight="bold" 
            color="brand.primary"
            letterSpacing="wide"
          >
            StoryForge
          </Text>
        </Box>
        
        <VStack spacing={1} align="stretch" py={4}>
          {links.map((link) => (
            <Link
              key={link.path}
              as={RouterLink}
              to={link.path}
              p={4}
              bg={location.pathname === link.path ? 'brand.dark.200' : 'transparent'}
              color={location.pathname === link.path ? 'brand.highlight' : 'brand.text.primary'}
              borderLeft="4px"
              borderColor={location.pathname === link.path ? 'brand.primary' : 'transparent'}
              transition="all 0.2s"
              _hover={{
                bg: 'brand.dark.200',
                color: 'brand.highlight',
                borderLeftColor: 'brand.primary',
              }}
              fontSize="md"
            >
              {link.label}
            </Link>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}

export default Sidebar; 