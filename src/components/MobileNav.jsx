import { navItems } from "../constants";

export default function MobileNav({ activeTab, setActiveTab }) {
  return (
    <nav className="mobile-nav">
      <svg className="sketch-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="sketch-wobble" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.022" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={activeTab === item.id ? "active" : ""}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={21} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
