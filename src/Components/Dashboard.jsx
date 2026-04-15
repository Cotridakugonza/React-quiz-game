import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (!data || data.message === "Not logged in") {
          window.location.href = "/";
        } else {
          setUser(data);
        }
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome {user.username} 🎉</h1>

      <p>Bubble Score: {user.progress?.bubbleScore}</p>
      <p>Bible Score: {user.progress?.bibleScore}</p>
    </div>
  );
}

export default Dashboard;