export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';

export interface APIBody {
  storyNodes: StoryNode[];
  model: OpenAIModel;
  key: string;
}

export interface APIResponse {
  text: string;
}

export interface StreamData {
  storyNodes: StoryNode[];
  model: OpenAIModel;
  key: string;
}

export interface StoryNode {
  name: string;
  description: string;
  summary: string;
  text: string;
}
