import { Bell } from "lucide-react";
import Brand from "./Brand";
import { navItems } from "../constants";

export default function MobileHeader({ activeTab }) {
  const title = navItems.find((item) => item.id === activeTab)?.label;
  return (
    <header className="mobile-header">
      <Brand />
      <div className="mobile-actions">
        <span className="mobile-title">{title}</span>
        <button aria-label="알림"><Bell size={20} /></button>
      </div>
    </header>
  );
}
