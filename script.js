const textPh = document.querySelector(".textph");
const timeStat = document.querySelector(".time");
const wpmStat = document.querySelector(".wpm");
const testTexts = [
  "Technology has revolutionized every aspect of our lives, from the way we communicate to the way we work. The advent of the internet has connected the world in ways unimaginable just a few decades ago. Social media platforms allow us to stay in touch with friends and family, while video conferencing tools enable remote work and global collaboration. Automation and artificial intelligence are transforming industries, increasing efficiency, and reducing the need for manual labor. However, with these advancements come new challenges, such as cybersecurity threats and the potential loss of jobs due to automation. As technology continues to evolve, society must adapt to these changes, finding ways to balance innovation with ethical considerations. Education and retraining will be essential in preparing the workforce for the future, ensuring that the benefits of technological progress are shared by all.",
  "Climate change is one of the most pressing issues of our time. The Earth's climate is warming at an unprecedented rate, largely due to human activities such as deforestation, industrial pollution, and the burning of fossil fuels. Rising global temperatures are leading to more extreme weather events, such as hurricanes, droughts, and wildfires. Melting polar ice caps are contributing to rising sea levels, threatening coastal communities around the world. The impact of climate change is not just environmental but also economic and social, as it exacerbates poverty and inequality. Addressing this global challenge requires coordinated efforts from governments, businesses, and individuals. Transitioning to renewable energy sources, promoting sustainable practices, and investing in green technologies are critical steps in mitigating the effects of climate change. The choices we make today will determine the future of our planet and the well-being of future generations.",
  "Education is the cornerstone of a thriving society. It empowers individuals, fosters innovation, and drives economic growth. From early childhood to higher education, learning provides the foundation for personal and professional development. Quality education equips students with the knowledge and skills necessary to succeed in a rapidly changing world. It also promotes critical thinking, creativity, and a lifelong love of learning. However, access to education remains unequal, with disparities in resources, quality, and opportunities across different regions and communities. Ensuring that every child receives a quality education is essential for building a more just and equitable society. Investing in education not only benefits individuals but also strengthens communities and nations. By prioritizing education, we can create a brighter future for all, where everyone has the opportunity to reach their full potential.",
  "The importance of mental health cannot be overstated. Mental health is just as crucial as physical health, yet it is often overlooked or stigmatized. Anxiety, depression, and other mental health disorders affect millions of people worldwide, impacting their ability to lead fulfilling lives. Recognizing the signs of mental health issues and seeking help early is vital for effective treatment and recovery. Societies must prioritize mental health by increasing awareness, reducing stigma, and providing accessible resources for those in need. Employers can play a significant role by fostering a supportive work environment and offering mental health benefits. Schools can also contribute by teaching students about mental health and promoting emotional well-being. By addressing mental health with the same urgency as physical health, we can improve overall well-being, reduce the burden on healthcare systems, and create a more compassionate and understanding society.",
  "The role of art in society is profound and multifaceted. Art has the power to inspire, challenge, and connect people across cultures and generations. It serves as a reflection of society, capturing the emotions, struggles, and triumphs of the human experience. Through various forms of expression, such as painting, music, literature, and theater, art has the ability to communicate complex ideas and evoke deep emotions. It also fosters creativity and innovation, encouraging people to think differently and explore new perspectives. Art has the potential to bring about social change, raising awareness of important issues and inspiring action. Despite its significance, the arts are often undervalued in education and society at large. Supporting and promoting the arts is essential for preserving cultural heritage and enriching our lives. By embracing the arts, we can nurture a more vibrant, inclusive, and empathetic society.",
];
let currentText;
let startTime, endTime;
let currentIndex = 0;
let correctChars = 0;
let totalChars = 0;
let timer;

function initializeTest() {
  currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
  textPh.innerHTML = currentText
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  textPh.appendChild(cursor);
  updateCursorPosition();
  currentIndex = 0;
  correctChars = 0;
  totalChars = 0;
  startTime = null;
  clearInterval(timer);
  timeStat.textContent = "1:00";
  wpmStat.textContent = "0 WPM";
}

function updateCursorPosition() {
  const cursor = document.querySelector(".cursor");
  const currentSpan = textPh.children[currentIndex];
  if (currentSpan) {
    const rect = currentSpan.getBoundingClientRect();
    const containerRect = textPh.getBoundingClientRect();
    cursor.style.left = `${
      rect.left - containerRect.left + textPh.scrollLeft
    }px`;
    cursor.style.top = `${rect.top - containerRect.top + textPh.scrollTop}px`;

    const cursorBottom = rect.top + rect.height - containerRect.top;
    if (cursorBottom > textPh.clientHeight) {
      textPh.scrollTop += rect.height;
    }
  }
}

function startTimer() {
  startTime = new Date();
  timer = setInterval(() => {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const remainingTime = Math.max(60 - elapsedTime, 0);
    timeStat.textContent = `${Math.floor(remainingTime / 60)}:${(
      remainingTime % 60
    )
      .toString()
      .padStart(2, "0")}`;

    if (remainingTime === 0) {
      clearInterval(timer);
      endTest();
    }
  }, 1000);
}

function updateWPM() {
  const currentTime = new Date();
  const elapsedMinutes = (currentTime - startTime) / 60000;
  const wpm = Math.round(correctChars / 5 / elapsedMinutes);
  wpmStat.textContent = `${wpm} WPM`;
}

function endTest() {
  endTime = new Date();
  document.removeEventListener("keydown", handleKeyPress);
  displayResults();
}

function handleKeyPress(e) {
  if (!startTime) startTimer();

  const expectedChar = currentText[currentIndex];
  const typedChar = e.key;

  if (typedChar === "Shift" || typedChar === "CapsLock") {
    return;
  }

  if (typedChar === expectedChar) {
    textPh.children[currentIndex].classList.add("correct");
    correctChars++;
  } else {
    textPh.children[currentIndex].classList.add("incorrect");
  }

  currentIndex++;
  totalChars++;
  updateCursorPosition();
  updateWPM();

  if (currentIndex === currentText.length) {
    endTest();
  }

  e.preventDefault();
}

function displayResults() {
  const totalTime = (endTime - startTime) / 60000;
  const wpm = Math.round(correctChars / 5 / totalTime);
  const accuracy = Math.round((correctChars / totalChars) * 100);

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
          <div class="result-box">
            <h2>Test Results</h2>
            <p>Words Per Minute: ${wpm}</p>
            <p>Accuracy: ${accuracy}%</p>
            <p>Time: ${Math.round(totalTime * 60)} seconds</p>
            <button onclick="restartTest()">Try Again</button>
          </div>
        `;
  document.body.appendChild(overlay);
}

function restartTest() {
  document.querySelector(".overlay").remove();
  initializeTest();
  document.addEventListener("keydown", handleKeyPress);
}

initializeTest();
document.addEventListener("keydown", handleKeyPress);
