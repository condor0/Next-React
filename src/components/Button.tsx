import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../utils/cx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-ink text-white shadow-soft hover:-translate-y-0.5',
  outline: 'border border-slate-200 bg-white/70 text-ink hover:bg-white',
  ghost: 'bg-transparent text-ink hover:bg-slate-100',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}
