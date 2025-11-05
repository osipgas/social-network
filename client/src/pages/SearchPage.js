// pages/SearchPage.jsx
import { useState } from "react";
import { Navigate } from "react-router-dom";
import UsersList from "../components/UsersList.js";

export function SearchPage() {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    const [usersList, setUsersList] = useState([]); // состояние для результатов поиска

    if (!username) {
        return <Navigate to="/login" />;
    }

    const handleChange = async (e) => {
        const query = e.target.value;
        try {
            if (query.length !== 0) {
                const res = await fetch('http://localhost:5001/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                if (!res.ok) throw new Error('Ошибка сервера');

                const data = await res.json();
                setUsersList(data.users); // обновляем состояние
            }
        } catch (err) {
            console.error(err);
        } 
    };

    return (
        <div className="profile-container">
            <button onClick={() => window.location.href = '/'} className="back-button">
                {"<"}
            </button>

            <div className="description-group">
                <textarea
                    onChange={handleChange}
                    placeholder="Search"
                    className="description-field"
                />
            </div>

            <div className="profile-container">
                <UsersList usersList={usersList} />
            </div>
        </div>
    );
}