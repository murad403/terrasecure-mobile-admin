import { useState, useEffect, useRef, ChangeEvent, InputHTMLAttributes } from 'react';
import useDebounce from '@/hooks/useDebounce';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onDebounceSearch?: (value: string) => void;
  debounceDelay?: number;
}

export default function SearchInput({
  onDebounceSearch,
  debounceDelay = 500,
  defaultValue = '',
  value,
  onChange,
  ...props
}: SearchInputProps) {
  const [text, setText] = useState<string>(
    (value ?? defaultValue ?? '') as string
  );

  const [prevValue, setPrevValue] = useState<string | number | readonly string[] | undefined>(value);

  if (value !== undefined && value !== prevValue) {
    setPrevValue(value);
    setText(value as string);
  }

  const debouncedText = useDebounce<string>(text, debounceDelay);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onDebounceSearch?.(debouncedText);
  }, [debouncedText, onDebounceSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onChange?.(e);
  };

  return (
    <input
      placeholder="Type to search..."
      {...props}
      value={text}
      onChange={handleChange}
    />
  );
}