import React, { useState, useEffect } from 'react';
import UpcomingGame from '../components/UpcomingGame';

const FetchUpcomingEvents = ({ imgSize }) => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/admin/upcoming-events', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Data from backend:', data); // Logga resultatet från backend
                setUpcomingEvents(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Laddar matcher...</div>;
    }

    if (error) {
        return <div>Fel: {error}</div>;
    }

    return (
        <>
            {upcomingEvents.slice(0, 5).map(game => (
                <UpcomingGame key={game.id} game={game} imgSize={imgSize} />
            ))}
        </>
    );
};

export default FetchUpcomingEvents;