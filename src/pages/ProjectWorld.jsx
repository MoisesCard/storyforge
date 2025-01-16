import React from 'react';
import {
  Container,
  Heading,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ProjectWorld() {
  const { projectId } = useParams();
  const [project, setProject] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return <Container maxW="container.xl" py={8}>Loading...</Container>;
  }

  if (!project) {
    return <Container maxW="container.xl" py={8}>Project not found</Container>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading
        size="xl"
        mb={6}
        variant="gradient"
      >
        {project.title}
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="pink">
        <TabList mb={4}>
          <Tab>Locations</Tab>
          <Tab>Timeline</Tab>
          <Tab>Notes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              p={6}
              bg="brand.dark.200"
              borderRadius="xl"
            >
              <Text color="brand.text.secondary">
                Locations coming soon...
              </Text>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box
              p={6}
              bg="brand.dark.200"
              borderRadius="xl"
            >
              <Text color="brand.text.secondary">
                Timeline coming soon...
              </Text>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box
              p={6}
              bg="brand.dark.200"
              borderRadius="xl"
            >
              <Text color="brand.text.secondary">
                Notes coming soon...
              </Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default ProjectWorld; 