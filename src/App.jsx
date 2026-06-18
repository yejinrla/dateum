import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { initialDates, initialTodos, initialVisits } from "./data";
import { usePersistedState } from "./hooks/usePersistedState";
import { formatClock } from "./utils";
import MobileHeader from "./components/MobileHeader";
import MobileNav from "./components/MobileNav";
import TodoModal from "./components/TodoModal";
import DateModal from "./components/DateModal";
import PlaceModal from "./components/PlaceModal";
import HomePage from "./pages/HomePage";
import DatesPage from "./pages/DatesPage";
import TodosPage from "./pages/TodosPage";
import FootprintsPage from "./pages/FootprintsPage";
import CouplePage from "./pages/CouplePage";
import CourseDetailPage from "./pages/CourseDetailPage";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dates, setDates] = usePersistedState("dateum-dates", initialDates);
  const [todos, setTodos] = usePersistedState("dateum-todos", initialTodos);
  const [visits, setVisits] = usePersistedState("dateum-visits", initialVisits);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

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
      <main className="main">
        <MobileHeader activeTab={activeTab} clock={clock} />
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

export default App;
