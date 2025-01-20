import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  List,
  ListItem,
  useDisclosure,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import LocationModal from './LocationModal';
import LocationDetails from './LocationDetails';

function LocationsTab({ projectId }) {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingLocation, setEditingLocation] = useState(null);
  const toast = useToast();

  // Fetch locations
  useEffect(() => {
    const locationsQuery = query(
      collection(db, 'locations'),
      where('projectId', '==', projectId)
    );

    const unsubscribe = onSnapshot(locationsQuery, (snapshot) => {
      const locationsData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Fetched location:', {
          id: doc.id,
          data,
          hasCharacters: !!data.linkedCharacters,
          charactersLength: data.linkedCharacters?.length,
          hasEvents: !!data.linkedEvents,
          eventsLength: data.linkedEvents?.length
        });
        return {
          id: doc.id,
          ...data
        };
      });
      setLocations(locationsData);
      setFilteredLocations(locationsData);
    });

    return () => unsubscribe();
  }, [projectId]);

  // Filter locations based on search query
  useEffect(() => {
    const filtered = locations.filter(location => {
      const searchLower = searchQuery.toLowerCase();
      return (
        location.name?.toLowerCase().includes(searchLower) ||
        location.type?.toLowerCase().includes(searchLower) ||
        location.description?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredLocations(filtered);
  }, [searchQuery, locations]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!selectedLocation) return;

    // Create a listener for the selected location
    const unsubscribe = onSnapshot(
      doc(db, 'locations', selectedLocation.id),
      (doc) => {
        if (doc.exists()) {
          const updatedLocation = { id: doc.id, ...doc.data() };
          setSelectedLocation(updatedLocation);
          
          // Also update the location in the list
          setLocations(prev => prev.map(loc => 
            loc.id === updatedLocation.id ? updatedLocation : loc
          ));
        }
      }
    );

    return () => unsubscribe();
  }, [selectedLocation?.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleAddLocation = () => {
    setEditingLocation(null);
    onOpen();
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    onOpen();
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      await deleteDoc(doc(db, 'locations', locationId));
      if (selectedLocation?.id === locationId) {
        setSelectedLocation(null);
      }
      toast({
        title: 'Location deleted',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error deleting location',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box display="flex" gap={6} h="full">
      {/* Left sidebar with location list */}
      <Box w="300px" bg="brand.dark.100" borderRadius="md" p={4}>
        <VStack align="stretch" spacing={4}>
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              bg="brand.dark.200"
              borderColor="brand.dark.300"
              _hover={{
                borderColor: 'brand.primary',
              }}
              _focus={{
                borderColor: 'brand.primary',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)',
              }}
            />
          </InputGroup>

          <Button
            leftIcon={<FiPlus />}
            onClick={handleAddLocation}
            bg="brand.dark.200"
            _hover={{ bg: 'brand.dark.300' }}
          >
            Add Location
          </Button>

          <List spacing={2}>
            {filteredLocations.map(location => (
              <ListItem
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                cursor="pointer"
                p={3}
                borderRadius="md"
                bg={selectedLocation?.id === location.id ? 'brand.dark.300' : 'transparent'}
                _hover={{ bg: 'brand.dark.200' }}
              >
                <Text fontWeight="medium">{location.name}</Text>
                <Text fontSize="sm" color="brand.text.secondary">
                  {location.type}
                </Text>
              </ListItem>
            ))}
          </List>
        </VStack>
      </Box>

      {/* Right content area */}
      <Box flex={1} bg="brand.dark.100" borderRadius="md" p={6}>
        {selectedLocation ? (
          <LocationDetails 
            location={selectedLocation}
            onEdit={() => handleEditLocation(selectedLocation)}
            onDelete={() => handleDeleteLocation(selectedLocation.id)}
          />
        ) : (
          <Text color="brand.text.secondary" textAlign="center">
            Select a location to view details
          </Text>
        )}
      </Box>

      <LocationModal
        isOpen={isOpen}
        onClose={onClose}
        projectId={projectId}
        location={editingLocation}
      />
    </Box>
  );
}

export default LocationsTab; 