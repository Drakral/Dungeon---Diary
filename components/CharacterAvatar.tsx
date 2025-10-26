
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface CharacterAvatarProps {
  characterName: string;
  characterClass: string;
  race: string;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  size?: number;
}

export default function CharacterAvatar({
  characterName,
  characterClass,
  race,
  stats,
  size = 200,
}: CharacterAvatarProps) {
  // Generate colors based on character attributes
  const getClassColor = (charClass: string) => {
    const classColors: { [key: string]: string } = {
      barbarian: '#8B0000',
      bard: '#9370DB',
      cleric: '#FFD700',
      druid: '#228B22',
      fighter: '#B22222',
      monk: '#4169E1',
      paladin: '#FFD700',
      ranger: '#2E8B57',
      rogue: '#2F4F4F',
      sorcerer: '#DC143C',
      warlock: '#8B008B',
      wizard: '#4169E1',
    };
    return classColors[charClass.toLowerCase()] || colors.primary;
  };

  const getRaceSymbol = (charRace: string) => {
    const raceSymbols: { [key: string]: string } = {
      human: '👤',
      elf: '🧝',
      dwarf: '⚒️',
      halfling: '🌾',
      dragonborn: '🐉',
      gnome: '🎩',
      'half-elf': '🧝‍♂️',
      'half-orc': '⚔️',
      tiefling: '😈',
    };
    return raceSymbols[charRace.toLowerCase()] || '⚔️';
  };

  // Calculate dominant stat for background pattern
  const getDominantStat = () => {
    const statEntries = Object.entries(stats);
    const maxStat = statEntries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    return maxStat[0];
  };

  const classColor = getClassColor(characterClass);
  const raceSymbol = getRaceSymbol(race);
  const dominantStat = getDominantStat();

  // Generate initials
  const initials = characterName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle with class color */}
      <View
        style={[
          styles.background,
          {
            backgroundColor: classColor,
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        {/* Inner circle with gradient effect */}
        <View
          style={[
            styles.innerCircle,
            {
              width: size * 0.85,
              height: size * 0.85,
              borderRadius: (size * 0.85) / 2,
            },
          ]}
        >
          {/* Race symbol */}
          <Text style={[styles.raceSymbol, { fontSize: size * 0.3 }]}>
            {raceSymbol}
          </Text>
          
          {/* Character initials */}
          <Text style={[styles.initials, { fontSize: size * 0.15 }]}>
            {initials}
          </Text>
        </View>
      </View>

      {/* Stat indicators (small dots around the avatar) */}
      <View style={styles.statIndicators}>
        {Object.entries(stats).map(([stat, value], index) => {
          const angle = (index * 60 - 90) * (Math.PI / 180);
          const radius = size * 0.45;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <View
              key={stat}
              style={[
                styles.statDot,
                {
                  left: size / 2 + x - 6,
                  top: size / 2 + y - 6,
                  backgroundColor: value >= 15 ? '#FFD700' : value >= 12 ? '#C0C0C0' : '#CD7F32',
                },
              ]}
            />
          );
        })}
      </View>

      {/* Class badge */}
      <View style={styles.classBadge}>
        <Text style={styles.classBadgeText}>{characterClass.slice(0, 3).toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  innerCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  raceSymbol: {
    marginBottom: 8,
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statIndicators: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  statDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  classBadge: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  classBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
