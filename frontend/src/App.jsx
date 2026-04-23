import { useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Frontend React</h1>

      <button onClick={fetchUsers}>
        Charger les utilisateurs
      </button>

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