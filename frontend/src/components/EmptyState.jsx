import { PackageOpen } from "lucide-react";

export default function EmptyState({ title }) {
  return (
    <div className="empty-state">
      <PackageOpen size={28} />
      <span>{title}</span>
    </div>
  );
}
