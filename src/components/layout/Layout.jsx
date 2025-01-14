import React from 'react';
import { Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';

function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <Box display="flex" h="100vh">
      {!isAuthPage && <Sidebar />}
      <Box flex="1" overflowY="auto" position="relative">
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 