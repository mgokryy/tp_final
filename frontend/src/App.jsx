import { useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setError("");

      const res = await fetch("http://20.39.233.140:30080/api/users");
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