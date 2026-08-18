import React, { useState, useEffect, ChangeEvent, InputHTMLAttributes } from 'react';
import useDebounce from '@/hooks/useDebounce';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onDebounceSearch?: (value: string) => void; 
}

export default function SearchInput({ onDebounceSearch, ...props }: SearchInputProps) {
  const [text, setText] = useState<string>('');

  const debouncedText = useDebounce<string>(text, 500);

  useEffect(() => {
    if (debouncedText) {
      console.log('API Request sent for:', debouncedText);
      onDebounceSearch?.(debouncedText);
    }
  }, [debouncedText, onDebounceSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    props.onChange?.(e); 
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