import { Link, useParams } from "react-router-dom";

import { Card } from "../components/Card";

export default function ProjectDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Project</p>
        <h2 className="text-2xl font-semibold">{id ?? "Unknown"}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Deep link works for project detail routes.
        </p>
      </div>

      <Card className="space-y-2">
        <p className="text-sm text-slate-600">
          This is a placeholder detail view. Wire it to your data source next.
        </p>
        <Link
          to="/projects"
          className="text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          Back to projects
        </Link>
      </Card>
    </div>
  );
}