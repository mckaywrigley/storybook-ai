import { StoryNode } from '@/types';
import { FC } from 'react';
import { AddStoryNodeButton } from './AddStoryNodeButton';
import { StoryNodeDisplay } from './StoryNodeDisplay';

interface Props {
  storyNodes: StoryNode[];
  onUpdateStoryNode: (index: number, storyNode: StoryNode) => void;
  onRemoveStoryNode: (index: number) => void;
  onAddStoryNode: (index: number) => void;
}

export const StoryNodes: FC<Props> = ({
  storyNodes,
  onUpdateStoryNode,
  onRemoveStoryNode,
  onAddStoryNode,
}) => {
  return (
    <div className="flex flex-col">
      {storyNodes.map((storyNode, index) => (
        <div key={index} className="relative">
          <StoryNodeDisplay
            storyNode={storyNode}
            onUpdateStoryNode={(storyNode) =>
              onUpdateStoryNode(index, storyNode)
            }
          />

          <div className="my-6 flex justify-center">
            <AddStoryNodeButton
              onAddStoryNode={() => onAddStoryNode(index + 1)}
            />
          </div>

          <button
            className="absolute right-5 top-3 text-red-300 hover:opacity-50"
            onClick={() => onRemoveStoryNode(index)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
