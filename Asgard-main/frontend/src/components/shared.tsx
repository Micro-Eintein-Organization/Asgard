import type { ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Check,
  Circle,
  Clock3,
  Info,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p className="lead">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function BackLink({
  to,
  children = "Back",
  state,
}: {
  to: string;
  children?: ReactNode;
  state?: unknown;
}) {
  return (
    <Link to={to} state={state} className="back-link">
      <ArrowLeft aria-hidden="true" size={16} />
      {children}
    </Link>
  );
}

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "error" | "success";
}) {
  const Icon =
    tone === "error" ? TriangleAlert : tone === "success" ? Check : Info;
  return (
    <div
      className={`notice notice-${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon size={18} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export function Unavailable({
  children = "Not available in this prototype. No changes are saved.",
}: {
  children?: ReactNode;
}) {
  return (
    <p className="availability">
      <Info aria-hidden="true" size={15} />
      {children}
    </p>
  );
}

export function StatePanel({
  kind,
  title,
  children,
  action,
}: {
  kind: "empty" | "loading" | "error" | "success";
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card
      className={`state-panel state-${kind}`}
      role={
        kind === "error"
          ? "alert"
          : kind === "loading" || kind === "success"
            ? "status"
            : undefined
      }
    >
      <div>
        {kind === "loading" ? (
          <Clock3 aria-hidden="true" size={24} />
        ) : kind === "error" ? (
          <TriangleAlert aria-hidden="true" size={24} />
        ) : kind === "success" ? (
          <Check aria-hidden="true" size={24} />
        ) : (
          <Circle aria-hidden="true" size={24} />
        )}
      </div>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {kind === "loading" && (
        <div className="loading-lines" aria-hidden="true">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      )}
      {action}
    </Card>
  );
}

export type TopicState = "Not started" | "Learning" | "Done" | "Skipped";
export function StatusBadge({ status }: { status: TopicState }) {
  return (
    <Badge
      variant="outline"
      className={`topic-status status-${status.toLowerCase().replace(" ", "-")}`}
    >
      {status === "Done" ? <Check aria-hidden="true" size={13} /> : null}
      {status}
    </Badge>
  );
}

export function UnavailableButton({ children }: { children: ReactNode }) {
  return <Button disabled>{children}</Button>;
}
