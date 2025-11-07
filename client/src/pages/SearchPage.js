// pages/SearchPage.jsx
import { Navigate } from "react-router-dom";
import UserSearchBox from "../components/UserSearchBox";

export function SearchPage() {
  const username = localStorage.getItem("username");
  if (!username) return <Navigate to="/login" />;

  return (
    <div className="profile-container">
      <button onClick={() => window.location.href = '/'} className="back-button">
        {"<"}
      </button>

      <UserSearchBox mode="global" />
    </div>
  );
}