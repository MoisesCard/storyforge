import { create } from 'zustand';

const useStore = create((set) => ({
  currentProject: null,
  projects: [],
  characters: [],
  worldBuilding: {},
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  addProject: (project) => 
    set((state) => ({ 
      projects: [...state.projects, project] 
    })),
    
  addCharacter: (character) =>
    set((state) => ({
      characters: [...state.characters, character]
    })),
    
  updateWorldBuilding: (data) =>
    set((state) => ({
      worldBuilding: { ...state.worldBuilding, ...data }
    })),
}));

export default useStore; 