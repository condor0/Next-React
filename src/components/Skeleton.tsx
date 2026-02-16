import type { HTMLAttributes } from 'react'
import { cx } from '../utils/cx'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cx('animate-pulse rounded-2xl bg-slate-200/70', className)}
      {...props}
    />
  )
}
