import React from 'react';
import { NodeData } from '../../types/resume';

export interface ResumeUIContextType {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  activeNode: NodeData | null;
  setActiveNode: React.Dispatch<React.SetStateAction<NodeData | null>>;
  allowEdit: boolean;
  allowJsonExport: boolean;
  watermarkEditedCopies: boolean;
}

const ResumeUIContext = React.createContext<ResumeUIContextType | undefined>(undefined);

export const useResumeUI = (): ResumeUIContextType => {
  const ctx = React.useContext(ResumeUIContext);
  if (!ctx) throw new Error('useResumeUI must be used within a ResumeUIContext.Provider');
  return ctx;
};

export default ResumeUIContext;
