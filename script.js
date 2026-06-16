const questionsEN = [
  {
    title: "How many times per year do you visit BeaverTails?",
    answers: [
      { label: "Once",         image: "images/once.png",         value: "once" },
      { label: "Twice",        image: "images/twice.png",        value: "twice" },
      { label: "Three times",  image: "images/three-times.png",  value: "three_times" },
      { label: "Four or more", image: "images/four-or-more.png", value: "four_or_more" }
    ]
  },
  {
    title: "What best describes where you live?",
    answers: [
      { label: "This city",     image: "images/this-region.png",   value: "this_city" },
      { label: "This province", image: "images/this-province.png", value: "this_province" },
      { label: "Canada",        image: "images/canada.png",        value: "canada" },
      { label: "International", image: "images/international.png", value: "international" }
    ]
  },
  {
    title: "What are you doing today?",
    textOnly: true,
    answers: [
      { label: "Vacation / Day off", value: "vacation_day_off" },
      { label: "Celebration", value: "celebration" },
      { label: "On a date",   value: "date" },
      { label: "School",      value: "school" },
      { label: "Work",        value: "work" }
    ]
  }
];

const questionsFR = [
  {
    title: "Combien de fois par année visite-tu Queues de Castor?",
    answers: [
      { label: "Une fois",      image: "images-fr/once-fr.png",         value: "once" },
      { label: "Deux fois",     image: "images-fr/twice-fr.png",        value: "twice" },
      { label: "Trois fois",    image: "images-fr/three-times-fr.png",  value: "three_times" },
      { label: "Quatre fois +", image: "images-fr/four-or-more-fr.png", value: "four_or_more" }
    ]
  },
  {
    title: "Qu'est-ce qui décrit le mieux l'endroit où tu vis?",
    answers: [
      { label: "Cette ville",    image: "images-fr/this-region-fr.png",   value: "this_city" },
      { label: "Cette province", image: "images-fr/this-province-fr.png", value: "this_province" },
      { label: "Canada",         image: "images-fr/canada-fr.png",        value: "canada" },
      { label: "International",  image: "images-fr/international-fr.png", value: "international" }
    ]
  },
  {
    title: "Tu fais quoi aujourd’hui?",
    textOnly: true,
    answers: [
      { label: "Vacances / Jour de congé", value: "vacation_day_off" },
      { label: "Célébration",   value: "celebration" },
      { label: "Sortie en couple",   value: "date" },
      { label: "École / sortie scolaire",         value: "school" },
      { label: "Travail",       value: "work" }
    ]
  }
];

const params = new URLSearchParams(window.location.search);
const storeLocation = params.get("store") || "unknown";
const method = params.get("method") || "unknown";
let lang = params.get("lang") || null;

let questions = questionsEN;

let currentQuestion = 0;
let responses = [];
let savedAnswers = {};
let hasSubmitted = false;
let acceptingAnswer = true;

const REVIEW_LINKS = {
  "montreal-stpaul":        "https://search.google.com/local/writereview?placeid=ChIJVT2oLTEbyUwRaMrwdTDZihc",
  "montreal-delacommune":   "https://getreviewlaunch.com/scan/02/b4f44e64/d2ba4a5f",
  "dix30":                  "",
  "old-quebec-champlain":   "https://search.google.com/local/writereview?placeid=ChIJ-fDBsRWRuEwR04p9vegfIdo",
  "old-quebec-stjean":      "https://search.google.com/local/writereview?placeid=ChIJ6c70TdCVuEwRRCt3BRw7rYE",
  "tremblant-upper":         "https://search.google.com/local/writereview?placeid=ChIJmbVIH9F3z0wRZLpOfPnybmY",
  "tremblant-lower":         "https://search.google.com/local/writereview?placeid=ChIJO3VFRfR3z0wRKYwj7bJL21U",
  "toronto-waterfront":     "https://search.google.com/local/writereview?placeid=ChIJoS93HtvL1IkRTtiilSY_0TY",
  "halifax-waterfront":     "https://search.google.com/local/writereview?placeid=ChIJWxgdds0jWksR8l-zGVi7AzQ",
  "ottawa-byward":          "https://search.google.com/local/writereview?placeid=ChIJXzrXPgIFzkwROYqS0S6vgyg",
  "tpo":                    "https://search.google.com/local/writereview?placeid=ChIJj1tB9AdsK4gRnC-UU0Qfg7A",
  "tanger":                 "https://search.google.com/local/writereview?placeid=ChIJZ4TU6YoA0kwRW7Ju9uarYPI",
  "blue-mountain":          "https://search.google.com/local/writereview?placeid=ChIJD6MvhNpwKogRq49_HCmzhnw",
  "grand-bend":            "https://search.google.com/local/writereview?placeid=ChIJDxUAPzg6L4gRT0HkUdMHeVg",
  "canmore":                "https://search.google.com/local/writereview?placeid=ChIJH71QpevFcFMRI6PqLTqZglc",
  "banff-east":             "https://search.google.com/local/writereview?placeid=ChIJZV8abEbKcFMRD3oZHhEedlM",
  "banff-west":             "https://search.google.com/local/writereview?placeid=ChIJvdgr4UXKcFMR51yqEbuXtd0",
  "waterton":               "https://search.google.com/local/writereview?placeid=ChIJSxuLBABFb1MRDywC3BPK5Uw",
  "niagara-falls-clifton":  "https://search.google.com/local/writereview?placeid=ChIJQbZJYRdD04kRtKANa0nJUWA",
  "niagara-outlet":         "https://search.google.com/local/writereview?placeid=ChIJtaUJRPFa04kRyy4NR4AlU6Q",
  "calgary-17av":           "https://search.google.com/local/writereview?placeid=ChIJVS7ehNNxcVMRpUniZeALxpo",
  "west-edmonton-mall":     "https://search.google.com/local/writereview?placeid=ChIJTVjNqYkhoFMRxJ0mTAluQjM",
  "white-rock":             "https://search.google.com/local/writereview?placeid=ChIJS_KEMtjDhVQR0IoyXChIZfA"
};

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSfCocHorKKULJc917yttbNuiCNimNhTF3z4-eiGdkerHR7AgC2d0iFsDvfB0AyhytBA/exec";

const questionTitle = document.getElementById("question-title");
const answerGrid = document.getElementById("answer-grid");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const dots = document.querySelectorAll(".dot");
const langToggleBtn = document.getElementById("lang-toggle");
const logo = document.getElementById("logo");
const backBtn = document.getElementById("back-btn");
const resultTitle = document.getElementById("result-title");
const resultBody = document.getElementById("result-body");
const reviewLink = document.getElementById("review-link");

function updateResultScreen() {
  if (lang === "fr") {
    resultTitle.textContent = "Merci !";
    resultBody.textContent = "Vos réponses ont été enregistrées.";
    reviewLink.textContent = "⭐ Évaluez-nous sur Google";
    logo.src = "images-fr/beavertails-logo-fr.png";
    backBtn.textContent = "← Retour";
  } else {
    resultTitle.textContent = "Thank you!";
    resultBody.textContent = "Your answers have been recorded.";
    reviewLink.textContent = "⭐ Review us on Google";
    logo.src = "images/beavertails-logo.png";
    backBtn.textContent = "← Back";
  }

  const link = REVIEW_LINKS[storeLocation];
  if (link) {
    reviewLink.href = link;
    reviewLink.classList.remove("hidden");
  } else {
    reviewLink.classList.add("hidden");
  }
}

function setLanguage(newLang) {
  lang = newLang;
  questions = lang === "fr" ? questionsFR : questionsEN;
  langToggleBtn.textContent = lang === "fr" ? "EN" : "FR";
  logo.src = lang === "fr" ? "images-fr/beavertails-logo-fr.png" : "images/beavertails-logo.png";
  updateResultScreen();
  showQuestion();
}

langToggleBtn.addEventListener("click", function() {
  setLanguage(lang === "fr" ? "en" : "fr");
});

function showQuestion() {
  acceptingAnswer = true;
  backBtn.style.visibility = currentQuestion === 0 ? "hidden" : "visible";

  const question = questions[currentQuestion];
  const saved = savedAnswers[currentQuestion];

  questionTitle.textContent = question.title;
  answerGrid.innerHTML = "";
  answerGrid.classList.toggle("text-grid", !!question.textOnly);

  question.answers.forEach(function(answer) {
    const card = document.createElement("button");
    card.classList.add(question.textOnly ? "text-card" : "answer-card");
    card.type = "button";

    if (question.textOnly) {
      card.textContent = answer.label;
    } else {
      card.innerHTML = `<img src="${answer.image}" alt="${answer.label}">`;
    }

    if (saved === answer.value) {
      card.classList.add("selected");
    }

    card.addEventListener("click", function() {
      saveAnswer(answer.value);
    });

    answerGrid.appendChild(card);
  });

  updateProgress();
}

function goBack() {
  if (currentQuestion === 0) return;
  currentQuestion--;
  showQuestion();
}

function saveAnswer(answerValue) {
  if (!acceptingAnswer) return;
  acceptingAnswer = false;

  savedAnswers[currentQuestion] = answerValue;

  responses[currentQuestion] = {
    questionNumber: currentQuestion + 1,
    question: questions[currentQuestion].title,
    answer: answerValue
  };

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

}

function finishSurvey() {
  if (hasSubmitted) return;
  hasSubmitted = true;

  questionScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  updateResultScreen();

  const surveyData = {
    store:        storeLocation,
    method:       method,
    lang:         lang,
    timesPerYear: responses[0] ? responses[0].answer : "",
    origin:       responses[1] ? responses[1].answer : "",
    reasonInArea: responses[2] ? responses[2].answer : ""
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
  savedAnswers = {};
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
  const timeout = setTimeout(function() { applyLanguage("en"); }, 2000);

  fetch("https://ip-api.com/json/?fields=regionName")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      clearTimeout(timeout);
      const region = (data.regionName || "").toLowerCase();
      applyLanguage(region.includes("quebec") ? "fr" : "en");
    })
    .catch(function() {
      clearTimeout(timeout);
      applyLanguage("en");
    });
}

function applyLanguage(newLang) {
  lang = newLang;
  questions = lang === "fr" ? questionsFR : questionsEN;
  langToggleBtn.textContent = lang === "fr" ? "EN" : "FR";
  logo.src = lang === "fr" ? "images-fr/beavertails-logo-fr.png" : "images/beavertails-logo.png";
  questionTitle.textContent = lang === "fr" ? "Chargement..." : "Loading...";
  updateResultScreen();
  showQuestion();
}
