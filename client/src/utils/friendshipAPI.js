const API_BASE = 'http://localhost:5001';

/**
 * Определяет текущий статус дружбы между двумя пользователями.
 * @param {string} myId - ID текущего пользователя.
 * @param {string} targetId - ID профиля, который мы просматриваем.
 * @returns {string} Возвращает статус: 'accepted', 'pending_sent', 'pending_received', 'not_friends'.
 */
export async function fetchFriendStatus(myId, targetId) {
    if (!myId || !targetId) return 'not_friends';

    try {
        // Мы используем userId1 и userId2 в запросе.
        // Ваш контроллер getFriendStatus не был в routes.js, поэтому я предполагаю,
        // что для корректной работы он должен принимать два ID.
        const res = await fetch(`${API_BASE}/getFriendStatus`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId1: myId, userId2: targetId })
        });

        if (!res.ok) throw new Error('Failed to fetch status');
        
        const data = await res.json();

        if (data.length === 0) {
            return 'not_friends';
        }

        const friendship = data[0]; // Предполагаем, что возвращается одна запись
        
        if (friendship.status === 'accepted') {
            return 'accepted';
        } 
        
        // Для pending нужно определить, кто отправил запрос (user_id1 - тот, кто отправил первым)
        if (friendship.status === 'pending') {
            // Если мой ID совпадает с меньшим ID, значит, я отправил запрос,
            // поскольку в вашем контроллере addFriend ID сортируются: [id1, id2] = [id2, id1]
            const id1 = friendship.user_id1; 
            if (id1 === myId) {
                 return 'pending_sent'; // Я отправил запрос
            } else {
                 return 'pending_received'; // Мне отправили запрос
            }
        }

        return 'not_friends';

    } catch (error) {
        console.error("API Error: fetchFriendStatus", error);
        return 'not_friends';
    }
}

/**
 * Отправляет запрос на добавление в друзья.
 */
export async function sendFriendRequest(myId, targetId) {
    // В контроллере addFriend ожидаются id1 и id2, которые будут отсортированы.
    const body = { id1: myId, id2: targetId }; 

    const res = await fetch(`${API_BASE}/addFriend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    
    if (!res.ok) throw new Error("Не удалось отправить запрос в друзья.");
    return res.json();
}

/**
 * Принимает запрос на дружбу.
 */
export async function acceptFriendRequest(myId, targetId) {
    const res = await fetch(`${API_BASE}/acceptFriend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myId, friendUserId: targetId })
    });
    
    if (!res.ok) throw new Error("Не удалось принять запрос в друзья.");
    return res.json();
}

/**
 * Удаляет друга (или отменяет запрос).
 */
export async function removeFriendship(myId, targetId) {
    const res = await fetch(`${API_BASE}/removeFriend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myId, friendUserId: targetId })
    });
    
    if (!res.ok) throw new Error("Не удалось удалить друга.");
    return res.json();
}