import { OpenAIModel, StoryNode } from '@/types';
import endent from 'endent';
import { Configuration, OpenAIApi } from 'openai';

export const generateStoryNode = async (
  storyNode: StoryNode,
  context: { summary: string; script: string },
  model: OpenAIModel,
  key: string,
) => {
  const configuration = new Configuration({
    apiKey: key,
  });
  const openai = new OpenAIApi(configuration);

  const systemPromptScreenplay = endent`
  You are a world class artist, writer, director, and creative talent. You are tasked with writing a screenplay given the following information:

  Previous Scene(s) Summary:
  ${context.summary.trim()}

  Previous Scene(s) Script:
  ${context.script.trim()}

  New Scene Name:
  ${storyNode.name.trim()}

  New Scene Description:
  ${storyNode.description.trim()}

  Write a screenplay with a full script for a scene that fits the description and name. Format it nicely and make it look like a real screenplay.

  Be thorough and creative. Put a lot of effort into it. The more effort you put into it, the better it will be. You will be told when it is the final scene.

  Only respond with the properly formatted screenplay for the scene. Do not respond with any other information.
  `;

  let screenplayRes: any;
  try {
    screenplayRes = await retryWithDelay(
      () =>
        openai.createChatCompletion({
          model,
          messages: [
            {
              role: 'system',
              content: systemPromptScreenplay,
            },
          ],
        }),
      30000,
    );
  } catch (error) {
    throw new Error('Failed to generate screenplay after two attempts.');
  }

  const script = screenplayRes.data.choices[0].message?.content;

  if (!script) {
    throw new Error('No screenplay was generated.');
  }

  let updatedStoryNode: StoryNode = {
    ...storyNode,
    script,
  };

  const systemPromptSummary = endent`
  You are a world expert at summarizing information. Summarize the screenplay you wrote for the given scene in a short paragraph.

  Screenplay:
  ${script.trim()}

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
