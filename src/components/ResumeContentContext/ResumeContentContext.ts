import React from 'react';
import { ResumeTree } from '../../types/resume';
import { ContentAction } from '../../utils/contentReducer';

export interface ResumeContentContextType {
  resumeContent: ResumeTree;
  dispatch: React.Dispatch<ContentAction>;
  isDataLoaded: boolean;
  wasChanged: boolean;
  setWasChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResumeContentContext = React.createContext<ResumeContentContextType>(
  undefined as unknown as ResumeContentContextType
);

export const useResumeContent = (): ResumeContentContextType => {
  const ctx = React.useContext(ResumeContentContext);
  if (!ctx) throw new Error('useResumeContent must be used within a ResumeContentContext.Provider');
  return ctx;
};

export default ResumeContentContext;
