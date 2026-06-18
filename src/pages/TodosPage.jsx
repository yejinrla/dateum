import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import TodoRow from "../components/TodoRow";

export default function TodosPage({ todos, setModal, toggleTodo }) {
  const [view, setView] = useState("open");
  const filtered = todos.filter((todo) => view === "all" || (view === "done" ? todo.completed : !todo.completed));
  const completed = todos.filter((todo) => todo.completed).length;

  return (
    <>
      <PageHeader
        eyebrow="TOGETHER, ONE BY ONE"
        title={<>함께할 <em>일</em></>}
        description="작은 약속도 잊지 않게, 부담 없이 나누어 챙겨요."
        action={<button className="primary-button" onClick={() => setModal("todo")}><Plus size={18} /> 할 일 추가</button>}
      />
      <section className="todo-summary">
        <div className="summary-copy">
          <span>이번 주 함께 해낸 일</span>
          <strong>{completed}<small>개</small></strong>
          <p>조금씩 준비되고 있어요. 잘하고 있어요!</p>
        </div>
        <div className="progress-ring" style={{ "--progress": `${Math.max(18, completed / todos.length * 100)}%` }}>
          <span>{Math.round(completed / todos.length * 100)}%</span>
        </div>
      </section>
      <div className="filter-tabs">
        {[["open", "해야 할 일"], ["done", "완료"], ["all", "전체"]].map(([id, label]) => (
          <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>{label}</button>
        ))}
      </div>
      <section className="card full-todo-card">
        <div className="todo-list">
          {filtered.length > 0 ? filtered.map((todo) => (
            <TodoRow key={todo.id} todo={todo} onToggle={toggleTodo} />
          )) : (
            <div className="empty-state">
              <CheckCircle2 size={30} />
              <strong>모두 완료했어요!</strong>
              <p>둘이 함께해서 더 가벼운 하루네요.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
