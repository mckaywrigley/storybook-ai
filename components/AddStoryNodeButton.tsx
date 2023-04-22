import { IconPlus } from '@tabler/icons-react';
import { FC } from 'react';

interface Props {
  onAddStoryNode: () => void;
}

export const AddStoryNodeButton: FC<Props> = ({ onAddStoryNode }) => {
  return (
    <button
      className="flex rounded border bg-white p-2 text-indigo-600 hover:opacity-50"
      onClick={() => onAddStoryNode()}
    >
      <IconPlus />
      <div className="ml-1">Chapter</div>
    </button>
  );
};
