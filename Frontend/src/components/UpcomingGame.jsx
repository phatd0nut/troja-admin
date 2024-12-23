import React from 'react';
import trj from '../assets/img/trj.png';
import IK_Pantern_logo from '../assets/img/IK_Pantern_logo.png';

const UpcomingGame = ({ game, imgSize }) => {
    const { name, startUtc } = game;

    // Formatera startUtc för att visa datumet och tiden
    const eventDate = new Date(startUtc);
    const [formattedDate, formattedTime] = eventDate.toISOString().split('T');

    // Extrahera endast HH:MM från tiden
    const time = formattedTime.substring(0, 5);

    console.log(game);

    return (
        <div className="nextMatch">
            <img src={trj} alt="" style={{ width: imgSize }} />
            <div className="nextMatchPDiv">
                <p>{name}</p>
                <p>{formattedDate} | {time}</p>
            </div>
            <img src={IK_Pantern_logo} alt="" style={{ width: imgSize }} />
        </div>
    );
};

export default UpcomingGame;