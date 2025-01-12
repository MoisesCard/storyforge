import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const GENRES = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Romance',
  'Thriller',
  'Horror',
  'Literary Fiction',
  'Historical Fiction',
  'Young Adult',
  'Other'
];

function NewProjectModal({ isOpen, onClose, onCreateProject }) {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    targetAudience: '',
    estimatedLength: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Sanitize the data before submitting
      const sanitizedData = {
        ...formData,
        title: formData.title.trim() || 'Untitled Project',
        description: formData.description.trim(),
        targetAudience: formData.targetAudience.trim(),
        estimatedLength: formData.estimatedLength.trim(),
      };
      
      // Wait for the project to be created before proceeding
      await onCreateProject(sanitizedData);
      
    } catch (error) {
      console.error('Error in modal submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        genre: '',
        description: '',
        targetAudience: '',
        estimatedLength: '',
      });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isSubmitting}>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="brand.dark.100">
        <ModalHeader color="brand.text.primary">Create New Project</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color="brand.text.secondary">Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                variant="filled"
                bg="brand.dark.200"
                borderColor="brand.dark.300"
                _hover={{ bg: 'brand.dark.300' }}
                _focus={{ 
                  bg: 'brand.dark.300',
                  borderColor: 'brand.primary'
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Genre</FormLabel>
              <Select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Select genre"
                variant="filled"
                bg="brand.dark.200"
                borderColor="brand.dark.300"
                _hover={{ bg: 'brand.dark.300' }}
                _focus={{ 
                  bg: 'brand.dark.300',
                  borderColor: 'brand.primary'
                }}
              >
                {GENRES.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your project"
                variant="filled"
                bg="brand.dark.200"
                borderColor="brand.dark.300"
                _hover={{ bg: 'brand.dark.300' }}
                _focus={{ 
                  bg: 'brand.dark.300',
                  borderColor: 'brand.primary'
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Target Audience</FormLabel>
              <Input
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="e.g., Young Adult, Adult, Children"
                variant="filled"
                bg="brand.dark.200"
                borderColor="brand.dark.300"
                _hover={{ bg: 'brand.dark.300' }}
                _focus={{ 
                  bg: 'brand.dark.300',
                  borderColor: 'brand.primary'
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Estimated Length</FormLabel>
              <Input
                name="estimatedLength"
                value={formData.estimatedLength}
                onChange={handleChange}
                placeholder="e.g., Novel (80k words), Short Story (5k words)"
                variant="filled"
                bg="brand.dark.200"
                borderColor="brand.dark.300"
                _hover={{ bg: 'brand.dark.300' }}
                _focus={{ 
                  bg: 'brand.dark.300',
                  borderColor: 'brand.primary'
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            onClick={onClose}
            isDisabled={isSubmitting}
            _hover={{ bg: 'brand.dark.300' }}
          >
            Cancel
          </Button>
          <Button
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating..."
            _hover={{
              transform: 'translateY(-1px)',
              shadow: 'lg',
            }}
            transition="all 0.2s"
          >
            Create Project
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewProjectModal; 