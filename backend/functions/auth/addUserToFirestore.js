import * as functions from "firebase-functions/v1";
import { firestore, logger } from "../utils/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export const addUserToFirestore = functions.auth.user().onCreate(async (user) => {
    try {
        // Prepare the user document to save in Firestore
        const userDocument = {
            uid: user.uid, // User ID from Firebase Authentication
            email: user.email || null, // Email address if available
            phoneNumber: user.phoneNumber || null, // Phone number if available
            displayName: user.displayName || null, // Display name or default
            photoURL: user.photoURL || null, // Profile photo URL if available
            createdAt: Timestamp.now(), // Timestamp for creation
        };

        // Save the user document to Firestore
        await firestore.collection("users").doc(user.uid).set(userDocument);

        // Retrieve the user document to verify it was added
        const userDocSnapshot = await firestore.collection("users").doc(user.uid).get();

        if (userDocSnapshot.exists) {
            logger.info(`User ${user.uid} added to Firestore successfully.`);
        } else {
            logger.error("Error adding user to Firestore or retrieving document:", error);
            throw new Error("Failed to add user to Firestore.");
        }

    } catch (error) {
        logger.error("Error adding user to Firestore or retrieving document:", error);
        throw new Error("Failed to add user to Firestore.");
    }
});