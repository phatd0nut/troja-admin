import React from 'react';
import TeamLogos from '../utils/TeamLogos';

const UpcomingGame = ({ game, imgSize }) => {
  const { name, startUtc } = game;

  // Formatera startUtc för att visa datumet och tiden
  const eventDate = new Date(startUtc);
  const [formattedDate, formattedTime] = eventDate.toISOString().split('T');
  const time = formattedTime.substring(0, 5);

  // Dela upp matchnamnet vid " - " för att få hem- och bortalaget
  const [homeTeam, awayTeam] = name.split(" - ").map(team => team.trim());

  // Funktion för att hämta bildens URL baserat på lagets namn
  const getImageForTeam = (team) => {
    // Direkt användning av lagnamnet utan formatering
    const logo = TeamLogos[team];  // Hämta bilden från TeamLogos
    return logo || TeamLogos.defaultLogo;  // Fallback till defaultLogo om ingen bild hittas
  };

  // Hämta bilder för hemma- och bortalag
  const homeLogo = getImageForTeam(homeTeam);
  const awayLogo = getImageForTeam(awayTeam);

  return (
    <div className="nextMatch">
      <img className="homeLogo" src={homeLogo} alt={homeTeam} style={{ width: imgSize }} />
      <div className="nextMatchPDiv">
        <p>{name}</p>
        <p>{formattedDate} | {time}</p>
      </div>
      <img className="awayLogo" src={awayLogo} alt={awayTeam} style={{ width: imgSize }} />
    </div>
  );
};

export default UpcomingGame;
