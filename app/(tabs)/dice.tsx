
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface DiceRoll {
  id: string;
  type: string;
  result: number;
  timestamp: Date;
}

const DICE_TYPES = [
  { name: 'd4', sides: 4 },
  { name: 'd6', sides: 6 },
  { name: 'd8', sides: 8 },
  { name: 'd10', sides: 10 },
  { name: 'd12', sides: 12 },
  { name: 'd20', sides: 20 },
  { name: 'd100', sides: 100 },
];

export default function DiceScreen() {
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const shakeAnimation = useState(new Animated.Value(0))[0];

  const rollDice = (diceName: string, sides: number) => {
    if (isRolling) return;

    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsRolling(true);

    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate rolling delay
    setTimeout(() => {
      const result = Math.floor(Math.random() * sides) + 1;
      setLastRoll(result);

      const newRoll: DiceRoll = {
        id: Date.now().toString(),
        type: diceName,
        result: result,
        timestamp: new Date(),
      };

      setRollHistory([newRoll, ...rollHistory].slice(0, 20));
      setIsRolling(false);

      // Success haptic for natural 20
      if (Platform.OS !== 'web' && diceName === 'd20' && result === 20) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 200);
  };

  const clearHistory = () => {
    setRollHistory([]);
    setLastRoll(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dice Roller</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Display */}
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Last Roll</Text>
          <Animated.View
            style={[
              styles.resultCircle,
              {
                transform: [{ translateX: shakeAnimation }],
              },
            ]}
          >
            <Text style={styles.resultValue}>
              {lastRoll !== null ? lastRoll : '-'}
            </Text>
          </Animated.View>
        </View>

        {/* Dice Buttons */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Dice</Text>
          <View style={styles.diceGrid}>
            {DICE_TYPES.map((dice) => (
              <TouchableOpacity
                key={dice.name}
                style={[
                  styles.diceButton,
                  isRolling && styles.diceButtonDisabled,
                ]}
                onPress={() => rollDice(dice.name, dice.sides)}
                disabled={isRolling}
                activeOpacity={0.7}
              >
                <Text style={styles.diceButtonText}>{dice.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Roll History */}
        <View style={styles.card}>
          <View style={styles.historyHeader}>
            <Text style={styles.cardTitle}>Roll History</Text>
            {rollHistory.length > 0 && (
              <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {rollHistory.length === 0 ? (
            <Text style={styles.emptyText}>No rolls yet. Roll some dice!</Text>
          ) : (
            <View style={styles.historyList}>
              {rollHistory.map((roll) => (
                <View key={roll.id} style={styles.historyItem}>
                  <View style={styles.historyItemLeft}>
                    <View style={[styles.historyDiceBadge, getResultColor(roll.type, roll.result)]}>
                      <Text style={styles.historyDiceText}>{roll.type}</Text>
                    </View>
                    <Text style={styles.historyResult}>{roll.result}</Text>
                  </View>
                  <Text style={styles.historyTime}>
                    {roll.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getResultColor = (diceType: string, result: number) => {
  if (diceType === 'd20') {
    if (result === 20) return { backgroundColor: colors.secondary };
    if (result === 1) return { backgroundColor: colors.primary };
  }
  return { backgroundColor: colors.accent };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  resultCard: {
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
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  resultCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.highlight,
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
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
  diceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  diceButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  diceButtonDisabled: {
    opacity: 0.5,
  },
  diceButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.card,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.textSecondary,
    borderRadius: 6,
  },
  clearButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyDiceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  historyDiceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.card,
  },
  historyResult: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  historyTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
