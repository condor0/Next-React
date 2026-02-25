import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginValues = z.infer<typeof loginSchema>

export const projectStatusOptions = [
  'Planned',
  'In progress',
  'In review',
  'Done',
] as const

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  status: z.enum(projectStatusOptions),
  ownerEmail: z
    .string()
    .min(1, 'Owner email is required')
    .email('Enter a valid email address'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(240, 'Description must be at most 240 characters'),
})

export type ProjectValues = z.infer<typeof projectSchema>

export const taskStatusOptions = ['todo', 'doing', 'done'] as const

export type TaskStatus = (typeof taskStatusOptions)[number]

export const taskSchema = z.object({
  title: z.string().min(2, 'Task title is required'),
  status: z.enum(taskStatusOptions),
  description: z
    .string()
    .min(4, 'Description must be at least 4 characters')
    .max(200, 'Description must be at most 200 characters'),
})

export type TaskValues = z.infer<typeof taskSchema>
