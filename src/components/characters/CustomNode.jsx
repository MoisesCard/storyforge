import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Text, VStack } from '@chakra-ui/react';

const CustomNode = ({ data }) => {
  const handleStyle = {
    width: '8px',
    height: '8px',
    border: '2px solid white',
    zIndex: 2,
  };

  const sourceHandleStyle = { ...handleStyle, background: '#FF4D8D' };
  const targetHandleStyle = { ...handleStyle, background: '#4D8DFF' };

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      border="2px solid #FF4D8D"
      minWidth="200px"
      position="relative"
      role="button"
      tabIndex={0}
      aria-label={`${data.label} - ${data.role}`}
    >
      {/* Top handles */}
      <Handle
        type="target"
        position={Position.Top}
        id={`${data.label}-top-target`}
        style={{ ...targetHandleStyle, top: -8, left: '43%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Top}
        id={`${data.label}-top-source`}
        style={{ ...sourceHandleStyle, top: -8, left: '57%' }}
        isConnectable={true}
      />

      <VStack spacing={2} pointerEvents="none" align="center" width="100%">
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          {data.label || "Unnamed Character"}
        </Text>
        <Text fontSize="lg" color="gray.600">
          {data.role || "No role assigned"}
        </Text>
      </VStack>

      {/* Bottom handles */}
      <Handle
        type="target"
        position={Position.Bottom}
        id={`${data.label}-bottom-target`}
        style={{ ...targetHandleStyle, bottom: -8, left: '43%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${data.label}-bottom-source`}
        style={{ ...sourceHandleStyle, bottom: -8, left: '57%' }}
        isConnectable={true}
      />

      {/* Left handles */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${data.label}-left-target`}
        style={{ ...targetHandleStyle, left: -8, top: '43%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Left}
        id={`${data.label}-left-source`}
        style={{ ...sourceHandleStyle, left: -8, top: '57%' }}
        isConnectable={true}
      />

      {/* Right handles */}
      <Handle
        type="target"
        position={Position.Right}
        id={`${data.label}-right-target`}
        style={{ ...targetHandleStyle, right: -8, top: '43%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${data.label}-right-source`}
        style={{ ...sourceHandleStyle, right: -8, top: '57%' }}
        isConnectable={true}
      />
    </Box>
  );
};

export default memo(CustomNode); 