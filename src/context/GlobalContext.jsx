import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchAllPropertyData,
  fetchClassData,
  fetchAllHistoryRecord,
  fetchAllTransactionData,
  fetchProjectData,
  fetchAllReportRecord,
} from "../firebase/api";
import PropTypes from "prop-types";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [property, setProperty] = useState([]);
  const [classData, setClassData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [reportData, setReportData] = useState([]);

  const [historyData, setHistoryData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [loginState, setLoginState] = useState(() => {
    return localStorage.getItem("user") || null;
  });
  const [loginEmail, setLoginEmail] = useState(() => {
    return localStorage.getItem("userEmail") || null;
  });

  useEffect(() => {
    const unsubscribe = fetchAllPropertyData(loginEmail, setProperty);
    return () => unsubscribe();
  }, [loginEmail]);
  useEffect(() => {
    const unsubscribe = fetchAllReportRecord(loginEmail, setReportData);
    return () => unsubscribe();
  }, [loginEmail]);
  useEffect(() => {
    const unsubscribe = fetchClassData(loginEmail, setClassData);
    return () => unsubscribe();
  }, [loginEmail]);

  useEffect(() => {
    const unsubscribe = fetchProjectData(loginEmail, setProjectData);
    return () => unsubscribe();
  }, [loginEmail]);

  useEffect(() => {
    const unsubscribe = fetchAllHistoryRecord(loginEmail, setHistoryData);
    return () => unsubscribe();
  }, [loginEmail]);
  useEffect(() => {
    const unsubscribe = fetchAllTransactionData(loginEmail, setTransactionData);
    return () => unsubscribe();
  }, [loginEmail]);
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
        loginState,
        setLoginState,
        loginEmail,
        setLoginEmail,
        projectData,
        setProjectData,
        reportData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
