import { cn } from '@/lib/utils'

const Toggle = ({ on, onToggle, color = 'bg-emerald-500' }: { on: boolean; onToggle: () => void; color?: string }) => (
    <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle() }}
        className={cn(
            'relative w-9.5 h-5 rounded-full transition-colors cursor-pointer shrink-0 focus:outline-none',
            on ? color : 'bg-slate-200'
        )}
        aria-checked={on}
        role="switch"
    >
        <span
            className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                on ? 'translate-x-0.5' : '-translate-x-4'
            )}
        />
    </button>
)

export default Toggle;