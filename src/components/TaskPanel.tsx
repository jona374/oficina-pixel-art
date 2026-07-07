import type { TaskInfo } from "@/types/agent";

export default function TaskPanel({ task }: { task: TaskInfo | null }) {
  return (
    <section className="retro-panel retro-corners p-4 space-y-2.5">
      <h2 className="panel-title border-b border-[var(--border-dim)] pb-2">▸ TAREAS</h2>

      {!task ? (
        <p className="text-[10px] text-gray-500">
          Sin tareas. Prueba:{" "}
          <span className="text-crt-green">run task revisar conexión con OpenClaw</span>
        </p>
      ) : (
        <>
          <p className="text-[10px] text-gray-200 leading-snug">{task.title}</p>

          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-gray-500">
              <span>progreso</span>
              <span className="text-crt-green">{task.progress}%</span>
            </div>
            <div className="h-3 bg-black/50 border border-crt-border">
              <div className="pixel-progress h-full" style={{ width: `${task.progress}%` }} />
            </div>
          </div>

          <ul className="space-y-1">
            {task.subtasks.map((st) => (
              <li key={st.label} className="flex items-center gap-2 text-[10px]">
                <span className={st.done ? "text-crt-green" : "text-gray-600"}>
                  {st.done ? "[✓]" : "[ ]"}
                </span>
                <span className={st.done ? "text-gray-300" : "text-gray-500"}>
                  {st.label}
                </span>
              </li>
            ))}
          </ul>

          {task.result && (
            <p className="text-[10px] text-crt-green border-t border-crt-border pt-2">
              ✓ {task.result}
            </p>
          )}
          {task.error && (
            <p className="text-[10px] text-crt-red border-t border-crt-border pt-2">
              ✗ {task.error}
            </p>
          )}
        </>
      )}
    </section>
  );
}
