import { addUserToFirestore } from "./auth/addUserToFirestore.js";

export const addUserToFirestore_CF = addUserToFirestore;

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
