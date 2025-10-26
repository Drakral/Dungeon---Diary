
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration for D&D app
  const tabs: TabBarItem[] = [
    {
      name: 'character',
      route: '/(tabs)/character',
      icon: 'person.fill',
      label: 'Character',
    },
    {
      name: 'dice',
      route: '/(tabs)/dice',
      icon: 'square.grid.3x3',
      label: 'Dice',
    },
    {
      name: 'inventory',
      route: '/(tabs)/inventory',
      icon: 'bag.fill',
      label: 'Inventory',
    },
    {
      name: 'journal',
      route: '/(tabs)/journal',
      icon: 'doc.text.fill',
      label: 'Journal',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="character">
          <Icon sf="person.fill" drawable="ic_person" />
          <Label>Character</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="dice">
          <Icon sf="square.grid.3x3" drawable="ic_dice" />
          <Label>Dice</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="inventory">
          <Icon sf="bag.fill" drawable="ic_inventory" />
          <Label>Inventory</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="journal">
          <Icon sf="doc.text.fill" drawable="ic_journal" />
          <Label>Journal</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="character" />
        <Stack.Screen name="dice" />
        <Stack.Screen name="inventory" />
        <Stack.Screen name="journal" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={320} />
    </>
  );
}
