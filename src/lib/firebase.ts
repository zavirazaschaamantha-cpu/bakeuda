import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with long-polling to prevent WebSocket connection failures in the iframe sandbox
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

// Helper to seed a collection if it is currently empty
export async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  mockList: T[]
) {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && mockList.length > 0) {
      console.log(`Seeding collection ${collectionName} with mock data...`);
      const batch = writeBatch(db);
      mockList.forEach((item) => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item);
      });
      await batch.commit();
    }
  } catch (error) {
    console.error(`Error seeding collection ${collectionName}:`, error);
  }
}

export { 
  app, 
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch
};
