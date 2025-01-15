import React, { useState, useRef, useEffect } from 'react';
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
  Avatar,
  Center,
  IconButton,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  useToast,
  Box,
  Select,
} from '@chakra-ui/react';
import { FiCamera, FiPlus } from 'react-icons/fi';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

function NewCharacterModal({ isOpen, onClose, onCreateCharacter }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    age: '',
    occupation: '',
    description: '',
    imageUrl: '',
    traits: [],
    projectId: '',
  });
  const [traitInput, setTraitInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();
  const toast = useToast();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;
      
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title
      }));
      setProjects(projectsData);
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateCharacter(formData);
    setFormData({
      name: '',
      role: '',
      age: '',
      occupation: '',
      description: '',
      imageUrl: '',
      traits: [],
      projectId: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="brand.dark.100">
        <ModalHeader color="white">Create New Character</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={6}>
              {/* Avatar Upload */}
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

              {/* Existing Fields */}
              <FormControl isRequired>
                <FormLabel color="brand.text.secondary">Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Character name"
                  value={formData.name}
                  onChange={handleChange}
                  bg="brand.dark.200"
                  borderColor="brand.dark.300"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="brand.text.secondary">Role</FormLabel>
                <Input
                  name="role"
                  placeholder="Select role"
                  value={formData.role}
                  onChange={handleChange}
                  bg="brand.dark.200"
                  borderColor="brand.dark.300"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="brand.text.secondary">Age</FormLabel>
                <Input
                  name="age"
                  placeholder="Character age"
                  value={formData.age}
                  onChange={handleChange}
                  bg="brand.dark.200"
                  borderColor="brand.dark.300"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="brand.text.secondary">Occupation</FormLabel>
                <Input
                  name="occupation"
                  placeholder="Character occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  bg="brand.dark.200"
                  borderColor="brand.dark.300"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="brand.text.secondary">Project</FormLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  placeholder="Select project"
                  bg="brand.dark.200"
                  borderColor="brand.dark.300"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Traits Field */}
              <FormControl>
                <FormLabel color="brand.text.secondary">Traits</FormLabel>
                <InputGroup>
                  <Input
                    value={traitInput}
                    onChange={(e) => setTraitInput(e.target.value)}
                    placeholder="Add a trait..."
                    bg="brand.dark.200"
                    borderColor="brand.dark.300"
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
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
                <Box mt={2}>
                  <HStack spacing={2} wrap="wrap">
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
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel color="brand.text.secondary">Description</FormLabel>
                <Textarea
                  name="description"
                  placeholder="Character description"
                  value={formData.description}
                  onChange={handleChange}
                  bg="brand.dark.200"
                  borderColor="brand.dark.300"
                  resize="vertical"
                  minH="100px"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              bg="linear-gradient(135deg, brand.primary, brand.secondary)"
              color="white"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
              }}
            >
              Create Character
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default NewCharacterModal; 