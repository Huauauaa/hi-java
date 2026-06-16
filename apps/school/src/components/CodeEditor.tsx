import type { FC } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  language?: string;
};

export const CodeEditor: FC<Props> = ({ value, onChange, language = 'java' }) => {
  const lines = value.split('\n');

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[#1e1e1e] font-mono text-sm">
      <div className="select-none overflow-hidden border-r border-[#3a3a3a] bg-[#1e1e1e] py-3 pr-2 text-right text-[#6e7681]">
        {lines.map((_, i) => (
          <div key={i} className="leading-6 px-2">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none border-0 bg-[#1e1e1e] p-3 leading-6 text-[#d4d4d4] outline-none"
        aria-label={`${language} code editor`}
      />
    </div>
  );
};
