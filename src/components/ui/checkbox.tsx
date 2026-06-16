import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "h-4.5 w-4.5 rounded border border-slate-300 bg-white transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-button-color/50 peer-checked:bg-blue-600 peer-checked:border-slate-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 flex items-center justify-center",
              className
            )}
          >
            <Check className="h-3.5 w-3.5 text-white stroke-[3px] peer-checked:block" />
          </div>
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
