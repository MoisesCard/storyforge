import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  HStack,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { FiX } from 'react-icons/fi';

const LOCATION_TYPES = [
  'City',
  'Town',
  'Village',
  'Castle',
  'Fortress',
  'Landmark',
  'Forest',
  'Mountain',
  'Lake',
  'Island',
  'Temple',
  'Ruins',
  'Other'
];

function LocationModal({ isOpen, onClose, projectId, location }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    linkedCharacters: [],
    linkedEvents: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [characters, setCharacters] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        type: location.type || '',
        description: location.description || '',
        linkedCharacters: location.linkedCharacters || [],
        linkedEvents: location.linkedEvents || []
      });
    } else {
      setFormData({
        name: '',
        type: '',
        description: '',
        linkedCharacters: [],
        linkedEvents: []
      });
    }
  }, [location]);

  useEffect(() => {
    const fetchRelatedElements = async () => {
      try {
        const charactersQuery = query(
          collection(db, 'characters'),
          where('projectId', '==', projectId)
        );
        const charactersSnap = await getDocs(charactersQuery);
        setCharacters(charactersSnap.docs.map(doc => ({
          value: doc.id,
          label: doc.data().name,
          type: 'character',
          ...doc.data()
        })));
      } catch (error) {
        console.error('Error fetching related elements:', error);
      }
    };

    const fetchTimelineEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, 'timelineEvents'),
          where('projectId', '==', projectId)
        );
        const eventsSnap = await getDocs(eventsQuery);
        const eventsData = eventsSnap.docs.map(doc => {
          const data = doc.data();
          console.log('Fetched event:', { id: doc.id, ...data });
          return {
            value: doc.id,
            label: `${data.date} - ${data.title}`,
            title: data.title,
            date: data.date,
            projectId: data.projectId
          };
        });
        console.log('All fetched events:', eventsData);
        setTimelineEvents(eventsData);
      } catch (error) {
        console.error('Error fetching timeline events:', error);
      }
    };

    if (isOpen) {
      fetchRelatedElements();
      fetchTimelineEvents();
    }
  }, [isOpen, projectId]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    console.log('Saving location with data:', {
      formData,
      hasCharacters: !!formData.linkedCharacters,
      charactersLength: formData.linkedCharacters?.length,
      hasEvents: !!formData.linkedEvents,
      eventsLength: formData.linkedEvents?.length
    });

    setIsSubmitting(true);
    try {
      const locationData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        linkedCharacters: formData.linkedCharacters || [],
        linkedEvents: formData.linkedEvents || [],
        updatedAt: new Date()
      };

      console.log('Final location data to save:', locationData);

      if (location) {
        await updateDoc(doc(db, 'locations', location.id), locationData);
      } else {
        await addDoc(collection(db, 'locations'), {
          ...locationData,
          projectId,
          createdAt: new Date(),
        });
      }
      
      toast({
        title: `Location ${location ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: 'Error saving location',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="brand.dark.100">
        <ModalHeader>
          {location ? 'Edit Location' : 'Add New Location'}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Location name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Type</FormLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
                placeholder="Select location type"
              >
                {LOCATION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Describe this location..."
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Linked Characters</FormLabel>
              <Select
                value=""
                onChange={(e) => {
                  const character = characters.find(c => c.value === e.target.value);
                  if (character && !formData.linkedCharacters.some(el => el.value === character.value)) {
                    setFormData(prev => ({
                      ...prev,
                      linkedCharacters: [...prev.linkedCharacters, character]
                    }));
                  }
                }}
                placeholder="Select characters to link"
              >
                {characters.map(char => (
                  <option key={char.value} value={char.value}>
                    {char.label}
                  </option>
                ))}
              </Select>
              
              <VStack mt={2} align="stretch">
                {formData.linkedCharacters.map(character => (
                  <HStack
                    key={character.value}
                    bg="brand.dark.200"
                    p={2}
                    borderRadius="md"
                    justify="space-between"
                  >
                    <Text>{character.label}</Text>
                    <IconButton
                      icon={<FiX />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          linkedCharacters: prev.linkedCharacters.filter(c => c.value !== character.value)
                        }));
                      }}
                    />
                  </HStack>
                ))}
              </VStack>
            </FormControl>

            <FormControl>
              <FormLabel>Linked Events</FormLabel>
              <Select
                value=""
                onChange={(e) => {
                  const event = timelineEvents.find(evt => evt.value === e.target.value);
                  if (event && !formData.linkedEvents?.some(el => el.value === event.value)) {
                    const formattedEvent = {
                      value: event.value,
                      title: event.title || event.label,
                      date: event.date,
                      label: event.label
                    };
                    setFormData(prev => ({
                      ...prev,
                      linkedEvents: [...(prev.linkedEvents || []), formattedEvent]
                    }));
                  }
                }}
                placeholder="Select events to link"
              >
                {timelineEvents.map(event => (
                  <option key={event.value} value={event.value}>
                    {event.label}
                  </option>
                ))}
              </Select>

              <VStack mt={2} align="stretch">
                {formData.linkedEvents?.map(event => (
                  <HStack
                    key={event.value}
                    bg="brand.dark.200"
                    p={2}
                    borderRadius="md"
                    justify="space-between"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium">
                        {event.title}
                      </Text>
                      <Text fontSize="xs" color="brand.text.secondary">
                        {event.date}
                      </Text>
                    </VStack>
                    <IconButton
                      icon={<FiX />}
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          linkedEvents: prev.linkedEvents.filter(e => e.value !== event.value)
                        }));
                      }}
                    />
                  </HStack>
                ))}
              </VStack>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {location ? 'Save Changes' : 'Create Location'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LocationModal; 