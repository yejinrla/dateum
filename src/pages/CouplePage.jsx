import { createElement } from "react";
import { Bell, CalendarDays, ChevronRight, Heart, Map, Settings, UserRound } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function CouplePage() {
  return (
    <>
      <PageHeader
        eyebrow="JUST THE TWO OF US"
        title={<>우리의 <em>공간</em></>}
        description="둘만의 정보와 알림, 연결 상태를 관리해요."
      />
      <section className="couple-hero">
        <div className="large-avatar pink">민</div>
        <div className="heart-line"><Heart size={22} fill="currentColor" /></div>
        <div className="large-avatar purple">준</div>
        <h2>민지 & 준호</h2>
        <p>2024년 3월 15일부터 함께 · 824일</p>
      </section>
      <div className="settings-grid">
        {[
          [UserRound, "프로필", "이름과 프로필 사진 관리"],
          [Bell, "알림", "데이트와 할 일 알림 설정"],
          [CalendarDays, "기념일", "우리의 특별한 날 관리"],
          [Map, "데이터 내보내기", "기록을 안전하게 내려받기"],
          [Settings, "앱 설정", "테마와 개인정보 관리"],
          [Heart, "DATEUM Plus", "더 오래, 더 선명하게 보관하기"],
        ].map(([icon, title, description]) => (
          <button className="setting-card" key={title}>
            <span>{createElement(icon, { size: 20 })}</span>
            <div><strong>{title}</strong><small>{description}</small></div>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </>
  );
}
