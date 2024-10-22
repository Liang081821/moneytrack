import { useGlobalContext } from "@/context/GlobalContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Google from "../../../public/google.png";
import { auth, db } from "../../firebase/firebaseConfig";
import Logo from "./Logo.png";

export default function Header({ linkToBackstage = true }) {
  const { loginState } = useGlobalContext();
  const { loginEmail } = useGlobalContext();

  const [isSticky, setIsSticky] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "test123@gmail.com",
    password: "test123",
  });

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
      console.error("登入失敗", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.log("登出失敗", error);
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsLoginMode(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const emailAsId = formData.email;
      const userDocRef = doc(db, "record", emailAsId);

      await setDoc(userDocRef, {
        name: formData.name,
        userEmail: formData.email,
        createdAt: new Date(),
      });

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("user", formData.name);

      window.location.href = "/property";
    } catch (error) {
      console.error("註冊失敗", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("user", user.displayName || formData.email);
      window.location.href = "/property";
    } catch (error) {
      console.error("登入失敗", error);
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
                onClick={handleDialogOpen}
                className="rounded-lg border border-white p-2 text-xs text-white hover:bg-white hover:text-[#222E50] xs:text-sm sm:text-base"
              >
                註冊/登入
              </button>
              <button
                onClick={handleGoogleLogin}
                className="h-[42px] w-[42px] rounded-lg border border-white p-2 text-xs text-white hover:bg-white hover:text-[#222E50] xs:text-sm sm:text-base"
              >
                <div className="">
                  <img src={Google} alt="" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[40vw] rounded-lg bg-white p-6">
            <h2 className="text-xl font-semibold">
              {isLoginMode ? "登入" : "註冊"}
            </h2>
            <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
              {!isLoginMode && (
                <div className="mt-4">
                  <label
                    htmlFor="name"
                    className="block text-lg font-medium text-gray-700"
                  >
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
                    required={!isLoginMode}
                  />
                </div>
              )}
              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-gray-700"
                >
                  電子郵件
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
                  required
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="block text-lg font-medium text-gray-700"
                >
                  密碼
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
                  required
                />
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-lg text-blue-500 hover:underline"
                >
                  {isLoginMode ? "沒有帳戶？ 註冊" : "已有帳戶？ 登入"}
                </button>
                <div>
                  <button
                    type="button"
                    onClick={handleDialogClose}
                    className="rounded-lg px-4 py-2 text-lg text-gray-700"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="ml-2 rounded-lg bg-[#607196] px-4 py-2 text-lg text-white hover:bg-indigo-700"
                  >
                    {isLoginMode ? "登入" : "註冊"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

Header.propTypes = {
  linkToBackstage: PropTypes.bool,
};
