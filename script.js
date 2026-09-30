const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => nav.classList.toggle("open"));

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

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

function setAssistantOpen(open) {
  assistant.classList.toggle("open", open);
  assistantLauncher.setAttribute("aria-expanded", String(open));
  assistantPanel.setAttribute("aria-hidden", String(!open));
  if (open) setTimeout(() => assistantInput.focus(), 180);
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
    answer: "The Water Refilling Station Management System is an in-development project where Rommel is the Primary Developer. It focuses on customer, product, order, and delivery records using Laravel, PHP, and MySQL."
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

function answerAssistantQuestion(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addAssistantMessage(cleanQuestion, "user");
  if (assistantSuggestions) assistantSuggestions.remove();
  showTyping();
  setTimeout(() => {
    document.getElementById("assistantTyping")?.remove();
    addAssistantMessage(getAssistantAnswer(cleanQuestion), "bot");
  }, 450);
}

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = assistantInput.value;
  assistantInput.value = "";
  answerAssistantQuestion(question);
});

document.querySelectorAll(".assistant-suggestions button").forEach(button => {
  button.addEventListener("click", () => answerAssistantQuestion(button.dataset.question));
});
