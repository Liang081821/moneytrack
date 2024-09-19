// import { db } from "./firebaseConfig";
// import { collection, doc, onSnapshot } from "firebase/firestore";
// const accountingCollectionRef = collection(
//   db,
//   "record",
//   "2001henry99@gmail.com",
//   "accounting",
// );

// const propertyCollectionRef = collection(
//   db,
//   "record",
//   "2001henry99@gmail.com",
//   "property",
// );
// const historyCollectionRef = collection(
//   db,
//   "record",
//   "2001henry99@gmail.com",
//   "history",
// );
// const docRef = doc(db, "record", "2001henry99@gmail.com");

// //所有 class 的資料
// const fetchClassData = (setClassData) => {
//   try {
//     const unsubscribe = onSnapshot(docRef, (docSnap) => {
//       if (docSnap.exists()) {
//         console.log("Document data:", docSnap.data());
//         setClassData(docSnap.data());
//       } else {
//         console.log("No such document!");
//         setClassData(null);
//       }
//     });
//     return unsubscribe;
//   } catch (error) {
//     console.error("Error fetching document:", error);
//   }
// };

// //即時監聽所有 transaction 資料
// const fetchAllTransactionData = (setTransactionData) => {
//   //調用的地方會有 useState
//   try {
//     // 使用 onSnapshot 監聽資料變化
//     const unsubscribe = onSnapshot(accountingCollectionRef, (querySnapshot) => {
//       const transactionData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       console.log(transactionData);
//       setTransactionData(transactionData);
//     });

//     // 返回取消訂閱的函數
//     return unsubscribe;
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//   }
// };

// //所有帳戶的資料
// const fetchAllPropertyData = async (setPropertyData) => {
//   try {
//     const unsubscribe = onSnapshot(propertyCollectionRef, (querySnapshot) => {
//       const propertyData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       console.log(propertyData);
//       setPropertyData(propertyData);
//     });
//     return unsubscribe;
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//   }
// };

// const fetchAllHistoryRecord = async (setHistoryRecord) => {
//   try {
//     const unsubscribe = onSnapshot(historyCollectionRef, (querySnapshot) => {
//       const historyData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       console.log(historyData);
//       setHistoryRecord(historyData);
//     });
//     return unsubscribe;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export {
//   fetchAllTransactionData,
//   accountingCollectionRef,
//   propertyCollectionRef,
//   historyCollectionRef,
//   fetchAllPropertyData,
//   fetchClassData,
//   fetchAllHistoryRecord,
//   docRef,
// };
import { db } from "./firebaseConfig";
import { collection, doc, onSnapshot } from "firebase/firestore";
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
  const historyCollectionRef = collection(db, "record", loginEmail, "history");
  const docRef = doc(db, "record", loginEmail);

  return {
    accountingCollectionRef,
    propertyCollectionRef,
    historyCollectionRef,
    projectCollectionRef,
    docRef,
  };
};

//所有 class 的資料
const fetchClassData = (loginEmail, setClassData) => {
  const { docRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setClassData(docSnap.data());
      } else {
        console.log("No such document!");
        setClassData(null);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

//所有 project 的資料
const fetchProjectData = (loginEmail, setProjectData) => {
  const { projectCollectionRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(projectCollectionRef, (querySnapshot) => {
      const transactionData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(transactionData);
      setProjectData(transactionData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

//即時監聽所有 transaction 資料
const fetchAllTransactionData = (loginEmail, setTransactionData) => {
  const { accountingCollectionRef } = getFirestoreRefs(loginEmail); // 使用動態 email 獲取 collectionRef

  try {
    const unsubscribe = onSnapshot(accountingCollectionRef, (querySnapshot) => {
      const transactionData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(transactionData);
      setTransactionData(transactionData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

//所有帳戶的資料
const fetchAllPropertyData = (loginEmail, setPropertyData) => {
  const { propertyCollectionRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(propertyCollectionRef, (querySnapshot) => {
      const propertyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(propertyData);
      setPropertyData(propertyData);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

//所有歷史紀錄
const fetchAllHistoryRecord = (loginEmail, setHistoryRecord) => {
  const { historyCollectionRef } = getFirestoreRefs(loginEmail);

  try {
    const unsubscribe = onSnapshot(historyCollectionRef, (querySnapshot) => {
      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(historyData);
      setHistoryRecord(historyData);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching history records:", error);
  }
};

export {
  fetchAllTransactionData,
  getFirestoreRefs,
  fetchAllPropertyData,
  fetchClassData,
  fetchAllHistoryRecord,
  fetchProjectData,
};
