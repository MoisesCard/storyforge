import { create } from 'zustand';

const useDocumentStore = create((set) => ({
  documents: [],
  currentDocument: null,
  
  addDocument: (document) => 
    set((state) => ({
      documents: [...state.documents, document],
    })),
    
  setCurrentDocument: (document) =>
    set({ currentDocument: document }),
    
  updateDocument: (id, content) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, content } : doc
      ),
    })),
}));

export default useDocumentStore; 