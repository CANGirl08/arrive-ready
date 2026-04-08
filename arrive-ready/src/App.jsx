import { useState, useEffect } from "react";
function getSkyTheme(hour) {
  if (hour >= 5 && hour < 7) return { bg: "linear-gradient(180deg, #1a0533 0%, #6b2d6b 35%, #c2512a 65%, #f5a623 100%)", stars: true, glow: "#f5a623" };
  if (hour >= 7 && hour < 11) return { bg: "linear-gradient(180deg, #0a2550 0%, #1565c0 45%, #2196f3 75%, #64b5f6 100%)", stars: false, glow: "#64b5f6" };
  if (hour >= 11 && hour < 15) return { bg: "linear-gradient(180deg, #0d2e7a 0%, #1976d2 55%, #42a5f5 100%)", stars: false, glow: "#42a5f5" };
  if (hour >= 15 && hour < 18) return { bg: "linear-gradient(180deg, #0d1b4b 0%, #1a3a7c 40%, #2979ff 80%, #82b1ff 100%)", stars: false, glow: "#82b1ff" };
  if (hour >= 18 && hour < 20) return { bg: "linear-gradient(180deg, #08051f 0%, #3d1c5e 30%, #c2512a 65%, #f5a623 100%)", stars: true, glow: "#f59e0b" };
  if (hour >= 20 && hour < 22) return { bg: "linear-gradient(180deg, #05071a 0%, #130a2e 40%, #1a1060 80%, #2a1a7a 100%)", stars: true, glow: "#b48ef7" };
  return { bg: "linear-gradient(180deg, #05071a 0%, #07091f 40%, #0a0d2e 70%, #0d1040 100%)", stars: true, glow: "#b48ef7" };
}
const StarField = () => {
  const stars = Array.from({ length: 90 }, (_, i) => ({ cx: ((i * 137.5) % 100) + "%", cy: ((i * 97.3) % 100) + "%", r: i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1 : 0.6, op: 0.3 + (i % 7) * 0.1 }));
  return ( <svg style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.6 }}> {stars.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />)} </svg> );
};
const EarthArcLogo = ({ glow, hour }) => {
  const pct = (hour % 24) / 24;
  const angle = pct * Math.PI;
  const rx = 22, ry = 10, cx = 25, cy = 36;
  const px = cx + rx * Math.cos(Math.PI - angle);
  const py = cy - ry * Math.sin(Math.PI - angle) - 10;
  const tx = Math.atan2(ry * Math.cos(Math.PI - angle), rx * Math.sin(Math.PI - angle));
  const rd = (tx * 180 / Math.PI) - 90;
  const above = py < cy - 1;
  const f = { filter: "drop-shadow(0 0 6px " + glow + ") drop-shadow(0 0 14px " + glow + ")" };
  return (
    <svg width="54" height="50" viewBox="0 0 54 50" fill="none" style={f}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke={glow} strokeWidth="1.8" fill="none" opacity="0.7" strokeDasharray="3 2" />
      <path d={"M" + (cx - rx) + " " + cy + " A" + rx + " " + ry + " 0 0 1 " + (cx + rx) + " " + cy} stroke={glow} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
      {above && (
        <g transform={"translate(" + px + "," + py + ") rotate(" + rd + ")"}>
                    <polygon points="0,-8 -4,5 0,2.5 4,5" fill="white" opacity="0.95" />
                    <line x1="-6.5" y1="0.5" x2="6.5" y2="0.5" stroke={glow} strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="-2.5" y1="3.5" x2="2.5" y2="3.5" stroke={glow} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                    <circle cx="0" cy="0" r="5.5" fill={glow} opacity="0.18" />
        </g>
      )}
      <line x1={cx - rx - 3} y1={cy} x2={cx + rx + 3} y2={cy} stroke={glow} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
            <circle cx={px} cy={py + 10} r="3.5" fill={glow} opacity="0.9" />
            <circle cx={px} cy={py + 10} r="7" fill={glow} opacity="0.15" />
    </svg>
  );
};
const SunriseLogo = ({ glow }) => {
  const f = { filter: "drop-shadow(0 0 8px " + glow + ") drop-shadow(0 0 18px " + glow + ")" };
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" style={f}>
      <path d="M5 38 A20 20 0 0 1 45 38" stroke={glow} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="25" cy="38" r="7" fill={glow} opacity="0.95" />
      <circle cx="25" cy="38" r="12" fill={glow} opacity="0.1" />
      <line x1="25" y1="13" x2="25" y2="7" stroke={glow} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="11" y1="24" x2="7" y2="19" stroke={glow} strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
      <line x1="39" y1="24" x2="43" y2="19" stroke={glow} strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
      <line x1="5" y1="41" x2="45" y2="41" stroke={glow} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
};
const PlaneLogo = ({ glow }) => {
  const f = { filter: "drop-shadow(0 0 8px " + glow + ") drop-shadow(0 0 18px " + glow + ")" };
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" style={f}>
      <ellipse cx="25" cy="40" rx="17" ry="2" fill={glow} opacity="0.35" />
      <path d="M25 35 C25 35 11 26 11 19 C11 14 16 12 20 14 L25 17 L30 14 C34 12 39 14 39 19 C39 26 25 35 25 35Z" fill={glow} opacity="0.9" />
      <line x1="25" y1="17" x2="25" y2="35" stroke="white" strokeWidth="1.2" opacity="0.45" />
      <path d="M15 28 L10 33 M35 28 L40 33" stroke={glow} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="6" y1="40" x2="44" y2="40" stroke={glow} strokeWidth="2" opacity="0.65" />
    </svg>
  );
};
const TIMEZONES = [{label:"Los Angeles (PST/PDT)",offset:-8},{label:"Denver (MST/MDT)",offset:-7},{label:"Chicago (CST/CDT)",offset:-6},{label:"New York (EST/EDT)",offset:-5},{label:"Sao Paulo (BRT)",offset:-3},{label:"London (GMT/BST)",offset:0},{label:"Paris / Berlin (CET/CEST)",offset:1},{label:"Cairo (EET)",offset:2},{label:"Moscow (MSK)",offset:3},{label:"Dubai (GST)",offset:4},{label:"Mumbai (IST)",offset:5.5},{label:"Bangkok (ICT)",offset:7},{label:"Singapore / KL (SGT)",offset:8},{label:"Tokyo (JST)",offset:9},{label:"Sydney (AEST/AEDT)",offset:10},{label:"Auckland (NZST/NZDT)",offset:12}];
const CHRONOTYPES = [{label:"Early bird",bedtime:"21:30",wake:"05:30"},{label:"Morning person",bedtime:"22:30",wake:"06:30"},{label:"Neutral",bedtime:"23:00",wake:"07:00"},{label:"Night owl",bedtime:"00:00",wake:"08:00"},{label:"Late night",bedtime:"01:30",wake:"09:30"}];
function timeToMinutes(t) { const [h,m] = t.split(":").map(Number); return h*60+m; }
function minutesToTime(m) { const total=((m%1440)+1440)%1440; return String(Math.floor(total/60)).padStart(2,"0")+":"+String(total%60).padStart(2,"0"); }
function formatTime12(t) { const [h,m]=t.split(":").map(Number); return (h%12||12)+":"+String(m).padStart(2,"0")+" "+(h>=12?"PM":"AM"); }
function generatePlan({ homeTZ, destTZ, chronotype }) {
  const diff=destTZ.offset-homeTZ.offset, absDiff=Math.abs(diff), goingEast=diff>0;
  if (absDiff===0) return null;
  const bedMins=timeToMinutes(chronotype.bedtime), wakeMins=timeToMinutes(chronotype.wake);
  const adjustPerDay=goingEast?60:120, recoveryDays=Math.ceil(absDiff/(adjustPerDay/60));
  const days=[];
  for (let i=-2; i<=recoveryDays; i++) {
    const label=i<0?Math.abs(i)+" day"+(i<-1?"s":"")+" before departure":i===0?"Departure day":"Day "+i+" at destination";
    const shiftMins=goingEast?Math.min(i+2,absDiff)*adjustPerDay:-Math.min(i+2,absDiff)*adjustPerDay;
    const newBed=minutesToTime(bedMins+(i>=0?diff*60:shiftMins*0.5));
    const newWake=minutesToTime(wakeMins+(i>=0?diff*60:shiftMins*0.5));
    const lightEnd=minutesToTime(timeToMinutes(newWake)+180);
    const avoidLight=minutesToTime(timeToMinutes(newBed)-120);
    const caffeine=minutesToTime(timeToMinutes(newBed)-360);
    const breakfast=minutesToTime(timeToMinutes(newWake)+30);
    const lunch=minutesToTime(timeToMinutes(newWake)+360);
    const dinner=minutesToTime(timeToMinutes(newBed)-180);
    let tips=[], hydration={}, food={};
    if (i<0) { tips.push(goingEast?"Adjust bedtime earlier to pre-align eastward":"Adjust bedtime later to pre-align westward"); tips.push("Limit alcohol and heavy meals the day before your flight"); hydration={water:"20-32 oz every 4-5 hours",electrolytes:"Start electrolytes 24h before departure",avoid:["Alcohol - disrupts sleep","Excess caffeine after mid-afternoon"],note:"Pre-load hydration now. Pair water with electrolytes for better absorption."}; food={eat:["High-protein breakfasts and lunches","Complex carbs at dinner","High-water foods like watermelon and cucumber","Tart cherry juice before bed"],avoid:["Heavy fatty meals at night","Refined carbs during the day","Large portions"],note:"Protein activates your active-phase chemistry. Carbs at dinner trigger wind-down."}; }
    if (i===0) { tips.push("Set all devices to destination time zone as you board"); tips.push("Skip alcohol and minimize caffeine on the plane"); tips.push(goingEast?"Try to sleep during destination nighttime hours":"Stay awake if it is daytime at your destination when you land"); hydration={water:"8 oz every hour in-flight - cabin air is extremely dry",electrolytes:"Add electrolyte drops to your water bottle",avoid:["Alcohol - diuretic, worsens jet lag","Coffee unless aligned with destination wake time","Sugary sodas"],note:"You can lose 1-2 liters of fluid on a long flight just through breathing."}; food={eat:["Light high-protein snacks like nuts, cheese, eggs","Hydrating foods like watermelon and cucumber","Small meals - heavy meals worsen sleep","Eat on destination schedule where possible"],avoid:["Airline alcohol","Heavy fried meals","Large refined carbs if you need to stay alert"],note:"Eat lightly before destination bedtime, then have a protein breakfast when destination morning arrives."}; }
    if (i>0 && i<=2) { tips.push("Spend time outdoors in the morning to anchor your new wake time"); tips.push("Cap any nap at 20 minutes before 3 PM local time"); tips.push("Melatonin 0.5-3 mg 30 min before target bedtime may help"); hydration={water:"8 oz per hour while awake",electrolytes:"Continue electrolytes for 2-3 days post-arrival",avoid:["Alcohol especially in the evening","Caffeine after your cutoff time"],note:"Dehydration slows circadian adjustment. Keep a water bottle visible."}; food={eat:["High-protein breakfast at local time","Fermented foods like yogurt, kefir, kimchi","Tart cherry juice before local bedtime","Bananas, oats, quinoa for steady energy"],avoid:["Heavy meals within 2-3 hours of bedtime","Skipping meals","High sugar foods"],note:"A strong local breakfast is your number one food tool for resetting your clock."}; }
    if (i>2) { tips.push("Maintain consistent sleep and wake times - nearly adjusted"); tips.push("Continue morning light to reinforce your new circadian rhythm"); hydration={water:"Return to normal about 8 cups or 64 oz",electrolytes:"Normal diet should suffice",avoid:["Late-night caffeine","Excess alcohol"],note:"Keep meal and sleep times consistent."}; food={eat:["Balanced meals on local schedule","Continue protein-rich breakfasts","Complex carbs at dinner"],avoid:["Erratic meal timing","Heavy late-night meals"],note:"Consistency is key. Regular mealtimes are among the strongest circadian cues."}; }
    days.push({ label, sleep:newBed, wake:newWake, lightExposure:{start:newWake,end:lightEnd}, avoidLight, caffeineCutoff:caffeine, meals:{breakfast,lunch,dinner}, tips, hydration, food, phase:i<0?"pre":i===0?"travel":"dest" });
  }
  return { days, diff, absDiff, goingEast, recoveryDays, direction:goingEast?"eastward":"westward" };
}
const F = { heading: "'Outfit', sans-serif", body: "'Nunito', sans-serif" };
const PC = { pre: "#b48ef7", travel: "#f5c842", dest: "#4dd9ac" };
const PL = { pre: "PRE-TRIP", travel: "TRAVEL DAY", dest: "AT DESTINATION" };
const glass = () => ({ background: "rgba(8,12,45,0.62)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)", borderRadius: "22px" });
const pill = (active, color) => ({ padding: "9px 22px", borderRadius: "50px", border: "1px solid "+(active?color:"rgba(255,255,255,0.16)"), background: active?color+"2a":"rgba(255,255,255,0.05)", color: active?color:"rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "13px", fontFamily: F.body, fontWeight: "600", transition: "all 0.2s ease" });
const sel = () => ({ width: "100%", background: "rgba(8,14,55,0.7)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "14px", color: "#e8eaf6", padding: "13px 16px", fontSize: "14px", fontFamily: F.body, appearance: "none", cursor: "pointer", outline: "none" });
const mc = (accent) => ({ background: "rgba(8,12,45,0.6)", backdropFilter: "blur(14px)", border: "1px solid "+accent+"38", borderRadius: "14px", padding: "14px 16px", marginBottom: "12px" });
const lbl = { display: "block", fontSize: "12px", letterSpacing: "0.5px", color: "rgba(255,255,255,0.6)", fontFamily: F.body, fontWeight: "700", marginBottom: "10px" };
const LOGOS = [
  (g, h) => <EarthArcLogo key="e" glow={g} hour={h} />,
  (g) => <SunriseLogo key="s" glow={g} />,
  (g) => <PlaneLogo key="p" glow={g} />,
];
export default function JetLagPlanner() {
  const [step, setStep] = useState(0);
  const [homeTZ, setHomeTZ] = useState(TIMEZONES[3]);
  const [destTZ, setDestTZ] = useState(TIMEZONES[6]);
  const [chronotype, setChronotype] = useState(CHRONOTYPES[2]);
  const [departDate, setDepartDate] = useState("");
  const [plan, setPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState("schedule");
  const [sky, setSky] = useState(() => getSkyTheme(new Date().getHours()));
  const [logoIdx, setLogoIdx] = useState(0);
  const [hour, setHour] = useState(new Date().getHours());
  useEffect(() => {
    setDepartDate(new Date().toISOString().split("T")[0]);
    const t = setInterval(() => { const h = new Date().getHours(); setSky(getSkyTheme(h)); setHour(h); }, 60000);
    return () => clearInterval(t);
  }, []);
  function handleGenerate() { const result = generatePlan({ homeTZ, destTZ, chronotype }); setPlan(result); setStep(1); setActiveDay(0); setActiveTab("schedule"); }
  const logoFn = LOGOS[logoIdx % LOGOS.length];
  return (
    <div style={{ minHeight: "100vh", background: sky.bg, color: "#e8eaf6", fontFamily: F.body, position: "relative", transition: "background 3s ease" }}>
      {sky.stars && <StarField />}
      <div style={{ position: "fixed", inset: 0, background: "rgba(4,6,28,0.45)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(780px,95vw)", height: "min(1000px,98vh)", borderRadius: "80px", border: "1px solid rgba(255,255,255,0.07)", pointerEvents: "none", zIndex: 0, boxShadow: "inset 0 0 140px rgba(0,0,0,0.18)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.09)", padding: "20px 28px 16px", display: "flex", alignItems: "center", gap: "16px", background: "rgba(4,6,28,0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
          <div onClick={() => setLogoIdx(i => i + 1)} style={{ cursor: "pointer", flexShrink: 0, userSelect: "none" }} title="Tap to cycle logo styles">
            {logoFn(sky.glow, hour)}
          </div>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.45)", fontFamily: F.heading, fontWeight: 500, marginBottom: "4px" }}>A CAPTURE ADVENTURE NOW TOOL</div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#f0eeff", fontFamily: F.heading, letterSpacing: "0.2px" }}>ArriveReady</h1>
            <div style={{ fontSize: "13px", color: sky.glow, fontStyle: "italic", marginTop: "3px", fontFamily: F.body, fontWeight: 400 }}>Land energized. Capture every moment.</div>
          </div>
          {step === 1 && <button onClick={() => { setStep(0); setPlan(null); }} style={{ ...pill(false, sky.glow), marginLeft: "auto" }}>Back</button>}
        </div>
        {step === 0 && (
          <div style={{ maxWidth: "580px", margin: "0 auto", padding: "40px 24px" }}>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: "1.9", marginBottom: "36px", fontFamily: F.body }}>Based on circadian science used by NASA and elite athletes, this planner generates a personalized sleep, light, caffeine, and meal schedule to minimize your jet lag.</p>
            {[
              { label: "Your Home Time Zone", content: <select value={homeTZ.label} onChange={e => setHomeTZ(TIMEZONES.find(t => t.label === e.target.value))} style={sel()}>{TIMEZONES.map(t => <option key={t.label}>{t.label}</option>)}</select> },
              { label: "Destination Time Zone", content: <select value={destTZ.label} onChange={e => setDestTZ(TIMEZONES.find(t => t.label === e.target.value))} style={sel()}>{TIMEZONES.map(t => <option key={t.label}>{t.label}</option>)}</select> },
              { label: "Departure Date", content: <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)} style={{ ...sel(), colorScheme: "dark", fontFamily: F.body }} /> },
              { label: "Your Sleep Chronotype", content: (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CHRONOTYPES.map(c => <button key={c.label} onClick={() => setChronotype(c)} style={pill(chronotype.label === c.label, sky.glow)}>{c.label}</button>)}
                </div>
              )},
            ].map(({ label, content }) => (
              <div key={label} style={{ marginBottom: "28px" }}>
                <label style={lbl}>{label}</label>
                {content}
              </div>
            ))}
            <button onClick={handleGenerate} style={{ width: "100%", padding: "18px 24px", background: "linear-gradient(135deg, "+sky.glow+"28, rgba(4,6,50,0.88))", border: "1px solid "+sky.glow+"95", borderRadius: "50px", color: "#f0eeff", fontSize: "18px", letterSpacing: "1.5px", cursor: "pointer", fontFamily: F.heading, fontWeight: 600, boxShadow: "0 0 32px "+sky.glow+"38, inset 0 1px 0 rgba(255,255,255,0.1)", marginTop: "8px" }}>Generate My Plan</button>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "18px", lineHeight: "1.7", fontFamily: F.body, textAlign: "center" }}>Science-backed: light exposure timing is the primary tool for resetting your circadian clock.</p>
            <p style={{ fontSize: "11px", color: sky.glow, marginTop: "8px", textAlign: "center", opacity: 0.6, fontFamily: F.body }}>Tap the logo above to cycle: Earth Arc (moves with your local time) - Sunrise Arc - Plane Horizon</p>
          </div>
        )}
        {step === 1 && plan && (
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "28px 20px" }}>
            <div style={{ ...glass(), padding: "16px 24px", marginBottom: "24px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[{ label: "Time Zone Shift", val: (plan.absDiff>0?"+":"")+plan.diff+"h" }, { label: "Direction", val: plan.direction }, { label: "Est. Recovery", val: "~"+plan.recoveryDays+" days" }, { label: "Chronotype", val: chronotype.label }].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.45)", fontFamily: F.body, fontWeight: 700, marginBottom: "3px" }}>{label}</div>
                  <div style={{ fontSize: "17px", color: "#f0eeff", fontFamily: F.body, fontWeight: 700 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "7px", overflowX: "auto", paddingBottom: "8px", marginBottom: "18px" }}>
              {plan.days.map((day, i) => (
                <button key={i} onClick={() => setActiveDay(i)} style={{ ...pill(activeDay===i, PC[day.phase]), flexShrink: 0, fontSize: "11px", padding: "7px 16px" }}>
                  {day.phase==="pre"?"D-"+(plan.days.filter(d=>d.phase==="pre").length-i):day.phase==="travel"?"DEP":"D+"+(i-plan.days.filter(d=>d.phase!=="dest").length+1)}
                </button>
              ))}
            </div>
            {(() => {
              const day = plan.days[activeDay];
              const pc = PC[day.phase];
              return (
                <div style={{ ...glass(), overflow: "hidden" }}>
                  <div style={{ background: pc+"1a", borderBottom: "1px solid "+pc+"30", padding: "16px 24px" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "2px", color: pc, fontFamily: F.body, fontWeight: 800 }}>{PL[day.phase]}</span>
                    <div style={{ fontSize: "18px", color: "#f0eeff", marginTop: "4px", fontFamily: F.body, fontWeight: 700 }}>{day.label}</div>
                  </div>
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", gap: "7px", marginBottom: "22px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px", flexWrap: "wrap" }}>
                      {[{id:"schedule",label:"Schedule"},{id:"hydration",label:"Hydration"},{id:"food",label:"Food"},{id:"tips",label:"Tips"},{id:"extras",label:"Extras"}].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={pill(activeTab===tab.id, pc)}>{tab.label}</button>
                      ))}
                    </div>
                    {activeTab === "schedule" && (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                          {[{icon:"😴",label:"Target Bedtime",val:formatTime12(day.sleep)},{icon:"⏰",label:"Target Wake",val:formatTime12(day.wake)},{icon:"☀️",label:"Seek Bright Light",val:formatTime12(day.lightExposure.start)+" to "+formatTime12(day.lightExposure.end)},{icon:"🕶️",label:"Avoid Light After",val:formatTime12(day.avoidLight)},{icon:"☕",label:"Last Caffeine",val:formatTime12(day.caffeineCutoff)},{icon:"🌙",label:"Melatonin if needed",val:"30 min before "+formatTime12(day.sleep)}].map(({ icon, label, val }) => (
                            <div key={label} style={{ ...mc(pc), padding: "13px 15px" }}>
                              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{icon}</div>
                              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontFamily: F.body, fontWeight: 700, marginBottom: "3px" }}>{label}</div>
                              <div style={{ fontSize: "15px", color: "#f0eeff", fontFamily: F.body, fontWeight: 700 }}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontFamily: F.body, fontWeight: 700, marginBottom: "10px" }}>Suggested Meal Times</div>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {[{label:"Breakfast",time:day.meals.breakfast},{label:"Lunch",time:day.meals.lunch},{label:"Dinner",time:day.meals.dinner}].map(({ label, time }) => (
                              <div key={label} style={{ background: "rgba(8,12,45,0.6)", border: "1px solid "+pc+"38", borderRadius: "50px", padding: "8px 20px", display: "inline-flex", gap: "6px", alignItems: "center" }}>
                                <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: F.body, fontSize: "13px" }}>{label}:</span>
                                <span style={{ color: "#f0eeff", fontFamily: F.body, fontWeight: 700, fontSize: "14px" }}>{formatTime12(time)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {activeTab === "hydration" && day.hydration && (
                      <div>
                        <div style={mc("#38bdf8")}><div style={{ fontSize: "11px", color: "#38bdf8", fontFamily: F.body, fontWeight: 800, marginBottom: "8px" }}>Water Target</div><div style={{ fontSize: "14px", color: "#e8eaf6", lineHeight: "1.65", fontFamily: F.body }}>{day.hydration.water}</div></div>
                        <div style={mc("#38bdf8")}><div style={{ fontSize: "11px", color: "#38bdf8", fontFamily: F.body, fontWeight: 800, marginBottom: "8px" }}>Electrolytes</div><div style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: "1.65", fontFamily: F.body }}>{day.hydration.electrolytes}</div></div>
                        <div style={mc("#f87171")}><div style={{ fontSize: "11px", color: "#f87171", fontFamily: F.body, fontWeight: 800, marginBottom: "8px" }}>Avoid</div>{day.hydration.avoid.map((item, idx) => (<div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "13px", color: "rgba(255,255,255,0.68)", fontFamily: F.body }}><span style={{ color: "#f87171", flexShrink: 0 }}>x</span>{item}</div>))}</div>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: "1.7", padding: "8px 0", fontFamily: F.body }}><strong style={{ color: "rgba(255,255,255,0.6)" }}>Note:</strong> {day.hydration.note}</p>
                      </div>
                    )}
                    {activeTab === "food" && day.food && (
                      <div>
                        <div style={mc("#4dd9ac")}><div style={{ fontSize: "11px", color: "#4dd9ac", fontFamily: F.body, fontWeight: 800, marginBottom: "8px" }}>Eat and Drink</div>{day.food.eat.map((item, idx) => (<div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: "1.5", fontFamily: F.body }}><span style={{ color: "#4dd9ac", flexShrink: 0 }}>+</span>{item}</div>))}</div>
                        <div style={mc("#f87171")}><div style={{ fontSize: "11px", color: "#f87171", fontFamily: F.body, fontWeight: 800, marginBottom: "8px" }}>Avoid</div>{day.food.avoid.map((item, idx) => (<div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "rgba(255,255,255,0.68)", fontFamily: F.body }}><span style={{ color: "#f87171", flexShrink: 0 }}>x</span>{item}</div>))}</div>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: "1.7", padding: "8px 0", fontFamily: F.body }}><strong style={{ color: "rgba(255,255,255,0.6)" }}>Why it matters:</strong> {day.food.note}</p>
                      </div>
                    )}
                    {activeTab === "tips" && (
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {day.tips.map((tip, i) => (
                          <li key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px", fontSize: "14px", color: "rgba(255,255,255,0.78)", lineHeight: "1.7", fontFamily: F.body }}><span style={{ color: pc, flexShrink: 0, fontSize: "16px" }}>-</span>{tip}</li>
                        ))}
                      </ul>
                    )}
                    {activeTab === "extras" && (() => {
                      const extras = [
                        { title: "Exercise Timing", color: "#fb923c", items: day.phase==="pre"?["Light morning exercise reinforces wake-time cues","Avoid intense workouts within 3 hours of target bedtime","Outdoor walk combines light and movement"]:day.phase==="travel"?["Walk the aisle every 1-2 hours","Stretch in your seat: ankle circles, shoulder rolls","Avoid intense exercise on travel day"]:["Morning exercise in local sunlight is a strong circadian anchor","Light aerobic activity is best for days 1-2","Avoid exercise within 2-3 hours of target bedtime"], note: "Morning outdoor movement compounds the light benefit and boosts alertness." },
                        { title: "Temperature Therapy", color: "#38bdf8", items: day.phase==="pre"?["Keep bedroom cool 65-68F","Warm bath 1-2 hours before bed triggers the temperature-drop response"]:day.phase==="travel"?["Use a blanket if sleeping, remove layers if staying alert","A cool damp cloth on face counters drowsiness"]:["Set hotel thermostat to 65-68F for sleep","Brief cold shower in the morning replicates the natural cortisol spike","Warm bath 60-90 min before bedtime aids sleep onset"], note: "Cool equals sleep mode. Warm equals wake mode." },
                        { title: "Stress and Mental Reset", color: "#b48ef7", items: day.phase==="pre"?["Reduce pre-trip stress as cortisol disrupts sleep","Avoid late-night screens; blue light suppresses melatonin","Pack familiar scents as sensory cues improve sleep in new places"]:day.phase==="travel"?["Noise-canceling headphones: sound is the top cause of poor in-flight sleep","Eye mask and neck pillow for sleep","Box breathing helps you fall asleep"]:["Commit to local time and avoid checking home time zone","5-10 min deep breathing before bed helps override the wrong-timezone feeling","Familiar scents cue sleep in unfamiliar rooms"], note: "Stress hormones actively fight your sleep signals." },
                        { title: "Gear and Preparation", color: "#4dd9ac", items: day.phase==="pre"?["Pack: sleep mask, earplugs, neck pillow, electrolyte packets, melatonin","Download offline entertainment to control alert vs wind-down timing","Consider blue-light blocking glasses for evenings before your flight"]:day.phase==="travel"?["Blue-light blocking glasses during destination evening hours","Compression socks reduce DVT risk"]:["Blackout curtains or sleep mask for hotel rooms","White noise app or travel fan masks hotel noise","Set your phone to destination time and avoid checking home time zone"], note: "Small physical tools meaningfully improve sleep quality in-flight and at destination." },
                      ];
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {extras.map(({ title, color, items, note }) => (
                            <div key={title} style={mc(color)}>
                              <div style={{ fontSize: "11px", color, fontFamily: F.body, fontWeight: 800, marginBottom: "10px" }}>{title}</div>
                              {items.map((item, idx) => (<div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: "1.5", fontFamily: F.body }}><span style={{ color, flexShrink: 0 }}>+</span>{item}</div>))}
                              <div style={{ marginTop: "10px", fontSize: "11px", color: "rgba(255,255,255,0.38)", lineHeight: "1.6", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "8px", fontFamily: F.body }}>{note}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
            <div style={{ marginTop: "16px", padding: "14px 20px", background: "rgba(8,12,45,0.6)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: "1.7", fontFamily: F.body }}>
              <strong style={{ color: "rgba(255,255,255,0.6)" }}>Science note:</strong> Light exposure is the primary driver of circadian clock resets. Melatonin works best at low doses timed to your new bedtime.
            </div>
            <div style={{ textAlign: "center", marginTop: "14px", fontSize: "11px", color: "rgba(255,255,255,0.22)", letterSpacing: "1px", fontFamily: F.heading }}>ArriveReady - A Capture Adventure Now Tool</div>
          </div>
        )}
      </div>
    </div>
  );
}
// v6 - animated Earth arc logo: plane position moves with local hour of day
