import clsx from "clsx";

type Status = "ready" | "beta" | "deprecated";

const statusConfig: Record<Status, { label: string; className: string }> = {
  ready: {
    label: "Ready",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  beta: {
    label: "Beta",
    className: "bg-amber-50 text-amber-700 border-amber-200"
  },
  deprecated: {
    label: "Deprecated",
    className: "bg-red-50 text-red-700 border-red-200"
  }
};

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
