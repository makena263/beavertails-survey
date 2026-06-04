const questions = [
  {
    title: "Which BeaverTails matches your personality?",
    answers: [
      {
        label: "Classic",
        image: "images/classic.png",
        value: "classic"
      },
      {
        label: "Decadent Tail",
        image: "images/decadent-tail.png",
        value: "decadent_tail"
      },
      {
        label: "Beaver Bites",
        image: "images/beaver-bites.png",
        value: "beaver_bites"
      },
      {
        label: "Poutail",
        image: "images/poutail.png",
        value: "poutail"
      }
    ]
  },
  {
    title: "How many times a year do you treat yourself to BeaverTails?",
    answers: [
      {
        label: "Once",
        image: "images/once.png",
        value: "once"
      },
      {
        label: "Twice",
        image: "images/twice.png",
        value: "twice"
      },
      {
        label: "Three times",
        image: "images/three-times.png",
        value: "three_times"
      },
      {
        label: "Four or more",
        image: "images/four-or-more.png",
        value: "four_or_more"
      }
    ]
  },
  {
    title: "What new BeaverTails product would you be most likely to try?",
    answers: [
      {
        label: "BeaverDog",
        image: "images/beaverdog.png",
        value: "beaverdog"
      },
      {
        label: "Drinks",
        image: "images/drinks.png",
        value: "drinks"
      },
      {
        label: "Ice Cream",
        image: "images/icecream.png",
        value: "icecream"
      },
      {
        label: "Poutine",
        image: "images/poutine.png",
        value: "poutine"
      }
    ]
  },
  {
    title: "Where is your favorite place to enjoy a BeaverTail?",
    answers: [
      {
        label: "Ski hill",
        image: "images/ski-hill.png",
        value: "ski_hill"
      },
      {
        label: "Hiking",
        image: "images/hiking.png",
        value: "hiking"
      },
      {
        label: "Picnic or festival",
        image: "images/picnic-festival.png",
        value: "picnic_or_festival"
      },
      {
        label: "City",
        image: "images/city.png",
        value: "city"
      }
    ]
  },
  {
    title: "How often are you in this area?",
    answers: [
      {
        label: "First time",
        image: "images/first-time.png",
        value: "first_time"
      },
      {
        label: "Frequently",
        image: "images/frequently.png",
        value: "frequently_7_plus_days_per_year"
      },
      {
        label: "Every weekend",
        image: "images/every-weekend.png",
        value: "every_weekend"
      },
      {
        label: "Local",
        image: "images/local.png",
        value: "local"
      }
    ]
  }
];

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

function showQuestion() {
  acceptingAnswer = true;

  const question = questions[currentQuestion];

  questionTitle.textContent = question.title;
  answerGrid.innerHTML = "";

  question.answers.forEach(function(answer) {
    const card = document.createElement("button");
    card.classList.add("answer-card");
    card.type = "button";

    card.innerHTML = `
      <img src="${answer.image}" alt="${answer.label}">
    `;

    card.addEventListener("click", function() {
      saveAnswer(answer.value);
    });

    answerGrid.appendChild(card);
  });

  updateProgress();
}

function saveAnswer(answerValue) {
  if (!acceptingAnswer) {
    return;
  }

  acceptingAnswer = false;

  responses.push({
    questionNumber: currentQuestion + 1,
    question: questions[currentQuestion].title,
    answer: answerValue
  });

  console.log("Saved answer:", responses);

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

  const surveyData = {
    personality:   responses[0] ? responses[0].answer : "",
    timesPerYear:  responses[1] ? responses[1].answer : "",
    newProduct:    responses[2] ? responses[2].answer : "",
    favoritePlace: responses[3] ? responses[3].answer : "",
    areaFrequency: responses[4] ? responses[4].answer : ""
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

showQuestion();