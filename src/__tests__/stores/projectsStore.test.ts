import { describe, it, expect } from 'vitest';
import { loadProjects, createProject, updateProject } from '../../state/projectsStore';

describe('projectsStore', () => {
	it('should load default projects', () => {
		const projects = loadProjects();
		expect(Array.isArray(projects)).toBe(true);
	});

	it('should create a project', () => {
		const projects = loadProjects();
		const newProject = { name: 'Test Project', status: 'Planned' as const, ownerEmail: 'test@example.com', description: 'Test' };
		const result = createProject(newProject, projects);
		expect(result.project).toBeDefined();
		expect(result.project.name).toBe('Test Project');
	});

	it('should update a project', () => {
		const projects = loadProjects();
		if (projects.length > 0) {
			const updated = updateProject(projects[0].id, { name: 'Updated', status: 'In progress' as const, ownerEmail: 'test@example.com', description: 'test' }, projects);
			expect(updated).toBeDefined();
		}
	});
});