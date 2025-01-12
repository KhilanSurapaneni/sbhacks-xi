import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import dotenv from 'dotenv';
import fs from 'fs';


dotenv.config({ path: '/Users/khilansurapaneni/sbhacks-xi/backend/.env' });

// Load the service account JSON file dynamically
const serviceAccountPath = process.env.PATH_TO_SERVICE_ACCOUNT_JSON;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "sbhacks-xi.appspot.com",
});

const storage = getStorage();
const firestore = getFirestore();
const auth = getAuth();

export { firestore, storage, logger, onRequest, auth, onDocumentCreated };