
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
}

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'The Adventure Begins',
      content:
        'Today we set out from the village of Phandalin. Our quest is to find the lost mine of Phandelver and rescue Gundren Rockseeker. The road ahead is dangerous, but our party is ready.',
      date: new Date(2024, 0, 15),
    },
    {
      id: '2',
      title: 'Goblin Ambush',
      content:
        'We were ambushed by goblins on the Triboar Trail. After a fierce battle, we defeated them and discovered they were working for someone called the Black Spider. We must investigate further.',
      date: new Date(2024, 0, 16),
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editingEntry, setEditingEntry] = useState<string | null>(null);

  const addEntry = () => {
    if (!newEntryTitle.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!newEntryContent.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    if (editingEntry) {
      // Update existing entry
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry
            ? { ...entry, title: newEntryTitle, content: newEntryContent }
            : entry
        )
      );
      setEditingEntry(null);
    } else {
      // Add new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntryTitle,
        content: newEntryContent,
        date: new Date(),
      };
      setEntries([newEntry, ...entries]);
    }

    setNewEntryTitle('');
    setNewEntryContent('');
    setShowAddForm(false);
  };

  const deleteEntry = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setEntries(entries.filter((entry) => entry.id !== id)),
        },
      ]
    );
  };

  const editEntry = (entry: JournalEntry) => {
    setNewEntryTitle(entry.title);
    setNewEntryContent(entry.content);
    setEditingEntry(entry.id);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setNewEntryTitle('');
    setNewEntryContent('');
    setEditingEntry(null);
    setShowAddForm(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adventure Journal</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (showAddForm && !editingEntry) {
              setShowAddForm(false);
            } else if (showAddForm && editingEntry) {
              cancelEdit();
            } else {
              setShowAddForm(true);
            }
          }}
        >
          <IconSymbol
            name={showAddForm ? 'xmark' : 'plus'}
            size={24}
            color={colors.card}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add/Edit Entry Form */}
        {showAddForm && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {editingEntry ? 'Edit Entry' : 'New Entry'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={newEntryTitle}
                onChangeText={setNewEntryTitle}
                placeholder="Enter entry title"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Content</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newEntryContent}
                onChangeText={setNewEntryContent}
                placeholder="Write your adventure notes here..."
                multiline
                numberOfLines={8}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.buttonRow}>
              {editingEntry && (
                <TouchableOpacity
                  style={[styles.submitButton, styles.cancelButton]}
                  onPress={cancelEdit}
                >
                  <Text style={styles.submitButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.submitButton, editingEntry && styles.flexButton]}
                onPress={addEntry}
              >
                <Text style={styles.submitButtonText}>
                  {editingEntry ? 'Update' : 'Save Entry'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Entries List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entries ({entries.length})</Text>

          {entries.length === 0 ? (
            <Text style={styles.emptyText}>
              No journal entries yet. Start documenting your adventure!
            </Text>
          ) : (
            <View style={styles.entriesList}>
              {entries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <View style={styles.entryHeaderLeft}>
                      <Text style={styles.entryTitle}>{entry.title}</Text>
                      <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                    </View>
                    <View style={styles.entryActions}>
                      <TouchableOpacity
                        onPress={() => editEntry(entry)}
                        style={styles.actionButton}
                      >
                        <IconSymbol name="pencil" size={18} color={colors.secondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteEntry(entry.id)}
                        style={styles.actionButton}
                      >
                        <IconSymbol name="trash" size={18} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.entryContent}>{entry.content}</Text>
                </View>
              ))}
            </View>
          )}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
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
  textArea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
  },
  flexButton: {
    flex: 1,
  },
  submitButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  entriesList: {
    gap: 12,
  },
  entryCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryHeaderLeft: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  entryContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
