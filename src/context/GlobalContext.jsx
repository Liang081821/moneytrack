import { createContext, useContext, useState, useEffect } from "react";
import { fetchAllPropertyData, fetchClassData } from "../firebase/api"; // 假設 API 文件在這個路徑

// 創建上下文
const GlobalContext = createContext();

// 創建提供者組件
export const GlobalProvider = ({ children }) => {
  const [property, setProperty] = useState([]);
  const [classData, setClassData] = useState([]);

  // 獲取 class 分類及 property 所有帳戶資料
  useEffect(() => {
    const unsubscribe = fetchAllPropertyData(setProperty);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = fetchClassData(setClassData);
    return () => unsubscribe();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ property, setProperty, classData, setClassData }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
