import { useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Heart, MapPin, Pencil, Plus, X } from "lucide-react";
import TodoRow from "../components/TodoRow";

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

const fallbackTimes = ["13:00", "15:00", "17:00", "19:00"];

function getDetail(course, place, index) {
  return (
    course.customPlaceDetails?.[place] ||
    placeDetails[place] || {
      time: fallbackTimes[index] || "시간 미정",
      duration: "약 1시간",
      address: `${course.province || "서울특별시"} ${course.district} ${course.area}`,
      category: "데이트 장소",
      note: "둘만의 메모를 남겨보세요.",
    }
  );
}

export default function CourseDetailPage({
  course,
  todos,
  toggleTodo,
  onOpenPlaceModal,
  onEdit,
  onUpdateCourse,
  onBack,
}) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState([]);

  const areaKeyword = course.area?.replace(/[동구]$/, "") || "";
  const relatedTodos = todos.filter(
    (todo) =>
      todo.category?.includes(areaKeyword) ||
      course.title.includes(todo.category?.replace(" 데이트", "")),
  );

  const handleEditToggle = () => {
    if (!editing) {
      setEditData(
        course.places.map((place, index) => ({
          name: place,
          ...getDetail(course, place, index),
        })),
      );
      setEditing(true);
    } else {
      onUpdateCourse(editData);
      setEditing(false);
    }
  };

  const updateItem = (index, field, value) => {
    setEditData((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeItem = (index) => {
    setEditData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPlace = () => {
    if (editing) {
      onUpdateCourse(editData);
      setEditing(false);
    }
    onOpenPlaceModal();
  };

  return (
    <div className="course-detail-page">
      <div className="course-detail-topbar">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} /> 이전으로
        </button>
        <button className="course-edit-button" onClick={onEdit}>
          <Pencil size={14} /> 수정
        </button>
      </div>

      <div className="course-detail-heading">
        <h1>{course.title}</h1>
        {course.note && <p className="course-detail-note">{course.note}</p>}
        <p className="course-detail-meta">
          <CalendarDays size={16} />
          {course.date.replaceAll("-", ".")}
          <span>·</span>
          <MapPin size={16} />
          {course.province || "서울특별시"} {course.district} {course.area}
        </p>
      </div>

      <div className="course-detail-layout">
        <section className="course-schedule-card">
          <div className="detail-section-title">
            <div>
              <span>OUR ROUTE</span>
              <h2>오늘의 코스</h2>
            </div>
            <div className="detail-title-actions">
              <strong>총 {editing ? editData.length : course.places.length}곳</strong>
              <button
                className={`icon-button${editing ? " icon-button--active" : ""}`}
                onClick={handleEditToggle}
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>

          <div className="course-schedule">
            {editing ? (
              <>
                {editData.map((item, index) => (
                  <article className="schedule-item" key={index}>
                    <div className="schedule-marker">
                      <span>{index + 1}</span>
                      <input
                        className="schedule-edit-input schedule-edit-time"
                        value={item.time}
                        onChange={(e) => updateItem(index, "time", e.target.value)}
                      />
                    </div>
                    <div className="schedule-place">
                      <div className="schedule-place-top">
                        <div className="schedule-edit-title-col">
                          <input
                            className="schedule-edit-input schedule-edit-category"
                            value={item.category}
                            onChange={(e) => updateItem(index, "category", e.target.value)}
                          />
                          <input
                            className="schedule-edit-input schedule-edit-name"
                            value={item.name}
                            onChange={(e) => updateItem(index, "name", e.target.value)}
                          />
                        </div>
                        <button className="schedule-remove-btn" onClick={() => removeItem(index)}>
                          <X size={13} />
                        </button>
                      </div>
                      <div className="schedule-edit-addr-row">
                        <MapPin size={13} />
                        <input
                          className="schedule-edit-input schedule-edit-address"
                          value={item.address}
                          onChange={(e) => updateItem(index, "address", e.target.value)}
                        />
                      </div>
                      <div className="schedule-edit-dur-row">
                        <Clock3 size={12} />
                        <input
                          className="schedule-edit-input schedule-edit-duration"
                          value={item.duration}
                          onChange={(e) => updateItem(index, "duration", e.target.value)}
                        />
                      </div>
                      <textarea
                        className="schedule-edit-input schedule-edit-note"
                        value={item.note}
                        onChange={(e) => updateItem(index, "note", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </article>
                ))}
                <button className="schedule-add-btn" onClick={handleAddPlace}>
                  <Plus size={15} /> 장소 추가
                </button>
              </>
            ) : course.places.length ? (
              course.places.map((place, index) => {
                const detail = getDetail(course, place, index);
                return (
                  <article className="schedule-item" key={place}>
                    <div className="schedule-marker">
                      <span>{index + 1}</span>
                      <time className="schedule-time">{detail.time}</time>
                    </div>
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
              })
            ) : (
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
