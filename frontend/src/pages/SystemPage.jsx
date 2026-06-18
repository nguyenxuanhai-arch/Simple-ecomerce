import { Activity, Cpu, RefreshCw, Server } from "lucide-react";
import StatusMessage from "../components/StatusMessage";

export default function SystemPage({
  info,
  health,
  version,
  loadResult,
  loading,
  error,
  onRefresh,
  onGenerateLoad,
}) {
  return (
    <section className="section-stack">
      <div className="section-heading">
        <div>
          <h1>System</h1>
          <p>{health?.status || "UNKNOWN"}</p>
        </div>
        <button type="button" className="icon-button" onClick={onRefresh} title="Refresh system">
          <RefreshCw size={18} />
        </button>
      </div>

      <StatusMessage error={error} />

      {loading ? <div className="loading-bar" /> : null}

      <div className="system-grid">
        <article className="metric-panel">
          <Server size={22} />
          <span>Hostname</span>
          <strong>{info?.hostname || "-"}</strong>
        </article>
        <article className="metric-panel">
          <Activity size={22} />
          <span>Version</span>
          <strong>{version?.version || info?.version || "-"}</strong>
        </article>
        <article className="metric-panel">
          <Cpu size={22} />
          <span>Health</span>
          <strong>{health?.status || "-"}</strong>
        </article>
      </div>

      <div className="system-actions">
        <button type="button" className="primary-button" onClick={onGenerateLoad}>
          <Cpu size={18} />
          <span>Generate CPU load</span>
        </button>
        {loadResult ? (
          <div className="code-panel">
            <pre>{JSON.stringify(loadResult, null, 2)}</pre>
          </div>
        ) : null}
      </div>

      <div className="code-panel">
        <pre>{JSON.stringify(info || {}, null, 2)}</pre>
      </div>
    </section>
  );
}
