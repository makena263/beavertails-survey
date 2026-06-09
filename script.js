const questionsEN = [
  {
    title: "Which items would you purchase?",
    answers: [
      { label: "BeaverTails", image: "images/beavertail.png", value: "beavertails" },
      { label: "BeaverDog",   image: "images/beaverdog.png",  value: "beaverdog" },
      { label: "Poutine",     image: "images/poutine.png",    value: "poutine" },
      { label: "Ice Cream",   image: "images/icecream.png",   value: "icecream" }
    ]
  },
  {
    title: "How many times a year do you visit BeaverTails?",
    answers: [
      { label: "Once",        image: "images/once.png",         value: "once" },
      { label: "Twice",       image: "images/twice.png",        value: "twice" },
      { label: "Three times", image: "images/three-times.png",  value: "three_times" },
      { label: "Four or more",image: "images/four-or-more.png", value: "four_or_more" }
    ]
  },
  {
    title: "Why are you in the area?",
    answers: [
      { label: "Work",     image: "images/work.png",     value: "work" },
      { label: "School",   image: "images/school.png",   value: "school" },
      { label: "Vacation", image: "images/vacation.png", value: "vacation" },
      { label: "Day off",  image: "images/day-off.png",  value: "day_off" }
    ]
  },
  {
    title: "Where are you from?",
    answers: [
      { label: "This city",     image: "images/this-region.png",   value: "this_city" },
      { label: "This province", image: "images/this-province.png", value: "this_province" },
      { label: "Canada",        image: "images/canada.png",        value: "canada" },
      { label: "International", image: "images/international.png", value: "international" }
    ]
  }
];

const questionsFR = [
  {
    title: "Quels articles achètes-tu?",
    answers: [
      { label: "BeaverTails", image: "images-fr/beavertail-fr.png", value: "beavertails" },
      { label: "BeaverDog",   image: "images-fr/beaverdog-fr.png",  value: "beaverdog" },
      { label: "Poutine",     image: "images-fr/poutine-fr.png",    value: "poutine" },
      { label: "Crème glacée",image: "images-fr/icecream-fr.png",   value: "icecream" }
    ]
  },
  {
    title: "Combien de fois par an fréquentes-tu Beavertails ?",
    answers: [
      { label: "Une fois",      image: "images-fr/once-fr.png",         value: "once" },
      { label: "Deux fois",     image: "images-fr/twice-fr.png",        value: "twice" },
      { label: "Trois fois",    image: "images-fr/three-times-fr.png",  value: "three_times" },
      { label: "Quatre fois +", image: "images-fr/four-or-more-fr.png", value: "four_or_more" }
    ]
  },
  {
    title: "Pourquoi êtes-vous dans la région ?",
    answers: [
      { label: "Travail",    image: "images-fr/work-fr.png",     value: "work" },
      { label: "École",      image: "images-fr/school-fr.png",   value: "school" },
      { label: "Vacances",   image: "images-fr/vacation-fr.png", value: "vacation" },
      { label: "Congé",      image: "images-fr/day-off-fr.png",  value: "day_off" }
    ]
  },
  {
    title: "D'où viens-tu ?",
    answers: [
      { label: "Cette ville",    image: "images-fr/this-region-fr.png",   value: "this_city" },
      { label: "Cette province", image: "images-fr/this-province-fr.png", value: "this_province" },
      { label: "Canada",         image: "images-fr/canada-fr.png",        value: "canada" },
      { label: "International",  image: "images-fr/international-fr.png", value: "international" }
    ]
  }
];

const params = new URLSearchParams(window.location.search);
const storeLocation = params.get("store") || "unknown";
let lang = params.get("lang") || null;

let questions = questionsEN;

let currentQuestion = 0;
let responses = [];
let hasSubmitted = false;
let acceptingAnswer = true;

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSfCocHorKKULJc917yttbNuiCNimNhTF3z4-eiGdkerHR7AgC2d0iFsDvfB0AyhytBA/exec";

const questionTitle = document.getElementById("question-title");
const answerGrid = document.getElementById("answer-grid");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const dots = document.querySelectorAll(".dot");
const progressText = document.querySelector(".progress-text");
const langToggleBtn = document.getElementById("lang-toggle");
const resultTitle = document.getElementById("result-title");
const resultBody = document.getElementById("result-body");
const resultRestart = document.getElementById("result-restart");

function updateResultScreen() {
  if (lang === "fr") {
    resultTitle.textContent = "Merci !";
    resultBody.textContent = "Tes réponses ont été enregistrées.";
    resultRestart.textContent = "Recommencer";
  } else {
    resultTitle.textContent = "Thank you!";
    resultBody.textContent = "Your answers have been recorded.";
    resultRestart.textContent = "Start over";
  }
}

function setLanguage(newLang) {
  lang = newLang;
  questions = lang === "fr" ? questionsFR : questionsEN;
  langToggleBtn.textContent = lang === "fr" ? "EN" : "FR";
  updateResultScreen();

  currentQuestion = 0;
  responses = [];
  hasSubmitted = false;
  acceptingAnswer = true;
  resultScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");

  showQuestion();
}

langToggleBtn.addEventListener("click", function() {
  setLanguage(lang === "fr" ? "en" : "fr");
});

function showQuestion() {
  acceptingAnswer = true;

  const question = questions[currentQuestion];
  questionTitle.textContent = question.title;
  answerGrid.innerHTML = "";

  question.answers.forEach(function(answer) {
    const card = document.createElement("button");
    card.classList.add("answer-card");
    card.type = "button";

    card.innerHTML = `<img src="${answer.image}" alt="${answer.label}">`;

    card.addEventListener("click", function() {
      saveAnswer(answer.value);
    });

    answerGrid.appendChild(card);
  });

  updateProgress();
}

function saveAnswer(answerValue) {
  if (!acceptingAnswer) return;
  acceptingAnswer = false;

  responses.push({
    questionNumber: currentQuestion + 1,
    question: questions[currentQuestion].title,
    answer: answerValue
  });

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    finishSurvey();
  }
}

function updateProgress() {
  dots.forEach(function(dot, index) {
    if (index === currentQuestion) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });

  progressText.textContent = `${currentQuestion + 1}/${questions.length}`;
}

function finishSurvey() {
  if (hasSubmitted) return;
  hasSubmitted = true;

  questionScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  updateResultScreen();

  const surveyData = {
    store:        storeLocation,
    lang:         lang,
    purchase:     responses[0] ? responses[0].answer : "",
    timesPerYear: responses[1] ? responses[1].answer : "",
    reasonInArea: responses[2] ? responses[2].answer : "",
    origin:       responses[3] ? responses[3].answer : ""
  };

  const url = GOOGLE_SCRIPT_URL + "?" + new URLSearchParams(surveyData).toString();
  fetch(url, {
    method: "GET",
    mode: "no-cors"
  }).catch(function(err) {
    console.error("Failed to submit survey:", err);
  });
}

function restartSurvey() {
  currentQuestion = 0;
  responses = [];
  hasSubmitted = false;
  acceptingAnswer = true;

  resultScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");

  showQuestion();
}

// Detect language: URL param takes priority, otherwise check IP region
if (lang) {
  applyLanguage(lang);
} else {
  fetch("https://ip-api.com/json/?fields=regionName")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      const region = (data.regionName || "").toLowerCase();
      applyLanguage(region.includes("quebec") ? "fr" : "en");
    })
    .catch(function() {
      applyLanguage("en");
    });
}

function applyLanguage(newLang) {
  lang = newLang;
  questions = lang === "fr" ? questionsFR : questionsEN;
  langToggleBtn.textContent = lang === "fr" ? "EN" : "FR";
  updateResultScreen();
  showQuestion();
}
