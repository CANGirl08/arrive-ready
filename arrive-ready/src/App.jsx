import { useState, useEffect } from "react";

function getSkyTheme(hour) {
  if (hour >= 5 && hour < 7) return { bg: "linear-gradient(180deg, #1a0533 0%, #6b2d6b 35%, #c2512a 65%, #f5a623 100%)", stars: true, glow: "#f5a623", name: "sunrise" };
  if (hour >= 7 && hour < 11) return { bg: "linear-gradient(180deg, #0a2550 0%, #1565c0 45%, #2196f3 75%, #64b5f6 100%)", stars: false, glow: "#64b5f6", name: "morning" };
  if (hour >= 11 && hour < 15) return { bg: "linear-gradient(180deg, #0d2e7a 0%, #1976d2 55%, #42a5f5 100%)", stars: false, glow: "#42a5f5", name: "midday" };
  if (hour >= 15 && hour < 18) return { bg: "linear-gradient(180deg, #0d1b4b 0%, #1a3a7c 40%, #2979ff 80%, #82b1ff 100%)", stars: false, glow: "#82b1ff", name: "afternoon" };
  if (hour >= 18 && hour < 20) return { bg: "linear-gradient(180deg, #08051f 0%, #3d1c5e 30%, #c2512a 65%, #f5a623 100%)", stars: true, glow: "#f59e0b", name: "sunset" };
  if (hour >= 20 && hour < 22) return { bg: "linear-gradient(180deg, #05071a 0%, #130a2e 40%, #1a1060 80%, #2a1a7a 100%)", stars: true, glow: "#b48ef7", name: "dusk" };
  return { bg: "linear-gradient(180deg, #05071a 0%, #07091f 40%, #0a0d2e 70%, #0d1040 100%)", stars: true, glow: "#b48ef7", name: "night" };
}

const StarField = () => {
  const stars = Array.from({length: 80}, (_, i) => ({
    cx: ((i * 137.5) % 100) + "%",
    cy: ((i * 97.3) % 100) + "%",
    r: i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1 : 0.6,
    opacity: 0.3 + (i % 7) * 0.1
  }));
  return (
    <svg style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:0.65}} xmlns="http://www.w3.org/2000/svg">
      {stars.map((s,i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.opacity}/>)}
    </svg>
  );
};

const PlaneLogo = ({glow}) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{filter: "drop-shadow(0 0 8px " + glow + ") drop-shadow(0 0 16px " + glow + "44)"}}>
    <ellipse cx="24" cy="38" rx="16" ry="2" fill={glow} opacity="0.35"/>
    <path d="M24 34 C24 34 10 25 10 18 C10 13 15 11 19 13 L24 16 L29 13 C33 11 38 13 38 18 C38 25 24 34 24 34Z" fill={glow} opacity="0.9"/>
    <path d="M24 16 L24 34" stroke="white" strokeWidth="1.2" opacity="0.5"/>
    <path d="M14 27 L9 32 M34 27 L39 32" stroke={glow} strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
    <line x1="6" y1="38" x2="42" y2="38" stroke={glow} strokeWidth="1.8" opacity="0.7"/>
    <line x1="6" y1="41" x2="42" y2="41" stroke={glow} strokeWidth="0.8" opacity="0.3"/>
  </svg>
);

const SunriseLogo = ({glow}) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{filter: "drop-shadow(0 0 8px " + glow + ") drop-shadow(0 0 16px " + glow + "44)"}}>
    <path d="M5 36 A19 19 0 0 1 43 36" stroke={glow} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="24" cy="36" r="6" fill={glow} opacity="0.95"/>
    <circle cx="24" cy="36" r="10" fill={glow} opacity="0.12"/>
    <line x1="24" y1="12" x2="24" y2="7" stroke={glow} strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="11" y1="22" x2="7" y2="18" stroke={glow} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <line x1="37" y1="22" x2="41" y2="18" stroke={glow} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <line x1="7" y1="30" x2="3" y2="30" stroke={glow} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <line x1="41" y1="30" x2="45" y2="30" stroke={glow} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <line x1="5" y1="39" x2="43" y2="39" stroke={glow} strokeWidth="1.2" opacity="0.4"/>
  </svg>
);
const TIMEZONES=[{label:"Los Angeles (PST/PDT)",offset:-8,dst:true},{label:"Denver (MST/MDT)",offset:-7,dst:true},{label:"Chicago (CST/CDT)",offset:-6,dst:true},{label:"New York (EST/EDT)",offset:-5,dst:true},{label:"São Paulo (BRT)",offset:-3,dst:false},{label:"London (GMT/BST)",offset:0,dst:true},{label:"Paris / Berlin (CET/CEST)",offset:1,dst:true},{label:"Cairo (EET)",offset:2,dst:false},{label:"Moscow (MSK)",offset:3,dst:false},{label:"Dubai (GST)",offset:4,dst:false},{label:"Mumbai (IST)",offset:5.5,dst:false},{label:"Bangkok (ICT)",offset:7,dst:false},{label:"Singapore / KL (SGT)",offset:8,dst:false},{label:"Tokyo (JST)",offset:9,dst:false},{label:"Sydney (AEST/AEDT)",offset:10,dst:true},{label:"Auckland (NZST/NZDT)",offset:12,dst:true}];
const CHRONOTYPES=[{label:"Early bird 🌅",bedtime:"21:30",wake:"05:30"},{label:"Morning person ☀️",bedtime:"22:30",wake:"06:30"},{label:"Neutral 🌤",bedtime:"23:00",wake:"07:00"},{label:"Night owl 🌙",bedtime:"00:00",wake:"08:00"},{label:"Late night 🦉",bedtime:"01:30",wake:"09:30"}];

function timeToMinutes(t){const[h,m]=t.split(":").map(Number);return h*60+m;}
function minutesToTime(m){const total=((m%1440)+1440)%1440;return String(Math.floor(total/60)).padStart(2,"0")+":"+String(total%60).padStart(2,"0");}
function formatTime12(t){const[h,m]=t.split(":").map(Number);return (h%12||12)+":"+String(m).padStart(2,"0")+" "+(h>=12?"PM":"AM");}

function generatePlan({homeTZ,destTZ,chronotype}){
  const diff=destTZ.offset-homeTZ.offset,absDiff=Math.abs(diff),goingEast=diff>0;
  if(absDiff===0)return null;
  const bedMins=timeToMinutes(chronotype.bedtime),wakeMins=timeToMinutes(chronotype.wake);
  const adjustPerDay=goingEast?60:120,recoveryDays=Math.ceil(absDiff/(adjustPerDay/60));
  const days=[];
  for(let i=-2;i<=recoveryDays;i++){
    const label=i<0?Math.abs(i)+" day"+(i<-1?"s":"")+" before departure":i===0?"Departure day":"Day "+i+" at destination";
    const shiftMins=goingEast?Math.min(i+2,absDiff)*adjustPerDay:-Math.min(i+2,absDiff)*adjustPerDay;
    const newBed=minutesToTime(bedMins+(i>=0?diff*60:shiftMins*0.5));
    const newWake=minutesToTime(wakeMins+(i>=0?diff*60:shiftMins*0.5));
    const lightEnd=minutesToTime(timeToMinutes(newWake)+180);
    const avoidLightStart=minutesToTime(timeToMinutes(newBed)-120);
    const caffeineStop=minutesToTime(timeToMinutes(newBed)-360);
    const breakfast=minutesToTime(timeToMinutes(newWake)+30);
    const lunch=minutesToTime(timeToMinutes(newWake)+360);
    const dinner=minutesToTime(timeToMinutes(newBed)-180);
    let tips=[],hydration={},foodGuidance={};
    if(i<0){
      tips.push(goingEast?"Go to bed "+(adjustPerDay/60)+"h earlier to pre-adjust eastward":"Go to bed "+(adjustPerDay/60)+"h later to pre-adjust westward");
      tips.push("Limit alcohol and heavy meals the day before your flight");
      hydration={water:"20–32 oz every 4–5 hours throughout the day",electrolytes:"Start electrolyte intake 24h before departure",avoid:["Alcohol — disrupts sleep and dehydrates","Excess caffeine after mid-afternoon"],note:"Pre-load hydration now. Pair water with electrolytes (sodium, potassium, magnesium) for better absorption."};
      foodGuidance={eat:["High-protein breakfasts & lunches to stay alert","Complex carbs at dinner to ease toward sleep","High-water-content foods: watermelon, cucumber, berries","Tart cherry juice before bed — a natural melatonin source"],avoid:["Heavy fatty meals close to bedtime","Refined carbs and sugar during the day","Large portions"],note:"Protein at breakfast/lunch activates your active-phase chemistry. Carbs at dinner trigger your wind-down pathway."};
    }
    if(i===0){
      tips.push("Set all devices to destination time zone as you board");
      tips.push("Skip alcohol and minimize caffeine on the plane");
      if(goingEast)tips.push("Try to sleep during destination nighttime hours on the plane");
      else tips.push("Stay awake if it is daytime at your destination when you land");
      hydration={water:"8 oz every hour in-flight — cabin air is drier than the Sahara",electrolytes:"Add electrolyte drops to your water bottle",avoid:["Alcohol — diuretic, worsens jet lag","Coffee and tea unless aligned with destination wake time","Sugary sodas"],note:"You can lose 1–2 liters of fluid on a long flight just through breathing. Do not wait until thirsty."};
      foodGuidance={eat:["Light high-protein snacks (nuts, cheese, eggs)","Hydrating foods: watermelon, cucumber","Small meals — heavy meals worsen sleep quality","Eat on destination schedule where possible"],avoid:["Airline alcohol","Heavy fried in-flight meals","Large refined carbs if you need to stay alert"],note:"If flying overnight: eat lightly before destination bedtime, then have a protein breakfast when destination morning arrives."};
    }
    if(i>0&&i<=2){
      tips.push("Spend time outdoors in the morning to anchor your new wake time");
      tips.push("Cap any nap at 20 minutes before 3 PM local time");
      tips.push("Melatonin (0.5–3 mg) 30 min before target bedtime may help");
      hydration={water:"8 oz per hour while awake; more if active or in a hot climate",electrolytes:"Continue electrolytes for 2–3 days post-arrival",avoid:["Alcohol especially in the evening","Caffeine after your cutoff time"],note:"Dehydration slows circadian adjustment. Keep a water bottle visible as a constant reminder."};
      foodGuidance={eat:["Substantial high-protein breakfast at local time","Fermented foods (yogurt, kefir, kimchi)","Tart cherry juice 1–2 hours before local bedtime","Bananas, oats, quinoa for steady energy"],avoid:["Heavy meals within 2–3 hours of bedtime","Skipping meals","High sugar foods"],note:"A strong breakfast at local time is your #1 food tool for resetting your clock."};
    }
    if(i>2){
      tips.push("Maintain consistent sleep and wake times — your body is nearly adjusted");
      tips.push("Continue morning light exposure to reinforce your new circadian rhythm");
      hydration={water:"Return to normal daily intake (~8 cups / 64 oz)",electrolytes:"Normal diet should suffice; supplement if doing heavy activity",avoid:["Late-night caffeine","Excess alcohol"],note:"By now your body is largely adjusted. Keep meal and sleep times consistent."};
      foodGuidance={eat:["Balanced meals on local schedule","Continue morning protein-rich breakfasts","Complex carbs at dinner to reinforce sleep onset"],avoid:["Erratic meal timing","Heavy late-night meals"],note:"Consistency is key. Your circadian system looks for reliable cues — regular mealtimes are among the strongest."};
    }
    days.push({label,sleep:newBed,wake:newWake,lightExposure:{start:newWake,end:lightEnd},avoidLight:avoidLightStart,caffeineCutoff:caffeineStop,meals:{breakfast,lunch,dinner},tips,hydration,foodGuidance,phase:i<0?"pre":i===0?"travel":"dest"});
  }
  return{days,diff,absDiff,goingEast,recoveryDays,direction:goingEast?"eastward ✈️→":"westward ←✈️"};
}
const font = { heading: "'Outfit', sans-serif", body: "'Nunito', sans-serif" };
const phaseColors = { pre: "#b48ef7", travel: "#f5c842", dest: "#4dd9ac" };
const phaseLabels = { pre: "PRE-TRIP", travel: "TRAVEL DAY", dest: "AT DESTINATION" };

function glassCard() {
  return { background: "rgba(8,12,45,0.6)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.11)", boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)", borderRadius: "20px" };
}

function pillBtn(active, color) {
  return { padding: "8px 20px", borderRadius: "50px", border: "1px solid " + (active ? color : "rgba(255,255,255,0.15)"), background: active ? color + "28" : "rgba(255,255,255,0.05)", color: active ? color : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "13px", fontFamily: "'Nunito', sans-serif", fontWeight: "600", letterSpacing: "0.3px", transition: "all 0.2s ease" };
}

function selectStyle() {
  return { width: "100%", background: "rgba(8,12,50,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "14px", color: "#e8eaf6", padding: "13px 16px", fontSize: "14px", fontFamily: "'Nunito', sans-serif", appearance: "none", cursor: "pointer", outline: "none" };
}

function miniCard(accent) {
  return { background: "rgba(8,12,45,0.55)", backdropFilter: "blur(12px)", border: "1px solid " + accent + "35", borderRadius: "14px", padding: "14px 16px", marginBottom: "12px" };
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
  const [sky, setSky] = useState(() => getSkyTheme(new Date().getHours()));
  const [logo, setLogo] = useState("sunrise");

  useEffect(() => {
    setDepartDate(new Date().toISOString().split("T")[0]);
    const t = setInterval(() => setSky(getSkyTheme(new Date().getHours())), 60000);
    return () => clearInterval(t);
  }, []);

  function handleGenerate() {
    const result = generatePlan({ homeTZ, destTZ, chronotype });
    setPlan(result); setStep(1); setActiveDay(0); setActiveTab("schedule");
  }
  return (
    <div style={{ minHeight: "100vh", background: sky.bg, color: "#e8eaf6", fontFamily: font.body, position: "relative", transition: "background 3s ease" }}>
      {sky.stars && <StarField />}
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(760px,94vw)", height: "min(980px,97vh)", borderRadius: "70px", border: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none", zIndex: 0, boxShadow: "inset 0 0 120px rgba(0,0,0,0.2), 0 0 60px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>

        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.09)", padding: "20px 28px 16px", display: "flex", alignItems: "center", gap: "16px", background: "rgba(5,8,35,0.72)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
          <div onClick={() => setLogo(l => l === "plane" ? "sunrise" : "plane")} style={{ cursor: "pointer", flexShrink: 0, userSelect: "none" }} title="Tap to switch logo">
            {logo === "plane" ? <PlaneLogo glow={sky.glow} /> : <SunriseLogo glow={sky.glow} />}
          </div>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.38)", fontFamily: font.heading, fontWeight: 500, marginBottom: "4px" }}>A CAPTURE ADVENTURE NOW TOOL</div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#e8eaf6", fontFamily: font.heading, letterSpacing: "0.2px" }}>ArriveReady</h1>
            <div style={{ fontSize: "13px", color: sky.glow, fontStyle: "italic", marginTop: "3px", fontFamily: font.body, fontWeight: 300, letterSpacing: "0.3px" }}>Land energized. Capture every moment.</div>
          </div>
          {step === 1 && <button onClick={() => { setStep(0); setPlan(null); }} style={{ ...pillBtn(false, sky.glow), marginLeft: "auto" }}>← New Plan</button>}
        </div>

        {step === 0 && (
          <div style={{ maxWidth: "580px", margin: "0 auto", padding: "40px 24px" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: "1.9", marginBottom: "36px", fontFamily: font.body }}>
              Based on circadian science used by NASA and elite athletes, this planner generates a personalized sleep, light, caffeine, and meal schedule to minimize your jet lag.
            </p>
            {[
              { label: "Your Home Time Zone", content: <select value={homeTZ.label} onChange={e => setHomeTZ(TIMEZONES.find(t => t.label === e.target.value))} style={selectStyle()}>{TIMEZONES.map(t => <option key={t.label}>{t.label}</option>)}</select> },
              { label: "Destination Time Zone", content: <select value={destTZ.label} onChange={e => setDestTZ(TIMEZONES.find(t => t.label === e.target.value))} style={selectStyle()}>{TIMEZONES.map(t => <option key={t.label}>{t.label}</option>)}</select> },
              { label: "Departure Date", content: <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)} style={{ ...selectStyle(), colorScheme: "dark" }} /> },
              { label: "Your Sleep Chronotype", content: (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CHRONOTYPES.map(c => <button key={c.label} onClick={() => setChronotype(c)} style={pillBtn(chronotype.label === c.label, sky.glow)}>{c.label}</button>)}
                </div>
              )},
            ].map(({ label, content }) => (
              <div key={label} style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.4)", fontFamily: font.heading, fontWeight: 500, marginBottom: "10px" }}>{label.toUpperCase()}</label>
                {content}
              </div>
            ))}
            <button onClick={handleGenerate} style={{ width: "100%", padding: "18px", background: "linear-gradient(135deg," + sky.glow + "30, rgba(5,8,60,0.85))", border: "1px solid " + sky.glow + "90", borderRadius: "50px", color: "#e8eaf6", fontSize: "15px", letterSpacing: "3px", cursor: "pointer", fontFamily: font.heading, fontWeight: 600, boxShadow: "0 0 30px " + sky.glow + "40, inset 0 1px 0 rgba(255,255,255,0.08)", marginTop: "8px" }}>
              GENERATE MY PLAN ✈️
            </button>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: "18px", lineHeight: "1.7", fontFamily: font.body, textAlign: "center" }}>Science-backed: light exposure timing is the primary tool for resetting your circadian clock.</p>
            <p style={{ fontSize: "11px", color: sky.glow, marginTop: "8px", textAlign: "center", opacity: 0.5, fontFamily: font.body }}>✨ Tap the logo above to switch between logo styles</p>
          </div>
        )}
        {step === 1 && plan && (
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "28px 20px" }}>
            <div style={{ ...glassCard(), padding: "16px 24px", marginBottom: "24px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[{ label: "Time Zone Shift", val: (plan.absDiff > 0 ? "+" : "") + plan.diff + "h" }, { label: "Direction", val: plan.direction }, { label: "Est. Recovery", val: "~" + plan.recoveryDays + " days" }, { label: "Chronotype", val: chronotype.label }].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.32)", fontFamily: font.heading, fontWeight: 500 }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: "16px", color: "#e8eaf6", marginTop: "3px", fontFamily: font.body, fontWeight: 700 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "18px" }}>
              {plan.days.map((day, i) => (
                <button key={i} onClick={() => setActiveDay(i)} style={{ ...pillBtn(activeDay === i, phaseColors[day.phase]), flexShrink: 0, fontSize: "11px", letterSpacing: "0.5px", padding: "7px 16px" }}>
                  {day.phase === "pre" ? "D-" + (plan.days.filter(d => d.phase === "pre").length - i) : day.phase === "travel" ? "DEP" : "D+" + (i - plan.days.filter(d => d.phase !== "dest").length + 1)}
                </button>
              ))}
            </div>
            {(() => {
              const day = plan.days[activeDay];
              const pc = phaseColors[day.phase];
              return (
                <div style={{ ...glassCard(), overflow: "hidden" }}>
                  <div style={{ background: pc + "18", borderBottom: "1px solid " + pc + "30", padding: "16px 24px" }}>
                    <span style={{ fontSize: "9px", letterSpacing: "3px", color: pc, fontFamily: font.heading, fontWeight: 600 }}>{phaseLabels[day.phase]}</span>
                    <div style={{ fontSize: "17px", color: "#e8eaf6", marginTop: "4px", fontFamily: font.body, fontWeight: 700 }}>{day.label}</div>
                  </div>
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", gap: "7px", marginBottom: "22px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px", flexWrap: "wrap" }}>
                      {[{id:"schedule",label:"⏱ Schedule"},{id:"hydration",label:"💧 Hydration"},{id:"food",label:"🍽 Food"},{id:"tips",label:"💡 Tips"},{id:"extras",label:"✨ Extras"}].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={pillBtn(activeTab === tab.id, pc)}>{tab.label}</button>
                      ))}
                    </div>
                    {activeTab === "schedule" && (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                          {[{icon:"😴",label:"Target Bedtime",val:formatTime12(day.sleep)},{icon:"⏰",label:"Target Wake",val:formatTime12(day.wake)},{icon:"☀️",label:"Seek Bright Light",val:formatTime12(day.lightExposure.start)+" – "+formatTime12(day.lightExposure.end)},{icon:"🕶️",label:"Avoid Light After",val:formatTime12(day.avoidLight)},{icon:"☕",label:"Last Caffeine",val:formatTime12(day.caffeineCutoff)},{icon:"🌙",label:"Melatonin (if needed)",val:"30 min before "+formatTime12(day.sleep)}].map(({icon,label,val}) => (
                            <div key={label} style={{ ...miniCard(pc), padding: "12px 14px" }}>
                              <div style={{ fontSize: "22px", marginBottom: "5px" }}>{icon}</div>
                              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.38)", fontFamily: font.heading, marginBottom: "4px" }}>{label.toUpperCase()}</div>
                              <div style={{ fontSize: "14px", color: "#e8eaf6", fontFamily: font.body, fontWeight: 700 }}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.32)", fontFamily: font.heading, marginBottom: "10px" }}>SUGGESTED MEAL TIMES</div>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {[{label:"Breakfast",time:day.meals.breakfast},{label:"Lunch",time:day.meals.lunch},{label:"Dinner",time:day.meals.dinner}].map(({ label, time }) => (
                              <div key={label} style={{ background: "rgba(8,12,45,0.55)", border: "1px solid " + pc + "35", borderRadius: "50px", padding: "7px 18px", display: "inline-flex", gap: "6px", alignItems: "center" }}>
                                <span style={{ color: "rgba(255,255,255,0.45)", fontFamily: font.body, fontSize: "13px" }}>{label}:</span>
                                <span style={{ color: "#e8eaf6", fontFamily: font.body, fontWeight: 700, fontSize: "13px" }}>{formatTime12(time)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}                    {activeTab === "hydration" && day.hydration && (
                      <div>
                        <div style={miniCard("#38bdf8")}><div style={{ fontSize: "9px", letterSpacing: "3px", color: "#38bdf8", fontFamily: font.heading, fontWeight: 600, marginBottom: "8px" }}>💧 WATER TARGET</div><div style={{ fontSize: "14px", color: "#e8eaf6", lineHeight: "1.6", fontFamily: font.body }}>{day.hydration.water}</div></div>
                        <div style={miniCard("#38bdf8")}><div style={{ fontSize: "9px", letterSpacing: "3px", color: "#38bdf8", fontFamily: font.heading, fontWeight: 600, marginBottom: "8px" }}>⚡ ELECTROLYTES</div><div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: "1.6", fontFamily: font.body }}>{day.hydration.electrolytes}</div><div style={{ marginTop: "6px", fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: font.body }}>Key minerals: sodium, potassium, magnesium</div></div>
                        <div style={miniCard("#f87171")}><div style={{ fontSize: "9px", letterSpacing: "3px", color: "#f87171", fontFamily: font.heading, fontWeight: 600, marginBottom: "8px" }}>🚫 AVOID</div>{day.hydration.avoid.map((item, idx) => (<div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "rgba(255,255,255,0.65)", fontFamily: font.body }}><span style={{ color: "#f87171", flexShrink: 0 }}>✕</span>{item}</div>))}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", lineHeight: "1.7", padding: "8px 0", fontFamily: font.body }}><strong style={{ color: "rgba(255,255,255,0.5)" }}>Note:</strong> {day.hydration.note}</div>
                      </div>
                    )}
                    {activeTab === "food" && day.foodGuidance && (
                      <div>
                        <div style={miniCard("#4dd9ac")}><div style={{ fontSize: "9px", letterSpacing: "3px", color: "#4dd9ac", fontFamily: font.heading, fontWeight: 600, marginBottom: "8px" }}>✅ EAT / DRINK</div>{day.foodGuidance.eat.map((item, idx) => (<div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: "1.5", fontFamily: font.body }}><span style={{ color: "#4dd9ac", flexShrink: 0 }}>→</span>{item}</div>))}</div>
                        <div style={miniCard("#f87171")}><div style={{ fontSize: "9px", letterSpacing: "3px", color: "#f87171", fontFamily: font.heading, fontWeight: 600, marginBottom: "8px" }}>🚫 AVOID</div>{day.foodGuidance.avoid.map((item, idx) => (<div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "rgba(255,255,255,0.65)", fontFamily: font.body }}><span style={{ color: "#f87171", flexShrink: 0 }}>✕</span>{item}</div>))}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", lineHeight: "1.7", padding: "8px 0", fontFamily: font.body }}><strong style={{ color: "rgba(255,255,255,0.5)" }}>Why it matters:</strong> {day.foodGuidance.note}</div>
                      </div>
                    )}
                    {activeTab === "tips" && (
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {day.tips.map((tip, i) => (
                          <li key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px", fontSize: "14px", color: "rgba(255,255,255,0.72)", lineHeight: "1.65", fontFamily: font.body }}>
                            <span style={{ color: pc, flexShrink: 0, fontSize: "16px", marginTop: "1px" }}>→</span>{tip}
                          </li>
                        ))}
                      </ul>
                    )}
                    {activeTab === "extras" && (() => {
                      const extras = [
                        { icon: "🏃", title: "Exercise Timing", color: "#fb923c", items: day.phase === "pre" ? ["Light morning exercise reinforces your wake-time cues", "Avoid intense workouts within 3 hours of target bedtime", "Short outdoor walk combines light exposure + movement — double benefit"] : day.phase === "travel" ? ["Walk the aisle every 1–2 hours to improve circulation", "Stretch in your seat — ankle circles, shoulder rolls, gentle twists", "Avoid intense exercise on travel day"] : ["Morning exercise in local sunlight is one of the strongest circadian anchors", "Light aerobic activity (walking, easy jog) is best for days 1–2", "Avoid exercise within 2–3 hours of target bedtime"], note: "Morning movement outdoors compounds the light benefit and boosts alertness without disrupting sleep." },
                        { icon: "🌡️", title: "Temperature Therapy", color: "#38bdf8", items: day.phase === "pre" ? ["Keep bedroom cool 65–68°F (18–20°C) to initiate sleep", "Warm bath 1–2 hours before bed triggers the temperature-drop response"] : day.phase === "travel" ? ["Use a blanket if sleeping, remove layers if staying alert", "A cool damp cloth on face and neck counters drowsiness"] : ["Set hotel thermostat to 65–68°F for sleep", "Brief cold shower in the morning replicates the natural cortisol spike", "Warm bath 60–90 min before bedtime aids sleep onset"], note: "Cool = sleep mode. Warm = wake mode. Use temperature strategically." },
                        { icon: "😌", title: "Stress & Mental Reset", color: "#b48ef7", items: day.phase === "pre" ? ["Reduce pre-trip stress — cortisol disrupts sleep and worsens jet lag", "Avoid late-night screens; blue light suppresses melatonin for 1–3 hours", "Pack familiar scents or a pillow — sensory cues improve sleep in new places"] : day.phase === "travel" ? ["Use noise-canceling headphones — sound is the #1 cause of poor in-flight sleep", "Eye mask plus neck pillow for sleep", "Box breathing (4 in, hold 4, out 4, hold 4) helps you fall asleep"] : ["Commit to local time — avoid checking home time zone on your phone", "5–10 min deep breathing before bed overrides the wrong-timezone feeling", "Familiar scents (lavender, your usual lotion) cue sleep in unfamiliar rooms"], note: "Stress hormones actively fight your sleep signals. Managing them is as important as managing light." },
                        { icon: "🧳", title: "Gear & Preparation", color: "#4dd9ac", items: day.phase === "pre" ? ["Pack: sleep mask, earplugs, neck pillow, electrolyte packets, melatonin", "Download offline entertainment to control alert vs. wind-down timing", "Consider blue-light blocking glasses for evenings before your flight"] : day.phase === "travel" ? ["Blue-light blocking glasses during destination evening hours on the plane", "Foot hammock attachments reduce leg pressure on long-haul flights", "Compression socks reduce DVT risk — put on before boarding"] : ["Blackout curtains or sleep mask — hotel rooms are often too bright", "White noise app or travel fan masks hotel noise", "Set your phone to destination time and do not check home time zone"], note: "Small physical tools meaningfully improve sleep quality both in-flight and at your destination." },
                      ];
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {extras.map(({ icon, title, color, items, note }) => (
                            <div key={title} style={miniCard(color)}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                <span style={{ fontSize: "20px" }}>{icon}</span>
                                <div style={{ fontSize: "9px", letterSpacing: "3px", color, fontFamily: font.heading, fontWeight: 600 }}>{title.toUpperCase()}</div>
                              </div>
                              {items.map((item, idx) => (<div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "rgba(255,255,255,0.68)", lineHeight: "1.5", fontFamily: font.body }}><span style={{ color, flexShrink: 0 }}>→</span>{item}</div>))}
                              <div style={{ marginTop: "10px", fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.6", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "8px", fontFamily: font.body }}>{note}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
            <div style={{ marginTop: "16px", padding: "14px 18px", background: "rgba(8,12,45,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.7", fontFamily: font.body }}>
              <strong style={{ color: "rgba(255,255,255,0.5)" }}>Science note:</strong> Light exposure is the primary driver of circadian clock resets. Seek bright outdoor light at the times shown and avoid it before sleep. Melatonin (0.5–3 mg) works best at low doses timed to your new bedtime.
            </div>
            <div style={{ textAlign: "center", marginTop: "14px", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "2px", fontFamily: font.heading }}>ARRIVEREADY · A CAPTURE ADVENTURE NOW TOOL</div>
          </div>
        )}
      </div>
    </div>
  );
}