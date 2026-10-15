// V21 — cinematic project showcase opening
const portfolioIntro = document.getElementById("portfolioIntro");
const introEnter = document.getElementById("introEnter");
const introSkip = document.getElementById("introSkip");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closePortfolioIntro(animate = true) {
  if (!portfolioIntro || portfolioIntro.classList.contains("is-hidden")) return;
  portfolioIntro.classList.add("is-opening");
  sessionStorage.setItem("rommelPortfolioIntroSeen", "true");
  const delay = animate && !prefersReducedMotion ? 1150 : 0;
  window.setTimeout(() => {
    portfolioIntro.classList.add("is-hidden");
    document.body.classList.remove("intro-active");
  }, delay);
}

if (portfolioIntro) {
  const introSeen = sessionStorage.getItem("rommelPortfolioIntroSeen");
  if (introSeen || prefersReducedMotion) {
    portfolioIntro.classList.add("is-hidden");
    document.body.classList.remove("intro-active");
  } else {
    introEnter?.addEventListener("click", () => closePortfolioIntro(true));
    introSkip?.addEventListener("click", () => closePortfolioIntro(false));
  }
}
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");
const navLinks = [...document.querySelectorAll("#nav a[href^='#']")];

function setNavigationOpen(open) {
  nav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  menuToggle.textContent = open ? "×" : "☰";
}

menuToggle.addEventListener("click", () => setNavigationOpen(!nav.classList.contains("open")));
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    setNavigationOpen(false);
    navLinks.forEach(item => {
      if (item === link) item.setAttribute("aria-current", "location");
      else item.removeAttribute("aria-current");
    });
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    setNavigationOpen(false);
    menuToggle.focus();
  }
});

// Keep the navigation state aligned with the section currently in view.
const navSections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateActiveNavigation() {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 240);
  let activeSection = navSections[0];
  for (const section of navSections) {
    if (section.offsetTop <= marker) activeSection = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
    activeSection = navSections[navSections.length - 1];
  }
  navLinks.forEach(link => {
    if (activeSection && link.getAttribute("href") === `#${activeSection.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
window.addEventListener("scroll", updateActiveNavigation, { passive: true });
window.addEventListener("resize", updateActiveNavigation);
window.addEventListener("load", updateActiveNavigation);
updateActiveNavigation();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();


// V12 — lightweight portfolio assistant. It answers from a fixed portfolio knowledge base,
// so it needs no API key or backend and works on GitHub Pages.
const assistant = document.getElementById("portfolioAssistant");
const assistantLauncher = document.getElementById("assistantLauncher");
const assistantPanel = document.getElementById("assistantPanel");
const assistantClose = document.getElementById("assistantClose");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantMessages = document.getElementById("assistantMessages");
const assistantSuggestions = document.getElementById("assistantSuggestions");

const assistantSuggestionSets = {
  home: [["Explore projects", "What projects has Rommel built?"], ["Tech stack", "What technologies does Rommel use?"], ["Contact", "How can I contact Rommel?"]],
  about: [["About Rommel", "Who is Rommel?"], ["Career focus", "What kind of software does Rommel focus on?"], ["Explore projects", "What projects has Rommel built?"]],
  "what-i-do": [["Development work", "What kind of development does Rommel do?"], ["Project roles", "What were Rommel's roles in his projects?"], ["Tech stack", "What technologies does Rommel use?"]],
  skills: [["Programming languages", "What programming languages does Rommel know?"], ["Frameworks", "What frameworks and tools does Rommel use?"], ["See projects", "What projects has Rommel built?"]],
  projects: [["StudyMateAI", "Tell me about StudyMateAI"], ["EduTech Mobile", "Tell me about EduTech Mobile"], ["Class Ledger", "Tell me about Class Ledger"], ["Water refilling system", "Tell me about the Water Refilling Station Management System"]],
  education: [["Education", "What is Rommel's education?"], ["Project experience", "What project roles has Rommel had?"], ["Download CV", "How can I download Rommel's CV?"]],
  contact: [["Email", "How can I contact Rommel?"], ["GitHub", "What is Rommel's GitHub?"], ["CV", "Where can I find Rommel's CV?"]]
};

function getCurrentPortfolioSection() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const targetLine = window.innerHeight * 0.42;
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= targetLine && rect.bottom > targetLine) return section.id;
  }
  return "home";
}

function refreshAssistantSuggestions() {
  if (!assistantMessages) return;
  let container = document.getElementById("assistantSuggestions");
  if (!container) {
    container = document.createElement("div");
    container.className = "assistant-suggestions";
    container.id = "assistantSuggestions";
    assistantMessages.appendChild(container);
  }
  container.replaceChildren();
  const choices = assistantSuggestionSets[getCurrentPortfolioSection()] || assistantSuggestionSets.home;
  choices.forEach(([label, question]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.question = question;
    button.addEventListener("click", () => answerAssistantQuestion(question));
    container.appendChild(button);
  });
}

function setAssistantOpen(open) {
  assistant.classList.toggle("open", open);
  assistantLauncher.setAttribute("aria-expanded", String(open));
  assistantPanel.setAttribute("aria-hidden", String(!open));
  if (open) {
    refreshAssistantSuggestions();
    setTimeout(() => assistantInput.focus(), 180);
  }
}

assistantLauncher.addEventListener("click", () => setAssistantOpen(!assistant.classList.contains("open")));
assistantClose.addEventListener("click", () => setAssistantOpen(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && assistant.classList.contains("open")) setAssistantOpen(false);
});

const portfolioAnswers = [
  {
    keys: ["who is rommel", "who is he", "about rommel", "about him", "rommel"],
    answer: "Rommel John M. Agolito is an Information Technology graduate majoring in Technopreneurship. He enjoys building practical web, mobile, and desktop applications and turning manual processes into useful digital solutions."
  },
  {
    keys: ["project", "projects", "portfolio work", "what has he built", "what did he build"],
    answer: "Rommel's featured projects are EduTech Mobile, Class Ledger, StudyMateAI, and a Water Refilling Station Management System. Each project focuses on solving a practical problem through software."
  },
  {
    keys: ["edutech", "edu tech", "mobile learning", "education app"],
    answer: "EduTech Mobile is a mobile learning application designed to enhance computer literacy among elementary students through gamification and offline learning. Rommel worked as the 2nd Developer, handling both frontend and backend development. It uses Kotlin, Android, and Jetpack Compose."
  },
  {
    keys: ["class ledger", "grading system", "grade system", "grades"],
    answer: "Class Ledger is a grading and class management application created by Rommel as a sole developer. It digitizes student records, grade entry, grading periods, summaries, and academic reports."
  },
  {
    keys: ["studymate", "study mate", "ai study", "study assistant"],
    answer: "StudyMateAI is a desktop study assistant created by Rommel. It combines AI tutoring, PDF extraction, lecture notes, quiz generation, study planning, and activity history. Its stack includes Python, PySide6, and SQLite."
  },
  {
    keys: ["water refilling", "refilling station", "water system", "management system"],
    answer: "The Water Refilling Station Management System is a completed web-based management project where Rommel is the Primary Developer. It organizes customer, product, order, and delivery records using Laravel, PHP, and MySQL."
  },
  {
    keys: ["skill", "skills", "technology", "technologies", "tech stack", "programming language", "languages"],
    answer: "Rommel's technical skills include Python, Java, JavaScript, C#, PHP, Kotlin, HTML, CSS, Flask, Laravel, PySide6, Jetpack Compose, Streamlit, MySQL, MariaDB, SQLite, Git, GitHub, VS Code, Android Studio, HeidiSQL, REST APIs, networking fundamentals, UI/UX, and responsive design."
  },
  {
    keys: ["education", "school", "college", "degree", "course", "study"],
    answer: "Rommel is pursuing a Bachelor of Science in Information Technology, Major in Technopreneurship, at Torres Capitol College, Inc. His portfolio also lists Capitol University Basic Education Department for secondary education (2019–2020) and elementary education (2013–2014)."
  },
  {
    keys: ["contact", "email", "reach", "hire", "message", "github", "linkedin"],
    answer: "You can contact Rommel at rommelagolito123098@gmail.com. His GitHub is github.com/BoyPresoGang. LinkedIn is currently coming soon."
  },
  {
    keys: ["cv", "resume", "curriculum vitae", "download"],
    answer: "Rommel's CV is available through the Download CV button in the hero section. It summarizes his education, technical skills, project experience, and career focus."
  },
  {
    keys: ["role", "responsibility", "developer"],
    answer: "Rommel's project roles include 2nd Developer for EduTech Mobile, Sole Developer for Class Ledger and StudyMateAI, and Primary Developer for the Water Refilling Station Management System."
  },
  {
    keys: ["focus", "interested", "career", "what does he do"],
    answer: "Rommel is interested in software development and practical digital solutions, especially transforming traditional or manual processes into systems that are more convenient, efficient, and accessible."
  }
];

function normalizeAssistantText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function getAssistantAnswer(question) {
  const q = normalizeAssistantText(question);
  let best = null;
  let bestScore = 0;
  portfolioAnswers.forEach(item => {
    let score = 0;
    item.keys.forEach(key => {
      const normalizedKey = normalizeAssistantText(key);
      if (q.includes(normalizedKey)) score += normalizedKey.split(" ").length > 1 ? 3 : 1;
    });
    if (score > bestScore) { bestScore = score; best = item.answer; }
  });
  if (best) return best;
  return "I'm designed to answer questions about Rommel's portfolio. Try asking about his projects, skills, education, experience, CV, or contact information.";
}

function addAssistantMessage(text, type = "bot") {
  const message = document.createElement("div");
  message.className = `assistant-message assistant-message-${type}`;
  message.textContent = text;
  assistantMessages.appendChild(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "assistant-message assistant-message-bot typing";
  typing.id = "assistantTyping";
  typing.innerHTML = "<span></span><span></span><span></span>";
  assistantMessages.appendChild(typing);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function addAssistantActions(question) {
  const q = normalizeAssistantText(question);
  let actions = [];
  if (/(project|edutech|class ledger|studymate|water refilling)/.test(q)) actions = [["View projects", "#projects"]];
  else if (/(skill|technology|tech stack|programming|framework)/.test(q)) actions = [["View skills", "#skills"], ["View projects", "#projects"]];
  else if (/(education|school|degree|college)/.test(q)) actions = [["View education", "#education"]];
  else if (/(contact|email|github|hire|reach)/.test(q)) actions = [["Go to contact", "#contact"]];
  else if (/(cv|resume|curriculum vitae|download)/.test(q)) actions = [["Go to top", "#home"], ["Go to contact", "#contact"]];
  if (!actions.length) return;
  const row = document.createElement("div");
  row.className = "assistant-suggestions assistant-action-links";
  actions.forEach(([label, href]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => {
      setAssistantOpen(false);
      document.querySelector(href)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
    row.appendChild(button);
  });
  assistantMessages.appendChild(row);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function answerAssistantQuestion(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addAssistantMessage(cleanQuestion, "user");
  document.getElementById("assistantSuggestions")?.remove();
  showTyping();
  setTimeout(() => {
    document.getElementById("assistantTyping")?.remove();
    addAssistantMessage(getAssistantAnswer(cleanQuestion), "bot");
    addAssistantActions(cleanQuestion);
    refreshAssistantSuggestions();
  }, 450);
}

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = assistantInput.value;
  assistantInput.value = "";
  answerAssistantQuestion(question);
});




// V39 — subtle cursor light on the hero profile card (fine pointers only).
const heroProfileCard = document.querySelector(".hero-card");
if (heroProfileCard && window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
  heroProfileCard.addEventListener("pointermove", (event) => {
    const rect = heroProfileCard.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    heroProfileCard.style.setProperty("--pointer-x", `${x}%`);
    heroProfileCard.style.setProperty("--pointer-y", `${y}%`);
    heroProfileCard.classList.add("is-pointer-active");
  });
  heroProfileCard.addEventListener("pointerleave", () => {
    heroProfileCard.classList.remove("is-pointer-active");
    heroProfileCard.style.removeProperty("--pointer-x");
    heroProfileCard.style.removeProperty("--pointer-y");
  });
}
