import { useGlobalContext } from "@/context/GlobalContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import Logo from "./Logo.png";

export default function Header({ linkToBackstage = true }) {
  const { loginState } = useGlobalContext();
  const { loginEmail } = useGlobalContext();

  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");
      console.log("登出成功");
      window.location.href = "/";
    } catch (error) {
      console.log("登出失敗", error);
    }
  };

  const goToBackstage = () => {
    window.location.href = "/property";
  };

  return (
    <>
      {loginEmail ? (
        <div className="fixed top-0 z-20 flex h-[80px] w-full items-center justify-between bg-[#222E50] p-6">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="flex h-[47px] w-[42px]" />
            <div className="text-xs text-white xs:text-sm sm:text-base">
              MoneyTrack
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-white xs:text-sm sm:text-base">
              歡迎！{loginState}
            </p>
            {linkToBackstage && (
              <button
                onClick={goToBackstage}
                className="rounded-lg border border-white p-2 text-xs text-white hover:bg-white hover:text-[#222E50] xs:text-sm sm:text-base"
              >
                進入後台
              </button>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white p-2 text-xs text-white hover:bg-white hover:text-[#222E50] xs:text-sm sm:text-base"
            >
              登出
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`fixed z-10 w-[100vw] ${isSticky ? "px-4 pt-4" : ""} transition-all duration-300`}
        >
          <div
            className={`flex h-[80px] items-center justify-between p-6 ${isSticky ? "rounded-2xl bg-[#222E50]" : ""} transition-all duration-300`}
          >
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="flex h-[47px] w-[42px]" />
              <div className="text-xs text-white xs:text-sm sm:text-base">
                MoneyTrack
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoogleLogin}
                className="rounded-lg border border-white p-2 text-xs text-white hover:bg-white hover:text-[#222E50] xs:text-sm sm:text-base"
              >
                註冊/登入
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
Header.propTypes = {
  linkToBackstage: PropTypes.bool,
};
