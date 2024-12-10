import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initializeDatabase } from './(tabs)/Utils/database';

export default function Layout() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}