import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { FormField } from './FormField'
import { Input } from './Input'
import { Select } from './Select'
import { Textarea } from './Textarea'
import { Button } from './Button'
import {
  projectSchema,
  projectStatusOptions,
  type ProjectValues,
} from '../forms/schemas'

type ProjectFormProps = {
  defaultValues?: Partial<ProjectValues>
  submitLabel: string
  onSubmit: SubmitHandler<ProjectValues>
  resetOnSubmit?: boolean
  className?: string
}

const baseDefaults: ProjectValues = {
  name: '',
  status: projectStatusOptions[0],
  ownerEmail: '',
  description: '',
}

export function ProjectForm({
  defaultValues,
  submitLabel,
  onSubmit,
  resetOnSubmit = false,
  className,
}: ProjectFormProps) {
  const resolvedDefaults = { ...baseDefaults, ...defaultValues }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: resolvedDefaults,
  })

  const handleFormSubmit: SubmitHandler<ProjectValues> = async (values) => {
    await onSubmit(values)
    if (resetOnSubmit) {
      reset(resolvedDefaults)
    }
  }

  return (
    <form
      className={className ?? 'space-y-4'}
      onSubmit={handleSubmit(handleFormSubmit)}
      aria-busy={isSubmitting || undefined}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Project name" error={errors.name?.message} required>
          <Input
            placeholder="Describe the work"
            autoComplete="off"
            disabled={isSubmitting}
            {...register('name')}
          />
        </FormField>
        <FormField label="Status" error={errors.status?.message} required>
          <Select disabled={isSubmitting} {...register('status')}>
            {projectStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Owner email" error={errors.ownerEmail?.message} required>
        <Input
          type="email"
          placeholder="owner@company.com"
          autoComplete="email"
          disabled={isSubmitting}
          {...register('ownerEmail')}
        />
      </FormField>

      <FormField
        label="Summary"
        hint="Keep it concise so it fits on a project card."
        error={errors.description?.message}
        required
      >
        <Textarea
          rows={4}
          placeholder="Short status update or goal"
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
