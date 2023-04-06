import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { FC } from 'react';

interface Props {
  onGenerateStory: () => void;
}

export const GenerateStoryButton: FC<Props> = ({ onGenerateStory }) => {
  return (
    <button
      className="flex items-center rounded border bg-white px-3 py-2 text-indigo-600 hover:opacity-50"
      onClick={onGenerateStory}
    >
      <div className="mr-1">Generate Story</div>

      <IconPlayerPlayFilled size={18} />
    </button>
  );
};
