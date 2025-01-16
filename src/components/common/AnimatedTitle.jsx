import React from 'react';
import { Heading } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function AnimatedTitle({ children, variant = 'default', ...props }) {
  const gradientColors = variant === 'default'
    ? "linear(to-r, brand.primary, brand.secondary, brand.primary)"
    : "linear(to-r, #6B46C1, #3182CE, #38B2AC, #6B46C1)"; // Story Forge colors

  return (
    <Heading
      size="xl"
      bgGradient={gradientColors}
      bgClip="text"
      bgSize="200%"
      animation={`${gradientAnimation} 3s linear infinite`}
      {...props}
    >
      {children}
    </Heading>
  );
}

export default AnimatedTitle; 