import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Avatar,
  Button,
  useDisclosure,
  SimpleGrid,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { FiEdit2, FiBook, FiAward, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/modals/EditProfileModal';

function StatCard({ icon, label, value }) {
  return (
    <Box
      bg="brand.dark.100"
      p={4}
      borderRadius="lg"
      textAlign="center"
    >
      <Icon as={icon} boxSize={6} color="brand.primary" mb={2} />
      <Text fontSize="2xl" fontWeight="bold" color="white">
        {value}
      </Text>
      <Text color="brand.text.secondary" fontSize="sm">
        {label}
      </Text>
    </Box>
  );
}

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    location: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      website: '',
    },
    theme: 'dark',
    privacy: 'public',
    stats: {
      totalProjects: 0,
      followers: 0,
      following: 0,
      wordCount: 0,
    }
  });
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      try {
        const profileRef = doc(db, 'userProfiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfileData(profileSnap.data());
        } else {
          // Create default profile if it doesn't exist
          const defaultProfile = {
            username: currentUser.email.split('@')[0],
            bio: '',
            location: '',
            photoURL: '',
            socialLinks: {
              twitter: '',
              instagram: '',
              website: '',
            },
            theme: 'dark',
            privacy: 'public',
            stats: {
              totalProjects: 0,
              followers: 0,
              following: 0,
              wordCount: 0,
            },
            recentActivity: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await setDoc(profileRef, defaultProfile);
          setProfileData(defaultProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setProfileData(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Spinner size="xl" color="brand.primary" />
          <Text color="brand.text.secondary">Loading profile...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Box
          bg="brand.dark.100"
          borderRadius="xl"
          overflow="hidden"
          position="relative"
        >
          {/* Banner Image */}
          <Box
            h="200px"
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            opacity={0.8}
          />

          {/* Profile Info */}
          <Box p={8} mt="-100px">
            <VStack spacing={4} align="center">
              <Avatar
                size="2xl"
                name={profileData.username}
                src={profileData.photoURL}
                border="4px solid"
                borderColor="brand.dark.100"
              />
              <VStack spacing={2}>
                <Heading size="lg" color="white">
                  {profileData.username}
                </Heading>
                <Text color="brand.text.secondary">
                  {profileData.bio || 'No bio yet'}
                </Text>
                {profileData.location && (
                  <Text color="brand.text.secondary" fontSize="sm">
                    📍 {profileData.location}
                  </Text>
                )}
              </VStack>
              <Button
                leftIcon={<FiEdit2 />}
                variant="solid"
                size="md"
                onClick={onOpen}
                bg="linear-gradient(135deg, brand.primary, brand.secondary)"
                color="white"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.2s"
              >
                Edit Profile
              </Button>
            </VStack>
          </Box>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={[2, 2, 4]} spacing={6}>
          <StatCard
            icon={FiBook}
            label="Projects"
            value={profileData.stats.totalProjects}
          />
          <StatCard
            icon={FiUsers}
            label="Followers"
            value={profileData.stats.followers}
          />
          <StatCard
            icon={FiUsers}
            label="Following"
            value={profileData.stats.following}
          />
          <StatCard
            icon={FiAward}
            label="Words Written"
            value={profileData.stats.wordCount.toLocaleString()}
          />
        </SimpleGrid>

        <Box
          bg="brand.dark.100"
          p={6}
          borderRadius="xl"
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="white">
              Social Links
            </Heading>
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                <Box
                  key={platform}
                  p={4}
                  bg="brand.dark.200"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text color="brand.text.secondary" textTransform="capitalize">
                    {platform}:
                  </Text>
                  <Text color="white" isTruncated>
                    {url || 'Not set'}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>

        <Box
          bg="brand.dark.100"
          p={6}
          borderRadius="xl"
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="white">
              Recent Activity
            </Heading>
            {profileData.recentActivity?.length > 0 ? (
              <VStack spacing={2} align="stretch">
                {profileData.recentActivity.map((activity, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg="brand.dark.200"
                    borderRadius="md"
                  >
                    <Text color="brand.text.secondary">
                      {activity.description}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text color="brand.text.secondary">No recent activity</Text>
            )}
          </VStack>
        </Box>

        {/* Account Section */}
        <Box
          bg="brand.dark.100"
          p={6}
          borderRadius="xl"
          mt={4}
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="white">
              Account
            </Heading>
            <Box
              p={4}
              bg="brand.dark.200"
              borderRadius="md"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text color="brand.text.secondary">
                {currentUser?.email}
              </Text>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                colorScheme="red"
                _hover={{
                  bg: 'rgba(255, 69, 58, 0.1)',
                }}
              >
                Sign Out
              </Button>
            </Box>
          </VStack>
        </Box>
      </VStack>

      <EditProfileModal
        isOpen={isOpen}
        onClose={onClose}
        currentProfile={{
          ...profileData,
          userId: currentUser.uid
        }}
        onUpdate={handleProfileUpdate}
      />
    </Container>
  );
}

export default Profile; 