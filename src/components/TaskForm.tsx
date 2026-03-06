import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { FormField } from './FormField'
import { Input } from './Input'
import { Select } from './Select'
import { Textarea } from './Textarea'
import { Button } from './Button'
import {
  taskSchema,
  taskStatusOptions,
  type TaskStatus,
  type TaskValues,
} from '../forms/schemas'
import { taskStatusLabels } from '../utils/taskRules'

type TaskFormProps = {
  defaultValues?: Partial<TaskValues>
  submitLabel: string
  onSubmit: SubmitHandler<TaskValues>
  resetOnSubmit?: boolean
  className?: string
  statusOptions?: TaskStatus[]
}

const baseDefaults: TaskValues = {
  title: '',
  status: taskStatusOptions[0],
  description: '',
}

export function TaskForm({
  defaultValues,
  submitLabel,
  onSubmit,
  resetOnSubmit = false,
  className,
  statusOptions,
}: TaskFormProps) {
  const resolvedDefaults = { ...baseDefaults, ...defaultValues }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: resolvedDefaults,
  })

  const handleFormSubmit: SubmitHandler<TaskValues> = async (values) => {
    await onSubmit(values)
    if (resetOnSubmit) {
      reset(resolvedDefaults)
    }
  }

  const resolvedStatusOptions = statusOptions ?? taskStatusOptions

  return (
    <form
      className={className ?? 'space-y-4'}
      onSubmit={handleSubmit(handleFormSubmit)}
      aria-busy={isSubmitting || undefined}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Task title" error={errors.title?.message} required>
          <Input
            placeholder="Define the next step"
            autoComplete="off"
            disabled={isSubmitting}
            {...register('title')}
          />
        </FormField>
        <FormField label="Status" error={errors.status?.message} required>
          <Select disabled={isSubmitting} {...register('status')}>
            {resolvedStatusOptions.map((status) => (
              <option key={status} value={status}>
                {taskStatusLabels[status]}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField
        label="Details"
        hint="Keep it short so it fits on a task card."
        error={errors.description?.message}
        required
      >
        <Textarea
          rows={3}
          placeholder="Short action item"
          disabled={isSubmitting}
          {...register('description')}
        />
      </FormField>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
