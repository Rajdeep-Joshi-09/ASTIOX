import { cn } from "@/lib/utils";

export const PageShell = ({ title, description, action, children, className }) => (
  <div className={cn("space-y-6 animate-in fade-in duration-300", className)}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    {children}
  </div>
);

export const FormCard = ({ children, className }) => (
  <div className="flex justify-center">
    <div
      className={cn(
        "w-full max-w-xl bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 sm:p-8",
        className
      )}
    >
      {children}
    </div>
  </div>
);

export const DataCard = ({ children, className }) => (
  <div
    className={cn(
      "bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);

export const StatusBadge = ({ active }) => (
  <span
    className={cn(
      "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium",
      active
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-muted text-muted-foreground"
    )}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

export const StatusToggle = ({ active, onChange, label = "Status" }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        onClick={() => onChange(!active)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          active ? "bg-indigo-600" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
            active ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      <span className="text-sm text-muted-foreground w-14">
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  </div>
);

export const ErrorAlert = ({ message }) =>
  message ? (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  ) : null;

export const SelectField = ({ id, value, onChange, children, required }) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
  >
    {children}
  </select>
);
