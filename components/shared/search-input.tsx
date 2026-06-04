'use client'

import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  debounceMs?: number
  className?: string
}

export function SearchInput({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  debounceMs = 300,
  className
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '')
  const value = controlledValue !== undefined ? controlledValue : internalValue

  const debouncedSearch = useCallback(
    (searchValue: string) => {
      const timer = setTimeout(() => {
        onSearch?.(searchValue)
      }, debounceMs)
      return () => clearTimeout(timer)
    },
    [onSearch, debounceMs]
  )

  useEffect(() => {
    const cleanup = debouncedSearch(value)
    return cleanup
  }, [value, debouncedSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm',
          'placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />
    </div>
  )
}
