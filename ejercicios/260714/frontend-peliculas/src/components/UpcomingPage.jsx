import { useEffect, useState } from "react";
import { getUpcoming } from "../services/upcomingService.js";

/** Permite seleccionar una fecha en un calendario y consultar estrenos reales de TMDB. */
function UpcomingPage({ contentType, onSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  /** Carga los estrenos vinculados exactamente a la fecha elegida. */
  useEffect(() => { (async () => { setLoading(true); try { setItems(await getUpcoming(contentType, isoDate(selectedDate))); } catch { setItems([]); } finally { setLoading(false); } })(); }, [contentType, selectedDate]);
  /** Actualiza la fecha activa al pulsar un día del calendario. */
  const selectDay = (day) => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  /** Cambia el mes visible, conservando una navegación de calendario sencilla. */
  const changeMonth = (amount) => setCurrentMonth((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1));
  const days = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const blankDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  return <section className="upcoming-page"><h2>Próximamente · {contentType === "movie" ? "películas" : "series"}</h2><div className="upcoming-container"><aside className="calendar-widget"><div className="calendar-header"><button className="calendar-nav-btn" onClick={() => changeMonth(-1)} aria-label="Mes anterior">←</button><h3>{currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</h3><button className="calendar-nav-btn" onClick={() => changeMonth(1)} aria-label="Mes siguiente">→</button></div><div className="calendar-weekdays">{["D", "L", "M", "X", "J", "V", "S"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-days">{Array.from({ length: blankDays }, (_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: days }, (_, index) => { const day = index + 1; const active = isoDate(selectedDate) === isoDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)); return <button key={day} className={active ? "calendar-day calendar-day-selected" : "calendar-day"} onClick={() => selectDay(day)}>{day}</button>; })}</div></aside><div className="upcoming-content"><h3>Estrenos el {selectedDate.toLocaleDateString("es-ES", { dateStyle: "full" })}</h3>{loading ? <p>Cargando estrenos…</p> : items.length ? <div className="movie-list">{items.map((item) => <button key={item.id} className="movie-card card-button" onClick={() => onSelect(item)}><img src={item.imagen || "https://placehold.co/500x750?text=Sin+portada"} alt="" /><span className="movie-card-info"><strong>{item.titulo}</strong><small>{item.fecha_estreno}</small></span></button>)}</div> : <p className="empty-message">No hay estrenos publicados para esta fecha.</p>}</div></div></section>;
}
export default UpcomingPage;
