import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchAllPropertyData,
  fetchClassData,
  fetchAllHistoryRecord,
  fetchAllTransactionData,
} from "../firebase/api";
import PropTypes from "prop-types";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [property, setProperty] = useState([]);
  const [classData, setClassData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  // 獲取 class 分類及 property 所有帳戶資料
  useEffect(() => {
    const unsubscribe = fetchAllPropertyData(setProperty);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = fetchClassData(setClassData);
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const unsubscribe = fetchAllHistoryRecord(setHistoryData);
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const unsubscribe = fetchAllTransactionData(setTransactionData);
    return () => unsubscribe();
  }, []);
  GlobalProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return (
    <GlobalContext.Provider
      value={{
        property,
        setProperty,
        classData,
        setClassData,
        historyData,
        setHistoryData,
        transactionData,
        setTransactionData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
