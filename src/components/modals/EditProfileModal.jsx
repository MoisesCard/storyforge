import React, { useState, useRef } from 'react';
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
  useToast,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

function EditProfileModal({ isOpen, onClose, currentProfile, onUpdate }) {
  const [formData, setFormData] = useState({
    username: currentProfile.username || '',
    bio: currentProfile.bio || '',
    location: currentProfile.location || '',
    photoURL: currentProfile.photoURL || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef();
  const toast = useToast();

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPG, PNG, etc.)',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setUploadingImage(true);
    try {
      // Add timestamp to filename to prevent conflicts
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `profilePictures/${currentProfile.userId}/${fileName}`);
      
      console.log('Starting upload...'); // Debug log
      await uploadBytes(storageRef, file);
      console.log('Upload complete, getting URL...'); // Debug log
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Got download URL:', downloadURL); // Debug log
      
      setFormData(prev => ({
        ...prev,
        photoURL: downloadURL
      }));

      toast({
        title: 'Image uploaded',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'userProfiles', currentProfile.userId), {
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        photoURL: formData.photoURL,
      });
      onUpdate(formData);
      onClose();
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="brand.dark.100">
        <ModalHeader color="white">Edit Profile</ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            {/* Profile Picture Upload */}
            <FormControl>
              <Center>
                <Box position="relative">
                  <Avatar
                    size="2xl"
                    src={formData.photoURL}
                    name={formData.username}
                    opacity={uploadingImage ? 0.5 : 1}
                  />
                  {uploadingImage && (
                    <Spinner
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      color="brand.primary"
                    />
                  )}
                  <IconButton
                    icon={<FiCamera />}
                    isLoading={uploadingImage}
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

            {/* Other form fields */}
            <FormControl>
              <FormLabel color="brand.text.secondary">Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                bg="brand.dark.200"
                borderColor="brand.dark.300"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="brand.text.secondary">Bio</FormLabel>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                bg="brand.dark.200"
                borderColor="brand.dark.300"
                resize="vertical"
                minH="100px"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="brand.text.secondary">Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                bg="brand.dark.200"
                borderColor="brand.dark.300"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            _hover={{ bg: 'brand.dark.300' }}
          >
            Cancel
          </Button>
          <Button
            bg="linear-gradient(135deg, brand.primary, brand.secondary)"
            color="white"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProfileModal; 