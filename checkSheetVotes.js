// checkSheetVotes.js
import { db } from './firebaseConfig.js';
import {
  doc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const QUESTION_LABELS = {
  'TAB-01': 'TAB-01_始めた時期は？',
  'TAB-02': 'TAB-02_好きなバージョンは？',
  'TAB-03': 'TAB-03_推しキャラは？',
  'TAB-04': 'TAB-04_髪型が似てるキャラは？',
  'TAB-05': 'TAB-05_親友にするなら？',
  'TAB-06': 'TAB-06_兄妹にするなら？',
  'TAB-07': 'TAB-07_結婚するなら？',
  'TAB-08': 'TAB-08_同じ声になれるなら？',
  'TAB-09': 'TAB-09_１日入れ替わるなら？',
  'TAB-10': 'TAB-10_着てみたいキャラの服装は？',
  'TAB-11': 'TAB-11_最初に引いた星５は？',
  'TAB-12': 'TAB-12_一番欲しいキャラは？',
};

const VOTE_COOLDOWN_MS = 60 * 60 * 1000; // 1時間
const LAST_VOTE_KEY = 'starrailCheck_lastVoteTime';

// checkSheetVotes/{questionId}/characters/{characterFile} = { count, updatedAt }
async function incrementVote(questionId, characterFile) {
  const docId = QUESTION_LABELS[questionId] ?? questionId;
  const ref = doc(db, "checkSheetVotes", docId, "characters", characterFile);
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
  const lastVote = localStorage.getItem(LAST_VOTE_KEY);
  if (lastVote && Date.now() - Number(lastVote) < VOTE_COOLDOWN_MS) return;

  const promises = Object.entries(tabSelections)
    .filter(([, selected]) => selected.length > 0)
    .map(([questionId, selected]) => incrementVote(questionId, selected[0]));

  const results = await Promise.allSettled(promises);
  results.forEach(r => {
    if (r.status === 'rejected') console.error("集計の書き込みに失敗", r.reason);
  });

  localStorage.setItem(LAST_VOTE_KEY, Date.now());
}
