import { createElement, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Footprints,
  Heart,
  Home,
  ListTodo,
  Map,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  districts,
  initialDates,
  initialTodos,
  initialVisits,
  nationwideRegions,
} from "./data";

const navItems = [
  { id: "home", label: "홈", icon: Home },
  { id: "dates", label: "데이트", icon: CalendarDays },
  { id: "todos", label: "할 일", icon: ListTodo },
  { id: "footprints", label: "발자국", icon: Footprints },
  { id: "couple", label: "우리", icon: UsersRound },
];

function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dates, setDates] = usePersistedState("dateum-dates", initialDates);
  const [todos, setTodos] = usePersistedState("dateum-todos", initialTodos);
  const [visits, setVisits] = usePersistedState("dateum-visits", initialVisits);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const addTodo = (todo) => {
    setTodos((current) => [{ ...todo, id: Date.now(), completed: false }, ...current]);
    setModal(null);
    notify("함께할 일을 추가했어요.");
  };

  const addDate = (date) => {
    const next = { ...date, id: Date.now(), status: "done", emoji: "💗", color: "rose" };
    const visitKey =
      date.province === "서울특별시"
        ? date.district
        : `${date.province} ${date.district}`;
    setDates((current) => [next, ...current]);
    setVisits((current) => ({
      ...current,
      [visitKey]: (current[visitKey] || 0) + 1,
    }));
    setModal(null);
    notify(`${date.province} ${date.district}에 새로운 발자국이 생겼어요!`);
  };

  const addPlaceToCourse = (courseId, place) => {
    let updatedCourse;
    setDates((current) =>
      current.map((date) => {
        if (date.id !== courseId) return date;
        const places = [...(date.places || []), place.name];
        const customPlaceDetails = {
          ...(date.customPlaceDetails || {}),
          [place.name]: {
            time: place.time || "시간 미정",
            duration: place.duration || "약 1시간",
            address:
              place.address ||
              `${date.province || "서울특별시"} ${date.district} ${date.area}`,
            category: place.category || "데이트 장소",
            note: place.note || "둘만의 메모를 남겨보세요.",
          },
        };
        updatedCourse = { ...date, places, customPlaceDetails };
        return updatedCourse;
      }),
    );
    if (updatedCourse) {
      setSelectedCourse((current) =>
        current?.course?.id === courseId
          ? { ...current, course: updatedCourse }
          : current,
      );
      setModal(null);
      notify(`${place.name}을 코스에 추가했어요.`);
    }
  };

  const toggleTodo = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const navigateToTab = (tab) => {
    setSelectedCourse(null);
    setActiveTab(tab);
  };

  const openCourse = (course, returnTab) => {
    setSelectedCourse({ course, returnTab });
    setActiveTab("dates");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const commonProps = {
    dates,
    todos,
    visits,
    setActiveTab: navigateToTab,
    setModal,
    toggleTodo,
    notify,
    openCourse,
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="couple-pill">
          <div className="avatar-stack">
            <span className="avatar avatar-a">민</span>
            <span className="avatar avatar-b">준</span>
          </div>
          <div>
            <strong>민지 & 준호</strong>
            <span>함께한 지 824일</span>
          </div>
        </div>
        <nav className="side-nav">
          {navItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={activeTab === item.id}
              onClick={() => navigateToTab(item.id)}
            />
          ))}
        </nav>
        <div className="side-quote">
          <Heart size={18} fill="currentColor" />
          <p>우리의 다음 장면도<br />함께 담아볼까요?</p>
        </div>
      </aside>

      <main className="main">
        <MobileHeader activeTab={activeTab} />
        <div className="content">
          {selectedCourse ? (
            <CourseDetailPage
              course={selectedCourse.course}
              todos={todos}
              toggleTodo={toggleTodo}
              onOpenPlaceModal={() => setModal({ type: "place", courseId: selectedCourse.course.id })}
              onBack={() => navigateToTab(selectedCourse.returnTab)}
            />
          ) : (
            <>
              {activeTab === "home" && <HomePage {...commonProps} />}
              {activeTab === "dates" && <DatesPage {...commonProps} />}
              {activeTab === "todos" && <TodosPage {...commonProps} />}
              {activeTab === "footprints" && <FootprintsPage {...commonProps} />}
              {activeTab === "couple" && <CouplePage {...commonProps} />}
            </>
          )}
        </div>
        <MobileNav activeTab={activeTab} setActiveTab={navigateToTab} />
      </main>

      {modal === "todo" && <TodoModal onClose={() => setModal(null)} onAdd={addTodo} />}
      {(modal === "date" || modal?.type === "date") && (
        <DateModal
          initialDistrict={modal?.district}
          initialProvince={modal?.province}
          onClose={() => setModal(null)}
          onAdd={addDate}
        />
      )}
      {modal?.type === "place" && (
        <PlaceModal
          onClose={() => setModal(null)}
          onAdd={(place) => addPlaceToCourse(modal.courseId, place)}
        />
      )}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={19} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Brand() {
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

function NavButton({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}>
      <Icon size={20} strokeWidth={active ? 2.4 : 1.9} />
      <span>{item.label}</span>
      {item.id === "footprints" && <span className="new-badge">NEW</span>}
    </button>
  );
}

function MobileHeader({ activeTab }) {
  const title = navItems.find((item) => item.id === activeTab)?.label;
  return (
    <header className="mobile-header">
      <Brand />
      <div className="mobile-actions">
        <button aria-label="알림"><Bell size={20} /></button>
        <span className="mobile-title">{title}</span>
      </div>
    </header>
  );
}

function MobileNav({ activeTab, setActiveTab }) {
  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={activeTab === item.id ? "active" : ""}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={21} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function HomePage({ dates, todos, visits, setActiveTab, setModal, toggleTodo, openCourse }) {
  const nextDate = dates.find((item) => item.status === "upcoming");
  const openTodos = todos.filter((item) => !item.completed).slice(0, 3);
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
        action={
          <button className="icon-button desktop-only" aria-label="알림">
            <Bell size={21} />
            <span className="notification-dot" />
          </button>
        }
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
          <SectionTitle
            title="함께할 일"
            subtitle={`${openTodos.length}개의 할 일이 기다리고 있어요`}
            action={<button onClick={() => setActiveTab("todos")}>전체보기</button>}
          />
          <div className="todo-list">
            {openTodos.map((todo) => (
              <TodoRow key={todo.id} todo={todo} onToggle={toggleTodo} compact />
            ))}
          </div>
          <button className="add-row-button" onClick={() => setModal("todo")}>
            <Plus size={17} /> 새로운 할 일 추가
          </button>
        </section>

        <button className="card footprint-preview" onClick={() => setActiveTab("footprints")}>
          <div className="footprint-copy">
            <span className="soft-label peach"><MapPin size={14} /> OUR FOOTPRINTS</span>
            <h3>서울 {25}개 구 중<br /><strong>{visitedCount}개 구</strong>를 함께 다녀왔어요</h3>
            <p>다음엔 아직 가보지 않은 동네로 떠나볼까요?</p>
            <span className="inline-link">발자국 지도 보기 <ChevronRight size={16} /></span>
          </div>
          <MiniDistrictCloud visits={visits} />
        </button>
      </div>

      <section className="memories-section">
        <SectionTitle
          title="최근 우리의 장면"
          subtitle="평범해서 더 오래 기억하고 싶은 날들"
          action={<button onClick={() => setActiveTab("dates")}>모두 보기</button>}
        />
        <div className="memory-grid">
          {doneDates.slice(0, 3).map((date) => (
            <MemoryCard key={date.id} date={date} />
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

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="section-title">
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function TodoRow({ todo, onToggle, compact = false }) {
  return (
    <div className={`todo-row ${todo.completed ? "completed" : ""}`}>
      <button
        className="check-button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "완료 취소" : "완료"}
      >
        {todo.completed ? <Check size={15} /> : null}
      </button>
      <div className="todo-content">
        <strong>{todo.title}</strong>
        <span>
          <span className={`assignee ${todo.assignee === "민지" ? "pink" : ""}`}>
            {todo.assignee}
          </span>
          {!compact && <><span className="dot-separator">·</span>{todo.category}</>}
        </span>
      </div>
      <time><Clock3 size={14} /> {formatDate(todo.due)}</time>
    </div>
  );
}

function MemoryCard({ date }) {
  return (
    <article className={`memory-card ${date.color}`}>
      <div className="memory-art">
        <span className="memory-emoji">{date.emoji}</span>
        <span className="polaroid-label">{date.area}</span>
        <span className="tape" />
      </div>
      <div className="memory-copy">
        <time>{date.date.replaceAll("-", ".")}</time>
        <h4>{date.title}</h4>
        <p>{date.note}</p>
      </div>
    </article>
  );
}

function DatesPage({ dates, setModal, openCourse }) {
  const [filter, setFilter] = useState("all");
  const filtered = dates.filter((date) => filter === "all" || date.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="OUR DATE LOG"
        title={<>우리의 <em>데이트</em></>}
        description="가고 싶은 곳부터 오래 남길 장면까지 한곳에 담아요."
        action={<button className="primary-button" onClick={() => setModal("date")}><Plus size={18} /> 기록 추가</button>}
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
              {date.note && <p>“{date.note}”</p>}
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

const placeDetails = {
  "오우드 성수": {
    time: "13:00",
    duration: "1시간 20분",
    address: "서울 성동구 연무장길 101-1",
    category: "브런치 · 카페",
    note: "창가 자리를 선호해요. 웨이팅이 길면 먼저 전시를 봐도 좋아요.",
  },
  "그라운드시소 성수": {
    time: "15:00",
    duration: "1시간 40분",
    address: "서울 성동구 아차산로17길 49",
    category: "전시 · 문화",
    note: "모바일 티켓을 미리 준비하고, 입장 10분 전에 도착해요.",
  },
  "서울숲": {
    time: "17:10",
    duration: "1시간 30분",
    address: "서울 성동구 뚝섬로 273",
    category: "산책 · 공원",
    note: "해 질 무렵 거울연못 방향으로 천천히 걸어요.",
  },
  "어글리베이커리": {
    time: "12:30",
    duration: "50분",
    address: "서울 마포구 월드컵로13길 73",
    category: "베이커리",
    note: "인기 메뉴가 일찍 품절될 수 있어요.",
  },
  "망원시장": {
    time: "13:40",
    duration: "1시간",
    address: "서울 마포구 포은로8길 14",
    category: "시장 · 먹거리",
    note: "먹고 싶은 메뉴를 하나씩 골라 나눠 먹어요.",
  },
  "한강공원": {
    time: "15:10",
    duration: "2시간",
    address: "서울 마포구 마포나루길 467",
    category: "산책 · 공원",
    note: "돗자리와 물을 챙겨 여유롭게 쉬어요.",
  },
};

function CourseDetailPage({ course, todos, toggleTodo, onOpenPlaceModal, onBack }) {
  const fallbackTimes = ["13:00", "15:00", "17:00", "19:00"];
  const areaKeyword = course.area?.replace(/[동구]$/, "") || "";
  const relatedTodos = todos.filter(
    (todo) =>
      todo.category?.includes(areaKeyword) ||
      course.title.includes(todo.category?.replace(" 데이트", "")),
  );

  return (
    <div className="course-detail-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> 이전으로
      </button>

      <section className="course-detail-hero">
        <div className="course-detail-heading">
          <span className="soft-label"><Sparkles size={14} /> DATE COURSE</span>
          <div className="course-detail-status">
            {course.status === "upcoming" ? "다가오는 데이트" : "다녀온 데이트"}
          </div>
          <h1>{course.title}</h1>
          <p>
            <CalendarDays size={16} />
            {course.date.replaceAll("-", ".")}
            <span>·</span>
            <MapPin size={16} />
            {course.province || "서울특별시"} {course.district} {course.area}
          </p>
        </div>
        <div className={`course-detail-art ${course.color}`}>
          <span>{course.emoji}</span>
          <small>{course.places.length} PLACES</small>
        </div>
      </section>

      <div className="course-detail-layout">
        <section className="course-schedule-card">
          <div className="detail-section-title">
            <div>
              <span>OUR ROUTE</span>
              <h2>오늘의 코스</h2>
            </div>
            <div className="detail-title-actions">
              <strong>총 {course.places.length}곳</strong>
              <button onClick={onOpenPlaceModal}><Plus size={14} /> 코스 추가</button>
            </div>
          </div>
          <div className="course-schedule">
            {course.places.length ? course.places.map((place, index) => {
              const detail = course.customPlaceDetails?.[place] || placeDetails[place] || {
                time: fallbackTimes[index] || "시간 미정",
                duration: "약 1시간",
                address: `${course.province || "서울특별시"} ${course.district} ${course.area}`,
                category: "데이트 장소",
                note: "둘만의 메모를 남겨보세요.",
              };
              return (
                <article className="schedule-item" key={place}>
                  <div className="schedule-time">{detail.time}</div>
                  <div className="schedule-marker"><span>{index + 1}</span></div>
                  <div className="schedule-place">
                    <div className="schedule-place-top">
                      <div>
                        <span>{detail.category}</span>
                        <h3>{place}</h3>
                      </div>
                      <small><Clock3 size={13} /> {detail.duration}</small>
                    </div>
                    <p className="place-address"><MapPin size={14} /> {detail.address}</p>
                    <p className="place-note">{detail.note}</p>
                  </div>
                </article>
              );
            }) : (
              <div className="course-empty-route">
                <MapPin size={28} />
                <strong>아직 추가된 코스가 없어요</strong>
                <p>장소를 하나 추가하면 이곳에 시간순 코스가 만들어져요.</p>
                <button onClick={onOpenPlaceModal}><Plus size={16} /> 첫 코스 추가</button>
              </div>
            )}
          </div>
        </section>

        <aside className="course-side-panel">
          <section className="course-info-card">
            <span className="detail-card-label">DATE INFO</span>
            <h3>데이트 정보</h3>
            <dl>
              <div><dt>만나는 시간</dt><dd>오후 1:00</dd></div>
              <div><dt>예상 종료</dt><dd>오후 6:40</dd></div>
              <div><dt>예상 비용</dt><dd>2인 약 78,000원</dd></div>
              <div><dt>이동 방법</dt><dd>도보 + 지하철</dd></div>
            </dl>
          </section>

          <section className="course-todo-card">
            <div className="detail-card-heading">
              <div>
                <span className="detail-card-label">CHECKLIST</span>
                <h3>함께 준비할 일</h3>
              </div>
              <span>{relatedTodos.filter((todo) => todo.completed).length}/{relatedTodos.length}</span>
            </div>
            {relatedTodos.length ? (
              <div className="course-todos">
                {relatedTodos.map((todo) => (
                  <TodoRow key={todo.id} todo={todo} onToggle={toggleTodo} compact />
                ))}
              </div>
            ) : (
              <p className="course-empty-copy">이 코스에 연결된 할 일이 아직 없어요.</p>
            )}
          </section>

          <section className="course-note-card">
            <Heart size={19} fill="currentColor" />
            <div>
              <strong>우리의 메모</strong>
              <p>{course.note || "토요일은 여유롭게, 서두르지 않고 천천히 걷기."}</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function TodosPage({ todos, setModal, toggleTodo }) {
  const [view, setView] = useState("open");
  const filtered = todos.filter((todo) => view === "all" || (view === "done" ? todo.completed : !todo.completed));
  const completed = todos.filter((todo) => todo.completed).length;

  return (
    <>
      <PageHeader
        eyebrow="TOGETHER, ONE BY ONE"
        title={<>함께할 <em>일</em></>}
        description="작은 약속도 잊지 않게, 부담 없이 나누어 챙겨요."
        action={<button className="primary-button" onClick={() => setModal("todo")}><Plus size={18} /> 할 일 추가</button>}
      />
      <section className="todo-summary">
        <div className="summary-copy">
          <span>이번 주 함께 해낸 일</span>
          <strong>{completed}<small>개</small></strong>
          <p>조금씩 준비되고 있어요. 잘하고 있어요!</p>
        </div>
        <div className="progress-ring" style={{ "--progress": `${Math.max(18, completed / todos.length * 100)}%` }}>
          <span>{Math.round(completed / todos.length * 100)}%</span>
        </div>
      </section>
      <div className="filter-tabs">
        {[["open", "해야 할 일"], ["done", "완료"], ["all", "전체"]].map(([id, label]) => (
          <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>{label}</button>
        ))}
      </div>
      <section className="card full-todo-card">
        <div className="todo-list">
          {filtered.length > 0 ? filtered.map((todo) => (
            <TodoRow key={todo.id} todo={todo} onToggle={toggleTodo} />
          )) : (
            <div className="empty-state">
              <CheckCircle2 size={30} />
              <strong>모두 완료했어요!</strong>
              <p>둘이 함께해서 더 가벼운 하루네요.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FootprintsPage({ dates, visits, setModal }) {
  const [selected, setSelected] = useState("성동구");
  const [period, setPeriod] = useState("전체");
  const visitCount = visits[selected] || 0;
  const districtDates = dates.filter(
    (date) =>
      (date.province || "서울특별시") === "서울특별시" &&
      date.district === selected,
  );
  const seoulDistrictNames = new Set(districts.map((district) => district.name));
  const visitedCount = Object.keys(visits).filter(
    (name) => seoulDistrictNames.has(name) && visits[name] > 0,
  ).length;
  const topDistricts = Object.entries(visits)
    .filter(([name]) => seoulDistrictNames.has(name))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const visitedProvinces = [...new Set(
    dates
      .filter((date) => date.status === "done")
      .map((date) => date.province || "서울특별시"),
  )];

  return (
    <>
      <PageHeader
        eyebrow="OUR FOOTPRINTS"
        title={<>함께 채운 <em>발자국</em></>}
        description="우리가 함께 다녀온 동네가 하나씩 색으로 물들어요."
        action={<button className="primary-button" onClick={() => setModal("date")}><Plus size={18} /> 방문 기록</button>}
      />

      <div className="footprint-layout">
        <section className="map-card">
          <div className="map-toolbar">
            <div className="segmented-control">
              {["전체", "2026"].map((label) => (
                <button className={period === label ? "active" : ""} onClick={() => setPeriod(label)} key={label}>
                  {label}
                </button>
              ))}
            </div>
            <div className="map-legend">
              <span><i className="level-0" /> 아직</span>
              <span><i className="level-1" /> 1회</span>
              <span><i className="level-2" /> 2-4회</span>
              <span><i className="level-3" /> 5회+</span>
            </div>
          </div>
          <SeoulMap visits={visits} selected={selected} onSelect={setSelected} />
          <p className="map-hint"><MapPin size={15} /> 구를 눌러 우리의 기록을 확인해보세요</p>
        </section>

        <aside className="district-panel">
          <div className="conquest-card">
            <span>서울 정복률</span>
            <strong>{visitedCount}<small> / 25개 구</small></strong>
            <div className="bar"><i style={{ width: `${visitedCount / 25 * 100}%` }} /></div>
            <p>{25 - visitedCount}개 구가 우리를 기다리고 있어요.</p>
          </div>
          <div className="selected-district">
            <span className="selected-label">SELECTED AREA</span>
            <div className="district-title">
              <div><MapPin size={19} /></div>
              <span>
                <strong>{selected}</strong>
                <small>{visitCount > 0 ? `${visitCount}번 함께 다녀왔어요` : "아직 함께 가보지 않았어요"}</small>
              </span>
            </div>
            {districtDates.length > 0 ? (
              <div className="district-history">
                {districtDates.map((date) => (
                  <div key={date.id}>
                    <span>{date.emoji}</span>
                    <p><strong>{date.title}</strong><small>{date.date.replaceAll("-", ".")} · {date.area}</small></p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="district-empty">
                <Sparkles size={24} />
                <p>첫 발자국의 주인공이 되어보세요.</p>
                <button onClick={() => setModal({ type: "date", province: "서울특별시", district: selected })}>이 지역에 기록 남기기</button>
              </div>
            )}
          </div>
          <div className="top-districts">
            <h4>우리가 사랑한 동네</h4>
            {topDistricts.map(([name, count], index) => (
              <button key={name} onClick={() => setSelected(name)}>
                <span>{index + 1}</span>
                <strong>{name}</strong>
                <small>{count}회</small>
              </button>
            ))}
          </div>
        </aside>
      </div>
      <section className="national-footprints">
        <div className="national-footprints-heading">
          <div>
            <span>ALL OVER KOREA</span>
            <h2>전국 발자국</h2>
            <p>데이트 기록을 남기면 방문한 시·도가 함께 채워져요.</p>
          </div>
          <strong>{visitedProvinces.length}<small> / 17개 시·도</small></strong>
        </div>
        <div className="province-grid">
          {Object.keys(nationwideRegions).map((province) => (
            <button
              key={province}
              className={visitedProvinces.includes(province) ? "visited" : ""}
              onClick={() => setModal({ type: "date", province })}
            >
              <MapPin size={14} />
              <span>{province.replace("특별자치도", "").replace("특별자치시", "").replace("광역시", "").replace("특별시", "")}</span>
              {visitedProvinces.includes(province) && <Check size={13} />}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function SeoulMap({ visits, selected, onSelect }) {
  return (
    <div className="seoul-map-wrap">
      <svg className="seoul-map" viewBox="0 0 630 565" role="img" aria-label="서울 25개 구 발자국 지도">
        <path className="river" d="M4 270 C95 230 155 257 227 282 C305 310 369 277 432 250 C504 220 565 220 628 243 L628 276 C556 252 512 260 443 286 C374 312 304 340 220 313 C143 289 75 268 4 304 Z" />
        {districts.map((district) => {
          const count = visits[district.name] || 0;
          const level = count >= 5 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0;
          const isSelected = selected === district.name;
          const notch = district.id.length % 3 * 5;
          const points = [
            `${district.x + 10},${district.y}`,
            `${district.x + district.w - 8},${district.y + notch}`,
            `${district.x + district.w},${district.y + district.h * 0.55}`,
            `${district.x + district.w - 12},${district.y + district.h}`,
            `${district.x + 8},${district.y + district.h - 3}`,
            `${district.x},${district.y + district.h * 0.38}`,
          ].join(" ");
          return (
            <g
              key={district.id}
              className={`district level-${level} ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(district.name)}
              role="button"
              tabIndex="0"
              onKeyDown={(event) => event.key === "Enter" && onSelect(district.name)}
              aria-label={`${district.name}, ${count}회 방문`}
            >
              <polygon points={points} />
              <text x={district.x + district.w / 2} y={district.y + district.h / 2 - 2}>{district.name}</text>
              {count > 0 && <text className="visit-label" x={district.x + district.w / 2} y={district.y + district.h / 2 + 14}>{count}회</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MiniDistrictCloud({ visits }) {
  const shown = ["마포구", "종로구", "성동구", "용산구", "강남구", "송파구", "서초구"];
  return (
    <div className="mini-map">
      {shown.map((name, index) => (
        <span
          key={name}
          className={`mini-cell level-${visits[name] >= 5 ? 3 : visits[name] >= 2 ? 2 : 1}`}
          style={{ "--i": index }}
        >
          {name.replace("구", "")}
        </span>
      ))}
    </div>
  );
}

function CouplePage() {
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

function Modal({ title, subtitle, onClose, children, onSubmit, submitLabel }) {
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

function TodoModal({ onClose, onAdd }) {
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

function DateModal({
  initialDistrict,
  initialProvince = "서울특별시",
  onClose,
  onAdd,
}) {
  const startingDistrict =
    initialDistrict || nationwideRegions[initialProvince]?.[0] || "직접 입력";
  const [form, setForm] = useState({
    title: "",
    date: "2026-06-16",
    province: initialProvince,
    district: startingDistrict,
    customDistrict: "",
    area: "",
    places: "",
    note: "",
  });
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const regionOptions = nationwideRegions[form.province] || [];
  const changeProvince = (event) => {
    const province = event.target.value;
    setForm({
      ...form,
      province,
      district: nationwideRegions[province]?.[0] || "직접 입력",
      customDistrict: "",
    });
  };
  return (
    <Modal
      title="새로운 방문 기록"
      subtitle="전국 어디든 선택해 둘만의 발자국을 남길 수 있어요."
      onClose={onClose}
      submitLabel="발자국 남기기"
      onSubmit={(event) => {
        event.preventDefault();
        if (!form.title.trim()) return;
        const district =
          form.district === "직접 입력"
            ? form.customDistrict.trim()
            : form.district;
        if (!district) return;
        onAdd({
          ...form,
          district,
          area: form.area || district,
          places: form.places.split(",").map((item) => item.trim()).filter(Boolean),
        });
      }}
    >
      <label>데이트 제목<input autoFocus required value={form.title} onChange={update("title")} placeholder="예: 해방촌 노을 산책" /></label>
      <label>날짜<input type="date" value={form.date} onChange={update("date")} /></label>
      <label>방문한 시·도
        <select value={form.province} onChange={changeProvince}>
          {Object.keys(nationwideRegions).map((province) => (
            <option key={province}>{province}</option>
          ))}
        </select>
      </label>
      <label>시·군·구
        <select value={form.district} onChange={update("district")}>
          {regionOptions.map((region) => <option key={region}>{region}</option>)}
          <option>직접 입력</option>
        </select>
      </label>
      {form.district === "직접 입력" && (
        <label>시·군·구 직접 입력
          <input required value={form.customDistrict} onChange={update("customDistrict")} placeholder="예: 해운대구, 춘천시" />
        </label>
      )}
      <label>동네<input value={form.area} onChange={update("area")} placeholder="예: 성수동" /></label>
      <label>장소<input value={form.places} onChange={update("places")} placeholder="쉼표로 구분해 입력해주세요" /></label>
      <label>한 줄 기록<textarea value={form.note} onChange={update("note")} placeholder="오늘 가장 기억에 남은 순간은?" /></label>
    </Modal>
  );
}

function PlaceModal({ onClose, onAdd }) {
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

function formatDate(value) {
  const [, month, day] = value.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export default App;
