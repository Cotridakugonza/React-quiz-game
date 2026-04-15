import { useState, useEffect } from "react";

const questions = {
  easy: [
    {
      question: "Who built the ark?",
      options: ["Moses", "Noah", "David", "Paul"],
      answer: "Noah"
    },
    {
      question: "Jesus was born in?",
      options: ["Nazareth", "Bethlehem", "Jerusalem", "Rome"],
      answer: "Bethlehem"
    }
  ],
  medium: [
    {
      question: "Who led Israel out of Egypt?",
      options: ["Moses", "Joshua", "Aaron", "Elijah"],
      answer: "Moses"
    },
    {
      question: "True or False: David was a king",
      options: ["True", "False"],
      answer: "True"
    }
  ],
  hard: [
    {
      question: "Who was swallowed by a big fish?",
      options: ["Jonah", "Peter", "Paul", "Isaiah"],
      answer: "Jonah"
    }
  ]
};

function Bible() {
  const [level, setLevel] = useState("easy");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [unlocked, setUnlocked] = useState(["easy"]);

  const current = questions[level][index];

  const checkAnswer = (option) => {
    if (option === current.answer) {
      setScore(score + 10);
      setMessage("Correct 🎉");

      // unlock levels
      if (score >= 20 && !unlocked.includes("medium")) {
        setUnlocked([...unlocked, "medium"]);
      }
      if (score >= 40 && !unlocked.includes("hard")) {
        setUnlocked([...unlocked, "hard"]);
      }

      playSound("correct");
    } else {
      setMessage("Wrong ❌");
      playSound("wrong");
    }
  };

  const next = () => {
    setIndex((index + 1) % questions[level].length);
    setMessage("");
  };

  const saveProgress = async () => {
    await fetch("http://localhost:3000/save-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        progress: { bibleScore: score }
      })
    });

    setMessage("Progress saved ✅");
  };

  const playSound = (type) => {
    const audio = new Audio(
      type === "correct"
        ? "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
        : "https://actions.google.com/sounds/v1/cartoon/boing.ogg"
    );
    audio.play();
  };

  return (
    <div className="bible-game">
      <h2>Bible Adventure 📖</h2>

      <div className="levels">
        {["easy", "medium", "hard"].map((lvl) => (
          <button
            key={lvl}
            disabled={!unlocked.includes(lvl)}
            onClick={() => {
              setLevel(lvl);
              setIndex(0);
            }}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="question-box">
        <p>{current.question}</p>
      </div>

      <div className="options">
        {current.options.map((opt, i) => (
          <button key={i} onClick={() => checkAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>

      <button onClick={next}>Next</button>
      <button onClick={saveProgress}>Save Progress</button>

      <h3>Score: {score}</h3>
      <p className="message">{message}</p>
    </div>
  );
}

export default Bible;