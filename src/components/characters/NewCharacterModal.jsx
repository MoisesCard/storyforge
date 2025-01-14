import React, { useState } from 'react';
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
  Select,
} from '@chakra-ui/react';

const ROLES = [
  'Protagonist',
  'Antagonist',
  'Supporting Character',
  'Mentor',
  'Love Interest',
  'Sidekick',
  'Other'
];

function NewCharacterModal({ isOpen, onClose, onCreateCharacter }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    age: '',
    occupation: '',
    description: '',
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
      await onCreateCharacter(formData);
      setFormData({
        name: '',
        role: '',
        age: '',
        occupation: '',
        description: '',
      });
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="brand.dark.100">
        <ModalHeader color="brand.text.primary">Create New Character</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="brand.text.secondary">Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Character name"
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

            <FormControl isRequired>
              <FormLabel color="brand.text.secondary">Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Select role"
                variant="filled"
                bg="brand.dark.200"
                borderColor="brand.dark.300"
                _hover={{ bg: 'brand.dark.300' }}
                _focus={{ 
                  bg: 'brand.dark.300',
                  borderColor: 'brand.primary'
                }}
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Age</FormLabel>
              <Input
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Character age"
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
              <FormLabel color="brand.text.secondary">Occupation</FormLabel>
              <Input
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Character occupation"
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
              <FormLabel color="brand.text.secondary">Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Character description"
                variant="filled"
                bg="brand.dark.200"
                borderColor="brand.dark.300"
                _hover={{ bg: 'brand.dark.300' }}
                _focus={{ 
                  bg: 'brand.dark.300',
                  borderColor: 'brand.primary'
                }}
                rows={4}
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
            Create Character
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewCharacterModal; 