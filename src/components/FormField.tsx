import type { ReactElement, ReactNode } from 'react'
import { cloneElement, isValidElement, useId } from 'react'
import { cx } from '../utils/cx'

type FieldControlProps = {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

type FormFieldProps = {
  label: string
  children: ReactElement<FieldControlProps>
  error?: string
  hint?: ReactNode
  required?: boolean
  id?: string
  className?: string
}

export function FormField({
  label,
  children,
  error,
  hint,
  required,
  id,
  className,
}: FormFieldProps) {
  const generatedId = useId()
  const childId = isValidElement<FieldControlProps>(children)
    ? children.props.id
    : undefined
  const resolvedId = childId ?? id ?? generatedId
  const errorId = `${resolvedId}-error`
  const hintId = `${resolvedId}-hint`
  const childDescribedBy = isValidElement<FieldControlProps>(children)
    ? children.props['aria-describedby']
    : undefined
  const describedBy = [hint ? hintId : null, error ? errorId : null, childDescribedBy]
    .filter(Boolean)
    .join(' ')

  const control = isValidElement<FieldControlProps>(children)
    ? cloneElement(children, {
        id: resolvedId,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': describedBy || undefined,
      })
    : children

  return (
    <div className={cx('space-y-1.5', className)}>
      <label htmlFor={resolvedId} className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      {control}
      {hint ? (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
