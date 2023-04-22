import { OpenAIModel, StoryNode } from '@/types';
import endent from 'endent';
import { Configuration, OpenAIApi } from 'openai';

export const generateStoryNode = async (
  storyNode: StoryNode,
  context: {
    summary: string;
    text: string;
    nextChapterName: string;
    nextChapterDescription: string;
  },
  model: OpenAIModel,
  key: string,
) => {
  const configuration = new Configuration({
    apiKey: key,
  });
  const openai = new OpenAIApi(configuration);

  const systemPromptStory = endent`
  You are a world class storyteller and writer. You are tasked with writing a story given the following information:

  Previous Story Summary:
  ${context.summary.trim()}

  Previous Story Text:
  ${context.text.trim()}

  Current Chapter Name (you will be writing for this chapter):
  ${storyNode.name.trim()}

  Current Chapter Description:
  ${storyNode.description.trim()}

  Next Chapter Name (chapter after the current chapter):
  ${context.nextChapterName.trim()}

  Next Chapter Description:
  ${context.nextChapterDescription.trim()}

  Use the given information to continue writing the story. Write the text for the current chapter. The new chapter must be seamlessly integrated into the previous story text. Also take the next chapter name and description into account when writing the current chapter.
  
  Remember, this chapter is not the final chapter (unless specified), so do not end the story unless you are told it is the final chapter.
  
  Be thoughtful and creative. Think of this process as writing a book. Write a story that the reader will enjoy reading.

  Only respond with the text body for the new chapter. Do not respond with any other information including things like chapter name, number, etc.
  `;

  let storyRes: any;
  try {
    storyRes = await retryWithDelay(
      () =>
        openai.createChatCompletion({
          model,
          messages: [
            {
              role: 'system',
              content: systemPromptStory,
            },
          ],
        }),
      30000,
    );
  } catch (error) {
    throw new Error('Failed to generate story after two attempts.');
  }

  const text = storyRes.data.choices[0].message?.content;

  if (!text) {
    throw new Error('No story was generated.');
  }

  let updatedStoryNode: StoryNode = {
    ...storyNode,
    text,
  };

  const systemPromptSummary = endent`
  You are a world expert at summarizing information. Summarize the text you wrote for the given chapter in 2 sentences.

  Story:
  ${text.trim()}

  Summary:`;

  let summaryRes: any;
  try {
    summaryRes = await retryWithDelay(
      () =>
        openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPromptSummary,
            },
          ],
        }),
      30000,
    );
  } catch (error) {
    throw new Error('Failed to generate summary after two attempts.');
  }

  const summary = summaryRes.data.choices[0].message?.content;

  if (!summary) {
    throw new Error('No summary was generated.');
  }

  updatedStoryNode = {
    ...updatedStoryNode,
    summary,
  };

  return updatedStoryNode;
};

const retryWithDelay = (func: any, delay: number) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await func();
      resolve(result);
    } catch (error) {
      setTimeout(async () => {
        try {
          const result = await func();
          resolve(result);
        } catch (secondError) {
          reject(secondError);
        }
      }, delay);
    }
  });
