import { auth } from "../../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useGlobalContext } from "@/context/GlobalContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import Logo from "./Logo.png";

export default function Header() {
  const { loginState } = useGlobalContext();
  const { loginEmail } = useGlobalContext();

  // Google 登入處理程序
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
      await setDoc(userDocRef, {
        createdAt: new Date(),
        userEmail: email,
      });
      localStorage.setItem("userEmail", email);
      localStorage.setItem("user", user.displayName);

      console.log("登入成功", user);
      window.location.href = "/accounting";
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");
      console.log("登出成功");
      window.location.href = "/login";
    } catch (error) {
      console.log("登出失敗", error);
    }
  };

  return (
    <div className="flex h-[100px] items-center justify-between bg-[#222E50] p-6">
      <div className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="flex h-[47px] w-[42px]" />
        <div className="text-white">MoneyTrack</div>
      </div>
      <div className="flex items-center gap-3">
        {loginEmail ? (
          <>
            <p className="text-white">歡迎！{loginState}</p>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-white p-2 text-white hover:bg-white hover:text-[#222E50]"
            >
              登出
            </button>
          </>
        ) : (
          <button
            onClick={handleGoogleLogin}
            className="rounded-xl border border-white p-2 text-white hover:bg-white hover:text-[#222E50]"
          >
            註冊/登入
          </button>
        )}
        {/* <img src={Mail} alt="Logo" className="h-6 w-6" />
        <img src={Bell} alt="Logo" className="h-6 w-6" />
        <img src={Profile} alt="Logo" className="h-6 w-6" /> */}
      </div>
    </div>
  );
}
