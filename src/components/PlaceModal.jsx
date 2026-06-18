import { useState } from "react";
import Modal from "./Modal";

export default function PlaceModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    time: "13:00",
    durationHours: "1",
    durationMinutes: "0",
    durationSeconds: "0",
    category: "데이트 장소",
    address: "",
    note: "",
  });
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const formatDuration = () => {
    const hours = Number(form.durationHours) || 0;
    const minutes = Number(form.durationMinutes) || 0;
    const seconds = Number(form.durationSeconds) || 0;
    const parts = [];
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0) parts.push(`${minutes}분`);
    if (seconds > 0) parts.push(`${seconds}초`);
    return parts.length ? parts.join(" ") : "약 1시간";
  };

  return (
    <Modal
      title="코스 추가"
      subtitle="이 데이트에 들를 장소와 간단한 메모를 추가해요."
      onClose={onClose}
      submitLabel="코스 추가"
      onSubmit={(event) => {
        event.preventDefault();
        if (form.name.trim()) {
          onAdd({
            ...form,
            name: form.name.trim(),
            duration: formatDuration(),
          });
        }
      }}
    >
      <label>장소명<input autoFocus required value={form.name} onChange={update("name")} placeholder="예: 당산 카페 오후" /></label>
      <div className="form-grid">
        <label>방문 시간<input type="time" value={form.time} onChange={update("time")} /></label>
        <fieldset className="duration-spinner">
          <legend>소요 시간</legend>
          <label>
            <input type="number" min="0" max="23" value={form.durationHours} onChange={update("durationHours")} />
            <span>시</span>
          </label>
          <label>
            <input type="number" min="0" max="59" value={form.durationMinutes} onChange={update("durationMinutes")} />
            <span>분</span>
          </label>
          <label>
            <input type="number" min="0" max="59" value={form.durationSeconds} onChange={update("durationSeconds")} />
            <span>초</span>
          </label>
        </fieldset>
      </div>
      <label>카테고리<input value={form.category} onChange={update("category")} placeholder="예: 카페, 산책, 저녁" /></label>
      <label>주소<input value={form.address} onChange={update("address")} placeholder="주소를 몰라도 비워둘 수 있어요" /></label>
      <label>메모<textarea value={form.note} onChange={update("note")} placeholder="예약 정보나 기억할 점을 적어보세요" /></label>
    </Modal>
  );
}
