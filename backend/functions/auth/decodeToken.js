import { auth, firestore, logger } from "../utils/firebase.js";

export const decodeToken = async ( idToken ) => {
    if (!idToken) {
        logger.error("No ID token provided.");
        return false;
    }
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const snapshot = await firestore.collection("users").where("uid", "==", uid).get();
        if (snapshot.empty) {
            return false;
        }
        const userDoc = snapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };
        return user;
    }
    catch (error) {
        logger.error("Error checking user identity:", error);
        return false;
    }
}
