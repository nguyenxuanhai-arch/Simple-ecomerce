import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function StatusMessage({ error, success }) {
  if (!error && !success) {
    return null;
  }

  const Icon = error ? AlertCircle : CheckCircle2;

  return (
    <div className={error ? "status-message status-message--error" : "status-message"}>
      <Icon size={18} />
      <span>{error || success}</span>
    </div>
  );
}
