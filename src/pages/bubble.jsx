import { useState, useEffect } from "react";

function Bubble() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  const fetchQuestion = async () => {
    const res = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
    const data = await res.json();

    const q = data.results[0];

    const allOptions = [...q.incorrect_answers, q.correct_answer].sort();

    setQuestion(q.question);
    setAnswer(q.correct_answer);
    setOptions(allOptions);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const check = (opt) => {
    if (opt === answer) {
      setScore(score + 10);
      setMessage("🎉 Bravo! Awesome! Wonderful!");
      playWin();
    } else {
      setMessage("❌ Oops! Try again");
      playLose();
    }
  };

  const playWin = () => {
    new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg").play();
  };

  const playLose = () => {
    new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg").play();
  };

  const saveProgress = async () => {
    await fetch("http://localhost:3000/save-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        progress: { bubbleScore: score }
      })
    });

    setMessage("Progress saved ✅");
  };

  return (
    <div className="game-box">
      <h2>Bible Trivia Q & A 🎮</h2>

      <div className="question-box">
        <p dangerouslySetInnerHTML={{ __html: question }} />
      </div>

      <div className="options">
        {options.map((opt, i) => (
          <button key={i} onClick={() => check(opt)}
            dangerouslySetInnerHTML={{ __html: opt }} />
        ))}
      </div>

      <button onClick={fetchQuestion}>Next Question</button>
      <button onClick={saveProgress}>Save Progress</button>

      <h3>Score: {score}</h3>
      <p className="message">{message}</p>
    </div>
  );
}

export default Bubble;