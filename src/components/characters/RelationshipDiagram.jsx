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
} from '@chakra-ui/react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from 'reactflow';
import CustomNode from './CustomNode';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

function RelationshipDiagram({ characters, isOpen, onClose }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const characterNodes = characters.map((char, index) => ({
      id: char.id,
      type: 'custom',
      data: {
        label: char.name,
        role: char.role,
      },
      position: { x: index * 300, y: 100 },
    }));

    setNodes(characterNodes);
  }, [characters]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#FF4D8D', strokeWidth: 2 },
        deletable: true,
        selectable: true,
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    []
  );

  const onEdgesDelete = useCallback(
    (edgesToDelete) => {
      console.log('Deleting edges:', edgesToDelete);
      setEdges((currentEdges) => 
        currentEdges.filter((edge) => !edgesToDelete.includes(edge))
      );
    },
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bg="brand.dark.100">
        <ModalHeader color="white">Character Relationships</ModalHeader>
        <ModalBody>
          <Box height="600px" width="100%" position="relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onEdgesDelete={onEdgesDelete}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              defaultEdgeOptions={{
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#FF4D8D', strokeWidth: 2 },
              }}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              connectOnClick={true}
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