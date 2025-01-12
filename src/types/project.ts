export interface Project {
  id?: string;
  title: string;
  genre: string;
  description: string;
  targetAudience: string;
  estimatedLength: string;
  createdAt: Date;
  updatedAt: Date;
  documents: string[]; // Array of document IDs
} 