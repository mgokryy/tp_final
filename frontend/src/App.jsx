import { useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setError("");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/users`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur serveur");
        setUsers([]);
        return;
      }

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError("La réponse n'est pas une liste d'utilisateurs");
        setUsers([]);
      }
    } catch (err) {
      setError("Impossible de contacter le backend");
      setUsers([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Frontend React</h1>
      <button onClick={fetchUsers}>Charger les utilisateurs</button>
      {error && <p>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;