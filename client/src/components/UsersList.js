// components/UsersList.js
import { Link } from "react-router-dom";
export default function UsersList({ usersList, onUserClick}) {
  if (!usersList.length) {
    return <p>No users found</p>;
  }

  return (
    <div className="friends-list">
  {usersList.map(f => (
    <Link
      key={f.id}
      to={`/profile/${f.id}/${f.username}`}
      className="profile-from-list"
      onClick={() => onUserClick && onUserClick()}
    >
      {f.username}
    </Link>
  ))}
</div>
  );
}