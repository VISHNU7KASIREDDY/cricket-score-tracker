import React from 'react';
import Team from './Team';

const Team2 = ({ onTeamData }) => {
  const handleTeamData = (teamData) => {
    localStorage.setItem('team2Data', JSON.stringify(teamData));
    onTeamData(teamData);
  };

  return <Team teamKey="team2Data" onTeamData={handleTeamData} />;
};

export default Team2;
