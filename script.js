const MAX_METRIC = 100;
const TOTAL_ROUNDS = 5;

const crises = [
  {
    id: "r1-tech-lead",
    title: "Lead Developer Quits Before Launch",
    description:
      "Two days before your beta launch, your lead developer resigns unexpectedly. The team is rattled and critical deployment knowledge is undocumented.",
    choices: [
      {
        text: "Tell the team and customers the truth, delay launch one week, and document everything.",
        hint: "Build trust, spend cash, keep team aligned.",
        effects: { reputation: -4, cash: -12, morale: +8 },
        traits: { transparency: +2, risk: -1, empathy: +1, decisiveness: +1, prioritization: +2, ethics: +2 },
        flags: ["transparentDelay", "documentedHandoff"],
        feedback:
          "You chose transparency and structural repair. The delay hurt short-term optics and revenue, but your team feels respected and focused."
      },
      {
        text: "Announce launch is still on schedule and push everyone into weekend crunch.",
        hint: "Protect image now, gamble with burnout and quality.",
        effects: { reputation: +3, cash: +4, morale: -14 },
        traits: { transparency: -2, risk: +2, empathy: -2, decisiveness: +1, prioritization: -1, ethics: -1 },
        flags: ["burnoutSeed", "qualityRisk"],
        feedback:
          "You bought time in public perception and cash flow, but internally the team absorbed the shock through stress."
      },
      {
        text: "Hire an expensive emergency contractor and delegate authority to your engineering manager.",
        hint: "Fast containment with high cost.",
        effects: { reputation: +1, cash: -16, morale: +2 },
        traits: { transparency: 0, risk: +1, empathy: +1, decisiveness: +2, prioritization: +1, ethics: +1 },
        flags: ["contractorPatch"],
        feedback:
          "You triaged quickly by paying for expertise. The fire is controlled, but your runway shrank."
      }
    ]
  },
  {
    id: "r2-outage-demo",
    title: "Server Outage During Enterprise Demo",
    description:
      "During your largest client demo yet, production goes down for 40 minutes. The client CTO and your sales lead are waiting for an explanation.",
    choices: [
      {
        text: "Own the outage immediately, provide timeline updates, and offer a remediation plan.",
        hint: "Protect trust through transparency.",
        effects: { reputation: +3, cash: -5, morale: +2 },
        traits: { transparency: +2, risk: -1, empathy: +1, decisiveness: +1, prioritization: +2, ethics: +2 },
        flags: ["ownedOutage"],
        feedback:
          "You framed the outage as an accountability moment. The client stayed cautious but willing to continue."
      },
      {
        text: "Blame a cloud provider glitch and keep details internal.",
        hint: "Preserve optics, increase later exposure risk.",
        effects: { reputation: +1, cash: +1, morale: -4 },
        traits: { transparency: -2, risk: +1, empathy: -1, decisiveness: +1, prioritization: -1, ethics: -2 },
        flags: ["blamedExternal", "truthDebt"],
        feedback:
          "The room calmed for now, but your team knows the full story and trust became more fragile."
      },
      {
        text: "Pause the demo, pull senior staff into a war room, and recover before resuming.",
        hint: "Operationally strong, expensive interruption.",
        effects: { reputation: -1, cash: -8, morale: +5 },
        traits: { transparency: +1, risk: 0, empathy: +1, decisiveness: +2, prioritization: +2, ethics: +1 },
        flags: ["warRoomResponse"],
        feedback:
          "You prioritized operational quality under pressure. Confidence inside the team improved, despite cost."
      }
    ]
  },
  {
    id: "r3-leak-question",
    title: "Journalist Asks About Possible Data Leak",
    description:
      "A tech journalist contacts you with user screenshots suggesting a data exposure. They will publish in 24 hours.",
    choices: [
      {
        text: "Publish a transparent incident note, notify affected users, and open support channels.",
        hint: "Short-term reputational hit, long-term credibility.",
        effects: { reputation: -3, cash: -10, morale: +4 },
        traits: { transparency: +3, risk: 0, empathy: +2, decisiveness: +1, prioritization: +2, ethics: +3 },
        flags: ["fullDisclosure"],
        feedback:
          "You led with accountability. The story hurt today, but customers and staff saw principled leadership."
      },
      {
        text: "Issue a vague statement and wait for legal guidance before saying more.",
        hint: "Contain legal risk now, possibly erode trust.",
        effects: { reputation: -1, cash: -4, morale: -3 },
        traits: { transparency: -1, risk: -1, empathy: -1, decisiveness: -1, prioritization: 0, ethics: -1 },
        flags: ["slowComms"],
        feedback:
          "You reduced immediate legal exposure, but ambiguity made both customers and staff uneasy."
      },
      {
        text: "Aggressively deny the leak and threaten legal action against publication.",
        hint: "High-risk defensive move.",
        effects: { reputation: +2, cash: -2, morale: -6 },
        traits: { transparency: -3, risk: +3, empathy: -2, decisiveness: +1, prioritization: -2, ethics: -3 },
        flags: ["aggressiveDenial", "reputationTimeBomb"],
        feedback:
          "You projected strength, but the team fears this could backfire if evidence expands."
      }
    ]
  },
  {
    id: "r4-investor-burnout",
    title: "Investor Payment Delay + Burnout Signals",
    description:
      "Your expected investor tranche is delayed 30 days, while burnout complaints spike. You can’t fully solve both at once.",
    choices: [
      {
        text: "Freeze noncritical spend, hold an all-hands, and protect workload boundaries.",
        hint: "Cash discipline with culture support.",
        effects: { reputation: +1, cash: +7, morale: +6 },
        traits: { transparency: +2, risk: -1, empathy: +2, decisiveness: +1, prioritization: +3, ethics: +2 },
        flags: ["cultureStabilized"],
        feedback:
          "You made hard financial cuts while signaling human limits. Team trust rose even in uncertainty."
      },
      {
        text: "Push one more sprint and promise bonuses once funding clears.",
        hint: "Possible cash bridge, high morale risk.",
        effects: { reputation: +2, cash: +5, morale: -12 },
        traits: { transparency: -1, risk: +2, empathy: -2, decisiveness: +2, prioritization: -1, ethics: -1 },
        flags: ["bonusPromise", "burnoutPeak"],
        feedback:
          "You bought near-term output, but exhaustion deepened and promises now carry execution pressure."
      },
      {
        text: "Seek emergency bridge financing and delegate wellness planning to HR.",
        hint: "External risk with moderate morale relief.",
        effects: { reputation: -1, cash: +10, morale: +1 },
        traits: { transparency: 0, risk: +2, empathy: +1, decisiveness: +1, prioritization: +1, ethics: +1 },
        flags: ["bridgeLoan"],
        feedback:
          "You preserved runway through financing risk while spreading leadership load across the team."
      }
    ]
  },
  {
    id: "r5-client-public",
    title: "Angry Client + Controversial Public Post",
    description:
      "A major client threatens to churn after missed deadlines, and an old founder post resurfaced online, triggering backlash.",
    choices: [
      {
        text: "Apologize publicly, meet the client directly, and commit to measurable fixes.",
        hint: "Repair trust through humility and execution.",
        effects: { reputation: +4, cash: -5, morale: +3 },
        traits: { transparency: +2, risk: 0, empathy: +2, decisiveness: +1, prioritization: +2, ethics: +2 },
        flags: ["trustRebuild"],
        feedback:
          "You chose credible repair over image defense. Recovery is slower, but foundation quality improved."
      },
      {
        text: "Offer deep discounts privately and ignore the public controversy.",
        hint: "Save account short-term, weak external narrative.",
        effects: { reputation: -5, cash: -8, morale: -2 },
        traits: { transparency: -1, risk: -1, empathy: 0, decisiveness: +1, prioritization: -1, ethics: -1 },
        flags: ["quietDiscount"],
        feedback:
          "You reduced immediate churn risk but signaled inconsistency between public and private leadership."
      },
      {
        text: "Go on offense online and blame unrealistic client expectations.",
        hint: "High-risk posture with potential morale split.",
        effects: { reputation: -10, cash: +1, morale: -6 },
        traits: { transparency: -2, risk: +3, empathy: -3, decisiveness: +2, prioritization: -2, ethics: -3 },
        flags: ["publicFight"],
        feedback:
          "You asserted control in public, but reputation volatility surged and internal confidence weakened."
      }
    ]
  }
];

const delayedRules = [
  {
    round: 2,
    ifFlag: "qualityRisk",
    text: "Because you pushed speed over quality in Round 1, unresolved defects amplified this outage.",
    effects: { reputation: -4, cash: -6, morale: -2 },
    turningPoint: "Early quality shortcuts increased outage damage in Round 2."
  },
  {
    round: 2,
    ifFlag: "documentedHandoff",
    text: "Your earlier documentation effort helped engineers isolate the failure faster.",
    effects: { cash: +4, morale: +2 },
    turningPoint: "Investing in documentation reduced later operational cost."
  },
  {
    round: 3,
    ifFlag: "blamedExternal",
    text: "Because you downplayed responsibility earlier, journalists now scrutinize your credibility more aggressively.",
    effects: { reputation: -6 },
    turningPoint: "Deflecting blame in Round 2 damaged media trust in Round 3."
  },
  {
    round: 3,
    ifFlag: "transparentDelay",
    text: "Your earlier transparency with staff made crisis communication smoother this week.",
    effects: { morale: +4 },
    turningPoint: "Transparency early preserved team cohesion under public pressure."
  },
  {
    round: 4,
    ifFlag: "burnoutSeed",
    text: "The earlier crunch culture has compounded. Burnout complaints are now severe.",
    effects: { morale: -8, reputation: -2 },
    turningPoint: "Unmanaged crunch in Round 1 escalated into a morale crisis."
  },
  {
    round: 4,
    ifFlag: "fullDisclosure",
    text: "Your honest handling of incident communications retained customer goodwill.",
    effects: { reputation: +5 },
    turningPoint: "Ethical disclosure created reputational buffer later."
  },
  {
    round: 5,
    ifFlag: "bonusPromise",
    text: "Because bonus promises are still unresolved, frustration resurfaces during client pressure.",
    effects: { morale: -5 },
    turningPoint: "Deferred compensation promises worsened final-round team stress."
  },
  {
    round: 5,
    ifFlag: "reputationTimeBomb",
    text: "Your earlier aggressive denials were fact-checked and publicly challenged.",
    effects: { reputation: -8, cash: -4 },
    turningPoint: "Defensive messaging strategy triggered a late reputational shock."
  },
  {
    round: 5,
    ifFlag: "cultureStabilized",
    text: "Your culture reset gave the team resilience when client tensions spiked.",
    effects: { morale: +6 },
    turningPoint: "Protecting workload boundaries sustained execution in the final crisis."
  }
];

const state = {
  round: 1,
  metrics: { reputation: 60, cash: 60, morale: 60 },
  flags: new Set(),
  traits: {
    transparency: 0,
    risk: 0,
    empathy: 0,
    decisiveness: 0,
    prioritization: 0,
    ethics: 0
  },
  history: [],
  turningPoints: [],
  pendingChoice: null,
  gameOver: false,
  result: null
};

const el = {
  startScreen: document.getElementById("start-screen"),
  gameScreen: document.getElementById("game-screen"),
  endScreen: document.getElementById("end-screen"),
  startBtn: document.getElementById("start-btn"),
  howBtn: document.getElementById("how-btn"),
  howPanel: document.getElementById("how-panel"),
  roundLabel: document.getElementById("round-label"),
  companyState: document.getElementById("company-state"),
  repValue: document.getElementById("rep-value"),
  cashValue: document.getElementById("cash-value"),
  moraleValue: document.getElementById("morale-value"),
  repBar: document.getElementById("rep-bar"),
  cashBar: document.getElementById("cash-bar"),
  moraleBar: document.getElementById("morale-bar"),
  crisisTitle: document.getElementById("crisis-title"),
  crisisDescription: document.getElementById("crisis-description"),
  carryoverNote: document.getElementById("carryover-note"),
  choicesContainer: document.getElementById("choices-container"),
  feedbackCard: document.getElementById("feedback-card"),
  feedbackText: document.getElementById("feedback-text"),
  feedbackDelta: document.getElementById("feedback-delta"),
  feedbackTitle: document.getElementById("feedback-title"),
  continueBtn: document.getElementById("continue-btn"),
  endTitle: document.getElementById("end-title"),
  endSummary: document.getElementById("end-summary"),
  finalMetrics: document.getElementById("final-metrics"),
  leadershipProfile: document.getElementById("leadership-profile"),
  decisionHistory: document.getElementById("decision-history"),
  turningPoints: document.getElementById("turning-points"),
  reflection: document.getElementById("reflection"),
  restartBtn: document.getElementById("restart-btn")
};

function clamp(value) {
  return Math.max(0, Math.min(MAX_METRIC, value));
}

function metricDeltaText(deltaObj) {
  return Object.entries(deltaObj)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => {
      const label = key[0].toUpperCase() + key.slice(1);
      const sign = value > 0 ? "+" : "";
      return `${label} ${sign}${value}`;
    })
    .join(" • ");
}

function applyEffects(effects) {
  const applied = { reputation: 0, cash: 0, morale: 0 };
  for (const metric of Object.keys(state.metrics)) {
    const change = effects?.[metric] ?? 0;
    if (change !== 0) {
      state.metrics[metric] = clamp(state.metrics[metric] + change);
      applied[metric] = change;
    }
  }
  return applied;
}

function applyTraits(traits) {
  for (const [trait, change] of Object.entries(traits || {})) {
    state.traits[trait] += change;
  }
}

function applyFlags(flags) {
  (flags || []).forEach((flag) => state.flags.add(flag));
}

function checkCollapse() {
  for (const [key, value] of Object.entries(state.metrics)) {
    if (value <= 0) {
      state.gameOver = true;
      state.result = "loss";
      el.companyState.textContent = "Startup Collapsed";
      return key;
    }
  }
  return null;
}

function updateMetricUI() {
  el.repValue.textContent = state.metrics.reputation;
  el.cashValue.textContent = state.metrics.cash;
  el.moraleValue.textContent = state.metrics.morale;

  el.repBar.style.width = `${state.metrics.reputation}%`;
  el.cashBar.style.width = `${state.metrics.cash}%`;
  el.moraleBar.style.width = `${state.metrics.morale}%`;

  if (!state.gameOver) {
    const lowest = Math.min(...Object.values(state.metrics));
    el.companyState.textContent = lowest < 25 ? "Critical" : lowest < 45 ? "Fragile" : "Startup Live";
  }
}

function getRoundCrisis() {
  return crises[state.round - 1];
}

function processDelayedConsequences() {
  const rules = delayedRules.filter((rule) => rule.round === state.round && state.flags.has(rule.ifFlag));
  if (!rules.length) {
    el.carryoverNote.classList.add("hidden");
    el.carryoverNote.textContent = "";
    return;
  }

  const notes = [];
  for (const rule of rules) {
    applyEffects(rule.effects);
    state.turningPoints.push(rule.turningPoint);
    notes.push(`${rule.text} (${metricDeltaText(rule.effects)})`);
  }

  el.carryoverNote.classList.remove("hidden");
  el.carryoverNote.textContent = notes.join(" ");
}

function renderRound() {
  if (state.round > TOTAL_ROUNDS) {
    state.result = "win";
    finishGame();
    return;
  }

  el.roundLabel.textContent = `Round ${state.round} of ${TOTAL_ROUNDS}`;
  updateMetricUI();

  const crisis = getRoundCrisis();
  el.crisisTitle.textContent = crisis.title;
  el.crisisDescription.textContent = crisis.description;

  el.choicesContainer.innerHTML = "";
  crisis.choices.forEach((choice, idx) => {
    const button = document.createElement("button");
    button.className = "btn choice-btn";
    button.innerHTML = `<strong>${idx + 1}. ${choice.text}</strong><small>${choice.hint}</small>`;
    button.addEventListener("click", () => selectChoice(choice));
    el.choicesContainer.appendChild(button);
  });

  processDelayedConsequences();

  const collapsedMetric = checkCollapse();
  updateMetricUI();
  if (collapsedMetric) {
    state.turningPoints.push(`A compounded crisis drove ${collapsedMetric} to zero in Round ${state.round}.`);
    finishGame();
  }
}

function selectChoice(choice) {
  if (state.pendingChoice || state.gameOver) return;
  state.pendingChoice = choice;

  const effects = applyEffects(choice.effects);
  applyTraits(choice.traits);
  applyFlags(choice.flags);

  state.history.push({
    round: state.round,
    crisis: getRoundCrisis().title,
    action: choice.text,
    impact: effects
  });

  if (checkCollapse()) {
    state.turningPoints.push(`Your Round ${state.round} decision exhausted a core metric.`);
  }

  updateMetricUI();
  showImmediateFeedback(choice, effects);
}

function showImmediateFeedback(choice, effects) {
  el.feedbackTitle.textContent = `Round ${state.round} Result`;
  el.feedbackText.textContent = choice.feedback;
  el.feedbackDelta.textContent = metricDeltaText(effects) || "No direct metric change.";
  el.feedbackCard.classList.remove("hidden");

  const allChoiceButtons = document.querySelectorAll(".choice-btn");
  allChoiceButtons.forEach((button) => {
    button.disabled = true;
    button.style.opacity = "0.75";
  });

  el.continueBtn.focus();
}

function nextStep() {
  el.feedbackCard.classList.add("hidden");
  state.pendingChoice = null;

  if (state.gameOver) {
    finishGame();
    return;
  }

  state.round += 1;
  renderRound();
}

function profileText() {
  const t = state.traits;

  const transparency = t.transparency >= 5 ? "high-transparency" : t.transparency <= -3 ? "opaque" : "situationally transparent";
  const risk = t.risk >= 5 ? "bold risk-taker" : t.risk <= -3 ? "risk-averse" : "calibrated risk manager";
  const empathy = t.empathy >= 4 ? "people-centered" : t.empathy <= -3 ? "hardline" : "mixed-empathy";
  const ethics = t.ethics >= 4 ? "ethics-forward" : t.ethics <= -3 ? "ethically strained" : "pragmatic";

  return `You operated as a ${transparency}, ${risk}, ${empathy} founder with a ${ethics} decision pattern. Your prioritization score finished at ${t.prioritization}, and decisiveness at ${t.decisiveness}.`;
}

function outcomeNarrative() {
  const { reputation, cash, morale } = state.metrics;
  const avg = (reputation + cash + morale) / 3;

  if (state.result === "loss") {
    if (cash <= 0) return "Runway collapsed before your strategy stabilized. Operational choices outpaced financial resilience.";
    if (morale <= 0) return "Execution capacity failed as morale collapsed. The startup lost its ability to absorb pressure.";
    return "External trust deteriorated faster than your recovery plan, and the company lost market confidence.";
  }

  if (avg >= 70) {
    return "You exited Crisis Mode with a resilient company, strong trust signals, and a team still able to execute under strain.";
  }
  if (avg >= 50) {
    return "You survived a turbulent cycle through imperfect trade-offs. The company remains viable but strategically fragile.";
  }
  return "You survived by inches. The startup is still standing, but unresolved debt in trust, culture, or runway requires immediate follow-through.";
}

function finishGame() {
  showScreen("end");
  updateMetricUI();

  el.endTitle.textContent = state.result === "win" ? "You Survived Crisis Mode" : "Startup Collapse";
  el.endSummary.textContent = outcomeNarrative();

  el.finalMetrics.innerHTML = [
    `Reputation: ${state.metrics.reputation}/100`,
    `Cash: ${state.metrics.cash}/100`,
    `Team Morale: ${state.metrics.morale}/100`
  ].map((item) => `<li>${item}</li>`).join("");

  el.leadershipProfile.textContent = profileText();

  el.decisionHistory.innerHTML = state.history
    .map((entry) => `<li><strong>Round ${entry.round}:</strong> ${entry.action} <em>(${metricDeltaText(entry.impact)})</em></li>`)
    .join("");

  const points = state.turningPoints.length
    ? state.turningPoints
    : ["No major delayed effects were triggered. Your choices contained most crises directly."];

  el.turningPoints.innerHTML = points.map((point) => `<li>${point}</li>`).join("");
}

function showScreen(screen) {
  el.startScreen.classList.remove("active");
  el.gameScreen.classList.remove("active");
  el.endScreen.classList.remove("active");

  if (screen === "start") el.startScreen.classList.add("active");
  if (screen === "game") el.gameScreen.classList.add("active");
  if (screen === "end") el.endScreen.classList.add("active");
}

function resetState() {
  state.round = 1;
  state.metrics = { reputation: 60, cash: 60, morale: 60 };
  state.flags = new Set();
  state.traits = {
    transparency: 0,
    risk: 0,
    empathy: 0,
    decisiveness: 0,
    prioritization: 0,
    ethics: 0
  };
  state.history = [];
  state.turningPoints = [];
  state.pendingChoice = null;
  state.gameOver = false;
  state.result = null;

  el.feedbackCard.classList.add("hidden");
  el.carryoverNote.classList.add("hidden");
  el.reflection && (el.reflection.value = "");
}

el.startBtn.addEventListener("click", () => {
  resetState();
  showScreen("game");
  renderRound();
});

el.howBtn.addEventListener("click", () => {
  const expanded = el.howBtn.getAttribute("aria-expanded") === "true";
  el.howBtn.setAttribute("aria-expanded", String(!expanded));
  el.howPanel.hidden = expanded;
});

el.continueBtn.addEventListener("click", nextStep);
el.restartBtn.addEventListener("click", () => showScreen("start"));

document.addEventListener("keydown", (event) => {
  if (!el.gameScreen.classList.contains("active")) return;
  if (state.pendingChoice || state.gameOver) return;

  if (["1", "2", "3"].includes(event.key)) {
    const idx = Number(event.key) - 1;
    const crisis = getRoundCrisis();
    if (crisis?.choices[idx]) selectChoice(crisis.choices[idx]);
  }
});

showScreen("start");
