import { useState } from "react";
import Modal from "./Modal";
import { nationwideRegions } from "../data";

export default function DateModal({
  initialDate,
  initialDistrict,
  initialProvince = "서울특별시",
  onClose,
  onAdd,
  onSave,
}) {
  const isEditing = Boolean(initialDate);
  const startingProvince = initialDate?.province || initialProvince;
  const provinceRegions = nationwideRegions[startingProvince] || [];
  const hasKnownDistrict = provinceRegions.includes(initialDate?.district);
  const startingDistrict = initialDate
    ? (hasKnownDistrict ? initialDate.district : "직접 입력")
    : initialDistrict || provinceRegions[0] || "직접 입력";
  const [form, setForm] = useState({
    title: initialDate?.title || "",
    date: initialDate?.date || "2026-06-16",
    province: startingProvince,
    district: startingDistrict,
    customDistrict: initialDate && !hasKnownDistrict ? initialDate.district : "",
    area: initialDate?.area || "",
    places: (initialDate?.places || []).join(", "),
    note: initialDate?.note || "",
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
      title={isEditing ? "데이트 기록 수정" : "새로운 방문 기록"}
      subtitle={
        isEditing
          ? "데이트 정보와 코스를 원하는 내용으로 고쳐보세요."
          : "전국 어디든 선택해 둘만의 발자국을 남길 수 있어요."
      }
      onClose={onClose}
      submitLabel={isEditing ? "수정 내용 저장" : "발자국 남기기"}
      onSubmit={(event) => {
        event.preventDefault();
        if (!form.title.trim()) return;
        const district = form.district === "직접 입력" ? form.customDistrict.trim() : form.district;
        if (!district) return;
        const nextDate = {
          ...form,
          district,
          area: form.area || district,
          places: form.places.split(",").map((item) => item.trim()).filter(Boolean),
        };
        if (isEditing) {
          onSave(nextDate);
        } else {
          onAdd(nextDate);
        }
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
