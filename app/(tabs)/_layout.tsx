// _layout.tsx
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initializeDatabase } from './Utils/database';

const Layout = () => {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <Stack
      screenOptions={{headerShown: false,}}
    />
  );
};

export default Layout;
