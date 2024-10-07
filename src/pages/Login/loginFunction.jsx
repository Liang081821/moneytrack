import { auth } from "../../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    console.log(token);
    const user = result.user;

    const email = user.email;

    const userDocRef = doc(db, "record", email);

    try {
      await updateDoc(userDocRef, {
        createdAt: new Date(),
        userEmail: email,
      });
      console.log("資料更新成功");
    } catch (error) {
      if (error.code === "not-found") {
        await setDoc(userDocRef, {
          createdAt: new Date(),
          userEmail: email,
        });
        console.log("文件不存在，已創建新的文件");
      } else {
        console.error("更新失敗", error);
      }
    }
    localStorage.setItem("userEmail", email);
    localStorage.setItem("user", user.displayName);

    console.log("登入成功", user);
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
