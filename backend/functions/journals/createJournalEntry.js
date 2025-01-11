import { storage, firestore, logger, onRequest, auth } from "../utils/firebase.js"; // Firebase utilities
import { decodeToken } from "../auth/decodeToken.js";
import { Timestamp } from "firebase-admin/firestore"; // Firestore Timestamp
import path from "path"; // Node.js path utilities
import { v4 as uuidv4 } from "uuid"; // Library to generate unique identifiers
import busboy from "busboy"; // Library to handle multipart/form-data

// Define a Firebase HTTPS-triggered function to create a new postcard
export const createJournalEntry = onRequest(async(req, res) => {
        if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" }); // Return 405 Method Not Allowed for non-POST requests
    }

    // Ensure the request uses 'multipart/form-data'
    if (!req.headers['content-type']?.includes('multipart/form-data')) {
        return res.status(400).json({ error: "Invalid content type, expected multipart/form-data" }); // Handle invalid content type
    }

    // const idToken = req.headers.authorization?.split("Bearer ")[1]; // Get the ID token from the Authorization header
    // const user = await decodeToken(idToken);

    // if (!user) {
    //     return res.status(401).json({ error: "Unauthorized" }); // Return 401 Unauthorized if user is not authenticated
    // }

    
    // const uid = user.uid;

    const bb = busboy({ headers: req.headers }); // Initialize Busboy for processing form-data
    const fields = {}; // Object to store form fields
    const fileUploads = []; // Array to track file upload promises
    let audioUrl = null; // URL of the uploaded audio (if provided)
    const publicMediaUrls = []; // Array to store public URLs of uploaded media files
    const localMediaPaths = []; // Array to store local paths of uploaded media files

    // Handle form fields
    bb.on("field", (name, val) => {
        fields[name] = val; // Store field value in the fields object
    });

    // Handle file uploads
    bb.on("file", (fieldname, file, info) => {
        const fileId = uuidv4(); // Generate a unique ID for the file
        const { filename, mimetype } = info; // Extract file metadata
        const filePath = `${fieldname}/${fileId}-${path.basename(filename || "unknown")}`; // Create a unique file path
        const fileUpload = storage.bucket().file(filePath); // Reference the file in Firebase Storage

        const writeStream = fileUpload.createWriteStream({
            metadata: { contentType: mimetype }, // Set file metadata
        });

        localMediaPaths.push(filePath); // Store the local path of the uploaded file
        file.pipe(writeStream); // Pipe file stream to Firebase Storage

        const uploadPromise = new Promise((resolve, reject) => {
            writeStream.on("finish", async () => {
                try {
                    // Get a signed URL for the uploaded file
                    const [url] = await fileUpload.getSignedUrl({
                        action: "read", // URL allows reading
                        expires: "03-09-2500", // Set URL expiration date
                    });

                    // Assign URLs based on the field name
                    if (fieldname === "descriptionAudio") {
                        audioUrl = url;
                    } else if (fieldname === "media" && publicMediaUrls.length < 9) {
                        publicMediaUrls.push(url);
                    } else if (fieldname === "media" && publicMediaUrls.length === 9) {
                        return reject(new Error("You can only upload up to 9 photos/videos"));
                    }

                    resolve(); // Mark file upload as successful
                } catch (error) {
                    reject(error); // Handle errors during URL generation
                }
            });

            writeStream.on("error", (error) => {
                reject(error); // Handle stream errors
            });
        });

        fileUploads.push(uploadPromise); // Add promise to the array
    });

    bb.on("error", (error) => {
        console.error("Busboy error:", error);
        res.status(500).json({ error: "Form processing error" });
    });

    // Handle completion of all form fields and files
    bb.on("finish", async () => {
        try {
            // Wait for all file uploads to complete
            await Promise.all(fileUploads);
            
            if (!fields.primaryEmotion || !fields.physicalState) {
                return res.status(400).json({ error: "Primary emotion and physical state are required" });
            }

            if (!fields.descriptionText && !audioUrl && publicMediaUrls.length === 0) {
                return res.status(400).json({ error: "At least one of description text, audio, or media is required" });
            }


            // Prepare data to be saved in Firestore
            const journalEntryData = {
                createdAt: Timestamp.now(), // Timestamp for when the journal entry is created 
                primaryEmotion: fields.primaryEmotion, // (Happy, Sad, Anxious, Calm, Angry, Excited),
                physicalState: fields.physicalState, // (Energetic, Tired, Sick, Rested, Hungry)
                descriptionText: fields.descriptionText || null, // Optional freeform text for thoughts/feelings
                descriptionAudio: audioUrl || null, // Uploaded audio file URL (if any)
                publicMediaUrls: publicMediaUrls, // Uploaded media file public URLs
                localMediaPaths: localMediaPaths, // Local paths of uploaded media files
                //uid: uid, // User ID of the journal entry creator
            };

            // Save the journal entry data in the 'journalEntries' Firestore collection
            const docRef = await firestore.collection("journalEntries").add(journalEntryData);
            res.status(201).json({ message: "Journal entry created", id: docRef.id });
        
        } catch (error) {
            logger.error("Error during file upload or saving to Firestore:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    bb.end(req.rawBody); // Feed raw request body to Busboy for Firebase Functions
});