import { useGlobalContext } from "../../context/GlobalContext";
import { useState, useEffect } from "react";
import { getFirestoreRefs } from "../../firebase/api";
import { getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

export default function Consume() {
  const { property, transactionData } = useGlobalContext();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountrecord, setAccountRecord] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { loginEmail } = useGlobalContext();
  const { accountingCollectionRef, propertyCollectionRef } =
    getFirestoreRefs(loginEmail);

  const consumeAccounts = Array.isArray(property)
    ? property.filter((item) => item.account_type === "儲蓄")
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
      const records = transactionData.filter(
        (account) => account.account === selectedAccount.account,
      );
      records.sort((a, b) => b.time.toDate() - a.time.toDate());
      setAccountRecord(records);
    }
  }, [selectedAccount, transactionData]);

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
        <p>新增儲蓄帳戶，解鎖區塊</p>
      </div>
    );
  }
  return (
    <div className="flex h-[595px] w-[420px] flex-col items-center rounded-2xl bg-white shadow-md">
      <div className="mt-3 font-semibold">儲蓄</div>

      {/* 動態渲染篩選後的帳戶 */}
      {consumeAccounts.map((account) => (
        <div
          key={account.id}
          className="m-2 flex h-[88px] w-[380px] items-center justify-between rounded-xl bg-[#9DBEBB] p-3"
        >
          <div>
            <div className="text-md text-[#E8E9ED]">{account.account}</div>
            <div className="h-1 w-6 rounded-xl bg-[#031926]"></div>
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
          <div className="h-[80vh] w-full max-w-lg overflow-scroll rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {selectedAccount.account} 歷史紀錄
              </h2>
              <div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-xl bg-[#89023E] px-4 py-2 text-white transition duration-200 hover:bg-[#CC7178]"
                >
                  刪除帳戶
                </button>
                <button
                  onClick={handleCloseDetail}
                  className="mr-2 rounded-xl bg-[#F4E9CD] px-4 py-2 text-gray-800 transition duration-200 hover:bg-[#E8E9ED]"
                >
                  取消
                </button>
              </div>
            </div>
            {/* 渲染帳戶的所有紀錄 */}
            <div className="flex flex-col gap-3">
              {accountrecord?.map((record) => (
                <div
                  key={record.id}
                  className={`rounded-xl border p-3 transition-all duration-200 ${
                    record.record_type === "支出"
                      ? "bg-[#9DBEBB] text-gray-800"
                      : record.record_type === "轉帳"
                        ? "bg-[#F4E9CD] text-gray-800"
                        : "bg-[#E8E9ED] text-gray-800"
                  }`}
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
                    <div className="text-sm text-gray-500">
                      {record.account}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                className="rounded-xl bg-[#9DBEBB] px-4 py-2 text-white"
                onClick={() => {
                  handleDeleteAccount("保留帳單");
                  setShowDeleteConfirm(false);
                }}
              >
                保留所有帳單
              </button>
              <button
                className="rounded-xl bg-[#89023E] px-4 py-2 text-white transition duration-200 hover:bg-[#CC7178]"
                onClick={() => {
                  handleDeleteAccount("刪除帳單");
                  setShowDeleteConfirm(false);
                }}
              >
                刪除所有帳單
              </button>
              <button
                className="rounded-xl bg-[#F4E9CD] px-4 py-2 hover:bg-[#E8E9ED]"
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
