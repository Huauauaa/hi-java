import type { FC, KeyboardEvent, UIEvent } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { filterCompletions, highlightJava, wordBeforeCursor, type JavaCompletion } from '../lib/javaEditorSupport';

type Props = {
  value: string;
  onChange: (v: string) => void;
  language?: string;
};

const INDENT = '    ';

export const CodeEditor: FC<Props> = ({ value, onChange, language = 'java' }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [suggestions, setSuggestions] = useState<JavaCompletion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [popup, setPopup] = useState<{ top: number; left: number } | null>(null);

  const lines = value.split('\n');
  const highlighted = useMemo(() => highlightJava(value), [value]);

  const syncScroll = (el: HTMLTextAreaElement) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = el.scrollTop;
      highlightRef.current.scrollLeft = el.scrollLeft;
    }
  };

  const closeSuggestions = useCallback(() => {
    setSuggestions([]);
    setPopup(null);
    setActiveIndex(0);
  }, []);

  const openSuggestions = useCallback(
    (prefix: string, cursor: number) => {
      const items = filterCompletions(prefix);
      if (items.length === 0) {
        closeSuggestions();
        return;
      }
      const ta = textareaRef.current;
      if (!ta) return;

      const before = value.slice(0, cursor);
      const line = before.split('\n').length;
      const col = (before.match(/[^\n]*$/)?.[0] ?? '').length;

      setSuggestions(items);
      setActiveIndex(0);
      setPopup({
        top: line * 24 + 8,
        left: col * 8 + 12,
      });
    },
    [closeSuggestions, value],
  );

  const applyCompletion = useCallback(
    (item: JavaCompletion) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const cursor = ta.selectionStart;
      const prefix = wordBeforeCursor(value, cursor);
      const next = value.slice(0, cursor - prefix.length) + item.insert + value.slice(ta.selectionEnd);
      onChange(next);
      closeSuggestions();

      const nextCursor = cursor - prefix.length + item.insert.length;
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = ta.selectionEnd = nextCursor;
      });
    },
    [closeSuggestions, onChange, value],
  );

  const onChangeInner = (next: string) => {
    onChange(next);
    const ta = textareaRef.current;
    if (!ta) return;
    const prefix = wordBeforeCursor(next, ta.selectionStart);
    if (prefix.length >= 1) openSuggestions(prefix, ta.selectionStart);
    else closeSuggestions();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applyCompletion(suggestions[activeIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSuggestions();
        return;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const { selectionStart, selectionEnd } = ta;
      const next = value.slice(0, selectionStart) + INDENT + value.slice(selectionEnd);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = selectionStart + INDENT.length;
      });
      return;
    }

    if (e.key === ' ' && e.ctrlKey) {
      e.preventDefault();
      const ta = e.currentTarget;
      openSuggestions(wordBeforeCursor(value, ta.selectionStart), ta.selectionStart);
    }
  };

  const onScroll = (e: UIEvent<HTMLTextAreaElement>) => {
    syncScroll(e.currentTarget);
  };

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[#1e1e1e] font-mono text-sm">
      <div className="select-none overflow-hidden border-r border-[#3a3a3a] bg-[#1e1e1e] py-3 pr-2 text-right text-[#6e7681]">
        {lines.map((_, i) => (
          <div key={i} className="leading-6 px-2">
            {i + 1}
          </div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <pre
          ref={highlightRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre-wrap wrap-break-word p-3 leading-6 text-[#d4d4d4]"
          dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChangeInner(e.target.value)}
          onKeyDown={onKeyDown}
          onScroll={onScroll}
          onBlur={() => setTimeout(closeSuggestions, 120)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="relative z-10 h-full w-full resize-none border-0 bg-transparent p-3 leading-6 text-transparent caret-[#d4d4d4] outline-none selection:bg-[#264f78]"
          aria-label={`${language} code editor`}
        />

        {popup && suggestions.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-20 max-h-48 min-w-[180px] overflow-y-auto rounded border border-[#3a3a3a] bg-[#252526] py-1 shadow-lg"
            style={{ top: popup.top, left: popup.left }}
          >
            {suggestions.map((item, i) => (
              <li key={item.label}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-1 text-left text-xs ${
                    i === activeIndex ? 'bg-[#094771] text-[#eff1f6]' : 'text-[#cccccc]'
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyCompletion(item);
                  }}
                >
                  <span>{item.label}</span>
                  {item.detail && <span className="text-[#8c8c8c]">{item.detail}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
