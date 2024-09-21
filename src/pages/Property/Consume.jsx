import { useGlobalContext } from "../../context/GlobalContext";
import { useState, useEffect } from "react";
import { getFirestoreRefs } from "../../firebase/api";
import { getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

export default function Consume() {
  const { property } = useGlobalContext();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountrecord, setAccountRecord] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { loginEmail } = useGlobalContext();
  const { accountingCollectionRef, propertyCollectionRef } =
    getFirestoreRefs(loginEmail);

  const consumeAccounts = Array.isArray(property)
    ? property.filter((item) => item.account_type === "消費")
    : [];

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
  };

  const handleCloseDetail = () => {
    setSelectedAccount(null);
    setAccountRecord([]);
  };

  const handleDeleteAccount = async (deleteOption) => {
    try {
      if (deleteOption === "保留帳單") {
        await deleteDoc(doc(propertyCollectionRef, selectedAccount.id));
        alert("帳戶已刪除");
      } else if (deleteOption === "刪除帳單") {
        const q = query(
          accountingCollectionRef,
          where("account", "==", selectedAccount.account),
        );
        const qSnapShot = await getDocs(q);
        qSnapShot.forEach(async (docSnap) => {
          await deleteDoc(doc(accountingCollectionRef, docSnap.id));
        });
        await deleteDoc(doc(propertyCollectionRef, selectedAccount.id));
        alert("帳戶及其所有帳單已刪除");
      }

      setSelectedAccount(null);
      setAccountRecord([]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      const getAccountData = async () => {
        try {
          const q = query(
            accountingCollectionRef,
            where("account", "==", selectedAccount.account),
          );
          const qSnapShot = await getDocs(q);
          const records = qSnapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          records.sort((a, b) => b.time.toDate() - a.time.toDate());
          setAccountRecord(records);
        } catch (e) {
          console.error(e);
        }
      };
      getAccountData();
    }
  }, [selectedAccount, accountingCollectionRef]);
  if (!consumeAccounts || consumeAccounts.length === 0) {
    return (
      <div className="mb-4 mt-4 flex h-[595px] w-[420px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="mb-2 h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        <p>新增消費帳戶，解鎖區塊</p>
      </div>
    );
  }
  return (
    <div className="flex h-[595px] w-[420px] flex-col items-center rounded-2xl border border-black">
      <div className="mt-3">消費</div>

      {/* 動態渲染篩選後的帳戶 */}
      {consumeAccounts.map((account) => (
        <div
          key={account.id}
          className="m-3 flex h-[88px] w-[360px] items-center justify-between rounded-2xl border border-[#01B8E3] p-3"
        >
          <div>
            <div className="text-xs">{account.account}</div>
            <div className="text-2xl">${account.balance}</div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 cursor-pointer"
            onClick={() => handleAccountClick(account)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
      ))}

      {/* 帳戶詳細紀錄顯示 */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {selectedAccount.account} 歷史紀錄
              </h2>
              <div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mr-2 rounded-xl bg-red-500 p-2 text-white"
                >
                  刪除帳戶
                </button>
                <button
                  onClick={handleCloseDetail}
                  className="rounded-full p-2"
                >
                  關閉
                </button>
              </div>
            </div>
            {/* 渲染帳戶的所有紀錄 */}
            {accountrecord?.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-black bg-gray-100 p-2"
              >
                <div>{record.time.toDate().toLocaleDateString()}</div>
                <div className="flex justify-between">
                  <div>{record.record_type}</div>
                  <div
                    className={
                      record.record_type === "支出"
                        ? "text-[#468189]"
                        : "text-[#9DBEBB]"
                    }
                  >
                    {record.record_type === "支出" ? "-" : ""}
                    NT${record.amount}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    {record.class
                      ? record.class
                      : `轉入 ${record.targetaccount}`}
                  </div>
                  <div className="text-sm text-gray-500">{record.account}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 刪除確認彈窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4">
            <h2 className="mb-4 text-xl font-bold">確定要刪除帳戶嗎？</h2>
            <div className="flex justify-around">
              <button
                className="rounded-lg bg-green-500 p-2 text-white"
                onClick={() => {
                  handleDeleteAccount("保留帳單");
                  setShowDeleteConfirm(false);
                }}
              >
                保留所有帳單
              </button>
              <button
                className="rounded-lg bg-red-500 p-2 text-white"
                onClick={() => {
                  handleDeleteAccount("刪除帳單");
                  setShowDeleteConfirm(false);
                }}
              >
                刪除所有帳單
              </button>
              <button
                className="rounded-lg bg-gray-500 p-2 text-white"
                onClick={() => setShowDeleteConfirm(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
