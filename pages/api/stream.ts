import { APIBody, StreamData } from '@/types';
import { OpenAIStream } from '@/utils/server';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { storyNodes, model, key } = (await req.json()) as APIBody;

    const data: StreamData = {
      storyNodes,
      model,
      key,
    };

    const stream = await OpenAIStream(data);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
