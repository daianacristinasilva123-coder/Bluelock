const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// When match is played, we need to add +3 trainings.
const oldMatchComplete = `    const newChar = {
      ...character,
      exp: newExp,
      level: newLevel,
      statPointsAvailable: newStatPoints,
      expToNextLevel: 100 * Math.pow(1.5, newLevel - 1),
      careerStats: {
        goals: (character.careerStats?.goals || 0) + playerStats.goals,
        assists: (character.careerStats?.assists || 0) + playerStats.assists,
        matchesPlayed: (character.careerStats?.matchesPlayed || 0) + 1,
        averageRating:
          ((character.careerStats?.averageRating || 0) * (character.careerStats?.matchesPlayed || 0) + playerStats.rating) /
          ((character.careerStats?.matchesPlayed || 0) + 1),
      },
      currentBidYen,
    };`;

const newMatchComplete = `    const newChar = {
      ...character,
      exp: newExp,
      level: newLevel,
      statPointsAvailable: newStatPoints,
      trainingsAvailable: (character.trainingsAvailable || 0) + 3,
      expToNextLevel: 100 * Math.pow(1.5, newLevel - 1),
      careerStats: {
        goals: (character.careerStats?.goals || 0) + playerStats.goals,
        assists: (character.careerStats?.assists || 0) + playerStats.assists,
        matchesPlayed: (character.careerStats?.matchesPlayed || 0) + 1,
        averageRating:
          ((character.careerStats?.averageRating || 0) * (character.careerStats?.matchesPlayed || 0) + playerStats.rating) /
          ((character.careerStats?.matchesPlayed || 0) + 1),
      },
      currentBidYen,
    };`;

code = code.replace(oldMatchComplete, newMatchComplete);

// Let's check training completion logic
const oldTrainComplete = `  const handleTrainingComplete = (expGained: number, statBonus?: { stat: keyof PlayerStats; amount: number }) => {
    if (!character) return;

    let newStats = { ...character.stats };
    if (statBonus) {
      newStats[statBonus.stat] = Math.min(95, newStats[statBonus.stat] + statBonus.amount);
    }

    const newExp = character.exp + expGained;
    let newLevel = character.level;
    let newStatPoints = character.statPointsAvailable;
    let expToNext = character.expToNextLevel;

    if (newExp >= expToNext) {
      newLevel++;
      newStatPoints += 2; // Fixed points per level
      sounds.playLevelUp();
    }

    setCharacter({
      ...character,
      stats: newStats,
      exp: newExp,
      level: newLevel,
      statPointsAvailable: newStatPoints,
      expToNextLevel: 100 * Math.pow(1.5, newLevel - 1),
    });
  };`;

const newTrainComplete = `  const handleTrainingComplete = (expGained: number, statBonus?: { stat: keyof PlayerStats; amount: number }) => {
    if (!character) return;

    let newStats = { ...character.stats };
    if (statBonus) {
      newStats[statBonus.stat] = Math.min(95, newStats[statBonus.stat] + statBonus.amount);
    }

    const newExp = character.exp + expGained;
    let newLevel = character.level;
    let newStatPoints = character.statPointsAvailable; // keeping this for legacy reasons, but not used in UI
    let expToNext = character.expToNextLevel;

    if (newExp >= expToNext) {
      newLevel++;
      newStatPoints += 2; // Fixed points per level
      sounds.playLevelUp();
    }

    setCharacter({
      ...character,
      stats: newStats,
      exp: newExp,
      level: newLevel,
      statPointsAvailable: newStatPoints,
      trainingsAvailable: Math.max(0, (character.trainingsAvailable || 0) - 1),
      expToNextLevel: 100 * Math.pow(1.5, newLevel - 1),
    });
  };`;

code = code.replace(oldTrainComplete, newTrainComplete);

fs.writeFileSync('src/App.tsx', code);
