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
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  Avatar,
  Center,
  Box,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiCamera } from 'react-icons/fi';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

function EditCharacterModal({ isOpen, onClose, character, onSave }) {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    traits: [],
    projectId: '',
    imageUrl: '',
  });
  const [traitInput, setTraitInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef();
  const toast = useToast();

  // Initialize form data when character prop changes
  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name || '',
        role: character.role || '',
        description: character.description || '',
        traits: character.traits || [],
        projectId: character.projectId || '',
        imageUrl: character.imageUrl || '',
      });
    }
  }, [character]);

  // Add image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `characterImages/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setFormData(prev => ({
        ...prev,
        imageUrl: url
      }));
    } catch (error) {
      toast({
        title: 'Error uploading image',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch projects when modal opens
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;
      
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', currentUser.uid)
      );

      try {
        const snapshot = await getDocs(q);
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [currentUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTrait = (e) => {
    e.preventDefault();
    if (traitInput.trim() && !formData.traits.includes(traitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        traits: [...prev.traits, traitInput.trim()]
      }));
      setTraitInput('');
    }
  };

  const handleRemoveTrait = (traitToRemove) => {
    setFormData(prev => ({
      ...prev,
      traits: prev.traits.filter(trait => trait !== traitToRemove)
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="brand.dark.100">
        <ModalHeader color="white">
          {character ? 'Edit Character' : 'Create Character'}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <Center>
                <Box position="relative">
                  <Avatar
                    size="2xl"
                    src={formData.imageUrl}
                    name={formData.name}
                    bg="brand.primary"
                    opacity={isUploading ? 0.5 : 1}
                  />
                  <IconButton
                    icon={<FiCamera />}
                    onClick={() => fileInputRef.current?.click()}
                    position="absolute"
                    bottom="0"
                    right="0"
                    rounded="full"
                    bg="brand.primary"
                    color="white"
                    _hover={{
                      bg: 'brand.secondary',
                    }}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    display="none"
                    onChange={handleImageUpload}
                  />
                </Box>
              </Center>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="brand.text.secondary">Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Character name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="brand.text.secondary">Role</FormLabel>
              <Input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Character role"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="brand.text.secondary">Project</FormLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                placeholder="Select project"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Character description"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Traits</FormLabel>
              <InputGroup>
                <Input
                  value={traitInput}
                  onChange={(e) => setTraitInput(e.target.value)}
                  placeholder="Add trait"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTrait(e);
                    }
                  }}
                />
                <InputRightElement>
                  <IconButton
                    icon={<FiPlus />}
                    size="sm"
                    onClick={handleAddTrait}
                    aria-label="Add trait"
                  />
                </InputRightElement>
              </InputGroup>
              {formData.traits.length > 0 && (
                <HStack mt={2} spacing={2} flexWrap="wrap">
                  {formData.traits.map((trait, index) => (
                    <Tag
                      key={index}
                      size="md"
                      borderRadius="full"
                      variant="subtle"
                      colorScheme="purple"
                    >
                      <TagLabel>{trait}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveTrait(trait)}
                      />
                    </Tag>
                  ))}
                </HStack>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            onClick={handleSubmit}
          >
            {character ? 'Save Changes' : 'Create Character'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditCharacterModal; 