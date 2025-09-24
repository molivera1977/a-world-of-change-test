import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

// Helper: Shuffle array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// -------------------------
// Original MC questions
// -------------------------
const originalMc = [
  {
    q: "What does the author mean when they say, 'Earth may seem as if it is a large rock that never changes'?",
    options: [
      "Earth is too big to change.",
      "Earth looks still, but changes happen constantly.",
      "Earth was formed long ago and hasn't changed since.",
      "Only fast changes matter to scientists."
    ],
    answer: 1
  },
  {
    q: "What are some examples of slow natural processes described in the text?",
    options: [
      "Volcanic eruptions and earthquakes",
      "Rainstorms and tsunamis",
      "Weathering, erosion, and deposition",
      "Avalanches and floods"
    ],
    answer: 2
  },
  {
    q: "According to the text, what is the result of erosion over many years?",
    options: [
      "Beaches are washed away.",
      "Rocks form new mountains.",
      "Entire landforms collapse.",
      "Rivers dry up."
    ],
    answer: 2
  },
  {
    q: "Which sentence from the passage best supports the idea that natural changes shape the Earth?",
    options: [
      "Natural changes take place every day.",
      "Volcanoes are scary.",
      "Scientists can't always stop disasters.",
      "The Grand Canyon is an example of the effect of erosion."
    ],
    answer: 3
  },
  {
    q: "What is deposition?",
    options: [
      "The breaking of rocks into smaller pieces",
      "The process of dropping dirt and rocks in a new place",
      "The collapse of a landform",
      "The movement of magma to the surface"
    ],
    answer: 1
  },
  {
    q: "What causes volcanoes to erupt?",
    options: [
      "Erosion from water",
      "Pressure from earthquakes",
      "Pressure builds under Earth’s surface and forces magma up",
      "Too much rainfall"
    ],
    answer: 2
  },
  {
    q: "What natural disaster can occur when rain loosens rocks and dirt?",
    options: ["Eruption", "Landslide", "Deposition", "Weathering"],
    answer: 1
  },
  {
    q: "What can communities do to stay safe from fast-moving disasters?",
    options: [
      "Watch movies about disasters",
      "Wait until they happen",
      "Create emergency plans and try to predict them",
      "Move to the city"
    ],
    answer: 2
  },
  {
    q: "Which of these is an example of a gradual change to Earth’s surface?",
    options: [
      "Lava covering a town",
      "A landslide after heavy rain",
      "A sand dune forming from wind",
      "An earthquake cracking a road"
    ],
    answer: 2
  },
  {
    q: "What does the author suggest people do to reduce beach erosion?",
    options: ["Avoid beaches", "Use umbrellas", "Build structures and plant vegetation", "Dig holes"],
    answer: 2
  },
  {
    q: "What does the word “unpredictable” most likely mean in this sentence: 'Some disasters are unpredictable and strike without warning'?",
    options: ["Easy to plan for", "Cannot be guessed", "Very small", "Predicted by scientists"],
    answer: 1
  },
  {
    q: "What is the central idea of the text 'A World of Change'?",
    options: [
      "Earth is fragile and should not be explored",
      "Natural disasters are always dangerous",
      "Earth is always changing, and people respond in different ways",
      "People should avoid the Grand Canyon"
    ],
    answer: 2
  },
  {
    q: "Which type of process is most dangerous to people?",
    options: ["Slow processes", "Gradual erosion", "Fast processes like eruptions and landslides", "Deposition"],
    answer: 2
  },
  {
    q: "Why can’t people always protect land from fast natural processes?",
    options: [
      "Because plants don’t grow fast enough",
      "Because disasters are too unpredictable",
      "Because soil is too strong",
      "Because scientists stop studying them"
    ],
    answer: 1
  },
  {
    q: "What is the purpose of the diagram showing the parts of a volcano?",
    options: [
      "To show where to build homes",
      "To name each mountain",
      "To explain the layers of the Earth",
      "To help readers understand how volcanoes erupt"
    ],
    answer: 3
  }
];

// Shuffle one question’s options
function shuffleQuestion(q) {
  const arr = [...q.options];
  const correct = q.options[q.answer];
  const shuffled = shuffleArray(arr);
  return {
    q: q.q,
    options: shuffled,
    answer: shuffled.indexOf(correct)
  };
}

function App() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  const [partAScore, setPartAScore] = useState(0);
  const [partASubmitted, setPartASubmitted] = useState(false);
  const [mcAnswers, setMcAnswers] = useState([]);
  const [currentMc, setCurrentMc] = useState(0);

  const [partBScore, setPartBScore] = useState(0);
  const [partBSubmitted, setPartBSubmitted] = useState(false);
  const [fibAnswers, setFibAnswers] = useState([]);
  const [currentFib, setCurrentFib] = useState(0);

  const [written, setWritten] = useState({ q1: "", q2: "", q3: "" });

  // Shuffle MC once per test
  const [mcQuestions] = useState(originalMc.map(shuffleQuestion));

  // Part B questions
  const fibQuestions = [
    { q: "The Grand Canyon was formed over time through the process of ________.", answer: "erosion" },
    { q: "A volcanic eruption can create a ________ in a community.", answer: "crisis" },
    { q: "A landslide can be a serious ________ for people who live near hills.", answer: "hazard" },
    { q: "After rocks are carried away by erosion, they are dropped in a new place through ________.", answer: "deposition" },
    { q: "Earthquakes often strike without warning because they are ________.", answer: "unpredictable" }
  ];

  // Shuffle word bank once per test
  const [wordBank] = useState(
    shuffleArray(["erosion", "crisis", "hazard", "deposition", "unpredictable"])
  );

  const handlePartASubmit = () => {
    let score = 0;
    mcQuestions.forEach((q, i) => {
      if (mcAnswers[i] === q.answer) score++;
    });
    setPartAScore(score);
    setPartASubmitted(true);
  };

  const handlePartBSubmit = () => {
    let score = 0;
    fibQuestions.forEach((q, i) => {
      if (fibAnswers[i] && fibAnswers[i].toLowerCase() === q.answer.toLowerCase()) {
        score++;
      }
    });
    setPartBScore(score);
    setPartBSubmitted(true);
  };

  const handleFinalSubmit = async () => {
    try {
      await addDoc(collection(db, "testResults"), {
        name,
        partAScore,
        partBScore,
        writtenQ1: written.q1,
        writtenQ2: written.q2,
        writtenQ3: written.q3,
        timestamp: new Date()
      });
      setStep(4);
    } catch (err) {
      console.error("Error saving to Firestore:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>🌍 A World of Change Test</h1>

      {/* Step 0: Student Name */}
      {step === 0 && (
        <div className="welcome-container">
          <div className="card">
            <p>✏️ Enter your name to begin:</p>
            <input value={name} onChange={(e) => setName(e.target.value)} className="text-input" />
            <button onClick={() => name && setStep(1)} className="btn">🚀 Start Test</button>
          </div>
        </div>
      )}

      {/* Step 1: Part A */}
      {step === 1 && (
        <div className="card">
          <h2>📘 Part A: Multiple Choice</h2>

          {!partASubmitted ? (
            <>
              <progress value={currentMc + 1} max={mcQuestions.length}></progress>
              <p><strong>{currentMc + 1} of {mcQuestions.length}</strong></p>
              <p>{mcQuestions[currentMc].q}</p>

              <div className="choices">
                {mcQuestions[currentMc].options.map((opt, j) => (
                  <button
                    key={j}
                    className={`choice-btn ${mcAnswers[currentMc] === j ? "selected" : ""}`}
                    onClick={() => {
                      const updated = [...mcAnswers];
                      updated[currentMc] = j;
                      setMcAnswers(updated);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="nav-buttons">
                {currentMc > 0 && <button onClick={() => setCurrentMc(currentMc - 1)} className="btn">⬅ Previous</button>}
                {currentMc < mcQuestions.length - 1 ? (
                  <button onClick={() => setCurrentMc(currentMc + 1)} className="btn">Next ➡</button>
                ) : (
                  <button onClick={handlePartASubmit} className="btn-submit">🎯 Submit Part A</button>
                )}
              </div>
            </>
          ) : (
            <>
              <p><strong>🎉 You got {partAScore} out of {mcQuestions.length} correct!</strong></p>
              {mcQuestions.map((q, i) => (
                <div key={i} className="question-card">
                  <p><strong>{i + 1}. {q.q}</strong></p>
                  <p>Your answer: {q.options[mcAnswers[i]] || "No answer"}</p>
                  {mcAnswers[i] === q.answer ? (
                    <p className="correct">✅ Correct</p>
                  ) : (
                    <p className="incorrect">❌ Incorrect — Correct answer: {q.options[q.answer]}</p>
                  )}
                </div>
              ))}
              <button onClick={() => setStep(2)} className="btn">Continue ➡</button>
            </>
          )}
        </div>
      )}

      {/* Step 2: Part B */}
      {step === 2 && (
        <div className="card">
          <h2>📗 Part B: Fill in the Blank</h2>

          {!partBSubmitted ? (
            <>
              <progress value={currentFib + 1} max={fibQuestions.length}></progress>
              <p><strong>{currentFib + 1} of {fibQuestions.length}</strong></p>
              <p>{fibQuestions[currentFib].q}</p>

              <div className="choices">
                {wordBank.map((word, idx) => (
                  <button
                    key={idx}
                    className={`choice-btn ${fibAnswers[currentFib] === word ? "selected" : ""}`}
                    onClick={() => {
                      const updated = [...fibAnswers];
                      updated[currentFib] = word;
                      setFibAnswers(updated);
                    }}
                  >
                    {word}
                  </button>
                ))}
              </div>

              <div className="nav-buttons">
                {currentFib > 0 && <button onClick={() => setCurrentFib(currentFib - 1)} className="btn">⬅ Previous</button>}
                {currentFib < fibQuestions.length - 1 ? (
                  <button onClick={() => setCurrentFib(currentFib + 1)} className="btn">Next ➡</button>
                ) : (
                  <button onClick={handlePartBSubmit} className="btn-submit">🎯 Submit Part B</button>
                )}
              </div>
            </>
          ) : (
            <>
              <p><strong>🎉 You got {partBScore} out of {fibQuestions.length} correct!</strong></p>
              {fibQuestions.map((q, i) => (
                <div key={i} className="question-card">
                  <p><strong>{i + 1}. {q.q}</strong></p>
                  <p>Your answer: {fibAnswers[i] || "No answer"}</p>
                  {fibAnswers[i] === q.answer ? (
                    <p className="correct">✅ Correct</p>
                  ) : (
                    <p className="incorrect">❌ Incorrect — Correct answer: {q.answer}</p>
                  )}
                </div>
              ))}
              <button onClick={() => setStep(3)} className="btn">Continue ➡</button>
            </>
          )}
        </div>
      )}

      {/* Step 3: Written */}
      {step === 3 && (
        <div className="card">
          <h2>✍️ Part C: Written Response</h2>
          <p>1. Explain one way people can prepare for fast natural disasters. Use a detail from the text.</p>
          <textarea value={written.q1} onChange={(e) => setWritten({ ...written, q1: e.target.value })} rows={4} className="text-area" />

          <p>2. Describe how slow changes like erosion affect landforms. Give an example from the story.</p>
          <textarea value={written.q2} onChange={(e) => setWritten({ ...written, q2: e.target.value })} rows={4} className="text-area" />

          <p>3. Compare a fast and a slow natural change. How are they different in how they affect the Earth?</p>
          <textarea value={written.q3} onChange={(e) => setWritten({ ...written, q3: e.target.value })} rows={4} className="text-area" />

          <button onClick={handleFinalSubmit} className="btn-submit">🚀 Submit Test</button>
        </div>
      )}

      {/* Step 4: Final Message */}
      {step === 4 && (
        <div className="final-container">
          <div className="card">
            <div className="celebration">🎉🌟🎓</div>
            <h2>Test Submitted!</h2>
            <p>You got <strong>{partAScore}</strong> out of <strong>{mcQuestions.length}</strong> correct in <strong>Part A</strong>.</p>
            <p>You got <strong>{partBScore}</strong> out of <strong>{fibQuestions.length}</strong> correct in <strong>Part B</strong>.</p>
            <hr />
            <p>📝 Your written responses for <strong>Part C</strong> have been submitted to your teacher.</p>
            <p><em>✅ Your final score will be given once your teacher reviews your written answers.</em></p>
            <p className="encouragement">Great job finishing the test! 🎊</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
