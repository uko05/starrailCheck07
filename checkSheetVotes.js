// checkSheetVotes.js
import { db } from './firebaseConfig.js';
import {
  doc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// checkSheetVotes/{questionId}/characters/{characterFile} = { count, updatedAt }
async function incrementVote(questionId, characterFile) {
  const ref = doc(db, "checkSheetVotes", questionId, "characters", characterFile);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) {
      tx.set(ref, { count: 1, updatedAt: serverTimestamp() });
    } else {
      tx.update(ref, { count: snap.data().count + 1, updatedAt: serverTimestamp() });
    }
  });
}

// tabSelections = { "TAB-03": ["キャラ.png"], ... }
export async function submitVotes(tabSelections) {
  const promises = Object.entries(tabSelections)
    .filter(([, selected]) => selected.length > 0)
    .map(([questionId, selected]) => incrementVote(questionId, selected[0]));

  const results = await Promise.allSettled(promises);
  results.forEach(r => {
    if (r.status === 'rejected') console.error("集計の書き込みに失敗", r.reason);
  });
}
