import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  doc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

const useDocumentStore = create((set, get) => ({
  documents: [],
  currentDoc: null,
  isLoading: false,
  error: null,

  // Fetch all documents
  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const q = query(
        collection(db, 'documents'), 
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      set({ documents: docs, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Create new document
  createDocument: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const docData = {
        title: data.title || 'Untitled',
        content: data.content || '',
        projectId: data.projectId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'documents'), docData);
      const newDoc = { id: docRef.id, ...docData };
      
      set(state => ({ 
        documents: [newDoc, ...state.documents],
        currentDoc: newDoc,
        isLoading: false 
      }));
      
      return newDoc;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update existing document
  updateDocument: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'documents', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      set(state => {
        const updatedDocs = state.documents.map(doc => 
          doc.id === id ? { ...doc, ...updates, updatedAt: new Date() } : doc
        );
        
        return { 
          documents: updatedDocs,
          currentDoc: state.currentDoc?.id === id 
            ? { ...state.currentDoc, ...updates, updatedAt: new Date() }
            : state.currentDoc,
          isLoading: false 
        };
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, 'documents', id));
      
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
        currentDoc: state.currentDoc?.id === id ? null : state.currentDoc,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Set current document
  setCurrentDocument: (doc) => {
    set({ currentDoc: doc });
  },
}));

export default useDocumentStore; 