import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

function TypewriterText({ text, delay = 100, ...props }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <Text {...props}>
      {displayText}
      <span style={{ opacity: currentIndex < text.length ? 1 : 0 }}>|</span>
    </Text>
  );
}

export default TypewriterText; 