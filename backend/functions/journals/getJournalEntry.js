import { firestore, logger, onRequest } from "../utils/firebase.js"; // Firebase utilities

export const getJournalEntry = onRequest(async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" }); // Return 405 Method Not Allowed for non-GET requests
    }

    const id = req.query.id; // Get the journal entry ID from the query parameter

    if (!id) {
        return res.status(400).json({ error: "Missing entry ID" }); // Return 400 Bad Request if ID is missing
    }

    try {
        // Get a reference to the journal entry document
        const snapshot = await firestore.collection("journalEntries").doc(id).get();

        if (!snapshot.exists) {
            return res.status(404).json({ error: "Entry not found" }); // Return 404 Not Found if the journal entry is not found
        }

        const journalEntryData = snapshot.data();

        if (!journalEntryData) {
            return res.status(404).json({ error: "Entry not found" }); // Return 404 Not Found if journal entry data is missing
        }

        res.status(200).json(journalEntryData); // Return the journal entry data
    } catch (error) {
        logger.error("Error fetching journal entry:", error);
        res.status(500).json({ error: "Internal Server Error" }); // Return 500 Internal Server Error
    }
});