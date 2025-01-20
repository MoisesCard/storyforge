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
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

function TimelineEventModal({ isOpen, onClose, projectId, event }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        date: event.date || '',
        description: event.description || '',
      });
    } else {
      setFormData({
        title: '',
        date: '',
        description: '',
      });
    }
  }, [event]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.date) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (event) {
        await updateDoc(doc(db, 'timelineEvents', event.id), {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'timelineEvents'), {
          ...formData,
          projectId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      toast({
        title: `Event ${event ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error saving event',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="brand.dark.100">
        <ModalHeader>
          {event ? 'Edit Event' : 'Add New Event'}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                placeholder="Event title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                value={formData.date}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  date: e.target.value
                }))}
                placeholder="e.g., Year 1200, Spring 1st, Dawn of Time"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Describe what happened..."
                rows={4}
              />
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
            {event ? 'Save Changes' : 'Create Event'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default TimelineEventModal; 