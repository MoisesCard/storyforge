import React, { useCallback } from 'react';
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
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import LocationsTab from '../components/world/LocationsTab';
import TimelineTab from '../components/world/TimelineTab';

function ProjectWorld() {
  const { projectId } = useParams();
  const [project, setProject] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const migrateLocationData = useCallback(async () => {
    if (!projectId) return;
    
    try {
      const locationsQuery = query(
        collection(db, 'locations'),
        where('projectId', '==', projectId)
      );
      
      const locationsSnap = await getDocs(locationsQuery);
      
      const updates = locationsSnap.docs.map(async (docSnap) => {
        const locationData = docSnap.data();
        
        // Only update if using old structure
        if (locationData.linkedElements && !locationData.linkedCharacters) {
          await updateDoc(doc(db, 'locations', docSnap.id), {
            linkedCharacters: locationData.linkedElements || [],
            linkedEvents: locationData.linkedEvents || [],
            linkedElements: null // Remove old field
          });
        }
      });
      
      await Promise.all(updates);
      console.log('Migration completed');
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  }, [projectId]);

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

  React.useEffect(() => {
    migrateLocationData();
  }, [migrateLocationData]);

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
            <LocationsTab projectId={projectId} />
          </TabPanel>

          <TabPanel>
            <TimelineTab projectId={projectId} />
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