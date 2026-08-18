"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface CustomFilterDropdownProps {
  label: string
  header: string
  options: string[]
  selected: string
  onSelect: (val: string) => void
  type?: "checkbox" | "radio"
}

const CustomFilterDropdown = ({
  label,
  header,
  options,
  selected,
  onSelect,
  type = "checkbox",
}: CustomFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Pure options excluding any "All" string passed from props
  const realOptions = options.filter((option) => option !== "All")

  // Options rendered in dropdown menu
  const dropdownOptions =
    type === "checkbox" ? ["All", ...realOptions] : options

  // Clean selected values array (filters out empty strings and literal "All")
  const selectedValues = selected
    ? selected
        .split(",")
        .map((value) => value.trim())
        .filter((val) => Boolean(val) && val !== "All")
    : []

  const isAllSelected =
    type === "checkbox" &&
    realOptions.length > 0 &&
    selectedValues.length === realOptions.length &&
    realOptions.every((option) => selectedValues.includes(option))

  const handleSelect = (option: string) => {
    if (type === "radio") {
      onSelect(option)
      setIsOpen(false)
      return
    }

    if (option === "All") {
      onSelect(isAllSelected ? "" : realOptions.join(","))
      return
    }

    const isSelected = selectedValues.includes(option)

    let updatedValues = isSelected
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option]

    if (
      updatedValues.length === realOptions.length &&
      realOptions.every((val) => updatedValues.includes(val))
    ) {
      updatedValues = realOptions
    }

    onSelect(updatedValues.join(","))
  }

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", clickOutside)
    return () => document.removeEventListener("mousedown", clickOutside)
  }, [])

  const displayValue =
    type === "checkbox"
      ? isAllSelected && selectedValues.length > 0
        ? "All"
        : selectedValues.length > 0
          ? selectedValues.join(", ")
          : label
      : selectedValues[0] || label

  return (
    <div ref={dropdownRef} className="relative select-none z-30">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg transition-all cursor-pointer w-40 sm:w-44 leading-relaxed"
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-35 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="bg-button-color text-white px-4 py-2 text-xs font-bold text-center border-b border-blue-400/20 tracking-wider select-none uppercase">
            {header}
          </div>

          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
            {dropdownOptions.map((option) => {
              const checked =
                type === "checkbox"
                  ? option === "All"
                    ? isAllSelected
                    : selectedValues.includes(option)
                  : selectedValues.includes(option)

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer",
                    checked && "text-button-color font-bold"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex items-center justify-center w-3.5 h-3.5 border shrink-0 transition-colors",
                        type === "radio" ? "rounded-full" : "rounded",
                        checked
                          ? "bg-button-color border-button-color"
                          : "border-slate-300"
                      )}
                    >
                      {checked &&
                        (type === "radio" ? (
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        ) : (
                          <span className="text-white text-[9px] font-bold leading-none">
                            ✓
                          </span>
                        ))}
                    </span>

                    <span className="truncate">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomFilterDropdown;