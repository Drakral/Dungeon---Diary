
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import CharacterAvatar from '@/components/CharacterAvatar';
import { storage } from '@/utils/storage';

interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export default function CharacterScreen() {
  const [characterName, setCharacterName] = useState('Aragorn');
  const [characterClass, setCharacterClass] = useState('Ranger');
  const [level, setLevel] = useState('5');
  const [race, setRace] = useState('Human');
  const [hp, setHp] = useState('45');
  const [maxHp, setMaxHp] = useState('45');
  const [ac, setAc] = useState('16');
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState<CharacterStats>({
    strength: 16,
    dexterity: 14,
    constitution: 15,
    intelligence: 10,
    wisdom: 13,
    charisma: 12,
  });

  // Load character data on mount
  useEffect(() => {
    loadCharacterData();
  }, []);

  // Save character data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCharacterData();
    }
  }, [characterName, characterClass, level, race, hp, maxHp, ac, stats]);

  const loadCharacterData = async () => {
    const savedData = await storage.loadCharacter();
    if (savedData) {
      setCharacterName(savedData.characterName || 'Aragorn');
      setCharacterClass(savedData.characterClass || 'Ranger');
      setLevel(savedData.level || '5');
      setRace(savedData.race || 'Human');
      setHp(savedData.hp || '45');
      setMaxHp(savedData.maxHp || '45');
      setAc(savedData.ac || '16');
      setStats(savedData.stats || {
        strength: 16,
        dexterity: 14,
        constitution: 15,
        intelligence: 10,
        wisdom: 13,
        charisma: 12,
      });
    }
    setIsLoading(false);
  };

  const saveCharacterData = async () => {
    const data = {
      characterName,
      characterClass,
      level,
      race,
      hp,
      maxHp,
      ac,
      stats,
    };
    await storage.saveCharacter(data);
  };

  const calculateModifier = (stat: number): string => {
    const modifier = Math.floor((stat - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const StatBox = ({ label, value, onValueChange }: { label: string; value: number; onValueChange: (val: number) => void }) => (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueContainer}>
        <TouchableOpacity onPress={() => onValueChange(Math.max(1, value - 1))} style={styles.statButton}>
          <IconSymbol name="minus" size={16} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.statCircle}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statModifier}>{calculateModifier(value)}</Text>
        </View>
        <TouchableOpacity onPress={() => onValueChange(Math.min(20, value + 1))} style={styles.statButton}>
          <IconSymbol name="plus" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading character...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Character Sheet</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Character Avatar */}
        <View style={styles.avatarCard}>
          <CharacterAvatar
            characterName={characterName}
            characterClass={characterClass}
            race={race}
            stats={stats}
            size={180}
          />
          <Text style={styles.avatarName}>{characterName}</Text>
          <Text style={styles.avatarSubtitle}>
            Level {level} {race} {characterClass}
          </Text>
        </View>

        {/* Basic Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Character Name</Text>
            <TextInput
              style={styles.input}
              value={characterName}
              onChangeText={setCharacterName}
              placeholder="Enter name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Class</Text>
              <TextInput
                style={styles.input}
                value={characterClass}
                onChangeText={setCharacterClass}
                placeholder="Class"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Level</Text>
              <TextInput
                style={styles.input}
                value={level}
                onChangeText={setLevel}
                placeholder="Level"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Race</Text>
            <TextInput
              style={styles.input}
              value={race}
              onChangeText={setRace}
              placeholder="Race"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Combat Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Combat Stats</Text>
          
          <View style={styles.combatStatsRow}>
            <View style={styles.combatStat}>
              <Text style={styles.combatStatLabel}>HP</Text>
              <View style={styles.hpContainer}>
                <TextInput
                  style={styles.hpInput}
                  value={hp}
                  onChangeText={setHp}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
                <Text style={styles.hpDivider}>/</Text>
                <TextInput
                  style={styles.hpInput}
                  value={maxHp}
                  onChangeText={setMaxHp}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.combatStat}>
              <Text style={styles.combatStatLabel}>Armor Class</Text>
              <TextInput
                style={styles.acInput}
                value={ac}
                onChangeText={setAc}
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Ability Scores Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ability Scores</Text>
          
          <View style={styles.statsGrid}>
            <StatBox 
              label="STR" 
              value={stats.strength} 
              onValueChange={(val) => setStats({...stats, strength: val})}
            />
            <StatBox 
              label="DEX" 
              value={stats.dexterity} 
              onValueChange={(val) => setStats({...stats, dexterity: val})}
            />
            <StatBox 
              label="CON" 
              value={stats.constitution} 
              onValueChange={(val) => setStats({...stats, constitution: val})}
            />
            <StatBox 
              label="INT" 
              value={stats.intelligence} 
              onValueChange={(val) => setStats({...stats, intelligence: val})}
            />
            <StatBox 
              label="WIS" 
              value={stats.wisdom} 
              onValueChange={(val) => setStats({...stats, wisdom: val})}
            />
            <StatBox 
              label="CHA" 
              value={stats.charisma} 
              onValueChange={(val) => setStats({...stats, charisma: val})}
            />
          </View>
        </View>

        {/* Skills Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skills & Proficiencies</Text>
          <Text style={styles.skillText}>• Acrobatics (DEX) {calculateModifier(stats.dexterity)}</Text>
          <Text style={styles.skillText}>• Animal Handling (WIS) {calculateModifier(stats.wisdom)}</Text>
          <Text style={styles.skillText}>• Arcana (INT) {calculateModifier(stats.intelligence)}</Text>
          <Text style={styles.skillText}>• Athletics (STR) {calculateModifier(stats.strength)}</Text>
          <Text style={styles.skillText}>• Deception (CHA) {calculateModifier(stats.charisma)}</Text>
          <Text style={styles.skillText}>• History (INT) {calculateModifier(stats.intelligence)}</Text>
          <Text style={styles.skillText}>• Insight (WIS) {calculateModifier(stats.wisdom)}</Text>
          <Text style={styles.skillText}>• Intimidation (CHA) {calculateModifier(stats.charisma)}</Text>
          <Text style={styles.skillText}>• Investigation (INT) {calculateModifier(stats.intelligence)}</Text>
          <Text style={styles.skillText}>• Medicine (WIS) {calculateModifier(stats.wisdom)}</Text>
          <Text style={styles.skillText}>• Nature (INT) {calculateModifier(stats.intelligence)}</Text>
          <Text style={styles.skillText}>• Perception (WIS) {calculateModifier(stats.wisdom)}</Text>
          <Text style={styles.skillText}>• Performance (CHA) {calculateModifier(stats.charisma)}</Text>
          <Text style={styles.skillText}>• Persuasion (CHA) {calculateModifier(stats.charisma)}</Text>
          <Text style={styles.skillText}>• Religion (INT) {calculateModifier(stats.intelligence)}</Text>
          <Text style={styles.skillText}>• Sleight of Hand (DEX) {calculateModifier(stats.dexterity)}</Text>
          <Text style={styles.skillText}>• Stealth (DEX) {calculateModifier(stats.dexterity)}</Text>
          <Text style={styles.skillText}>• Survival (WIS) {calculateModifier(stats.wisdom)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
  },
  avatarCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  avatarName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  avatarSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  combatStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  combatStat: {
    flex: 1,
    alignItems: 'center',
  },
  combatStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  hpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hpInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    width: 60,
  },
  hpDivider: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  acInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    width: 80,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    width: '30%',
    minWidth: 100,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statButton: {
    padding: 4,
  },
  statCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.highlight,
    borderWidth: 2,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statModifier: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  skillText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});
