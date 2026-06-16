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
  "montreal-stpaul":        "https://www.google.com/search?kgmid=/g/11kn02j2hg&hl=en-CA&q=Queues+de+Castor+-+BeaverTails+(Rue+Saint-Paul+Est)&shem=epsd1,rimspwouoe&shndl=30&source=sh/x/loc/osrp/m5/1&kgs=7468783b59f80dc0#lrd=0x4cc91b312da83d55:0x178ad93075f0ca68,3",
  "montreal-delacommune":   "https://getreviewlaunch.com/scan/02/b4f44e64/d2ba4a5f",
  "dix30":                  "",
  "old-quebec-champlain":   "https://www.google.com/search?q=Queues+de+Castor-+BeaverTails+(Vieux+Qu%C3%A9bec+Petit+Champlain)&rlz=1C5CHFA_enCA1177CA1177&oq=Queues+de+Castor-+BeaverTails+(Vieux+Qu%C3%A9bec+Petit+Champlain)&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIICAIQABgWGB4yCAgDEAAYFhgeMggIBBAAGBYYHjIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPdIBBzI0NmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x4cb89115b1c1f0f9:0xda211fe8bd7d8ad3,3",
  "old-quebec-stjean":      "https://www.google.com/search?q=Queues+de+Castor+Vieux+Qu%C3%A9bec+Rue+St-Jean&rlz=1C5CHFA_enCA1177CA1177&oq=Queues+de+Castor+Vieux+Qu%C3%A9bec+Rue+St-Jean&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBBjU5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lrd=0x4cb895d04df4cee9:0x81ad3b1c05772b44,3",
  "tremblant":              "https://www.google.com/search?q=Queues+de+Castor-+BeaverTails+(Mont-Tremblant+Kandahar)&rlz=1C5CHFA_enCA1177CA1177&oq=Queues+de+Castor-+BeaverTails+(Mont-Tremblant+Kandahar)&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABjvBTIHCAIQABjvBTIHCAMQABjvBTIHCAQQABjvBTIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBBzE2OGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x4ccf77d11f48b599:0x666ef2f97c4eba64,3",
  "toronto-waterfront":     "https://www.google.com/search?q=toronto+watefront+beavertails&sca_esv=ec2bff8bd1e2ef21&rlz=1C5CHFA_enCA1177CA1177&sxsrf=ANbL-n6uad0kTEaXseD0C2N6GTRNqe_RPA%3A1781633839904&ei=L5MxasXVNvWq5NoPysSAiQI&biw=978&bih=768&ved=0ahUKEwiFqZahr4yVAxV1FVkFHUoiICEQ4dUDCBI&uact=5&oq=toronto+watefront+beavertails&gs_lp=Egxnd3Mtd2l6LXNlcnAiHXRvcm9udG8gd2F0ZWZyb250IGJlYXZlcnRhaWxzMgcQABiABBgNMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgsQABiABBiKBRiGAzILEAAYgAQYigUYhgMyBRAAGO8FMgUQABjvBUjAEFC8AljHD3ABeAGQAQCYAXagAbIMqgEDNy45uAEDyAEA-AEBmAIRoALqDMICChAAGEcY1gQYsAPCAg0QABiABBiKBRhDGLADwgIQEAAYgAQYigUYQxixAxiDAcICDBAAGIAEGAoYCxixA8ICCRAAGIAEGAoYC8ICBhAAGB4YDcICCBAAGIAEGKIEmAMA4gMFEgExIECIBgGQBgySBwM4LjmgB_t-sgcDNy45uAfoDMIHBjAuMTMuNMgHJoAIAQ&sclient=gws-wiz-serp#lrd=0x89d4cbdb1e772fa1:0x36d13f2695a2d84e,3",
  "halifax-waterfront":     "https://www.google.com/search?q=halifax+waterfront+google+review+beavertails&sca_esv=ec2bff8bd1e2ef21&rlz=1C5CHFA_enCA1177CA1177&sxsrf=ANbL-n4-wBgG9Yhx2Bn6CUdUOdtVDntRsw%3A1781633631196&ei=X5Ixav_KC5as5NoP0NfBsA0&biw=794&bih=768&ved=0ahUKEwi_9tO9royVAxUWFlkFHdBrENYQ4dUDCBI&uact=5&oq=halifax+waterfront+google+review+beavertails&gs_lp=Egxnd3Mtd2l6LXNlcnAiLGhhbGlmYXggd2F0ZXJmcm9udCBnb29nbGUgcmV2aWV3IGJlYXZlcnRhaWxzMgUQIRigAUicDFDTAVjVC3ABeAGQAQCYAZABoAGwCaoBAzUuNrgBA8gBAPgBAZgCDKAC5QnCAgoQABhHGNYEGLADwgIFECEYnwXCAgQQIRgVwgIHECEYChigAZgDAIgGAZAGCJIHAzUuN6AHnTOyBwM0Lje4B-MJwgcFMS43LjTIBxuACAE&sclient=gws-wiz-serp#lrd=0x4b5a23cd761d185b:0x3403bb5819b35ff2,3",
  "ottawa-byward":          "https://www.google.com/search?q=ottawa+byward+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=ottawa+byward+beavertails&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIKCAEQLhixAxiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDINCAUQLhivARjHARiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABNIBCDM3ODFqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#lrd=0x4cce05023ed73a5f:0x2883af2ed1928a39,3",
  "tpo":                    "https://www.google.com/search?sca_esv=ec2bff8bd1e2ef21&rlz=1C5CHFA_enCA1177CA1177&sxsrf=ANbL-n4Sj2HNIZ99iA2kuNX8xSMMxPTVDA:1781633777704&q=toronto+premium+outlets+beavertails&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpUrv6YeyJhXfuYqj4Fj6c1Tg5t_ufWNUvD2V-uX26AFlqeVA_8cCiKkQH-MFQemrtal7dHPu4vMBCw5HGZFTilpPDj6sODUkQrt7T_dUoP4RxWrmusMr3AM72XCpGAeEQITRZ-cChkHToY6m00RXTD3YX1xwl7PrWEMUNEV73t_3i_fY5AW-IBgzcgBfCp-eLyOZx3g&sa=X&ved=2ahUKEwjOhMKDr4yVAxU3EmIAHQBULUUQ0pQJegQIEBAB&cshid=1781633793688651&biw=978&bih=768&dpr=2#lrd=0x882b6c07f4415b8f:0xb0831f4453942f9c,3",
  "tanger":                 "https://www.google.com/search?gs_ssp=eJzj4tVP1zc0TM4zNyirrKowYLRSNagwSU4xMjCwSEy1TDGxMDEztzKoSDMyM0hMSjVLMzNLTTIyTfISKknMS08tUkhKTSxLLSpJzMwpBgAmrBb0&q=tanger+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=tanger+beavertails&gs_lcrp=EgZjaHJvbWUqEAgBEC4YrwEYxwEYgAQYjgUyCggAEAAY4wIYgAQyEAgBEC4YrwEYxwEYgAQYjgUyCAgCEAAYFhgeMggIAxAAGBYYHjIICAQQABgWGB4yCAgFEAAYFhgeMggIBhAAGBYYHjIGCAcQRRg90gEIMjYxM2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x4cd2008ae9d48467:0xf260abe6f66eb25b,3",
  "blue-mountain":          "https://www.google.com/search?q=blue+mountain+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=blue+mountain+beavertails&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgcIARAuGIAEMgcIAhAAGIAEMgcIAxAAGIAEMgcIBBAAGIAEMgcIBRAAGIAEMg0IBhAuGMcBGNEDGIAEMgYIBxBFGD3SAQgzNDY5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lrd=0x882a70da842fa30f:0x7c86b3291c7f8fab,3",
  "grand-bend":            "https://www.google.com/search?q=grand+bend+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=grand+bend+beavertails&gs_lcrp=EgZjaHJvbWUyCggAEEUYFhgeGDkyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yCAgEEAAYFhgeMg0IBRAAGIYDGIAEGIoFMgYIBhBFGD3SAQgyNDI4ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lrd=0x882f3a383f00150f:0x587907d351e4414f,3",
  "canmore":                "https://www.google.com/search?q=canmore+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=canmore+beavertails&gs_lcrp=EgZjaHJvbWUqCggAEAAY4wIYgAQyCggAEAAY4wIYgAQyDQgBEC4YrwEYxwEYgAQyCAgCEAAYFhgeMggIAxAAGBYYHjIICAQQABgWGB4yCAgFEAAYFhgeMggIBhAAGBYYHjIGCAcQRRg90gEIMjQ4NWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x5370c5eba550bd1f:0x5782993a2deaa323,3",
  "banff-east":             "https://www.google.com/search?q=BeaverTails-+Queues+de+Castor+%28Banff+East%29&rlz=1C5CHFA_enCA1177CA1177&oq=BeaverTails-+Queues+de+Castor+%28Banff+East%29&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yCAgCEAAYFhgeMggIAxAAGBYYHjINCAQQABiGAxiABBiKBTINCAUQABiGAxiABBiKBTINCAYQABiGAxiABBiKBTINCAcQABiGAxiABBiKBTIHCAgQABjvBTIHCAkQABjvBdIBBzIzNmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x5370ca466c1a5f65:0x53761e111e197a0f,3",
  "banff-west":             "https://www.google.com/search?q=BeaverTails-+Queues+de+Castor+%28Banff+West%29&sca_esv=ec2bff8bd1e2ef21&rlz=1C5CHFA_enCA1177CA1177&sxsrf=ANbL-n7TnsBKQVSVxcf162-nDXinVmzt2w%3A1781634271634&ei=35QxarCjJuTn5NoPkve4iAw&biw=1238&bih=768&ved=0ahUKEwjwjoXvsIyVAxXkM1kFHZI7DsEQ4dUDCBI&uact=5&oq=BeaverTails-+Queues+de+Castor+%28Banff+West%29&gs_lp=Egxnd3Mtd2l6LXNlcnAiKkJlYXZlclRhaWxzLSBRdWV1ZXMgZGUgQ2FzdG9yIChCYW5mZiBXZXN0KTIFEAAYgAQyBBAAGB4yBBAAGB4yBBAAGB4yCxAAGIAEGIoFGIYDMgsQABiABBiKBRiGAzILEAAYgAQYigUYhgMyBRAAGO8FMgUQABjvBTIFEAAY7wVI9wRQAFiHA3AAeAGQAQCYAXygAZ0DqgEDMi4yuAEDyAEA-AEBmAIDoALXAsICCBAAGIkFGKIEmAMAkgcDMS4yoAeDILIHAzEuMrgH1wLCBwMyLTPIBw6ACAE&sclient=gws-wiz-serp#lrd=0x5370ca45e12bd8bd:0xddb597bb11aa5ce7,3",
  "waterton":               "https://www.google.com/search?q=waterton+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=watert&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7Mg0IARAuGIMBGLEDGIAEMhMIAhAuGIMBGK8BGMcBGLEDGIAEMg0IAxAuGIMBGLEDGIAEMgYIBBBFGDsyBggFEEUYOTIGCAYQRRg9MgYIBxBFGDzSAQgxMjY0ajBqNKgCAbACAfEFtWj4lfZqyGnxBbVo-JX2ashp&sourceid=chrome&ie=UTF-8#lrd=0x536f4500048b1b4b:0x4ce5ca13dc022c0f,3",
  "niagara-falls-clifton":  "https://www.google.com/search?q=niagara+falls+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=niagara+falls+beavertails&gs_lcrp=EgZjaHJvbWUyCggAEEUYFhgeGDkyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yCAgEEAAYFhgeMggIBRAAGBYYHjIICAYQABgWGB4yCggHEAAYChgWGB4yCggIEAAYCBgNGB4yCggJEAAYCBgNGB7SAQg0MzQwajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lrd=0x89d343176149b641:0x6051c9496b0da0b4,3",
  "niagara-outlet":         "https://www.google.com/search?q=BeaverTails-+Queues+de+Castor+%28Niagara-on-the-Lake%29&rlz=1C5CHFA_enCA1177CA1177&oq=BeaverTails-+Queues+de+Castor+%28Niagara-on-the-Lake%29&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yCAgCEAAYFhgeMggIAxAAGBYYHjIICAQQABgWGB4yDQgFEAAYhgMYgAQYigUyDQgGEAAYhgMYgAQYigUyDQgHEAAYhgMYgAQYigUyBwgIEAAY7wUyBwgJEAAY7wXSAQczNzlqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#lrd=0x89d35af14409a5b5:0xa4532580470d2ecb,3",
  "calgary-17av":           "https://www.google.com/search?q=calgary+17+ave+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=calgary+17+ave+beavertails&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg80gEINDYyNGowajmoAgSwAgHxBWqormJgSWJg&sourceid=chrome&ie=UTF-8#lrd=0x537171d384de2e55:0x9ac60be065e249a5,3",
  "west-edmonton-mall":     "https://www.google.com/search?q=west+edmonton+mall+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=west+edmonton+mall+beavertails&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDINCAQQLhivARjHARiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDINCAgQLhivARjHARiABDIHCAkQABiABNIBCTE3NjUyajBqOagCALACAA&sourceid=chrome&ie=UTF-8#lrd=0x53a02189a9cd584d:0x33426e094c269dc4,3",
  "white-rock":             "https://www.google.com/search?q=white+rock+beavertails&rlz=1C5CHFA_enCA1177CA1177&oq=white+rock+beavertails&gs_lcrp=EgZjaHJvbWUyCggAEEUYFhgeGDkyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yCAgEEAAYFhgeMggIBRAAGBYYHjIHCAYQABjvBTIGCAcQRRg80gEIMjgzNGowajmoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x5485c3d83284f24b:0xf06548285c328ad0,3"
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
