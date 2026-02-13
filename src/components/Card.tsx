import type { HTMLAttributes } from 'react'
import { cx } from '../utils/cx'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cx(
        'rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-soft backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}
