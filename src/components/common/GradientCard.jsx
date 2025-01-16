import React from 'react';
import { Box, VStack } from '@chakra-ui/react';

function GradientCard({ children, onClick, ...props }) {
  return (
    <Box
      bg="brand.dark.200"
      p={6}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
      cursor={onClick ? "pointer" : "default"}
      w="100%"
      transition="all 0.2s"
      _hover={{
        transform: onClick ? 'translateY(-2px)' : 'none',
        shadow: 'lg',
        '&::before': { opacity: 0.3 },
      }}
      _before={{
        content: '""',
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        bg: 'linear-gradient(45deg, brand.primary, brand.secondary)',
        zIndex: 0,
        borderRadius: 'xl',
        opacity: 0,
        transition: 'opacity 0.3s',
      }}
      {...props}
    >
      <VStack 
        spacing={4} 
        position="relative" 
        zIndex={1}
        align="stretch"
      >
        {children}
      </VStack>
    </Box>
  );
}

export default GradientCard; 