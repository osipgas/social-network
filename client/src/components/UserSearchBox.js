// UserSearchBox.js
import { useState, useEffect } from "react";
import UsersList from "./UsersList";

export default function UserSearchBox({ mode = "global", baseList = [], setShowFriends }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // <--- добавили флаг

  // при пустом поиске — если mode=friends, показываем всех друзей
  useEffect(() => {
    if (mode === "friends" && query.trim() === "") {
      setUsers(baseList);
      setHasSearched(false); // <--- сбрасываем флаг
    }
  }, [mode, query, baseList]);

  const handleChange = async (e) => {
    const q = e.target.value;
    setQuery(q);

    if (mode === "friends") {
      const filtered = baseList.filter((u) =>
        u.username.toLowerCase().startsWith(q.toLowerCase())
      );
      setUsers(filtered);
      setHasSearched(true); // <--- отмечаем, что был поиск
      return;
    }

    if (q.trim().length === 0) {
      setUsers([]);
      setHasSearched(false); // <--- сбрасываем флаг при очистке
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, mode }),
      });
      if (!res.ok) throw new Error("Ошибка запроса");
      const data = await res.json();
      setUsers(data.users);
      setHasSearched(true); // <--- только после первого запроса
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserClick = () => {
    // если это поиск друзей, скрываем список
    if (mode === "friends" && setShowFriends) {
      setShowFriends(false);
    }
  };

  return (
    <div className="user-search-box">
      <div className="search-wrapper">
        <div className="search-inner">
          <img src="/icons/search.svg" alt="Search" className="search-inline-icon" />
          {!query && <span className="search-placeholder">Search</span>}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={(e) => e.target.parentElement.classList.add("focused")}
          onBlur={(e) => {
            if (!query) e.target.parentElement.classList.remove("focused");
          }}
          className="search-inline-field"
          placeholder=""
        />
        {/* Крестик */}
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={(e) => {
              setQuery("");
              setUsers([]);
              setHasSearched(false);
              e.currentTarget.parentElement.classList.remove("focused");
            }}
          >
            <img src="/icons/close.svg" alt="Clear" />
          </button>
        )}
      </div>
      <div className="search-results">
        {users.length > 0 ? (
          <UsersList usersList={users} onUserClick={handleUserClick} />
        ) : (
          // показываем "No users found" только если реально был поиск
          mode === "global" && hasSearched && <p>No users found</p>
        )}
      </div>
    </div>
  );
}