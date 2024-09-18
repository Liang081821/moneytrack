import { useGlobalContext } from "../../context/GlobalContext";
import { useState, useEffect } from "react";
import { accountingCollectionRef } from "../../firebase/api";
import { getDocs, query, where } from "firebase/firestore";
export default function Consume() {
  const { property } = useGlobalContext();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountrecord, setAccountRecord] = useState([]);

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
          const q2 = query(
            accountingCollectionRef,
            where("targetaccount", "==", selectedAccount.account),
          );
          const qSnapShot2 = await getDocs(q2);
          const records2 = qSnapShot2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const combinedRecords = [...records, ...records2];
          setAccountRecord(combinedRecords);
          console.log(combinedRecords);
        } catch (e) {
          console.error(e);
        }
      };

      getAccountData();
    }
  }, [selectedAccount]);

  return (
    <div className="flex h-[595px] w-[420px] flex-col items-center rounded-2xl border border-black">
      <div className="mt-3">消費</div>

      {/* 動態渲染篩選後的帳戶 */}
      {consumeAccounts.map((account) => (
        <div
          key={account.id}
          onClick={() => handleAccountClick(account)}
          className="m-3 flex h-[88px] w-[360px] flex-col justify-center rounded-2xl border border-[#01B8E3] p-3"
        >
          <div className="text-xs">{account.account}</div>
          <div className="text-2xl">${account.balance}</div>
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
              <button
                onClick={handleCloseDetail}
                className="rounded-full bg-red-500 p-2 text-white"
              >
                關閉
              </button>
            </div>
            {/* 渲染帳戶的所有紀錄 */}
            {accountrecord?.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-black bg-gray-100 p-2"
              >
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
    </div>
  );
}
