import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  FormErrorMessage,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedTitle from '../components/common/AnimatedTitle';
import TypewriterText from '../components/common/TypewriterText';

// Define shake animation
const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(10px); }
  50% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
  100% { transform: translateX(0); }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.code === 'auth/invalid-credential' 
          ? 'Invalid email or password'
          : 'An error occurred while signing in'
      );
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake after animation
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <VStack spacing={0} mb={12}>
        <AnimatedTitle
          size="2xl"
          textAlign="center"
          variant="story-forge"
          w="256.898px"
          h="60px"
        >
          Story Forge
        </AnimatedTitle>
        <TypewriterText 
          text="Where stories come to life"
          color="brand.text.secondary"
          fontSize="md"
          textAlign="center"
          mt={0}
        />
      </VStack>
      
      <VStack spacing={8} align="stretch" p={8} bg="brand.dark.100" borderRadius="xl">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isInvalid={error}>
              <FormLabel color="brand.text.secondary">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="brand.dark.200"
                borderColor={error ? "red.500" : "brand.dark.300"}
                _hover={{
                  borderColor: error ? "red.500" : "brand.primary",
                }}
                animation={shake ? `${shakeAnimation} 0.5s ease` : 'none'}
              />
            </FormControl>
            <FormControl isInvalid={error}>
              <FormLabel color="brand.text.secondary">Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="brand.dark.200"
                borderColor={error ? "red.500" : "brand.dark.300"}
                _hover={{
                  borderColor: error ? "red.500" : "brand.primary",
                }}
                animation={shake ? `${shakeAnimation} 0.5s ease` : 'none'}
              />
              {error && (
                <FormErrorMessage
                  color="red.500"
                  fontSize="sm"
                  mt={2}
                >
                  {error}
                </FormErrorMessage>
              )}
            </FormControl>
            <Button
              type="submit"
              isLoading={loading}
              bg="linear-gradient(135deg, brand.primary, brand.secondary)"
              color="white"
              w="full"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
              }}
              _active={{
                transform: 'translateY(0)',
              }}
              transition="all 0.2s"
            >
              Sign In
            </Button>
          </VStack>
        </form>
        <Text color="brand.text.secondary" textAlign="center">
          Don't have an account?{' '}
          <Link as={RouterLink} to="/signup" color="brand.primary">
            Sign Up
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}

export default Login; 