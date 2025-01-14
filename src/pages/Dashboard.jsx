import React from 'react';
import {
  Container,
  SimpleGrid,
  Box,
  Heading,
  Text,
  Icon,
  VStack,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiUsers, FiMap, FiBook, FiPlus } from 'react-icons/fi';
import NewProjectModal from '../components/modals/NewProjectModal.jsx';

const DashboardCard = ({ title, description, icon, to, onClick }) => {
  const CardContent = (
    <Box
      bg="brand.dark.100"
      p={6}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
      cursor="pointer"
      w="100%"
      textAlign="left"
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
      _hover={{
        transform: 'translateY(-4px)',
        '&::before': { opacity: 0.3 },
      }}
      transition="all 0.3s"
    >
      <VStack spacing={4} position="relative" zIndex={1}>
        <Icon as={icon} boxSize={8} color="brand.primary" />
        <Heading size="md" color="white">
          {title}
        </Heading>
        <Text color="brand.text.secondary" textAlign="center">
          {description}
        </Text>
      </VStack>
    </Box>
  );

  if (onClick) {
    return (
      <Box as="button" onClick={onClick} w="100%">
        {CardContent}
      </Box>
    );
  }

  return (
    <Link as={RouterLink} to={to} _hover={{ textDecoration: 'none' }}>
      {CardContent}
    </Link>
  );
};

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading
          size="xl"
          bgGradient="linear(to-r, brand.primary, brand.secondary)"
          bgClip="text"
        >
          Dashboard
        </Heading>

        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          <DashboardCard
            title="New Project"
            description="Start a new writing project"
            icon={FiPlus}
            onClick={onOpen}
          />
          <DashboardCard
            title="Library"
            description="Access all your projects"
            icon={FiBook}
            to="/library"
          />
          <DashboardCard
            title="Characters"
            description="Manage your story characters"
            icon={FiUsers}
            to="/characters"
          />
          <DashboardCard
            title="World Builder"
            description="Create and organize your world"
            icon={FiMap}
            to="/world-builder"
          />
        </SimpleGrid>

        <NewProjectModal isOpen={isOpen} onClose={onClose} />
      </VStack>
    </Container>
  );
}

export default Dashboard; 