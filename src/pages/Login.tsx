import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useAuth } from "../state/auth";

type LocationState = {
  from?: { pathname?: string };
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname ?? "/dashboard";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login();
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center">
      <Card className="w-full space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Welcome back</p>
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">
            Use any credentials to simulate authentication.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-600">
            Email
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="mt-1"
              required
            />
          </label>
          <label className="block text-sm text-slate-600">
            Password
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              className="mt-1"
              required
            />
          </label>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  );
}