import { Link } from "react-router-dom";

import { Button } from "../components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Not found</p>
        <h2 className="text-2xl font-semibold">That page is missing.</h2>
        <p className="mt-2 text-sm text-slate-500">
          Check the URL or return to a known route.
        </p>
      </div>
      <Link to="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}