export interface Document {
  id?: string;
  projectId: string;  // Reference to parent project
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
} 