import { StoryNode } from '@/types';
import { FC } from 'react';
import { StoryNodeDisplay } from './StoryNodeDisplay';

interface Props {
  index: number;
  total: number;
  lastNode: StoryNode | undefined;
}

export const Loader: FC<Props> = ({ index, total, lastNode }) => {
  return (
    <div className="flex flex-col">
      <div className="text-center">
        <div className="text-2xl font-bold">Generating your story...</div>
        <div className="mt-2 text-xl">
          {index} / {total}
        </div>
      </div>

      {lastNode && (
        <div className="mt-8 w-[350px] sm:w-[600px]">
          <StoryNodeDisplay storyNode={lastNode} />
        </div>
      )}
    </div>
  );
};
