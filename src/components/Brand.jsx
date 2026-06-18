import { Heart } from "lucide-react";

export default function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark"><Heart size={18} fill="currentColor" /></div>
      <div>
        <strong>DATEUM</strong>
        <span>우리의 시간을 담다</span>
      </div>
    </div>
  );
}
