import { describe, it, expect } from 'vitest';
import { loadTasks, createTask, updateTask, } from '../../state/tasksStore';

describe('tasksStore', () => {
	it('should load default tasks', () => {
		const tasks = loadTasks();
		expect(Array.isArray(tasks)).toBe(true);
	});

	it('should create a task', () => {
		const tasks = loadTasks();
		const newTask = { title: 'Test Task', description: 'Test', status: 'todo' as const };
		const result = createTask('test-project', newTask, tasks);
		expect(result.task).toBeDefined();
		expect(result.task.title).toBe('Test Task');
	});

	it('should update a task', () => {
		const tasks = loadTasks();
		if (tasks.length > 0) {
			const updated = updateTask(tasks[0].id, { title: 'Updated', description: 'test', status: 'doing' as const }, tasks);
			expect(updated).toBeDefined();
		}
	});
});