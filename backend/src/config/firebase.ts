import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import serviceAccount from "./serviceKey.json";
import { firebaseConfig } from "./env";

// Initialize Firebase Admin SDK
let app;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount as any),
    storageBucket: firebaseConfig.storageBucket,
    projectId: firebaseConfig.projectId
  });
} else {
  app = getApps()[0];
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
export default app;
