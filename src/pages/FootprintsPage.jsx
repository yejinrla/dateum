import { useState } from "react";
import { Check, MapPin, Plus, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { districts, nationwideRegions } from "../data";

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

export default function FootprintsPage({ dates, visits, setModal }) {
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
