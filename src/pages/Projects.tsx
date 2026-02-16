import { Link } from "react-router-dom";

import { Card } from "../components/Card";

const projects = [
  { id: "alpha", name: "Project Alpha", status: "In progress" },
  { id: "atlas", name: "Atlas Migration", status: "Planned" },
  { id: "nova", name: "Nova Storybook", status: "In review" },
];

export default function Projects() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Portfolio</p>
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="mt-2 text-sm text-slate-500">
          Select a project to view details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                {project.status}
              </span>
            </div>
            <Link
              to={`/projects/${project.id}`}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              View details
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}