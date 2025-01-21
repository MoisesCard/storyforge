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
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { FiEdit2, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/modals/EditProfileModal';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCharacters: 0,
    totalWords: 0,
    totalLocations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(
        doc(db, 'userProfiles', currentUser.uid),
        (doc) => {
          if (doc.exists()) {
            setProfileData({
              ...doc.data(),
              userId: currentUser.uid,
              coverPhoto: doc.data().coverPhotoURL
            });
          } else {
            const newProfile = {
              userId: currentUser.uid,
              username: currentUser.displayName || '',
              email: currentUser.email,
              photoURL: currentUser.photoURL || '',
              coverPhoto: '',
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
              },
              recentActivity: []
            };
            setProfileData(newProfile);
            setDoc(doc(db, 'userProfiles', currentUser.uid), newProfile);
          }
        }
      );

      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Fetch projects count
        const projectsQuery = query(
          collection(db, 'projects'),
          where('userId', '==', currentUser.uid)
        );
        const projectsSnap = await getDocs(projectsQuery);
        const projectsCount = projectsSnap.docs.length;
        
        // Calculate total words from all projects
        let totalWords = 0;
        projectsSnap.docs.forEach(doc => {
          const content = doc.data().content;
          if (content && Array.isArray(content)) {
            // For Slate content structure
            content.forEach(node => {
              if (node.children) {
                node.children.forEach(child => {
                  if (child.text) {
                    totalWords += child.text.trim().split(/\s+/).filter(Boolean).length;
                  }
                });
              }
            });
          }
        });

        // Fetch characters count
        const charactersQuery = query(
          collection(db, 'characters'),
          where('userId', '==', currentUser.uid)
        );
        const charactersSnap = await getDocs(charactersQuery);
        const charactersCount = charactersSnap.docs.length;

        // Fetch locations count by aggregating across all projects
        let locationsCount = 0;
        for (const projectDoc of projectsSnap.docs) {
          const locationsQuery = query(
            collection(db, 'locations'),
            where('projectId', '==', projectDoc.id)
          );
          const locationsSnap = await getDocs(locationsQuery);
          locationsCount += locationsSnap.docs.length;
        }

        // Update stats state
        setStats({
          totalProjects: projectsCount,
          totalCharacters: charactersCount,
          totalWords: totalWords,
          totalLocations: locationsCount
        });

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  if (!profileData) {
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
    <Box>
      <Container maxW="container.xl" pt={8}>
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <Box
            bg="brand.dark.100"
            borderRadius="xl"
            overflow="hidden"
            position="relative"
          >
            {/* Banner/Cover Photo */}
            <Box
              h="200px"
              position="relative"
              overflow="hidden"
            >
              <Box
                w="100%"
                h="100%"
                bgGradient="linear(to-b, brand.primary, brand.secondary)"
              >
                {profileData?.coverPhoto ? (
                  <Box
                    as="img"
                    src={profileData.coverPhoto}
                    alt="Cover"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    w="100%"
                    h="100%"
                    bgGradient="linear(135deg, brand.primary, brand.secondary)"
                    opacity={0.8}
                  />
                )}
              </Box>
            </Box>

            {/* Keep original Profile Info with existing Avatar */}
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
                  
                  {/* Social Media Icons */}
                  <HStack spacing={4} pt={2}>
                    {profileData.socialLinks?.twitter && (
                      <IconButton
                        as="a"
                        href={profileData.socialLinks.twitter}
                        target="_blank"
                        icon={<FiTwitter />}
                        aria-label="Twitter"
                        variant="ghost"
                        color="brand.text.secondary"
                        _hover={{ color: "white", bg: "brand.dark.300" }}
                      />
                    )}
                    {profileData.socialLinks?.instagram && (
                      <IconButton
                        as="a"
                        href={profileData.socialLinks.instagram}
                        target="_blank"
                        icon={<FiInstagram />}
                        aria-label="Instagram"
                        variant="ghost"
                        color="brand.text.secondary"
                        _hover={{ color: "white", bg: "brand.dark.300" }}
                      />
                    )}
                    {profileData.socialLinks?.facebook && (
                      <IconButton
                        as="a"
                        href={profileData.socialLinks.facebook}
                        target="_blank"
                        icon={<FiFacebook />}
                        aria-label="Facebook"
                        variant="ghost"
                        color="brand.text.secondary"
                        _hover={{ color: "white", bg: "brand.dark.300" }}
                      />
                    )}
                  </HStack>
                </VStack>
                
                {/* Edit Profile Button */}
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
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Box bg="brand.dark.100" p={6} borderRadius="xl">
              <Stat>
                <StatLabel color="brand.text.secondary">Total Projects</StatLabel>
                <StatNumber fontSize="4xl" fontWeight="bold">
                  {loading ? '-' : stats.totalProjects}
                </StatNumber>
                <StatHelpText>Active writing projects</StatHelpText>
              </Stat>
            </Box>

            <Box bg="brand.dark.100" p={6} borderRadius="xl">
              <Stat>
                <StatLabel color="brand.text.secondary">Characters Created</StatLabel>
                <StatNumber fontSize="4xl" fontWeight="bold">
                  {loading ? '-' : stats.totalCharacters}
                </StatNumber>
                <StatHelpText>Across all projects</StatHelpText>
              </Stat>
            </Box>

            <Box bg="brand.dark.100" p={6} borderRadius="xl">
              <Stat>
                <StatLabel color="brand.text.secondary">Words Written</StatLabel>
                <StatNumber fontSize="4xl" fontWeight="bold">
                  {loading ? '-' : stats.totalWords.toLocaleString()}
                </StatNumber>
                <StatHelpText>Total word count</StatHelpText>
              </Stat>
            </Box>

            <Box bg="brand.dark.100" p={6} borderRadius="xl">
              <Stat>
                <StatLabel color="brand.text.secondary">Locations Created</StatLabel>
                <StatNumber fontSize="4xl" fontWeight="bold">
                  {loading ? '-' : stats.totalLocations}
                </StatNumber>
                <StatHelpText>World building progress</StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>

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
      </Container>

      <EditProfileModal
        isOpen={isOpen}
        onClose={onClose}
        currentProfile={{
          ...profileData,
          userId: currentUser.uid
        }}
        onUpdate={handleProfileUpdate}
      />
    </Box>
  );
}

export default Profile; 