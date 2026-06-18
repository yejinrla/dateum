import { Check, Clock3 } from "lucide-react";
import { formatDate } from "../utils";

export default function TodoRow({ todo, onToggle, compact = false }) {
  return (
    <div className={`todo-row ${todo.completed ? "completed" : ""}`}>
      <button
        className="check-button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "완료 취소" : "완료"}
      >
        {todo.completed ? <Check size={15} /> : null}
      </button>
      <div className="todo-content">
        <strong>{todo.title}</strong>
        <span>
          <span className={`assignee ${todo.assignee === "민지" ? "pink" : ""}`}>
            {todo.assignee}
          </span>
          {!compact && <><span className="dot-separator">·</span>{todo.category}</>}
        </span>
      </div>
      <time><Clock3 size={14} /> {formatDate(todo.due)}</time>
    </div>
  );
}
