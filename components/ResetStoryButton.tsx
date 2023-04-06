import { IconRepeat } from '@tabler/icons-react';
import { FC } from 'react';

interface Props {
  onResetStory: () => void;
}

export const ResetStoryButton: FC<Props> = ({ onResetStory }) => {
  return (
    <button
      className="flex items-center rounded border bg-white px-3 py-2 text-indigo-600 hover:opacity-50"
      onClick={onResetStory}
    >
      <div className="mr-1">Reset Story</div>

      <IconRepeat size={18} />
    </button>
  );
};
