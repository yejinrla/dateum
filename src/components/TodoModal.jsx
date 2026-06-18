import { useState } from "react";
import Modal from "./Modal";

export default function TodoModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "",
    assignee: "함께",
    due: "2026-06-20",
    category: "데이트 준비",
  });
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  return (
    <Modal
      title="함께할 일 추가"
      subtitle="누가 언제까지 할지 가볍게 정해보세요."
      onClose={onClose}
      submitLabel="할 일 추가"
      onSubmit={(event) => {
        event.preventDefault();
        if (form.title.trim()) onAdd(form);
      }}
    >
      <label>할 일<input autoFocus required value={form.title} onChange={update("title")} placeholder="예: 전시 티켓 예매하기" /></label>
      <div className="form-grid">
        <label>담당자<select value={form.assignee} onChange={update("assignee")}><option>함께</option><option>민지</option><option>준호</option></select></label>
        <label>기한<input type="date" value={form.due} onChange={update("due")} /></label>
      </div>
      <label>분류<input value={form.category} onChange={update("category")} /></label>
    </Modal>
  );
}
