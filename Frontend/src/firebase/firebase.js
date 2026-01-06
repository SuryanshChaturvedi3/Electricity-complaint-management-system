// 1️⃣ Firebase ko start karne wali machine import
import { initializeApp } from "firebase/app";

// 2️⃣ Firebase ka Authentication department import
import { getAuth } from "firebase/auth";

// 3️⃣ Firebase Console se milne wali details
const firebaseConfig = {
  apiKey: "AIzaSyDn15abtX9bO5rSNQzNCtIC2zjswwcsNKk",
  authDomain: "electricity-complaint-system.firebaseapp.com",
  projectId: "electricity-complaint-system",
};

// 4️⃣ Firebase app start
const app = initializeApp(firebaseConfig);

// 5️⃣ Auth service nikal li
export const auth = getAuth(app);


