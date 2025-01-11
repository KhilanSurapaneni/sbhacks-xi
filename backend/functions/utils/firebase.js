import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

import serviceAccount from "/Users/khilansurapaneni/sbhacks-xi/backend/sbhacks-xi-a4fd0-firebase-adminsdk-oybuw-1689b30588.json" with { type: "json" };

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "sbhacks-xi.appspot.com",
});

const storage = getStorage();
const firestore = getFirestore();
const auth = getAuth();

export { firestore, storage, logger, onRequest , auth };