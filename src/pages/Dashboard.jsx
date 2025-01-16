import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Icon,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiPlus, FiUsers, FiMap, FiBook } from 'react-icons/fi';
import NewProjectModal from '../components/modals/NewProjectModal';
import AnimatedTitle from '../components/common/AnimatedTitle';

const DashboardCard = ({ title, description, icon, to, onClick }) => {
  const CardContent = (
    <Box
      bg="brand.dark.200"
      p={6}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
      cursor="pointer"
      w="100%"
      textAlign="left"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'lg',
        '&::before': { opacity: 0.3 },
      }}
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
    >
      <VStack 
        spacing={4} 
        position="relative" 
        zIndex={1}
        align="flex-start"
      >
        <Icon 
          as={icon} 
          boxSize={8} 
          color="brand.primary"
        />
        <Box>
          <Heading 
            size="md" 
            color="white"
            mb={2}
          >
            {title}
          </Heading>
          <Text 
            color="brand.text.secondary"
          >
            {description}
          </Text>
        </Box>
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
        <AnimatedTitle mb={8}>Dashboard</AnimatedTitle>

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