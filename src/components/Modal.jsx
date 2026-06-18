import { X } from "lucide-react";

export default function Modal({ title, subtitle, onClose, children, onSubmit, submitLabel }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal" onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><h2>{title}</h2><p>{subtitle}</p></div>
          <button type="button" onClick={onClose} aria-label="닫기"><X size={20} /></button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>취소</button>
          <button className="primary-button" type="submit">{submitLabel}</button>
        </div>
      </form>
    </div>
  );
}
