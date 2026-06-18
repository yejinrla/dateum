import { useState } from "react";
import { ChevronRight, MapPin, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function DatesPage({ dates, setModal, openCourse }) {
  const [filter, setFilter] = useState("all");
  const filtered = dates.filter((date) => filter === "all" || date.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="OUR DATE LOG"
        title={<>우리의 <em>데이트</em></>}
        description="가고 싶은 곳부터 오래 남길 장면까지 한곳에 담아요."
        action={<button className="icon-button" onClick={() => setModal("date")}><Plus size={20} /></button>}
      />
      <div className="filter-tabs">
        {[
          ["all", "전체"],
          ["upcoming", "다가오는 데이트"],
          ["done", "다녀온 데이트"],
        ].map(([id, label]) => (
          <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="date-list">
        {filtered.map((date) => (
          <article className="date-list-card" key={date.id}>
            <div className={`date-icon ${date.color}`}>{date.emoji}</div>
            <div className="date-list-copy">
              <div className="date-meta">
                <span className={date.status === "upcoming" ? "status upcoming" : "status done"}>
                  {date.status === "upcoming" ? "예정" : "다녀옴"}
                </span>
                <time>{date.date.replaceAll("-", ".")}</time>
                <span><MapPin size={13} /> {date.province || "서울특별시"} {date.district} {date.area}</span>
              </div>
              <h3>{date.title}</h3>
              <div className="place-chips">
                {date.places.map((place) => <span key={place}>{place}</span>)}
              </div>
              {date.note && <p>"{date.note}"</p>}
            </div>
            <button
              className="date-detail-button"
              onClick={() => openCourse(date, "dates")}
              aria-label={`${date.title} 상세 보기`}
            >
              자세히 <ChevronRight size={16} />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
