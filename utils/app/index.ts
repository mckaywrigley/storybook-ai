import { OpenAIModel, StoryNode } from '@/types';
import endent from 'endent';
import { Configuration, OpenAIApi } from 'openai';

export const generateStoryNode = async (
  storyNode: StoryNode,
  context: { summary: string; text: string },
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

  New Chapter Name:
  ${storyNode.name.trim()}

  New Chapter Description:
  ${storyNode.description.trim()}

  Use the given information to write the story. The new chapter must be seamlessly integrated into the old chapter and the previous story text. Be thorough and creative. Put a lot of effort into it. The more effort you put into it, the better it will be. Think of this process as writing a book. You will be told when it is the final chapter.

  Only respond with the text for the new chapter. Do not respond with any other information including things like chapter name, number, etc.
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
          model,
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

// UNUSED: SAVING FOR LATER
// const handleGenerateStory = async () => {
//   const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;

//   if (!apiKey) {
//     alert('Please enter an API key.');
//     return;
//   }

//   if (!input) {
//     alert('Please enter some text.');
//     return;
//   }

//   setLoading(true);

//   const controller = new AbortController();

//   const body: APIBody = {
//     storyNodes,
//     model,
//     key: apiKey,
//   };

//   const response = await fetch('/api/stream', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     signal: controller.signal,
//     body: JSON.stringify(body),
//   });

//   if (!response.ok) {
//     setLoading(false);
//     alert('Something went wrong.');
//     return;
//   }

//   const data = response.body;

//   if (!data) {
//     setLoading(false);
//     alert('Something went wrong.');
//     return;
//   }

//   const reader = data.getReader();
//   const decoder = new TextDecoder();
//   let done = false;
//   let code = '';

//   while (!done) {
//     const { value, done: doneReading } = await reader.read();
//     done = doneReading;
//     const chunkValue = decoder.decode(value);

//     code += chunkValue;

//     setOutput((prevOutput) => prevOutput + chunkValue);
//   }

//   setLoading(false);
// };
