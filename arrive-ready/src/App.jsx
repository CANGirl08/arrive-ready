import { useState, useEffect } from "react";

const TIMEZONES = [
  { label: "Los Angeles (PST/PDT)", offset: -8, dst: true },
  { label: "Denver (MST/MDT)", offset: -7, dst: true },
  { label: "Chicago (CST/CDT)", offset: -6, dst: true },
  { label: "New York (EST/EDT)", offset: -5, dst: true },
  { label: "São Paulo (BRT)", offset: -3, dst: false },
  { label: "London (GMT/BST)", offset: 0, dst: true },
  { label: "Paris / Berlin (CET/CEST)", offset: 1, dst: true },
  { label: "Cairo (EET)", offset: 2, dst: false },
  { label: "Moscow (MSK)", offset: 3, dst: false },
  { label: "Dubai (GST)", offset: 4, dst: false },
  { label: "Mumbai (IST)", offset: 5.5, dst: false },
  { label: "Bangkok (ICT)", offset: 7, dst: false },
  { label: "Singapore / KL (SGT)", offset: 8, dst: false },
  { label: "Tokyo (JST)", offset: 9, dst: false },
  { label: "Sydney (AEST/AEDT)", offset: 10, dst: true },
  { label: "Auckland (NZST/NZDT)", offset: 12, dst: true },
];

const CHRONOTYPES = [
  { label: "Early bird 🌅", bedtime: "21:30", wake: "05:30" },
  { label: "Morning person ☀️", bedtime: "22:30", wake: "06:30" },
  { label: "Neutral 🌤", bedtime: "23:00", wake: "07:00" },
  { label: "Night owl 🌙", bedtime: "00:00", wake: "08:00" },
  { label: "Late night 🦉", bedtime: "01:30", wake: "09:30" },
];

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m) {
  const total = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(total / 60);
  const min = total % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function formatTime12(t) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function generatePlan({ homeTZ, destTZ, departDate, chronotype }) {
  const diff = destTZ.offset - homeTZ.offset;
  const absDiff = Math.abs(diff);
  const goingEast = diff > 0;

  if (absDiff === 0) return null;

  const bedMins = timeToMinutes(chronotype.bedtime);
  const wakeMins = timeToMinutes(chronotype.wake);
  const adjustPerDay = goingEast ? 60 : 120; // east = harder, shift 1hr/day; west = 2hr/day
  const recoveryDays = Math.ceil(absDiff / (adjustPerDay / 60));

  const days = [];

  // Pre-trip: 2 days before
  for (let i = -2; i <= recoveryDays; i++) {
    const label =
      i < 0
        ? `${Math.abs(i)} day${i < -1 ? "s" : ""} before departure`
        : i === 0
        ? "Departure day"
        : `Day ${i} at destination`;

    const shiftMins = goingEast
      ? Math.min(i + 2, absDiff) * adjustPerDay
      : -Math.min(i + 2, absDiff) * adjustPerDay;

    const newBed = minutesToTime(bedMins + (i >= 0 ? diff * 60 : shiftMins * 0.5));
    const newWake = minutesToTime(wakeMins + (i >= 0 ? diff * 60 : shiftMins * 0.5));

    const lightStart = minutesToTime(timeToMinutes(newWake));
    const lightEnd = minutesToTime(timeToMinutes(newWake) + 180);
    const avoidLightStart = minutesToTime(timeToMinutes(newBed) - 120);
    const caffeineStop = minutesToTime(timeToMinutes(newBed) - 360);
    const mealShift = i >= 0 ? diff * 60 : shiftMins * 0.3;
    const breakfast = minutesToTime(timeToMinutes(newWake) + 30);
    const lunch = minutesToTime(timeToMinutes(newWake) + 360);
    const dinner = minutesToTime(timeToMinutes(newBed) - 180);

    let tips = [];
    let hydration = {};
    let foodGuidance = {};

    if (i < 0) {
      tips.push(
        goingEast
          ? `Go to bed ${adjustPerDay / 60}h earlier than usual to pre-adjust eastward`
          : `Go to bed ${adjustPerDay / 60}h later than usual to pre-adjust westward`
      );
      tips.push("Limit alcohol and heavy meals the day before your flight");
      hydration = {
        water: "20–32 oz (2.5–4 cups) every 4–5 hours throughout the day",
        electrolytes: "Start electrolyte intake 24h before departure to build up mineral stores",
        avoid: ["Alcohol — disrupts sleep and dehydrates", "Excess caffeine after mid-afternoon"],
        note: "Begin pre-loading hydration now. Plain water alone may not be enough — pair with electrolytes (sodium, potassium, magnesium) for better absorption.",
      };
      foodGuidance = {
        eat: ["High-protein breakfasts & lunches (eggs, chicken, fish) to stay alert", "Complex carbs at dinner (pasta, potato, rice) to ease your body toward sleep", "High-water-content foods: watermelon, cucumber, berries", "Tart cherry juice before bed — a natural source of melatonin"],
        avoid: ["Heavy, fatty meals close to bedtime", "Refined carbs and sugar during the day", "Large portions — keep meals moderate"],
        note: "Protein at breakfast/lunch activates your 'active phase' chemistry. Carbs at dinner trigger your wind-down pathway.",
      };
    }

    if (i === 0) {
      tips.push("Set all devices and watches to destination time zone as you board");
      tips.push("Skip alcohol and minimize caffeine on the plane");
      if (goingEast) tips.push("Try to sleep during destination nighttime hours on the plane");
      else tips.push("Stay awake if it's daytime at your destination when you land");
      hydration = {
        water: "8 oz (1 cup) every hour you're awake in-flight — cabin air is drier than the Sahara",
        electrolytes: "Add electrolyte drops or powder to your water bottle; bring your own as airlines offer limited options",
        avoid: ["Alcohol — acts as a diuretic and worsens jet lag", "Coffee and tea (diuretics) unless aligned with destination wake time", "Sugary sodas and juice"],
        note: "You can lose up to 1–2 liters of fluid on a long flight just through breathing and skin evaporation. Don't wait until you're thirsty to drink.",
      };
      foodGuidance = {
        eat: ["Light, high-protein snacks in-flight (nuts, cheese, eggs)", "Hydrating foods: watermelon, cucumber, melon if available", "Small meals rather than large ones — heavy meals worsen sleep quality", "Eat on destination time where possible (align with breakfast/lunch/dinner at your destination)"],
        avoid: ["Airline alcohol — it compounds dehydration at altitude", "Heavy, creamy, or fried in-flight meals", "Large amounts of refined carbs mid-flight if you need to stay alert"],
        note: "If flying overnight: eat lightly before your destination 'bedtime', then have a proper high-protein breakfast when destination morning arrives — even if that's mid-flight.",
      };
    }

    if (i > 0 && i <= 2) {
      tips.push("Spend time outdoors in the morning to anchor your new wake time");
      tips.push("Avoid long naps — cap any nap at 20 minutes before 3 PM local time");
      tips.push("Melatonin (0.5–3 mg) 30 min before target bedtime may help");
      hydration = {
        water: "8 oz (1 cup) per hour while awake; more if active or in a hot climate",
        electrolytes: "Continue electrolytes for first 2–3 days post-arrival to support circadian adjustment",
        avoid: ["Alcohol, especially in the evening", "Caffeine after your cutoff time shown above"],
        note: "Dehydration slows your circadian adjustment and worsens fatigue. Keep a water bottle visible as a constant reminder.",
      };
      foodGuidance = {
        eat: ["Substantial high-protein breakfast at local time — this is the single strongest food signal to reset your body clock", "Fermented foods (yogurt, kefir, kimchi) to support gut health disrupted by travel", "Tart cherry juice or whole cherries 1–2 hours before local bedtime", "Bananas, oats, and quinoa for steady energy during the day"],
        avoid: ["Heavy meals within 2–3 hours of bedtime", "Skipping meals — even if appetite is off, eat lightly on local schedule", "High sugar foods that spike and crash energy"],
        note: "A strong breakfast at local time is your #1 food tool for resetting your clock. Research from Northwestern University found it significantly reduces recovery time.",
      };
    }

    if (i > 2) {
      tips.push("Your body should be close to adjusted — maintain consistent sleep/wake times");
      tips.push("Continue morning light exposure to reinforce your new circadian rhythm");
      hydration = {
        water: "Return to normal daily intake (~8 cups / 64 oz), adjusted for activity and climate",
        electrolytes: "Normal diet should suffice; supplement if doing heavy activity",
        avoid: ["Late-night caffeine", "Excess alcohol"],
        note: "By now your body is largely adjusted. Keep meal and sleep times consistent to lock in your new rhythm.",
      };
      foodGuidance = {
        eat: ["Balanced meals on local schedule", "Continue morning protein-rich breakfasts", "Complex carbs at dinner to reinforce sleep onset"],
        avoid: ["Erratic meal timing — consistency matters now", "Heavy late-night meals"],
        note: "Consistency is key at this stage. Your circadian system is looking for reliable cues — regular mealtimes are one of the strongest.",
      };
    }

    days.push({
      label,
      sleep: newBed,
      wake: newWake,
      lightExposure: { start: lightStart, end: lightEnd },
      avoidLight: avoidLightStart,
      caffeineCutoff: caffeineStop,
      meals: { breakfast, lunch, dinner },
      tips,
      hydration,
      foodGuidance,
      phase: i < 0 ? "pre" : i === 0 ? "travel" : "dest",
    });
  }

  return {
    days,
    diff,
    absDiff,
    goingEast,
    recoveryDays,
    direction: goingEast ? "eastward ✈️→" : "westward ←✈️",
  };
}

export default function JetLagPlanner() {
  const [step, setStep] = useState(0);
  const [homeTZ, setHomeTZ] = useState(TIMEZONES[3]);
  const [destTZ, setDestTZ] = useState(TIMEZONES[6]);
  const [chronotype, setChronotype] = useState(CHRONOTYPES[2]);
  const [departDate, setDepartDate] = useState("");
  const [plan, setPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState("schedule");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0];
    setDepartDate(formatted);
  }, []);

  function handleGenerate() {
    const result = generatePlan({ homeTZ, destTZ, departDate, chronotype });
    setPlan(result);
    setStep(1);
    setActiveDay(0);
    setActiveTab("schedule");
  }

  function toggleExpand(i) {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  const phaseColors = {
    pre: "#a78bfa",
    travel: "#f59e0b",
    dest: "#34d399",
  };

  const phaseLabels = {
    pre: "PRE-TRIP",
    travel: "TRAVEL",
    dest: "AT DESTINATION",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a14",
        color: "#e8e4f0",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        padding: "0",
        margin: "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #1e1e3a",
          padding: "28px 32px 20px",
          display: "flex",
          alignItems: "flex-end",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#6b6b9a",
              fontFamily: "'Courier New', monospace",
              marginBottom: "4px",
            }}
          >
            A CAPTURE ADVENTURE NOW TOOL
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: "400",
              letterSpacing: "1px",
              color: "#c4bde8",
            }}
          >
            ArriveReady
          </h1>
          <div style={{ fontSize: "12px", color: "#6b6b9a", fontStyle: "italic", marginTop: "3px", letterSpacing: "0.5px" }}>
            Land energized. Capture every moment.
          </div>
        </div>
        {step === 1 && (
          <button
            onClick={() => { setStep(0); setPlan(null); }}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "1px solid #2e2e50",
              color: "#6b6b9a",
              padding: "6px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              letterSpacing: "1px",
              fontFamily: "'Courier New', monospace",
            }}
          >
            ← NEW PLAN
          </button>
        )}
      </div>

      {step === 0 && (
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" }}>
          <p style={{ color: "#7070a0", fontSize: "14px", lineHeight: "1.7", marginBottom: "36px" }}>
            Based on circadian science used by NASA and elite athletes, this planner generates a
            personalized sleep, light, caffeine, and meal schedule to minimize your jet lag.
          </p>

          {/* Form */}
          {[
            {
              label: "Your Home Time Zone",
              content: (
                <select
                  value={homeTZ.label}
                  onChange={(e) => setHomeTZ(TIMEZONES.find((t) => t.label === e.target.value))}
                  style={selectStyle}
                >
                  {TIMEZONES.map((t) => (
                    <option key={t.label}>{t.label}</option>
                  ))}
                </select>
              ),
            },
            {
              label: "Destination Time Zone",
              content: (
                <select
                  value={destTZ.label}
                  onChange={(e) => setDestTZ(TIMEZONES.find((t) => t.label === e.target.value))}
                  style={selectStyle}
                >
                  {TIMEZONES.map((t) => (
                    <option key={t.label}>{t.label}</option>
                  ))}
                </select>
              ),
            },
            {
              label: "Departure Date",
              content: (
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  style={{ ...selectStyle, colorScheme: "dark" }}
                />
              ),
            },
            {
              label: "Your Sleep Chronotype",
              content: (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CHRONOTYPES.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setChronotype(c)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: "1px solid",
                        borderColor: chronotype.label === c.label ? "#a78bfa" : "#2e2e50",
                        background: chronotype.label === c.label ? "#1e1030" : "transparent",
                        color: chronotype.label === c.label ? "#c4bde8" : "#5a5a80",
                        cursor: "pointer",
                        fontSize: "13px",
                        transition: "all 0.15s",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              ),
            },
          ].map(({ label, content }) => (
            <div key={label} style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  letterSpacing: "3px",
                  color: "#6b6b9a",
                  fontFamily: "'Courier New', monospace",
                  marginBottom: "10px",
                }}
              >
                {label.toUpperCase()}
              </label>
              {content}
            </div>
          ))}

          <button
            onClick={handleGenerate}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #3b1f6e, #1e1030)",
              border: "1px solid #6b4fa0",
              borderRadius: "8px",
              color: "#c4bde8",
              fontSize: "14px",
              letterSpacing: "3px",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              marginTop: "8px",
            }}
          >
            GENERATE MY PLAN →
          </button>

          <p style={{ fontSize: "11px", color: "#4a4a6a", marginTop: "20px", lineHeight: "1.6" }}>
            Science-backed: light exposure timing is the primary tool for resetting your circadian
            clock — not food or exercise alone. This plan prioritizes light, sleep, melatonin, and
            caffeine timing.
          </p>
        </div>
      )}

      {step === 1 && plan && (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "28px 20px" }}>
          {/* Summary bar */}
          <div
            style={{
              background: "#0e0e22",
              border: "1px solid #1e1e3a",
              borderRadius: "8px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Time Zone Shift", val: `${plan.absDiff > 0 ? "+" : ""}${plan.diff}h` },
              { label: "Direction", val: plan.direction },
              { label: "Est. Recovery", val: `~${plan.recoveryDays} days` },
              {
                label: "Your Chronotype",
                val: chronotype.label,
              },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#5a5a80", fontFamily: "'Courier New', monospace" }}>
                  {label.toUpperCase()}
                </div>
                <div style={{ fontSize: "16px", color: "#c4bde8", marginTop: "3px" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Day tabs */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "4px",
              marginBottom: "16px",
            }}
          >
            {plan.days.map((day, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                style={{
                  flexShrink: 0,
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: activeDay === i ? phaseColors[day.phase] : "#1e1e3a",
                  background: activeDay === i ? "#0e0e22" : "transparent",
                  color: activeDay === i ? phaseColors[day.phase] : "#4a4a6a",
                  cursor: "pointer",
                  fontSize: "10px",
                  letterSpacing: "1px",
                  fontFamily: "'Courier New', monospace",
                  whiteSpace: "nowrap",
                }}
              >
                {day.phase === "pre"
                  ? `D-${plan.days.filter((d) => d.phase === "pre").length - i}`
                  : day.phase === "travel"
                  ? "DEP"
                  : `D+${i - plan.days.filter((d) => d.phase !== "dest").length + 1}`}
              </button>
            ))}
          </div>

          {/* Active day card */}
          {(() => {
            const day = plan.days[activeDay];
            return (
              <div
                style={{
                  background: "#0e0e22",
                  border: `1px solid ${phaseColors[day.phase]}33`,
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    background: `${phaseColors[day.phase]}14`,
                    borderBottom: `1px solid ${phaseColors[day.phase]}33`,
                    padding: "14px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "9px",
                        letterSpacing: "3px",
                        color: phaseColors[day.phase],
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {phaseLabels[day.phase]}
                    </span>
                    <div style={{ fontSize: "15px", color: "#e8e4f0", marginTop: "2px" }}>
                      {day.label}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  {/* Tab nav */}
                  <div style={{ display: "flex", gap: "6px", marginBottom: "20px", borderBottom: "1px solid #1e1e3a", paddingBottom: "12px", flexWrap: "wrap" }}>
                    {[
                      { id: "schedule", label: "⏱ Schedule" },
                      { id: "hydration", label: "💧 Hydration" },
                      { id: "food", label: "🍽 Food" },
                      { id: "tips", label: "💡 Tips" },
                      { id: "extras", label: "✨ Extras" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "4px",
                          border: "1px solid",
                          borderColor: activeTab === tab.id ? phaseColors[day.phase] : "#2e2e50",
                          background: activeTab === tab.id ? `${phaseColors[day.phase]}18` : "transparent",
                          color: activeTab === tab.id ? phaseColors[day.phase] : "#5a5a80",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontFamily: "'Courier New', monospace",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* SCHEDULE TAB */}
                  {activeTab === "schedule" && (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                        {[
                          { icon: "😴", label: "Target Bedtime", val: formatTime12(day.sleep) },
                          { icon: "⏰", label: "Target Wake", val: formatTime12(day.wake) },
                          { icon: "☀️", label: "Seek Bright Light", val: `${formatTime12(day.lightExposure.start)} – ${formatTime12(day.lightExposure.end)}` },
                          { icon: "🕶️", label: "Avoid Light After", val: formatTime12(day.avoidLight) },
                          { icon: "☕", label: "Last Caffeine", val: formatTime12(day.caffeineCutoff) },
                          { icon: "🌙", label: "Melatonin (if needed)", val: `30 min before ${formatTime12(day.sleep)}` },
                        ].map(({ icon, label, val }) => (
                          <div key={label} style={{ background: "#13132a", borderRadius: "6px", padding: "12px 14px", border: "1px solid #1e1e3a" }}>
                            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{icon}</div>
                            <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#5a5a80", fontFamily: "'Courier New', monospace", marginBottom: "3px" }}>{label.toUpperCase()}</div>
                            <div style={{ fontSize: "13px", color: "#c4bde8" }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#5a5a80", fontFamily: "'Courier New', monospace", marginBottom: "10px" }}>SUGGESTED MEAL TIMES</div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {[
                            { label: "Breakfast", time: day.meals.breakfast },
                            { label: "Lunch", time: day.meals.lunch },
                            { label: "Dinner", time: day.meals.dinner },
                          ].map(({ label, time }) => (
                            <div key={label} style={{ background: "#13132a", border: "1px solid #1e1e3a", borderRadius: "20px", padding: "6px 14px", fontSize: "13px", color: "#a09ac8" }}>
                              {label}: <span style={{ color: "#c4bde8" }}>{formatTime12(time)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* HYDRATION TAB */}
                  {activeTab === "hydration" && day.hydration && (
                    <div>
                      <div style={{ background: "#13132a", border: "1px solid #1e4060", borderRadius: "8px", padding: "14px 16px", marginBottom: "12px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#38bdf8", fontFamily: "'Courier New', monospace", marginBottom: "8px" }}>💧 WATER TARGET</div>
                        <div style={{ fontSize: "14px", color: "#c4bde8", lineHeight: "1.5" }}>{day.hydration.water}</div>
                      </div>
                      <div style={{ background: "#13132a", border: "1px solid #1e4060", borderRadius: "8px", padding: "14px 16px", marginBottom: "12px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#38bdf8", fontFamily: "'Courier New', monospace", marginBottom: "8px" }}>⚡ ELECTROLYTES</div>
                        <div style={{ fontSize: "13px", color: "#a09ac8", lineHeight: "1.5" }}>{day.hydration.electrolytes}</div>
                        <div style={{ marginTop: "8px", fontSize: "11px", color: "#5a5a80" }}>Key minerals: sodium (fluid retention), potassium (energy), magnesium (sleep & relaxation)</div>
                      </div>
                      <div style={{ background: "#13132a", border: "1px solid #4a1e1e", borderRadius: "8px", padding: "14px 16px", marginBottom: "12px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#f87171", fontFamily: "'Courier New', monospace", marginBottom: "8px" }}>🚫 AVOID</div>
                        {day.hydration.avoid.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "#a09ac8" }}>
                            <span style={{ color: "#f87171" }}>✕</span>{item}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: "11px", color: "#5a5a80", lineHeight: "1.6", padding: "10px 0" }}>
                        <strong style={{ color: "#6b6b9a" }}>Note:</strong> {day.hydration.note}
                      </div>
                    </div>
                  )}

                  {/* FOOD TAB */}
                  {activeTab === "food" && day.foodGuidance && (
                    <div>
                      <div style={{ background: "#13132a", border: "1px solid #1e4030", borderRadius: "8px", padding: "14px 16px", marginBottom: "12px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#34d399", fontFamily: "'Courier New', monospace", marginBottom: "8px" }}>✅ EAT / DRINK</div>
                        {day.foodGuidance.eat.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "13px", color: "#a09ac8", lineHeight: "1.4" }}>
                            <span style={{ color: "#34d399", flexShrink: 0 }}>→</span>{item}
                          </div>
                        ))}
                      </div>
                      <div style={{ background: "#13132a", border: "1px solid #4a1e1e", borderRadius: "8px", padding: "14px 16px", marginBottom: "12px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#f87171", fontFamily: "'Courier New', monospace", marginBottom: "8px" }}>🚫 AVOID</div>
                        {day.foodGuidance.avoid.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "#a09ac8" }}>
                            <span style={{ color: "#f87171", flexShrink: 0 }}>✕</span>{item}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: "11px", color: "#5a5a80", lineHeight: "1.6", padding: "10px 0" }}>
                        <strong style={{ color: "#6b6b9a" }}>Why it matters:</strong> {day.foodGuidance.note}
                      </div>
                    </div>
                  )}

                  {/* TIPS TAB */}
                  {activeTab === "tips" && (
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {day.tips.map((tip, i) => (
                        <li key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", fontSize: "13px", color: "#a09ac8", lineHeight: "1.5" }}>
                          <span style={{ color: phaseColors[day.phase], flexShrink: 0 }}>→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* EXTRAS TAB */}
                  {activeTab === "extras" && (() => {
                    const extras = [
                      {
                        icon: "🏃",
                        title: "Exercise Timing",
                        color: "#fb923c",
                        items: day.phase === "pre"
                          ? ["Light exercise in the morning helps reinforce your wake-time cues", "Avoid intense workouts within 3 hours of your target bedtime", "A short walk outdoors after waking combines light exposure + movement — double benefit"]
                          : day.phase === "travel"
                          ? ["Walk the aisle every 1–2 hours to improve circulation and reduce DVT risk", "Do light stretching in your seat — ankle circles, shoulder rolls, gentle twists", "Avoid intense exercise on travel day; save energy for adjustment"]
                          : ["Morning exercise in local sunlight is one of the strongest circadian anchors available", "Light aerobic activity (walking, easy jog) is best — skip intense training for the first 1–2 days", "Avoid exercise within 2–3 hours of target bedtime at your destination"],
                        note: "Exercise is a weaker circadian signal than light, but morning movement outdoors compounds the light benefit and boosts alertness without disrupting sleep.",
                      },
                      {
                        icon: "🌡️",
                        title: "Temperature Therapy",
                        color: "#38bdf8",
                        items: day.phase === "pre"
                          ? ["Keep your bedroom cool (65–68°F / 18–20°C) — your body drops 1–2°F to initiate sleep", "A warm bath or shower 1–2 hours before bed raises then drops your core temperature, triggering sleepiness"]
                          : day.phase === "travel"
                          ? ["Plane cabins are cool — use a blanket if trying to sleep, remove layers if you need to stay alert", "A cool, damp cloth on your face and neck can help wake you up if fighting drowsiness at the wrong time"]
                          : ["Set your hotel thermostat to 65–68°F (18–20°C) for sleep — hotel rooms are often too warm", "A brief cold shower in the morning can sharpen alertness and replicate the body's natural morning cortisol spike", "A warm bath 60–90 min before destination bedtime aids sleep onset by triggering the temperature drop response"],
                        note: "Your core body temperature is one of the most reliable internal clock signals. Cool = sleep mode. Warm = wake mode. Use it strategically.",
                      },
                      {
                        icon: "😌",
                        title: "Stress & Mental Reset",
                        color: "#c084fc",
                        items: day.phase === "pre"
                          ? ["Reduce pre-trip stress — cortisol disrupts sleep quality and worsens jet lag symptoms", "Avoid late-night screen time and news; blue light suppresses melatonin for 1–3 hours after exposure", "Pack familiar items (scent, blanket, pillow) — familiar sensory cues improve sleep in new environments"]
                          : day.phase === "travel"
                          ? ["Use noise-canceling headphones or earplugs — sound disruption is the #1 cause of poor in-flight sleep", "Consider an eye mask and neck pillow for sleep; the Trtl or Ostrich styles offer better head support", "Box breathing (4 counts in, hold 4, out 4, hold 4) can help you fall asleep when anxious or overstimulated"]
                          : ["Mentally commit to local time immediately — avoid checking home time zone on your phone", "Brief mindfulness or 5–10 min of deep breathing before bed helps override the 'wrong time zone' feeling", "Familiar scents (lavender, your usual lotion) can cue sleep in an unfamiliar hotel room"],
                        note: "Stress hormones like cortisol actively fight your body's sleep signals. Managing them is just as important as managing light.",
                      },
                      {
                        icon: "🧳",
                        title: "Gear & Preparation",
                        color: "#34d399",
                        items: day.phase === "pre"
                          ? ["Pack: sleep mask, earplugs or noise-canceling headphones, neck pillow, electrolyte packets, melatonin", "Download offline entertainment so you control when to stay alert vs. wind down in-flight", "Consider blue-light blocking glasses for the evenings leading up to your flight"]
                          : day.phase === "travel"
                          ? ["Blue-light blocking glasses during destination 'evening' hours on the plane — especially useful on overnight flights", "Foot hammock attachments reduce leg pressure and swelling on long-haul flights", "Compression socks reduce DVT risk and leg swelling — put them on before boarding"]
                          : ["Use blackout curtains or bring a sleep mask — hotel rooms are often brighter than your bedroom", "Bring a small white noise app or travel fan; consistent background sound masks hotel noise", "Set your phone to destination time and do not check home time zone — this is a surprisingly powerful psychological trick"],
                        note: "Small physical tools can meaningfully improve in-flight and at-destination sleep quality — the environment matters as much as the biology.",
                      },
                    ];

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {extras.map(({ icon, title, color, items, note }) => (
                          <div key={title} style={{ background: "#13132a", border: `1px solid ${color}30`, borderRadius: "8px", padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                              <span style={{ fontSize: "18px" }}>{icon}</span>
                              <div style={{ fontSize: "9px", letterSpacing: "3px", color, fontFamily: "'Courier New', monospace" }}>{title.toUpperCase()}</div>
                            </div>
                            {items.map((item, idx) => (
                              <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "#a09ac8", lineHeight: "1.4" }}>
                                <span style={{ color, flexShrink: 0 }}>→</span>{item}
                              </div>
                            ))}
                            <div style={{ marginTop: "10px", fontSize: "11px", color: "#5a5a80", lineHeight: "1.5", borderTop: "1px solid #1e1e3a", paddingTop: "8px" }}>
                              {note}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })()}

          {/* Science note */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: "#0a0a14",
              border: "1px solid #1a1a30",
              borderRadius: "6px",
              fontSize: "11px",
              color: "#4a4a6a",
              lineHeight: "1.6",
            }}
          >
            <strong style={{ color: "#6b6b9a" }}>Science note:</strong> Light exposure is the
            primary driver of circadian clock resets — not food or exercise alone. Seek bright
            outdoor light at the times shown above and avoid it before sleep. Melatonin (0.5–3 mg)
            works best at low doses timed to your new bedtime.
          </div>
          <div style={{ textAlign: "center", marginTop: "12px", fontSize: "10px", color: "#3a3a5a", letterSpacing: "2px", fontFamily: "'Courier New', monospace" }}>
            ARRIVEREADY · A CAPTURE ADVENTURE NOW TOOL
          </div>
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  width: "100%",
  background: "#0e0e22",
  border: "1px solid #2e2e50",
  borderRadius: "6px",
  color: "#c4bde8",
  padding: "10px 14px",
  fontSize: "14px",
  appearance: "none",
  cursor: "pointer",
  outline: "none",
};
