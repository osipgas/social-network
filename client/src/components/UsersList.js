// components/UsersList.js
import { Link } from "react-router-dom";

export default function UsersList({ usersList, onUserClick}) {
  if (!usersList.length) {
    return <p>No users found</p>;
  }

  return (
    <div className="friends-list">
      {usersList.map((f) => (
        <div key={f.id}>
          <Link to={`/profile/${f.id}/${f.username}`}>
            <button onClick={() => onUserClick && onUserClick()} >{f.username} </button>
          </Link>
        </div>
      ))}
    </div>
  );
}