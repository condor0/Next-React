import type { InputHTMLAttributes } from 'react'
import { cx } from '../utils/cx'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cx(
        'w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-ink shadow-inner outline-none transition focus:border-moss',
        className,
      )}
      {...props}
    />
  )
}
