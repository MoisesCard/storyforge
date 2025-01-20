import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import TimelineEventModal from './TimelineEventModal';

function TimelineTab({ projectId }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch timeline events
  useEffect(() => {
    const q = query(
      collection(db, 'timelineEvents'),
      where('projectId', '==', projectId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort the events in memory instead
      const sortedEvents = eventsData.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
      });
      setEvents(sortedEvents);
    });

    return () => unsubscribe();
  }, [projectId]);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    onOpen();
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'timelineEvents', eventId));
      toast({
        title: 'Event deleted successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error deleting event',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box bg="brand.dark.100" borderRadius="xl" p={6}>
      <Button
        leftIcon={<FiPlus />}
        onClick={handleAddEvent}
        mb={6}
        bg="brand.dark.200"
        _hover={{ bg: 'brand.dark.300' }}
      >
        Add Event
      </Button>

      <VStack spacing={0} align="stretch" position="relative">
        {/* Vertical timeline line */}
        <Box
          position="absolute"
          left="145px"
          top={0}
          bottom={0}
          width="2px"
          bg="brand.primary"
          opacity={0.3}
        />

        {events.length === 0 ? (
          <Box p={8} textAlign="center">
            <Text color="brand.text.secondary">
              No events yet. Add one to start your timeline!
            </Text>
          </Box>
        ) : (
          events.map((event, index) => (
            <HStack
              key={event.id}
              spacing={4}
              p={4}
              position="relative"
              role="group"
              _hover={{
                bg: 'brand.dark.200',
              }}
              borderRadius="md"
              transition="all 0.2s"
            >
              {/* Date bubble */}
              <Box
                minW="120px"
                textAlign="right"
                fontSize="sm"
                fontWeight="medium"
                color="brand.text.secondary"
              >
                {event.date}
              </Box>

              {/* Event dot with pulse effect */}
              <Box position="relative">
                <Box
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  bg="brand.primary"
                  position="relative"
                  zIndex={1}
                />
                <Box
                  position="absolute"
                  top="-4px"
                  left="-4px"
                  w="24px"
                  h="24px"
                  borderRadius="full"
                  bg="brand.primary"
                  opacity={0.15}
                />
              </Box>

              {/* Event content */}
              <VStack align="start" flex={1} spacing={2}>
                <Text fontSize="lg" fontWeight="bold">
                  {event.title}
                </Text>
                <Text color="brand.text.secondary">
                  {event.description}
                </Text>
              </VStack>

              {/* Actions */}
              <HStack 
                opacity={0} 
                _groupHover={{ opacity: 1 }} 
                transition="all 0.2s"
                spacing={2}
              >
                <IconButton
                  icon={<FiEdit2 />}
                  variant="ghost"
                  size="sm"
                  aria-label="Edit event"
                  _hover={{ bg: 'brand.dark.300' }}
                  onClick={() => handleEditEvent(event)}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  variant="ghost"
                  size="sm"
                  colorScheme="red"
                  aria-label="Delete event"
                  _hover={{ bg: 'red.900' }}
                  onClick={() => handleDeleteEvent(event.id)}
                />
              </HStack>
            </HStack>
          ))
        )}
      </VStack>

      <TimelineEventModal
        isOpen={isOpen}
        onClose={onClose}
        projectId={projectId}
        event={selectedEvent}
      />
    </Box>
  );
}

export default TimelineTab; 