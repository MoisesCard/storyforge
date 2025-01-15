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
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

function EditCharacterModal({ isOpen, onClose, character, onSave }) {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    traits: [],
    projectId: '',
  });
  const [traitInput, setTraitInput] = useState('');

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

  // Set form data when character changes
  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name || '',
        role: character.role || '',
        description: character.description || '',
        traits: character.traits || [],
        projectId: character.projectId || '',
      });
    }
  }, [character]);

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
    onSave({ ...formData, id: character.id });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="brand.dark.100">
        <ModalHeader color="white">Edit Character</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color="brand.text.secondary">Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                bg="brand.dark.200"
                borderColor="brand.dark.300"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Project</FormLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                bg="brand.dark.200"
                borderColor="brand.dark.300"
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
              <FormLabel color="brand.text.secondary">Role</FormLabel>
              <Input
                name="role"
                value={formData.role}
                onChange={handleChange}
                bg="brand.dark.200"
                borderColor="brand.dark.300"
              />
            </FormControl>

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
              <HStack mt={2} spacing={2} wrap="wrap">
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
            </FormControl>

            <FormControl>
              <FormLabel color="brand.text.secondary">Description</FormLabel>
              <Textarea
                name="description"
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
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditCharacterModal; 