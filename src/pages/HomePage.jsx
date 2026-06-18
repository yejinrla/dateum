import { CalendarDays, ChevronRight, ListTodo, Plus, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import TodoRow from "../components/TodoRow";
import MemoryCard from "../components/MemoryCard";
import { districts } from "../data";

export default function HomePage({ dates, todos, visits, setActiveTab, setModal, toggleTodo, openCourse }) {
  const nextDate = dates.find((item) => item.status === "upcoming");
  const openTodos = todos.filter((item) => !item.completed);
  const homeTodos = todos.slice(0, 3);
  const seoulDistrictNames = new Set(districts.map((district) => district.name));
  const visitedCount = Object.keys(visits).filter(
    (name) => seoulDistrictNames.has(name) && visits[name] > 0,
  ).length;
  const doneDates = dates.filter((item) => item.status === "done");

  return (
    <>
      <PageHeader
        eyebrow="TUESDAY, JUNE 16"
        title={<>좋은 아침이에요, <em>민지님</em></>}
        description="둘이 함께 채워갈 오늘을 확인해보세요."
        action={null}
      />

      <section className="hero-card">
        <div className="hero-copy">
          <span className="soft-label"><Sparkles size={14} /> NEXT DATE</span>
          <h2>{nextDate?.title || "다음 데이트를 계획해보세요"}</h2>
          <p className="hero-date">
            <CalendarDays size={17} />
            6월 20일 토요일 · 오후 1:00
          </p>
          <div className="route">
            {nextDate?.places.map((place, index) => (
              <div className="route-stop" key={place}>
                <span>{index + 1}</span>
                <p>{place}</p>
              </div>
            ))}
          </div>
          <button
            className="text-button"
            onClick={() => nextDate && openCourse(nextDate, "home")}
            disabled={!nextDate}
          >
            코스 자세히 보기 <ChevronRight size={17} />
          </button>
        </div>
        <div className="hero-visual">
          <div className="date-ticket">
            <span>JUN</span>
            <strong>20</strong>
            <small>SATURDAY</small>
          </div>
          <div className="floating-note">성수에서 만나요!</div>
          <div className="flower flower-one">✿</div>
          <div className="flower flower-two">✦</div>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="card todo-preview">
          <span className="soft-label todo-label"><ListTodo size={14} /> TO DO</span>
          <SectionTitle
            title="함께할 일"
            subtitle={`${openTodos.length}개의 할 일이 기다리고 있어요`}
            action={<button onClick={() => setActiveTab("todos")}>전체보기</button>}
          />
          <div className="todo-list">
            {homeTodos.map((todo) => (
              <TodoRow key={todo.id} todo={todo} onToggle={toggleTodo} compact />
            ))}
          </div>
          <button className="add-row-button" onClick={() => setModal("todo")}>
            <Plus size={17} /> 새로운 할 일 추가
          </button>
        </section>
      </div>

      <section className="memories-section">
        <SectionTitle
          title="최근 우리의 장면"
          subtitle="평범해서 더 오래 기억하고 싶은 날들"
          action={<button onClick={() => setActiveTab("dates")}>모두 보기</button>}
        />
        <div className="memory-grid">
          {doneDates.slice(0, 3).map((date) => (
            <MemoryCard key={date.id} date={date} openCourse={openCourse} />
          ))}
          <button className="new-memory-card" onClick={() => setModal("date")}>
            <span><Plus size={22} /></span>
            <strong>새로운 기록 남기기</strong>
            <small>오늘의 데이트를 담아보세요</small>
          </button>
        </div>
      </section>
    </>
  );
}
