import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      'html, body': {
        backgroundColor: '#140F1D',
        color: 'white',
      },
      '#root': {
        backgroundColor: '#140F1D',
        minHeight: '100vh',
      },
    }),
  },
  colors: {
    brand: {
      primary: '#FF4D8D',    
      secondary: '#FF8B3E',  
      dark: {
        100: '#1A1625',      
        200: '#231C31',      
        300: '#2D2440',      
        400: '#382D4D',      
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#A39CB5',
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'brand.primary',
          color: 'white',
          _hover: {
            bg: 'brand.secondary',
          },
        },
        ghost: {
          color: 'brand.text.secondary',
          _hover: {
            bg: 'brand.dark.300',
            color: 'white',
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'brand.dark.200',
            _hover: {
              bg: 'brand.dark.300',
            },
            _focus: {
              bg: 'brand.dark.300',
              borderColor: 'brand.primary',
            },
          },
        },
      },
    },
  },
});

export default theme; 