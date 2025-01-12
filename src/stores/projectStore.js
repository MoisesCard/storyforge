import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  createProject: async (projectData) => {
    if (get().isLoading) {
      console.log('Warning: Create project called while loading');
    }

    set({ isLoading: true, error: null });
    try {
      console.log('Creating project with data:', projectData);
      
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      // Create current timestamp
      const now = new Date();
      
      // Create the projects collection if it doesn't exist
      const projectsRef = collection(db, 'projects');
      
      // Add the document with server timestamp
      const docRef = await addDoc(projectsRef, {
        ...projectData,
        content: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Add a client timestamp as fallback
        clientCreatedAt: now.toISOString(),
        clientUpdatedAt: now.toISOString()
      });
      
      console.log('Project created with ID:', docRef.id);

      // Use JavaScript Date for local state
      const newProject = {
        id: docRef.id,
        ...projectData,
        createdAt: now,
        updatedAt: now,
        clientCreatedAt: now.toISOString(),
        clientUpdatedAt: now.toISOString()
      };

      set(state => ({
        projects: [newProject, ...state.projects],
        currentProject: newProject,
        isLoading: false
      }));

      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projects = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Raw project data:', data);
        
        // Convert Firestore timestamps to JS Dates for the UI
        const processedData = {
          ...data,
          createdAt: data.createdAt?.toDate?.() || null,
          updatedAt: data.updatedAt?.toDate?.() || null
        };
        
        return {
          id: doc.id,
          ...processedData
        };
      });
      
      console.log('Processed projects:', projects);
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  updateProject: async (projectId, updates) => {
    set({ isLoading: true });
    try {
      const projectRef = doc(db, 'projects', projectId);
      
      console.log('Starting project update:', {
        projectId,
        updateKeys: Object.keys(updates),
        contentLength: updates.content?.length,
        content: updates.content
      });

      // Add timestamp to updates
      const updatedData = {
        ...updates,
        updatedAt: serverTimestamp(),
        clientUpdatedAt: new Date().toISOString()
      };

      // Log the exact data being sent to Firestore
      console.log('Sending to Firestore:', updatedData);

      await updateDoc(projectRef, updatedData);
      console.log('Firestore update successful');

      // Verify the update by immediately fetching
      const updatedSnap = await getDoc(projectRef);
      if (updatedSnap.exists()) {
        const data = updatedSnap.data();
        console.log('Verified data in Firestore:', {
          id: projectId,
          content: data.content,
          contentLength: data.content?.length,
          updatedAt: data.updatedAt
        });
        
        const updatedProject = {
          id: projectId,
          ...data,
          createdAt: data.createdAt?.toDate?.() || null,
          updatedAt: data.updatedAt?.toDate?.() || null
        };
        
        set(state => ({
          projects: state.projects.map(p => 
            p.id === projectId ? updatedProject : p
          ),
          currentProject: updatedProject,
          isLoading: false
        }));

        return updatedProject;
      }
    } catch (error) {
      console.error('Error updating project:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchProject: async (projectId) => {
    set({ isLoading: true });
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (projectSnap.exists()) {
        const data = projectSnap.data();
        console.log('Fetched project data:', data);
        
        const project = {
          id: projectSnap.id,
          ...data,
          content: data.content || '',
          createdAt: data.createdAt?.toDate?.() || null,
          updatedAt: data.updatedAt?.toDate?.() || null
        };
        
        set({ 
          currentProject: project,
          isLoading: false 
        });
        
        return project;
      } else {
        throw new Error('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true });
    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);

      set(state => ({
        projects: state.projects.filter(p => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

export default useProjectStore; 