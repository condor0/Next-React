import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { Input } from "../components/Input";
import { useAuth } from "../state/auth";
import { loginSchema, type LoginValues } from "../forms/schemas";

type LocationState = {
  from?: { pathname?: string };
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    login({ email: values.email });
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

        <form
          className="space-y-3"
          onSubmit={handleSubmit(onSubmit)}
          aria-busy={isSubmitting || undefined}
        >
          <FormField label="Email" error={errors.email?.message} required>
            <Input
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              disabled={isSubmitting}
              {...register("email")}
            />
          </FormField>
          <FormField label="Password" error={errors.password?.message} required>
            <Input
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              disabled={isSubmitting}
              {...register("password")}
            />
          </FormField>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}