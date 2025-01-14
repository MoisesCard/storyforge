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
  Link,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthTitle from '../components/auth/AuthTitle';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(true);
    try {
      await signup(email, password);
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
          Create Account
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
            <FormControl isRequired>
              <FormLabel color="brand.text.secondary">Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Sign Up
            </Button>
          </VStack>
        </form>
        <Text color="brand.text.secondary" textAlign="center">
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="brand.primary">
            Sign In
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}

export default SignUp; 