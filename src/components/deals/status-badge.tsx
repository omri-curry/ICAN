import { dealStatusLabels, type DealStatus } from "@/data/mocks/deals";

type StatusBadgeProps = Readonly<{
  status: DealStatus;
  label?: string;
}>;

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return <span className={`status-badge status-badge-${status}`}><i />{label ?? dealStatusLabels[status]}</span>;
}
