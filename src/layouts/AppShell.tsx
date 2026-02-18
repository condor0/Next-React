import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { useAuth } from "../state/auth";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Projects", to: "/projects" },
];

export function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Field Notes
            </p>
            <h1 className="text-lg font-semibold">Research Workspace</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 text-sm transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                {user.name}
              </span>
            ) : null}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}