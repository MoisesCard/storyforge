import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Box 
      bg="brand.dark.100" 
      borderBottom="1px" 
      borderColor="brand.dark.300" 
      px={8} 
      py={4}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex justify="space-between" align="center">
        <Heading 
          size={isHomePage ? "lg" : "md"} 
          bgGradient="linear(to-r, brand.primary, brand.secondary)"
          bgClip="text"
        >
          {isHomePage ? 'StoryForge' : 'Write Your Story'}
        </Heading>
        {!isHomePage && (
          <Button 
            leftIcon={<FiPlus />}
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            _hover={{
              transform: 'translateY(-1px)',
              shadow: 'lg',
            }}
            transition="all 0.2s"
          >
            New Project
          </Button>
        )}
      </Flex>
    </Box>
  );
}

export default Header; 