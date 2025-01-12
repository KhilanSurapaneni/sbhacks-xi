import { onDocumentCreated, firestore } from "../utils/firebase.js"; // Firebase utilities
import { AssemblyAI } from "assemblyai";
import dotenv from "dotenv";

dotenv.config();

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLY_API_KEY,
});

// Firestore trigger for `journalEntries` collection
export const transcribeAudioOnCreate = onDocumentCreated(
    "journalEntries/{entryId}",
    async (event) => {
        const snapshot = event.data; // Document snapshot
        const journalEntry = snapshot.data();

        if (!journalEntry || !journalEntry.descriptionAudio) {
            console.log("No audio URL found, skipping transcription.");
            return;
        }

        //const audioUrl = journalEntry.descriptionAudio;
        const audioUrl = "https://assembly.ai/wildfires.mp3"

        try {
            const config = { audio_url: audioUrl };
            console.log("Starting transcription for:", audioUrl);

            const response = await client.transcripts.transcribe(config);

            if (response && response.text) {

                // Update Firestore entry with the transcription
                await snapshot.ref.update({
                    audioTranscript: response.text,
                });

                console.log("Transcript added to Firestore entry.");
            } else {
                console.error("Unexpected transcription response:", response);
            }
        } catch (error) {
            console.error("Error during transcription:", error);
        }
    }
);