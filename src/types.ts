export type Faculty = 'Science' | 'Management' | 'Law' | 'Humanities';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  faculty?: Faculty;
  isError?: boolean;
}

export interface PromptSuggestion {
  text: string;
  langTag: 'EN' | 'NP' | 'ROMANIZED';
  label: string;
}

export interface FacultyDetail {
  id: Faculty;
  name: string;
  iconName: string;
  tagline: string;
  prompts: PromptSuggestion[];
}
