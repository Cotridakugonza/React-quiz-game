import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setIsAuth(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Checking login...</p>;

  if (!isAuth) {
    window.location.href = "/";
    return null;
  }

  return children;
}

export default ProtectedRoute;