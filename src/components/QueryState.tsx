import type { ReactNode } from 'react'
import { Card } from './Card'
import { cx } from '../utils/cx'

type QueryStateProps = {
  title: string
  description?: string
  tone?: 'neutral' | 'error'
  action?: ReactNode
  className?: string
}

const toneStyles: Record<NonNullable<QueryStateProps['tone']>, string> = {
  neutral: 'border-slate-200/70 bg-white/85 text-slate-700',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
}

export function QueryState({
  title,
  description,
  tone = 'neutral',
  action,
  className,
}: QueryStateProps) {
  return (
    <Card
      className={cx('space-y-2', toneStyles[tone], className)}
      role={tone === 'error' ? 'alert' : undefined}
      aria-live={tone === 'error' ? 'assertive' : undefined}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Status
        </p>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {description ? <p className="text-sm opacity-80">{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </Card>
  )
}
