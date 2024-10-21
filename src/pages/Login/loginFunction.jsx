import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const email = user.email;

    const userDocRef = doc(db, "record", email);

    try {
      await updateDoc(userDocRef, {
        createdAt: new Date(),
        userEmail: email,
      });
    } catch (error) {
      if (error.code === "not-found") {
        await setDoc(userDocRef, {
          createdAt: new Date(),
          userEmail: email,
        });
      } else {
        console.error("更新失敗", error);
      }
    }
    localStorage.setItem("userEmail", email);
    localStorage.setItem("user", user.displayName);

    window.location.href = "/property";
  } catch (error) {
    console.error(
      "登入失敗",
      error.code,
      error.message,
      error.email,
      error.credential,
    );
  }
};

export default handleGoogleLogin;
