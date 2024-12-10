import * as SQLite from 'expo-sqlite';

let db;
export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('ImageMetadata.db');
  }
  return db;
};

// Initialize the database
export const initializeDatabase = async () => {
  const db = await openDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filePath TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      geolocation TEXT
    );
  `);
  console.log('Database initialized');
};

// Add an image to the database
export const addImage = async (filePath, timestamp, geolocation) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      `INSERT INTO images (filePath, timestamp, geolocation) VALUES (?, ?, ?)`,
      [filePath, timestamp, geolocation]
    );
    console.log('Image added, ID:', result.lastInsertRowId);
    return result.lastInsertRowId; e
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
};

// Fetch all images from the database
export const getImages = async () => {
  const db = await openDatabase();
  try {
    const rows = await db.getAllAsync('SELECT * FROM images');
    console.log('Fetched images:', rows);
    return rows;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Delete an image from the database
export const deleteImage = async (id) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(`DELETE FROM images WHERE id = ?`, [id]);
    console.log('Image deleted, changes:', result.changes);
    return result.changes; 
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
