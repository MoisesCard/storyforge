import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  useToast,
  Link,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthTitle from '../components/auth/AuthTitle';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={16}>
      <AuthTitle />
      <VStack spacing={8} align="stretch" p={8} bg="brand.dark.100" borderRadius="xl">
        <Heading
          textAlign="center"
          bgGradient="linear(to-r, brand.primary, brand.secondary)"
          bgClip="text"
        >
          Sign In
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="brand.text.secondary">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="brand.dark.200"
                borderColor="brand.dark.300"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="brand.text.secondary">Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="brand.dark.200"
                borderColor="brand.dark.300"
              />
            </FormControl>
            <Button
              type="submit"
              isLoading={loading}
              bg="linear-gradient(135deg, brand.primary, brand.secondary)"
              color="white"
              w="full"
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