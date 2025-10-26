
import React, { useState, useEffect } from 'react';
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
import { storage } from '@/utils/storage';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  description: string;
}

const DEFAULT_ITEMS: InventoryItem[] = [
  {
    id: '1',
    name: 'Longsword',
    quantity: 1,
    weight: 3,
    description: 'A versatile martial weapon',
  },
  {
    id: '2',
    name: 'Health Potion',
    quantity: 3,
    weight: 0.5,
    description: 'Restores 2d4+2 hit points',
  },
  {
    id: '3',
    name: 'Rope (50ft)',
    quantity: 1,
    weight: 10,
    description: 'Hemp rope, 50 feet',
  },
  {
    id: '4',
    name: 'Gold Pieces',
    quantity: 150,
    weight: 0,
    description: 'Currency',
  },
];

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>(DEFAULT_ITEMS);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemWeight, setNewItemWeight] = useState('0');
  const [newItemDescription, setNewItemDescription] = useState('');

  // Load inventory on mount
  useEffect(() => {
    loadInventory();
  }, []);

  // Save inventory whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveInventory();
    }
  }, [items]);

  const loadInventory = async () => {
    const savedItems = await storage.loadInventory();
    if (savedItems && savedItems.length > 0) {
      setItems(savedItems);
    }
    setIsLoading(false);
  };

  const saveInventory = async () => {
    await storage.saveInventory(items);
  };

  const totalWeight = items.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  const addItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName,
      quantity: parseInt(newItemQuantity) || 1,
      weight: parseFloat(newItemWeight) || 0,
      description: newItemDescription,
    };

    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemQuantity('1');
    setNewItemWeight('0');
    setNewItemDescription('');
    setShowAddForm(false);
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setItems(items.filter((item) => item.id !== id)),
        },
      ]
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading inventory...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
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
        {/* Weight Display */}
        <View style={styles.weightCard}>
          <Text style={styles.weightLabel}>Total Weight</Text>
          <Text style={styles.weightValue}>{totalWeight.toFixed(1)} lbs</Text>
        </View>

        {/* Add Item Form */}
        {showAddForm && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add New Item</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Name</Text>
              <TextInput
                style={styles.input}
                value={newItemName}
                onChangeText={setNewItemName}
                placeholder="Enter item name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={newItemQuantity}
                  onChangeText={setNewItemQuantity}
                  placeholder="1"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Weight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  value={newItemWeight}
                  onChangeText={setNewItemWeight}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newItemDescription}
                onChangeText={setNewItemDescription}
                placeholder="Enter description"
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={addItem}>
              <Text style={styles.submitButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Items List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items ({items.length})</Text>

          {items.length === 0 ? (
            <Text style={styles.emptyText}>
              No items in inventory. Add some items!
            </Text>
          ) : (
            <View style={styles.itemsList}>
              {items.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <TouchableOpacity
                      onPress={() => deleteItem(item.id)}
                      style={styles.deleteButton}
                    >
                      <IconSymbol name="trash" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  {item.description ? (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  ) : null}

                  <View style={styles.itemFooter}>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, -1)}
                        style={styles.quantityButton}
                      >
                        <IconSymbol name="minus" size={16} color={colors.primary} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>×{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 1)}
                        style={styles.quantityButton}
                      >
                        <IconSymbol name="plus" size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemWeight}>
                      {(item.weight * item.quantity).toFixed(1)} lbs
                    </Text>
                  </View>
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
  weightCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  weightLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  weightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
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
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
  },
  itemWeight: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
