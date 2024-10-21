import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
const getFirestoreRefs = (loginEmail) => {
  if (!loginEmail) {
    console.error("loginEmail is undefined or null");
    return {};
  }
  const accountingCollectionRef = collection(
    db,
    "record",
    loginEmail,
    "accounting",
  );
  const propertyCollectionRef = collection(
    db,
    "record",
    loginEmail,
    "property",
  );
  const projectCollectionRef = collection(db, "record", loginEmail, "project");
  const reportCollectionRef = collection(db, "record", loginEmail, "report");

  const historyCollectionRef = collection(db, "record", loginEmail, "history");
  const docRef = doc(db, "record", loginEmail);

  return {
    accountingCollectionRef,
    propertyCollectionRef,
    historyCollectionRef,
    projectCollectionRef,
    reportCollectionRef,
    docRef,
  };
};

const fetchClassData = (loginEmail, setClassData) => {
  const { docRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setClassData(docSnap.data());
      } else {
        setClassData(null);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

const fetchProjectData = (loginEmail, setProjectData) => {
  const { projectCollectionRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(projectCollectionRef, (querySnapshot) => {
      const transactionData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjectData(transactionData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

const fetchAllTransactionData = (loginEmail, setTransactionData) => {
  const { accountingCollectionRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(accountingCollectionRef, (querySnapshot) => {
      const transactionData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactionData(transactionData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

const fetchAllPropertyData = (loginEmail, setPropertyData) => {
  const { propertyCollectionRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(propertyCollectionRef, (querySnapshot) => {
      const propertyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPropertyData(propertyData);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

const fetchAllHistoryRecord = (loginEmail, setHistoryRecord) => {
  const { historyCollectionRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(historyCollectionRef, (querySnapshot) => {
      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistoryRecord(historyData);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching history records:", error);
  }
};

const fetchAllReportRecord = (loginEmail, setReportRecord) => {
  const { reportCollectionRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(reportCollectionRef, (querySnapshot) => {
      const reportData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReportRecord(reportData);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching history records:", error);
  }
};

export {
  fetchAllHistoryRecord,
  fetchAllPropertyData,
  fetchAllReportRecord,
  fetchAllTransactionData,
  fetchClassData,
  fetchProjectData,
  getFirestoreRefs,
};
