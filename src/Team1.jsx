import React from 'react';
import Team from './Team';

const Team1 = ({ onTeamData }) => {
  const handleTeamData = (teamData) => {
    localStorage.setItem('team1Data', JSON.stringify(teamData));
    onTeamData(teamData);
  };

  return <Team teamKey="team1Data" onTeamData={handleTeamData} />;
};

export default Team1;
