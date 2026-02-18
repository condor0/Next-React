import type { SelectHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cx } from '../utils/cx'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cx(
          'w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-ink shadow-inner outline-none transition focus:border-moss aria-[invalid=true]:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
    )
  },
)

Select.displayName = 'Select'
