
/* ═══════════════════════════════════════════════════════════
   KNOWLEDGE BASE — Belgium Campus IT Programmes
   Source: belgiumcampus.ac.za (public information)
═══════════════════════════════════════════════════════════ */
const KNOWLEDGE_BASE = {
  programmes: [
    {
      id: "bsc-it",
      name: "BSc Information Technology",
      type: "Degree",
      level: "HEQSF 7",
      duration: "3 years",
      aps: 26,
      mathsRequired: true,
      minMathsLevel: 4,
      minEnglishLevel: 4,
      specialisations: ["Software Development", "Networking", "Data Science"],
      careers: ["Software Developer", "Systems Analyst", "IT Manager", "Data Scientist"],
      description: "A comprehensive undergraduate degree covering programming, networking, databases, and software engineering.",
      keywords: ["degree", "bsc", "bachelor", "software", "programming", "development", "university"]
    },
    {
      id: "dip-it",
      name: "Diploma in IT",
      type: "Diploma",
      level: "HEQSF 6",
      duration: "3 years",
      aps: 22,
      mathsRequired: true,
      minMathsLevel: 3,
      minEnglishLevel: 4,
      specialisations: ["Software Development", "Networking", "Systems Support"],
      careers: ["Junior Developer", "IT Technician", "Network Administrator", "Systems Support"],
      description: "A practical, industry-focused diploma with strong emphasis on hands-on technical skills.",
      keywords: ["diploma", "it", "technical", "practical", "network", "support"]
    },
    {
      id: "hcd-it",
      name: "Higher Certificate in IT",
      type: "Certificate",
      level: "HEQSF 5",
      duration: "1 year",
      aps: 16,
      mathsRequired: false,
      minMathsLevel: 2,
      minEnglishLevel: 3,
      specialisations: ["End-User Computing", "IT Support"],
      careers: ["IT Support Technician", "Help Desk Agent", "PC Technician"],
      description: "An entry-level qualification that opens the door to IT studies and employment.",
      keywords: ["certificate", "higher certificate", "entry", "support", "beginner", "low aps"]
    },
    {
      id: "cert-it",
      name: "Short Learning Programmes",
      type: "Short Course",
      level: "HEQSF 4–5",
      duration: "3–6 months",
      aps: 0,
      mathsRequired: false,
      minMathsLevel: 0,
      minEnglishLevel: 0,
      specialisations: ["Cybersecurity", "Cloud Computing", "Coding Bootcamp", "Microsoft 365"],
      careers: ["Security Analyst", "Cloud Practitioner", "Junior Coder"],
      description: "Focused short courses for rapid skill acquisition, many with industry certifications.",
      keywords: ["short course", "bootcamp", "cybersecurity", "cloud", "microsoft", "cisco", "fast", "quick"]
    },
    {
      id: "post-grad",
      name: "Postgraduate Diploma in IT",
      type: "Postgrad",
      level: "HEQSF 8",
      duration: "1 year",
      aps: 0,
      prereq: "Relevant degree or diploma",
      specialisations: ["IT Management", "Advanced Software Development"],
      careers: ["IT Manager", "Solutions Architect", "Technical Lead"],
      description: "An advanced qualification for graduates looking to specialise or move into management.",
      keywords: ["postgrad", "advanced", "management", "graduate", "masters"]
    }
  ],

  careers: {
    "Software Developer": { demand: "Very High", avgSalary: "R25 000–R60 000/month", skills: ["Programming", "Databases", "APIs"], path: "BSc IT or Diploma IT" },
    "Cybersecurity Analyst": { demand: "High", avgSalary: "R30 000–R70 000/month", skills: ["Networking", "Security", "Ethical Hacking"], path: "BSc IT + Cybersecurity short course" },
    "Data Scientist": { demand: "Very High", avgSalary: "R40 000–R90 000/month", skills: ["Python", "ML", "Statistics"], path: "BSc IT + Data specialisation" },
    "Network Administrator": { demand: "High", avgSalary: "R18 000–R40 000/month", skills: ["Cisco", "Networking", "Cloud"], path: "Diploma IT" },
    "IT Support Technician": { demand: "High", avgSalary: "R8 000–R20 000/month", skills: ["Hardware", "Windows", "Help Desk"], path: "Higher Certificate IT" }
  }
};

/* ═══════════════════════════════════════════════════════════
   RULE ENGINE — Pattern matching & intent classification
═══════════════════════════════════════════════════════════ */
const RuleEngine = {
  patterns: [
    { intent: "greeting", regex: /^(hi|hello|hey|good morning|good day|howzit|sup)\b/i },
    { intent: "course_list", regex: /what.*courses|courses.*offer|list.*courses|all.*programmes|what.*offer|qualifications available/i },
    { intent: "diploma_vs_degree", regex: /diploma.*degree|degree.*diploma|difference between|which is better|diploma or degree/i },
    { intent: "career_paths", regex: /career|job|work|salary|earn|employment|after studying|after i graduate/i },
    { intent: "career_inquiry", regex: /what does .* do|how do i become .*|tell me about .*|role of .*|what is a .*|career as .*|job as .*|become .*|how to become .*/i },
    { intent: "cybersecurity", regex: /cybersecurity|cyber security|hacking|ethical hacking|security/i },
    { intent: "learnership", regex: /learnership|internship|bursary|funding|fees|financial aid|seta/i },
    { intent: "online_study", regex: /online|distance|part.time|work and study|remote/i },
    { intent: "requirements", regex: /requirements|matric subjects|what subjects|admission|entry requirements|do i need/i },
    { intent: "aps_query", regex: /my score|how many points|aps of (\d+)|i have (\d+) aps/i },
    { intent: "specific_aps", regex: /(\d{2})\s*aps|aps\s*(?:of\s*|score\s*(?:is\s*|=\s*)?)(\d{2})/i }
  ],

  classify(text) {
    for (const { intent, regex } of this.patterns) {
      const m = text.match(regex);
      if (m) {
        if (intent === "career_inquiry") {
          const career = this.extractCareer(text);
          return { intent, match: career ? [career] : m };
        }
        return { intent, match: m };
      }
    }
    return { intent: "general", match: null };
  },

  extractCareer(text) {
    const lower = text.toLowerCase();
    for (const career of Object.keys(KNOWLEDGE_BASE.careers)) {
      if (lower.includes(career.toLowerCase())) return career;
    }
    return null;
  },

  extractAPS(text) {
    const m = text.match(/\b([1-9]\d)\b/);
    return m ? parseInt(m[1]) : null;
  }
};

/* ═══════════════════════════════════════════════════════════
   RECOMMENDATION ENGINE — APS-based course matching
═══════════════════════════════════════════════════════════ */
const RecommendationEngine = {
  score(programme, aps, mathsLevel, englishLevel) {
    let score = 0;
    const apsGap = aps - programme.aps;

    if (programme.type === "Short Course") return { score: 50, tier: "mid" };
    if (programme.type === "Postgrad") return { score: 0, tier: "low" };

    if (apsGap >= 6) score = 95;
    else if (apsGap >= 3) score = 82;
    else if (apsGap >= 0) score = 68;
    else if (apsGap >= -3) score = 45;
    else return { score: 10, tier: "low" };

    if (mathsLevel && mathsLevel >= programme.minMathsLevel + 1) score = Math.min(score + 5, 100);
    if (mathsLevel && mathsLevel < programme.minMathsLevel) score = Math.max(score - 20, 10);
    if (englishLevel && englishLevel < programme.minEnglishLevel) score = Math.max(score - 15, 10);

    const tier = score >= 75 ? "high" : score >= 50 ? "mid" : "low";
    return { score, tier };
  },

  recommend(aps, mathsLevel, englishLevel) {
    return KNOWLEDGE_BASE.programmes
      .map(p => ({ programme: p, ...this.score(p, aps, mathsLevel, englishLevel) }))
      .filter(r => r.score > 15)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }
};

/* ═══════════════════════════════════════════════════════════
   RESPONSE BUILDER — Rule-based structured responses
═══════════════════════════════════════════════════════════ */
const ResponseBuilder = {
  greeting() {
    return {
      text: "Hello! 👋 Welcome to BC CourseFinder. I'm here to help you find the right IT qualification at Belgium Campus.\n\nYou can:\n• Enter your Matric results above for instant course matching\n• Ask me about any IT programme, career path, or learnership\n• Ask about APS requirements, Diploma vs Degree, or Cybersecurity\n\nWhat would you like to know?",
      cards: null
    };
  },

  courseList() {
    return {
      text: "Belgium Campus offers the following IT qualifications:",
      cards: KNOWLEDGE_BASE.programmes.map(p => ({
        name: p.name,
        meta: `${p.type} · ${p.level} · ${p.duration}${p.aps > 0 ? ` · Min APS: ${p.aps}` : ''}`,
        score: p.aps > 0 ? Math.min(90, 40 + p.aps * 2) : 50,
        tier: p.type === "Degree" ? "high" : p.type === "Diploma" ? "mid" : "low",
        onclick: () => ask(`Tell me more about the ${p.name} at Belgium Campus`)
      }))
    };
  },

  diplomaVsDegree() {
    return {
      text: "Great question! Here's the key difference at Belgium Campus:\n\n📘 Diploma in IT (HEQSF 6)\n• 3 years, APS 22+, practical & industry-focused\n• Leads to: Junior Developer, Technician, Support roles\n• Great if you want to enter the workforce quickly\n\n🎓 BSc in Information Technology (HEQSF 7)\n• 3 years, APS 26+, academic & research-oriented\n• Leads to: Software Developer, Systems Analyst, IT Manager\n• Opens doors to postgraduate study (Honours, Masters)\n\n💡 Pro tip: If you're uncertain, the Diploma is a great starting point — you can often articulate to a degree later!",
      cards: null
    };
  },

  apsResult(aps, recommendations) {
    const tierLabel = { high: "Strong match", mid: "Possible match", low: "Conditional" };
    const tierIcon = { high: "✅", mid: "⚡", low: "📋" };
    return {
      text: `Based on your APS of ${aps}, here are your best-matched programmes at Belgium Campus:`,
      cards: recommendations.map(r => ({
        name: r.programme.name,
        meta: `${r.programme.type} · Min APS ${r.programme.aps > 0 ? r.programme.aps : 'None'} · ${r.programme.duration}`,
        score: r.score,
        tier: r.tier,
        matchLabel: `${tierIcon[r.tier]} ${tierLabel[r.tier]} — ${r.score}% fit`,
        onclick: () => ask(`Tell me more about the ${r.programme.name} and what career it leads to`)
      }))
    };
  },

  careers() {
    const entries = Object.entries(KNOWLEDGE_BASE.careers);
    return {
      text: "Here are some of the top IT career paths you can pursue after studying at Belgium Campus:",
      cards: entries.map(([career, info]) => ({
        name: career,
        meta: `Demand: ${info.demand} · ${info.avgSalary}`,
        score: info.demand === "Very High" ? 90 : 75,
        tier: info.demand === "Very High" ? "high" : "mid",
        matchLabel: `📚 Path: ${info.path}`,
        onclick: () => addMessage(ResponseBuilder.careerDetails(career), "bot")
      }))
    };
  },

  careerDetails(career) {
    const info = KNOWLEDGE_BASE.careers[career];
    if (!info) {
      return {
        text: `I don't have the details for ${career} right now, but I can still help you explore Belgium Campus IT career options.`,
        cards: null
      };
    }

    return {
      text: `A ${career} in South Africa typically:
• Demand: ${info.demand}
• Average salary: ${info.avgSalary}
• Key skills: ${info.skills.join(', ')}
• Recommended study path: ${info.path}

To become a ${career}, focus on building the skills above, get hands-on projects, and consider starting with the related Belgium Campus programme.`,
      cards: null
    };
  },

  learnership() {
    return {
      text: "Belgium Campus is linked with MICT SETA (Media, Information and Communication Technologies Sector Education and Training Authority).\n\n🎯 Options available:\n• SETA-funded learnerships (NQF 4–6) — fully sponsored\n• Belgium Campus bursaries for qualifying students\n• Work Integrated Learning (WIL) included in the Diploma & BSc\n• Industry partnerships with companies like Microsoft, Cisco, AWS\n\n💡 Visit belgiumcampus.ac.za/apply or call their admissions team for current learnership availability. Spaces are limited and often filled early in the year.",
      cards: null
    };
  },

  online() {
    return {
      text: "Belgium Campus offers both campus-based and online study options:\n\n💻 Online / Distance Learning:\n• Full Diploma and BSc available online\n• Flexible scheduling — ideal if you're working\n• Same HEQSF-accredited qualifications\n• Interactive online portal with live sessions\n\n🏛️ Campus (Johannesburg):\n• Face-to-face lectures and labs\n• Strong campus community & networking\n• Hardware labs, project rooms\n\nWhich mode suits your lifestyle?",
      cards: null
    };
  },

  requirements() {
    return {
      text: "General Matric requirements for Belgium Campus IT programmes:\n\n📋 BSc IT (APS 26+)\n• Mathematics: 50%+ (Level 4)\n• English HL/FAL: 50%+ (Level 4)\n• Any 4 other subjects\n\n📋 Diploma IT (APS 22+)\n• Mathematics: 40%+ (Level 3)\n• English HL/FAL: 50%+ (Level 4)\n\n📋 Higher Certificate (APS 16+)\n• No strict Maths requirement\n• English: 40%+ (Level 3)\n\n💡 Mathematical Literacy may be accepted for the Higher Certificate and some Diploma streams — confirm with admissions.",
      cards: null
    };
  },

  cybersecurity() {
    return {
      text: "Cybersecurity is one of the fastest-growing IT fields in South Africa! 🛡️\n\nAt Belgium Campus you can pursue Cybersecurity via:\n• BSc IT with a security focus\n• Short Learning Programmes in Cybersecurity\n• Industry certs like CompTIA Security+, CEH, CISSP\n\nMatric requirements:\n• Mathematics: Level 3+ (40%)\n• English: Level 4+ (50%)\n• APS: 22+ for degree path\n\n💼 Career outcomes:\n• Cybersecurity Analyst: R30 000–R70 000/month\n• Penetration Tester, SOC Analyst, Security Engineer\n\nSouth Africa faces a huge shortage of cybersecurity professionals — this is an excellent career choice!",
      cards: null
    };
  }
};

/* ═══════════════════════════════════════════════════════════
   AI ENGINE — Orchestrates rule engine + Claude API fallback
═══════════════════════════════════════════════════════════ */
const AIEngine = {
  conversationHistory: [],
  userContext: { aps: null, mathsLevel: null, englishLevel: null },

  systemPrompt: `You are BC CourseFinder™, an expert AI advisor for Belgium Campus iTversity in South Africa. You help Matric students and young adults find the right IT qualification for their goals and results.

ABOUT BELGIUM CAMPUS:
- Located in Johannesburg, South Africa
- Offers: BSc IT (HEQSF 7, APS 26+), Diploma IT (HEQSF 6, APS 22+), Higher Certificate IT (HEQSF 5, APS 16+), Short Learning Programmes, Postgrad Diploma
- Accredited by CHE (Council on Higher Education)
- Affiliated with MICT SETA for learnerships
- Microsoft, Cisco, AWS technology partners
- Both campus (Johannesburg) and online delivery
- Website: belgiumcampus.ac.za

APS SYSTEM (South Africa):
- APS = sum of 6 best subjects (excluding Life Orientation, which counts half)
- Levels: 7=80-100%, 6=70-79%, 5=60-69%, 4=50-59%, 3=40-49%, 2=30-39%, 1=0-29%

YOUR BEHAVIOUR:
- Be warm, encouraging, and specific — never vague
- Always relate advice to South African context (job market, SETA, NQF levels)
- Give concrete APS numbers, salary ranges, and career paths
- If a student seems uncertain, help them explore options without judgment
- Keep answers focused and practical — avoid walls of text
- Format with line breaks and emoji for readability
- Always encourage visiting belgiumcampus.ac.za for official/current info
- NEVER make up specific course codes, application dates, or exact fees — say to confirm with Belgium Campus`,

  async process(userText) {
    const { intent, match } = RuleEngine.classify(userText);
    const extractedAPS = RuleEngine.extractAPS(userText);

    // Store user context if APS found
    if (extractedAPS) this.userContext.aps = extractedAPS;

    // Rule-based fast-path responses
    const ruleResponse = this._ruleResponse(intent, match, userText, extractedAPS || this.userContext.aps);
    if (ruleResponse) return { source: "rule", ...ruleResponse };

    // Fall through to Claude API for complex or general queries
    return await this._callClaude(userText);
  },

  _ruleResponse(intent, match, text, aps) {
    switch (intent) {
      case "greeting": return ResponseBuilder.greeting();
      case "course_list": return ResponseBuilder.courseList();
      case "diploma_vs_degree": return ResponseBuilder.diplomaVsDegree();
      case "career_paths": return ResponseBuilder.careers();
      case "career_inquiry": return ResponseBuilder.careerDetails(match && match[0] ? match[0] : text);
      case "learnership": return ResponseBuilder.learnership();
      case "online_study": return ResponseBuilder.online();
      case "requirements": return ResponseBuilder.requirements();
      case "cybersecurity": return ResponseBuilder.cybersecurity();
      case "specific_aps":
      case "aps_query": {
        if (aps && aps >= 10 && aps <= 42) {
          const eng = this.userContext.englishLevel;
          const maths = this.userContext.mathsLevel;
          const recs = RecommendationEngine.recommend(aps, maths, eng);
          return ResponseBuilder.apsResult(aps, recs);
        }
        return null;
      }
      default: return null;
    }
  },

  async _callClaude(userText) {
    this.conversationHistory.push({ role: "user", content: userText });

    // Keep history manageable
    const recentHistory = this.conversationHistory.slice(-10);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: this.systemPrompt,
        messages: recentHistory
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "API error");

    const replyText = data.content.map(b => b.text || "").join("");
    this.conversationHistory.push({ role: "assistant", content: replyText });

    return { source: "claude", text: replyText, cards: null };
  }
};

/* ═══════════════════════════════════════════════════════════
   UI LAYER
═══════════════════════════════════════════════════════════ */
const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("send-btn");
const thinkingBadge = document.getElementById("thinking-badge");

inputEl.addEventListener("input", () => {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
});

inputEl.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

function makeAvatar(role) {
  const el = document.createElement("div");
  el.className = `avatar ${role}`;
  el.textContent = role === "bot" ? "BC" : "You";
  return el;
}

function addMessage(response, role) {
  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;

  if (role === "bot" && response && typeof response === "object") {
    // Format text with line breaks
    const textNode = document.createElement("div");
    textNode.style.whiteSpace = "pre-wrap";
    textNode.textContent = response.text;
    bubble.appendChild(textNode);

    // Render recommendation cards
    if (response.cards && response.cards.length > 0) {
      const cardsEl = document.createElement("div");
      cardsEl.className = "rec-cards";
      response.cards.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.className = "rec-card";
        if (typeof card.onclick === "function") {
          cardEl.onclick = card.onclick;
        } else {
          cardEl.onclick = () => eval(card.onclick);
        }

        const nameEl = document.createElement("div");
        nameEl.className = "rec-card-name";
        nameEl.textContent = card.name;

        const metaEl = document.createElement("div");
        metaEl.className = "rec-card-meta";
        metaEl.textContent = card.meta;

        cardEl.appendChild(nameEl);
        cardEl.appendChild(metaEl);

        if (card.matchLabel) {
          const pill = document.createElement("div");
          pill.className = `match-pill ${card.tier || "mid"}`;
          pill.textContent = card.matchLabel;
          cardEl.appendChild(pill);
        }

        if (card.score) {
          const bar = document.createElement("div");
          bar.className = "confidence-bar";
          const fill = document.createElement("div");
          fill.className = "confidence-fill";
          fill.style.width = "0%";
          bar.appendChild(fill);
          cardEl.appendChild(bar);
          setTimeout(() => { fill.style.width = card.score + "%"; }, 100);
        }

        cardsEl.appendChild(cardEl);
      });
      bubble.appendChild(cardsEl);
    }
  } else {
    bubble.style.whiteSpace = "pre-wrap";
    bubble.textContent = typeof response === "string" ? response : response.text;
  }

  if (role === "user") {
    row.appendChild(bubble);
    row.appendChild(makeAvatar(role));
  } else {
    row.appendChild(makeAvatar(role));
    row.appendChild(bubble);
  }

  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "typing-row"; row.id = "typing-row";
  row.appendChild(makeAvatar("bot"));
  const b = document.createElement("div"); b.className = "typing-bubble";
  b.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  row.appendChild(b);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById("typing-row");
  if (el) el.remove();
}

function showCourseList() {
  addMessage(ResponseBuilder.courseList(), "bot");
}

function showDiplomaVsDegree() {
  addMessage(ResponseBuilder.diplomaVsDegree(), "bot");
}

function showCareerPaths() {
  addMessage(ResponseBuilder.careers(), "bot");
}

function showLearnerships() {
  addMessage(ResponseBuilder.learnership(), "bot");
}

function showCybersecurity() {
  addMessage(ResponseBuilder.cybersecurity(), "bot");
}

function showOnlineStudy() {
  addMessage(ResponseBuilder.online(), "bot");
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, "user");
  inputEl.value = ""; inputEl.style.height = "auto";
  sendBtn.disabled = true;
  showTyping();
  thinkingBadge.classList.add("active");

  try {
    const response = await AIEngine.process(text);
    removeTyping();
    addMessage(response, "bot");
  } catch (err) {
    removeTyping();
    addMessage({ text: `Something went wrong: ${err.message}. Please try again.`, cards: null }, "bot");
  } finally {
    sendBtn.disabled = false;
    thinkingBadge.classList.remove("active");
    inputEl.focus();
  }
}

/* ═══════════════════════════════════════════════════════════
   APS CALCULATOR
═══════════════════════════════════════════════════════════ */
function calcAPS() {
  const ids = ["s-english", "s-maths", "s-sub3", "s-sub4", "s-sub5", "s-lo"];
  const vals = ids.map(id => parseInt(document.getElementById(id).value) || 0);
  const lo = vals.pop(); // LO counts half
  const total = vals.reduce((a, b) => a + b, 0) + Math.round(lo / 2);
  document.getElementById("aps-display").textContent = total > 0 ? total : "—";

  // Store in engine context
  AIEngine.userContext.aps = total > 0 ? total : null;
  AIEngine.userContext.englishLevel = parseInt(document.getElementById("s-english").value) || null;
  AIEngine.userContext.mathsLevel = parseInt(document.getElementById("s-maths").value) || null;
}

async function recommendFromAPS() {
  const aps = AIEngine.userContext.aps;
  if (!aps || aps < 6) {
    await ask("What courses can I study at Belgium Campus and what are the APS requirements?");
    return;
  }
  await ask(`My APS score is ${aps}. What IT courses at Belgium Campus would suit me?`);
}

/* ── Boot message ── */
setTimeout(() => {
  addMessage({
    text: "Hello! 👋 I'm the BC CourseFinder AI — your personalised guide to IT studies at Belgium Campus.\n\nEnter your Matric results above for instant course matching, or ask me anything about qualifications, careers, and study options.",
    cards: null
  }, "bot");
}, 400);
