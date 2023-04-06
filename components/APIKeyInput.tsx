interface Props {
  apiKey: string;
  onChange: (apiKey: string) => void;
  onSet: () => void;
}

export const APIKeyInput: React.FC<Props> = ({ apiKey, onChange, onSet }) => {
  return (
    <div className="text-center">
      <div className="mb-1 text-sm sm:text-base">
        {`Don't have an OpenAI API key? Get one`}
        <a
          className="ml-1 underline"
          href="https://platform.openai.com/account/api-keys"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </div>

      <div className="flex flex-col items-center justify-center sm:flex-row">
        <input
          className="mt-1 w-[320px] rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:outline-none sm:h-[40px]"
          type="password"
          placeholder="OpenAI API Key"
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          className="ml-1 mt-2 flex h-[38px] items-center rounded border bg-white px-3 py-2 text-indigo-600 hover:opacity-50 sm:mt-1"
          onClick={onSet}
        >
          Set Key
        </button>
      </div>
    </div>
  );
};
