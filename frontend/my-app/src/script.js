// =======================
// Basic interactivity
// =======================

// Handle search button
document.querySelector(".filters button").addEventListener("click", () => {
  alert("🔍 Searching jobs... (feature coming soon!)");
});

// Handle apply button clicks
document.querySelectorAll(".apply-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    alert("✅ Application submitted successfully!");
  });
});

// =======================
// Scroll animations using Intersection Observer
// =======================
const jobCards = document.querySelectorAll(".job-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

jobCards.forEach((card) => {
  observer.observe(card);
});
// =======================
// DARK MODE TOGGLE
// =======================
const themeToggle = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "☀️" : "🌙";

  // Save preference
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

