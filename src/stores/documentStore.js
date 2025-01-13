import { create } from 'zustand';
import { 
  doc, 
  getDoc, 
  updateDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'projects';

const useDocumentStore = create((set, get) => ({
  currentDoc: null,
  isLoading: false,
  error: null,

  // Fetch a document
  fetchDocument: async (documentId) => {
    set({ isLoading: true, error: null });
    try {
      if (!documentId) throw new Error('Document ID is required');
      
      const docRef = doc(db, 'projects', documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const document = {
          id: docSnap.id,
          ...docSnap.data()
        };
        set({ currentDoc: document });
        return document;
      } else {
        // Create a new document if it doesn't exist
        const defaultDoc = {
          content: [
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ],
          title: 'Untitled Document',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(docRef, defaultDoc);
        
        const newDoc = {
          id: documentId,
          ...defaultDoc,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set({ currentDoc: newDoc });
        return newDoc;
      }
    } catch (error) {
      console.error('Error fetching/creating document:', error);
      // Check if it's a connection error
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update a document
  updateDocument: async (documentId, data) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, COLLECTION_NAME, documentId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      
      // Update local state
      const currentDoc = get().currentDoc;
      set({ 
        currentDoc: { 
          ...currentDoc, 
          ...data, 
          updatedAt: new Date() 
        } 
      });
    } catch (error) {
      console.error('Error updating document:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useDocumentStore; 