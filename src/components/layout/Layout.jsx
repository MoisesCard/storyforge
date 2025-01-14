import React from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../navigation/Sidebar';

function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on an auth page
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Box display="flex" h="100vh">
      {!isAuthPage && <Sidebar />}
      <Box flex="1" overflowY="auto" position="relative">
        {currentUser && !isAuthPage && (
          <HStack position="absolute" top={4} right={4} spacing={4}>
            <Text color="brand.text.secondary">
              {currentUser.email}
            </Text>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              _hover={{ bg: 'brand.dark.300' }}
            >
              Sign Out
            </Button>
          </HStack>
        )}
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 