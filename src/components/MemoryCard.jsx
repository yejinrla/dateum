export default function MemoryCard({ date, openCourse }) {
  return (
    <button className={`memory-card ${date.color}`} onClick={() => openCourse(date, "home")}>
      <div className="memory-art">
        <span className="memory-emoji">{date.emoji}</span>
        <span className="polaroid-label">{date.area}</span>
        <span className="tape" />
      </div>
      <div className="memory-copy">
        <h4>{date.title}</h4>
        <time>{date.date.replaceAll("-", ".")}</time>
        <p>{date.note}</p>
      </div>
    </button>
  );
}
