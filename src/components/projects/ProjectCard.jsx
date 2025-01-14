import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = React.useRef();

  const handleClick = () => {
    navigate(`/editor/${project.id}`);
  };

  const onDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, 'projects', project.id));
      toast({
        title: 'Project deleted',
        description: 'Your project has been successfully deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error deleting project:', error);
    }
  };

  return (
    <>
      <Box
        bg="brand.dark.100"
        p={6}
        borderRadius="xl"
        position="relative"
        overflow="hidden"
        cursor="pointer"
        onClick={handleClick}
        _before={{
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          bg: 'linear-gradient(45deg, brand.primary, brand.secondary)',
          zIndex: 0,
          borderRadius: 'xl',
          opacity: 0,
          transition: 'opacity 0.3s',
        }}
        _hover={{
          transform: 'translateY(-4px)',
          '&::before': { opacity: 0.3 },
        }}
        transition="all 0.3s"
      >
        <VStack align="start" spacing={4} position="relative" zIndex={1}>
          <HStack w="full" justify="space-between">
            <Heading size="md" color="white">
              {project.title}
            </Heading>
            <IconButton
              icon={<FiTrash2 />}
              variant="ghost"
              size="sm"
              colorScheme="red"
              aria-label="Delete project"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteOpen(true);
              }}
              _hover={{
                bg: 'rgba(255, 69, 58, 0.2)',
              }}
            />
          </HStack>

          <Badge colorScheme="blue">{project.genre}</Badge>
          
          <Text color="brand.text.secondary" noOfLines={2}>
            {project.description}
          </Text>

          {project.targetAudience && (
            <Text color="brand.text.secondary" fontSize="sm">
              Target Audience: {project.targetAudience}
            </Text>
          )}

          {project.updatedAt && (
            <Text color="brand.text.secondary" fontSize="xs">
              Last edited: {project.updatedAt.toLocaleDateString()}
            </Text>
          )}
        </VStack>
      </Box>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="brand.dark.100">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
              Delete Project
            </AlertDialogHeader>

            <AlertDialogBody color="brand.text.secondary">
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteOpen(false)}
                variant="ghost"
                _hover={{ bg: 'brand.dark.300' }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onDeleteConfirm}
                ml={3}
                _hover={{
                  bg: 'red.600',
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default ProjectCard; 