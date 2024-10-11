import { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { getFirestoreRefs } from "../../firebase/api";
import { getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import Alert from "@/components/Alert";
import TransactionCard from "@/components/TransactionCard";
import PropTypes from "prop-types";
import AddNewFunction from "../../pages/Property/addNewAccount";
import Button from "../../components/Button/index";

export default function AccountDetails({
  title,
  imageSrc,
  accountType,
  bgColor,
  textColor,
}) {
  const { property, transactionData } = useGlobalContext();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountRecord, setAccountRecord] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const { loginEmail } = useGlobalContext();
  const { accountingCollectionRef, propertyCollectionRef } =
    getFirestoreRefs(loginEmail);

  const filteredAccounts = Array.isArray(property)
    ? property.filter((item) => item.account_type === accountType)
    : [];

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
  };

  const handleCloseDetail = () => {
    setSelectedAccount(null);
    setAccountRecord([]);
  };
  const [isAddNewOpen, setIsAddNewOpen] = useState(false); //這裡z-index

  const handleDeleteAccount = async (deleteOption) => {
    try {
      if (deleteOption === "保留帳單") {
        setAlertMessage("帳戶已刪除");
        setSelectedAccount(null);
        setAccountRecord([]);
        setIsAddNewOpen(false);
        await deleteDoc(doc(propertyCollectionRef, selectedAccount.id));
      } else if (deleteOption === "刪除帳單") {
        setSelectedAccount(null);
        setAccountRecord([]);
        setAlertMessage("帳戶及其所有帳單已刪除");

        setIsAddNewOpen(false);
        console.log("已刪除");
        const q = query(
          accountingCollectionRef,
          where("accountid", "==", selectedAccount.id),
        );
        const qSnapShot = await getDocs(q);
        qSnapShot.forEach(async (docSnap) => {
          await deleteDoc(doc(accountingCollectionRef, docSnap.id));
        });

        await deleteDoc(doc(propertyCollectionRef, selectedAccount.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      const records = transactionData.filter(
        (account) => account.accountid === selectedAccount.id,
      );
      records.sort((a, b) => b.time.toDate() - a.time.toDate());
      setAccountRecord(records);
    }
  }, [selectedAccount, transactionData]);

  if (!filteredAccounts || filteredAccounts.length === 0) {
    return (
      <>
        {alertMessage && (
          <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
        )}

        <div className="flex h-[300px] w-full items-center justify-center rounded-lg border bg-slate-500 bg-opacity-40 p-6 text-white md:h-[595px]">
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
          <div
            className={`relative h-11 w-32 text-nowrap opacity-100 ${isAddNewOpen ? "z-10" : ""}`}
          >
            <AddNewFunction
              account_type={accountType}
              bgColor="default"
              setIsAddNewOpen={setIsAddNewOpen}
              alertMessage={alertMessage}
              setAlertMessage={setAlertMessage}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-auto w-full flex-col items-center rounded-lg bg-[#fcfcfc] px-4 py-7 shadow-lg md:h-[595px]">
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <div className="relative mb-4 flex w-full items-center justify-center gap-3">
        <div className="">{imageSrc}</div>
        <div className="text-xl font-semibold">{title}</div>
      </div>
      <div className="relative flex h-full w-full flex-col gap-2 overflow-scroll">
        {/* 動態渲染篩選後的帳戶 */}
        {filteredAccounts.map((account) => (
          <div
            key={account.id}
            className={`flex h-[88px] w-full items-center justify-between rounded-lg p-3 ${bgColor}`}
          >
            <div className={`${textColor}`}>
              <div className="text-xl font-semibold">{account.account}</div>
              <div className="h-1 w-6 rounded-lg bg-[#031926]"></div>
              <div className="text-xl">
                NT$
                {account.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </div>
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
      </div>
      <div className={`w-full pt-5 ${isAddNewOpen ? "z-10" : ""}`}>
        <AddNewFunction
          account_type={accountType}
          bgColor="add"
          setIsAddNewOpen={setIsAddNewOpen}
          alertMessage={alertMessage}
          setAlertMessage={setAlertMessage}
        />
      </div>
      {/* 帳戶詳細紀錄顯示 */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 p-4">
          <div className="h-[80vh] w-full max-w-lg overflow-scroll rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {selectedAccount.account} 歷史紀錄
              </h2>
              <div>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="delete"
                  className="mr-2"
                >
                  刪除帳戶
                </Button>
                <Button onClick={handleCloseDetail}>取消</Button>
              </div>
            </div>
            {/* 渲染帳戶的所有紀錄 */}
            <div className="flex flex-col gap-3">
              {accountRecord?.map((item) => (
                <TransactionCard key={item.id} item={item} showTime={true} />
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
              <Button
                variant="dontdelete"
                onClick={() => {
                  handleDeleteAccount("保留帳單");
                  setShowDeleteConfirm(false);
                }}
              >
                保留所有帳單
              </Button>
              <Button
                variant="delete"
                onClick={() => {
                  handleDeleteAccount("刪除帳單");
                  setShowDeleteConfirm(false);
                }}
              >
                刪除所有帳單
              </Button>
              <Button onClick={() => setShowDeleteConfirm(false)}>取消</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
AccountDetails.propTypes = {
  title: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  accountType: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
};
