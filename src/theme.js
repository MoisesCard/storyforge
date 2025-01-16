import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#0F172A', // Deep blue-slate background
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      primary: '#6D28D9',   // Deep purple
      secondary: '#0D9488', // Rich teal
      accent: '#F59E0B',    // Warm gold
      gradient: 'linear-gradient(135deg, #6D28D9, #0D9488)', // Standard gradient
      dark: {
        100: '#1E293B', // Slate blue
        200: '#334155', // Lighter slate
        300: '#475569', // Even lighter slate
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#94A3B8',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: '0 0 0 3px #6D28D9',
        },
      },
      variants: {
        gradient: {
          bg: 'brand.gradient',
          color: 'white',
          _hover: {
            transform: 'translateY(-2px)',
            shadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
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
      defaultProps: {
        variant: 'filled',
      },
    },
    Textarea: {
      variants: {
        filled: {
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
      defaultProps: {
        variant: 'filled',
      },
    },
    Heading: {
      variants: {
        gradient: {
          bgGradient: 'linear(to-r, brand.primary, brand.secondary)',
          bgClip: 'text',
        },
      },
    },
  },
});

export default theme; 