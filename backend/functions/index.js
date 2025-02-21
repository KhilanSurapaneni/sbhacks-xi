import { addUserToFirestore } from "./auth/addUserToFirestore.js";

export const addUserToFirestore_CF = addUserToFirestore;

import { createJournalEntry, getJournalEntry, transcribeAudioOnCreate } from "./journals/index.js";

export const createJournalEntry_CF = createJournalEntry;
export const getJournalEntry_CF = getJournalEntry;
export const transcribeAudioOnCreate_CF = transcribeAudioOnCreate;
