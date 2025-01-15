import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  useToast,
  Center,
  Spinner,
} from '@chakra-ui/react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from 'reactflow';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import CustomNode from './CustomNode';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

function RelationshipDiagram({ characters, isOpen, onClose, projectId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Load relationships and positions from Firestore
  useEffect(() => {
    let unsubscribe;
    let retryCount = 0;
    const maxRetries = 3;

    const loadRelationships = async () => {
      if (!projectId || !isOpen) return;
      setIsLoading(true);

      try {
        const relationshipsRef = doc(db, 'relationships', projectId);
        const relationshipsDoc = await getDoc(relationshipsRef);
        
        // Create nodes regardless of saved positions
        const characterNodes = characters.map((char, index) => {
          let position;
          
          // If we have saved positions, use them
          if (relationshipsDoc.exists()) {
            const data = relationshipsDoc.data();
            position = data.nodePositions?.[char.id];
          }

          // Use saved position or calculate a grid position
          const defaultPosition = {
            x: (index % 3) * 250 + 100,  // Create a grid layout, 3 columns
            y: Math.floor(index / 3) * 200 + 100  // Space rows by 200px
          };

          return {
            id: char.id,
            type: 'custom',
            data: {
              label: char.name,
              role: char.role,
            },
            position: position || defaultPosition,
            draggable: true,
            connectable: true,
            selectable: true,
            deletable: false,
          };
        });

        setNodes(characterNodes);

        if (relationshipsDoc.exists()) {
          const data = relationshipsDoc.data();
          setEdges(data.edges || []);
        } else {
          // Create initial relationships document
          await setDoc(relationshipsRef, { 
            edges: [],
            nodePositions: {},
          });
        }

        retryCount = 0; // Reset retry count on success
      } catch (error) {
        console.error('Error loading relationships:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(loadRelationships, 1000 * retryCount);
        } else {
          toast({
            title: 'Connection Error',
            description: 'Failed to load relationships. Please check your connection and try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRelationships();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [projectId, isOpen, toast, characters]);

  // Save relationships with retry logic
  const saveRelationships = useCallback(async (newEdges, newNodes) => {
    if (!projectId) return;

    const saveWithRetry = async (retryCount = 0) => {
      try {
        const relationshipsRef = doc(db, 'relationships', projectId);
        const nodePositions = {};
        
        newNodes?.forEach(node => {
          nodePositions[node.id] = node.position;
        });

        await updateDoc(relationshipsRef, {
          edges: newEdges,
          nodePositions: nodePositions || {},
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error('Error saving relationships:', error);
        if (retryCount < 3) {
          setTimeout(() => saveWithRetry(retryCount + 1), 1000 * (retryCount + 1));
        } else {
          toast({
            title: 'Save Error',
            description: 'Failed to save changes. Please check your connection.',
            status: 'error',
            duration: 3000,
          });
        }
      }
    };

    saveWithRetry();
  }, [projectId, toast]);

  const onNodesChange = useCallback(
    (changes) => {
      const allowedChanges = changes.filter(change => change.type !== 'remove');
      const newNodes = applyNodeChanges(allowedChanges, nodes);
      setNodes(newNodes);
      
      // Save positions when nodes are dragged
      if (changes.some(change => change.type === 'position')) {
        saveRelationships(edges, newNodes);
      }
    },
    [nodes, edges, saveRelationships]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges);
      setEdges(newEdges);
      saveRelationships(newEdges, nodes);
    },
    [edges, nodes, saveRelationships]
  );

  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#FF4D8D', strokeWidth: 2 },
      };
      const newEdges = addEdge(edge, edges);
      setEdges(newEdges);
      saveRelationships(newEdges, nodes);
    },
    [edges, nodes, saveRelationships]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bg="brand.dark.100">
        <ModalHeader color="white">Character Relationships</ModalHeader>
        <ModalBody>
          <Box height="600px" width="100%" position="relative">
            {isLoading ? (
              <Center h="100%">
                <Spinner 
                  size="xl" 
                  color="brand.primary"
                  thickness="4px"
                  speed="0.65s"
                />
              </Center>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: '#FF4D8D', strokeWidth: 2 },
                }}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                deleteKeyCode={['Backspace', 'Delete']}
                edgesFocusable={true}
                edgesUpdatable={true}
              >
                <Background color="#ccc" gap={16} />
                <Controls />
                <MiniMap 
                  style={{
                    width: 120,
                    height: 100,
                  }}
                  nodeColor="#FF4D8D"
                />
              </ReactFlow>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RelationshipDiagram; 