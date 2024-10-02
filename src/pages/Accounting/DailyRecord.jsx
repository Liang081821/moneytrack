import { useEffect, useState } from "react";
import { fetchAllTransactionData, getFirestoreRefs } from "../../firebase/api";
import {
  doc,
  setDoc,
  query,
  getDocs,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/context/GlobalContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DailyRecord() {
  const [transaction, setTransaction] = useState([]);
  const { property, classData, projectData } = useGlobalContext();
  const [startDate, setStartDate] = useState();
  const { loginEmail } = useGlobalContext();

  const { propertyCollectionRef } = getFirestoreRefs(loginEmail);

  useEffect(() => {
    const unsubscribe = fetchAllTransactionData(loginEmail, setTransaction);
    return () => unsubscribe();
  }, [loginEmail]);

  const groupByDate = (transactions) => {
    const sortedTransactions = transactions.sort((a, b) => {
      return b.time.toDate() - a.time.toDate();
    });

    return sortedTransactions.reduce((groups, transaction) => {
      const dateObj = transaction.time.toDate();
      const date = dateObj.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  };

  const groupedTransactions = groupByDate(transaction);
  const [editing, setEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      record_type: "",
      class: "",
      account: "",
      amount: 0,
      targetaccount: "",
    },
  });

  const handleEditClick = (item) => {
    setCurrentTransaction(item);
    setEditing(true);
    setValue("record_type", item.record_type);
    setValue("class", item.class);
    setValue("account", item.account);
    setValue("amount", item.amount);
    setValue("project", item.project || "");
    setValue("targetaccount", item.targetaccount);
    const transactionDate = item.time.toDate();
    setStartDate(transactionDate);
  };

  const handleCloseEdit = () => {
    setEditing(false);
    setCurrentTransaction(null);
    reset();
  };

  const recordType = watch("record_type");
  const watchAccount = watch("account");
  const watchTargetAccount = watch("targetaccount");

  const optionsToRender =
    recordType === "收入"
      ? classData.income
      : recordType === "支出"
        ? classData.expense
        : [];

  const accountsToRender = property.filter((item) => {
    return item.account !== watchAccount;
  });
  useEffect(() => {
    if (editing && recordType !== currentTransaction?.record_type) {
      setValue("class", "");
    }
  }, [recordType, setValue, editing, currentTransaction?.record_type]);

  useEffect(() => {
    if (editing && watchAccount !== currentTransaction?.account) {
      setValue("targetaccount", "");
    }
  }, [watchAccount, setValue, editing, currentTransaction?.account]);
  const { rates } = useGlobalContext();

  const handleSaveEdit = async (data) => {
    try {
      const docRef = doc(
        db,
        "record",
        loginEmail,
        "accounting",
        currentTransaction.id,
      );

      const originalAccount = currentTransaction.account;
      const newAccount = data.account;
      const originalAmount = Number(currentTransaction.amount);
      const newAmount = Number(data.amount);
      const originalTargetAccount = currentTransaction.targetaccount;
      const newTargetAccount = data.targetaccount;

      const isOriginalIncome = currentTransaction.record_type === "收入";
      const isOriginalExpense = currentTransaction.record_type === "支出";
      const isOriginalTransfer = currentTransaction.record_type === "轉帳";
      const isNewIncome = data.record_type === "收入";
      const isNewExpense = data.record_type === "支出";
      const isNewTransfer = data.record_type === "轉帳";
      const currencyType = currentTransaction.currency;

      const areDatesEqual =
        startDate.getTime() === currentTransaction.time.toDate().getTime();

      if (
        originalAccount === newAccount &&
        originalAmount === newAmount &&
        originalTargetAccount === newTargetAccount &&
        currentTransaction.record_type === data.record_type &&
        currentTransaction.class === data.class &&
        areDatesEqual &&
        currentTransaction.project === data.project
      ) {
        alert("沒有變更，不需要保存。");
        return;
      }

      // 查詢帳戶
      const qOriginal = query(
        propertyCollectionRef,
        where("account", "==", originalAccount),
      );
      const qNew = query(
        propertyCollectionRef,
        where("account", "==", newAccount),
      );
      const qOriginalTarget = originalTargetAccount
        ? query(
            propertyCollectionRef,
            where("account", "==", originalTargetAccount),
          )
        : null;

      const qNewTarget = newTargetAccount
        ? query(propertyCollectionRef, where("account", "==", newTargetAccount))
        : null;

      const querySnapshotOriginal = await getDocs(qOriginal);
      console.log(
        "Original Account Query Result:",
        querySnapshotOriginal.empty
          ? "No documents found"
          : querySnapshotOriginal.docs.map((doc) => doc.data()),
      );

      const querySnapshotNew = await getDocs(qNew);
      console.log(
        "New Account Query Result:",
        querySnapshotNew.empty
          ? "No documents found"
          : querySnapshotNew.docs.map((doc) => doc.data()),
      );

      const querySnapshotOriginalTarget = qOriginalTarget
        ? await getDocs(qOriginalTarget)
        : null;
      if (querySnapshotOriginalTarget) {
        console.log(
          "Original Target Account Query Result:",
          querySnapshotOriginalTarget.empty
            ? "No documents found"
            : querySnapshotOriginalTarget.docs.map((doc) => doc.data()),
        );
      } else {
        console.log("No Original Target Account Query");
      }

      const querySnapshotNewTarget = qNewTarget
        ? await getDocs(qNewTarget)
        : null;
      if (querySnapshotNewTarget) {
        console.log(
          "New Target Account Query Result:",
          querySnapshotNewTarget.empty
            ? "No documents found"
            : querySnapshotNewTarget.docs.map((doc) => doc.data()),
        );
      } else {
        console.log("No New Target Account Query");
      }

      const updateAccountBalance = async (docSnap, amountChange) => {
        const currentBalance = docSnap.data().balance || 0;
        const newBalance = currentBalance + amountChange;
        await updateDoc(docSnap.ref, { balance: newBalance });
      };

      let amountChangeForOriginalAccount = 0;
      let amountChangeForNewAccount = 0;
      let amountChangeForOriginalTargetAccount = 0;
      let amountChangeForNewTargetAccount = 0;

      if (isOriginalTransfer && isNewTransfer) {
        if (
          originalAccount === newAccount &&
          originalTargetAccount === newTargetAccount
        ) {
          // 1. 轉入和轉出帳戶都未更改
          console.log("1");
          amountChangeForNewAccount = originalAmount - newAmount;
          amountChangeForNewTargetAccount = newAmount - originalAmount;
        } else if (
          originalAccount === newTargetAccount &&
          originalTargetAccount === newAccount
        ) {
          // 2. 轉入和轉出帳戶互換
          console.log("2");
          amountChangeForNewAccount = -(originalAmount + newAmount);
          amountChangeForNewTargetAccount = originalAmount + newAmount;
        } else if (
          originalAccount !== newAccount &&
          originalTargetAccount === newTargetAccount
        ) {
          // 3. 只改變了轉出帳戶
          console.log("3");
          amountChangeForOriginalAccount = originalAmount;
          amountChangeForNewAccount = -newAmount;
        } else if (
          originalTargetAccount !== newTargetAccount &&
          originalAccount === newAccount
        ) {
          // 4. 只改變了轉入帳戶
          console.log("4");
          amountChangeForOriginalTargetAccount = -originalAmount;
          amountChangeForNewTargetAccount = newAmount;
        } else if (
          originalAccount !== newTargetAccount &&
          originalTargetAccount !== newAccount
        ) {
          // 5. 轉入和轉出帳戶都改變了
          console.log("5");
          amountChangeForOriginalAccount = originalAmount;
          amountChangeForOriginalTargetAccount = -originalAmount;
          amountChangeForNewAccount = -newAmount;
          amountChangeForNewTargetAccount = newAmount;
        }
      } else if ((isOriginalIncome || isOriginalExpense) && isNewTransfer) {
        if (isOriginalIncome) {
          if (originalAccount === newAccount) {
            console.log("6");
            amountChangeForOriginalAccount = -(originalAmount + newAmount);
            amountChangeForNewTargetAccount = newAmount;
          } else if (originalAccount === newTargetAccount) {
            console.log("7");
            amountChangeForNewAccount = -newAmount;
            amountChangeForNewTargetAccount = newAmount - originalAmount;
          } else {
            console.log("8");
            amountChangeForOriginalAccount = -originalAmount;
            amountChangeForNewAccount = -newAmount;
            amountChangeForNewTargetAccount = newAmount;
          }
        } else if (isOriginalExpense) {
          if (originalAccount === newAccount) {
            console.log("9");
            amountChangeForOriginalAccount = originalAmount - newAmount;
            amountChangeForNewTargetAccount = newAmount;
          } else if (originalAccount === newTargetAccount) {
            console.log("10");
            amountChangeForNewAccount = -newAmount;
            amountChangeForNewTargetAccount = originalAmount + newAmount;
          } else {
            console.log("11");
            amountChangeForOriginalAccount = originalAmount;
            amountChangeForNewAccount = -newAmount;
            amountChangeForNewTargetAccount = newAmount;
          }
        }
      } else if (isOriginalTransfer && (isNewIncome || isNewExpense)) {
        if (isNewIncome) {
          if (originalAccount === newAccount) {
            console.log("12");
            amountChangeForOriginalTargetAccount = -originalAmount;
            amountChangeForNewAccount = newAmount + originalAmount;
          } else {
            console.log("13");
            amountChangeForOriginalTargetAccount = -originalAmount;
            amountChangeForOriginalAccount = originalAmount;
            amountChangeForNewAccount = newAmount;
          }
        } else if (isNewExpense) {
          if (originalAccount === newAccount) {
            console.log("14");
            amountChangeForOriginalTargetAccount = -originalAmount;
            amountChangeForNewAccount = originalAmount - newAmount;
          } else {
            console.log("15");
            amountChangeForOriginalTargetAccount = -originalAmount;
            amountChangeForOriginalAccount = originalAmount;
            amountChangeForNewAccount = -newAmount;
          }
        }
      } else {
        //收入支出編輯>帳戶沒有改變
        if (originalAccount === newAccount) {
          if (isOriginalIncome && isNewIncome) {
            console.log("16");
            amountChangeForOriginalAccount = newAmount - originalAmount;
          } else if (isOriginalExpense && isNewExpense) {
            console.log("17");
            amountChangeForOriginalAccount = originalAmount - newAmount;
          } else if (isOriginalIncome && isNewExpense) {
            console.log("18");
            amountChangeForOriginalAccount = -originalAmount - newAmount;
          } else if (isOriginalExpense && isNewIncome) {
            console.log("19");
            amountChangeForOriginalAccount = originalAmount + newAmount;
          }
          //收入支出編輯>帳戶改變
        } else {
          console.log("20");
          amountChangeForOriginalAccount = isOriginalIncome
            ? -originalAmount
            : isOriginalExpense
              ? originalAmount
              : 0;

          amountChangeForNewAccount = isNewIncome
            ? newAmount
            : isNewExpense
              ? -newAmount
              : 0;
        }
      }
      let convertedAmountTWD = data.amount;

      if (currencyType !== "TWD") {
        if (rates[currencyType] && rates["TWD"]) {
          const rateToUSD = 1 / rates[currencyType];
          const rateToTWD = rates["TWD"];
          convertedAmountTWD = data.amount * rateToUSD * rateToTWD;
          amountChangeForOriginalAccount =
            amountChangeForOriginalAccount * rateToUSD * rateToTWD;
          amountChangeForNewAccount =
            amountChangeForNewAccount * rateToUSD * rateToTWD;
          amountChangeForOriginalTargetAccount =
            amountChangeForOriginalTargetAccount * rateToUSD * rateToTWD;
          amountChangeForNewTargetAccount =
            amountChangeForNewTargetAccount * rateToUSD * rateToTWD;
        } else {
          alert("匯率資料不可用，無法轉換成 TWD");
          return;
        }
      }

      console.log(amountChangeForOriginalAccount);
      console.log(amountChangeForNewAccount);

      console.log(amountChangeForOriginalTargetAccount);
      console.log(amountChangeForNewTargetAccount);
      console.log(watchTargetAccount);

      alert("編輯成功");
      handleCloseEdit();
      if (querySnapshotNewTarget && !querySnapshotNewTarget.empty) {
        querySnapshotNewTarget.forEach(async (docSnap) => {
          if (amountChangeForNewTargetAccount !== 0) {
            await updateAccountBalance(
              docSnap,
              amountChangeForNewTargetAccount,
            );
          }
        });
      }
      if (querySnapshotOriginal && !querySnapshotOriginal.empty) {
        querySnapshotOriginal.forEach(async (docSnap) => {
          if (amountChangeForOriginalAccount !== 0) {
            await updateAccountBalance(docSnap, amountChangeForOriginalAccount);
          }
        });
      }

      if (querySnapshotNew && !querySnapshotNew.empty) {
        querySnapshotNew.forEach(async (docSnap) => {
          if (amountChangeForNewAccount !== 0) {
            await updateAccountBalance(docSnap, amountChangeForNewAccount);
          }
        });
      }

      if (querySnapshotOriginalTarget && !querySnapshotOriginalTarget.empty) {
        querySnapshotOriginalTarget.forEach(async (docSnap) => {
          if (amountChangeForOriginalTargetAccount !== 0) {
            await updateAccountBalance(
              docSnap,
              amountChangeForOriginalTargetAccount,
            );
          }
        });
      }
      const cleanData = {
        ...data,
        class: data.class || null,
        targetaccount: data.targetaccount || null,
        time: startDate || currentTransaction.time,
        convertedAmountTWD: convertedAmountTWD,
      };
      await setDoc(docRef, cleanData, { merge: true });

      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(
        db,
        "record",
        loginEmail,
        "accounting",
        currentTransaction.id,
      );

      const qOriginal = query(
        propertyCollectionRef,
        where("account", "==", currentTransaction.account),
      );

      if (currentTransaction.targetaccount) {
        const qTargetAccount = query(
          propertyCollectionRef,
          where("account", "==", currentTransaction.targetaccount),
        );

        const querySnapshotTarget = await getDocs(qTargetAccount);
        const targetAmount = Number(currentTransaction.convertedAmountTWD);

        if (!querySnapshotTarget.empty) {
          querySnapshotTarget.forEach(async (docSnap) => {
            const currentBalance = docSnap.data().balance || 0;
            const adjustedBalance = currentBalance - targetAmount;
            await updateDoc(docSnap.ref, { balance: adjustedBalance });
          });
        }
      }

      const querySnapshotOriginal = await getDocs(qOriginal);
      const originalAmount = Number(currentTransaction.convertedAmountTWD);
      const isOriginalIncome = currentTransaction.record_type === "收入";
      const isOriginalExpense = currentTransaction.record_type === "支出";
      const isTransfer = currentTransaction.record_type === "轉帳";

      if (!querySnapshotOriginal.empty) {
        querySnapshotOriginal.forEach(async (docSnap) => {
          const currentBalance = docSnap.data().balance || 0;

          let adjustedBalance;
          if (isTransfer) {
            adjustedBalance = currentBalance + originalAmount;
          } else {
            adjustedBalance = isOriginalIncome
              ? currentBalance - originalAmount
              : isOriginalExpense
                ? currentBalance + originalAmount
                : currentBalance;
          }
          alert("刪除成功");
          setEditing(false);
          await updateDoc(docSnap.ref, { balance: adjustedBalance });
        });
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  if (transaction.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40 md:h-[908px]">
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
        <p>開始記帳，解鎖每日紀錄</p>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col overflow-scroll rounded-lg bg-white p-4 shadow-lg">
      <div>
        {Object.entries(groupedTransactions).map(([date, items]) => (
          <div key={date} className="mb-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="text-nowrap text-lg font-semibold text-gray-800">
                {date}
              </div>
              <div className="mx-auto w-full border-[0.5px] border-gray-400"></div>
              <div className="text-lg font-bold text-gray-800">
                NT$
                {items.reduce((total, item) => {
                  if (item.record_type === "轉帳") return total;

                  const amount =
                    item.record_type === "支出"
                      ? -Number(item.convertedAmountTWD)
                      : Number(item.convertedAmountTWD);
                  return total + amount;
                }, 0)}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 transition-all duration-200 ${
                    item.record_type === "支出"
                      ? "bg-[#5e687f] text-white"
                      : item.record_type === "轉帳"
                        ? "bg-[#A7CCED] text-gray-800"
                        : "bg-[#82A0BC] text-gray-800"
                  }`}
                  onClick={() => handleEditClick(item)}
                >
                  <div className="flex justify-between">
                    <div className="text-xl">{item.record_type}</div>
                    <div className="text-xl">
                      {item.record_type === "支出" ? "-" : ""}
                      {item.currency}$
                      {item.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div
                    className={`flex justify-between ${
                      item.record_type === "支出"
                        ? "text-gray-300"
                        : item.record_type === "轉帳"
                          ? "text-gray-800"
                          : "text-gray-800"
                    }`}
                  >
                    <div className="text-sm">
                      {item.class ? item.class : `轉入 ${item.targetaccount}`}
                    </div>
                    <div className="text-sm">{item.account}</div>
                  </div>
                  {item.project && (
                    <div
                      className={`${
                        item.record_type === "支出"
                          ? "text-white"
                          : item.record_type === "轉帳"
                            ? "text-gray-800"
                            : "text-gray-800"
                      }`}
                    >
                      <p>{item.project}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="w-[90%] max-w-lg rounded-lg bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  編輯帳單
                </h2>
                <button
                  type="button"
                  className="rounded-xl bg-[#89023E] px-4 py-2 text-white transition duration-200 hover:bg-[#CC7178]"
                  onClick={handleDelete}
                >
                  刪除此筆
                </button>
              </div>
              <form onSubmit={handleSubmit(handleSaveEdit)}>
                <div className="mb-4 flex flex-col">
                  <label className="mb-1 text-gray-700">日期</label>
                  <div>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={5}
                      timeCaption="時間"
                      dateFormat="yyyy/MM/dd h:mm aa"
                      className="rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4 flex flex-col">
                  <label className="mb-1 text-gray-700">帳戶</label>
                  <select
                    className="rounded-xl border p-2"
                    {...register("account", { required: "請選擇帳戶" })}
                  >
                    {Array.isArray(property) &&
                      property.map((item) => (
                        <option key={item.id} value={item.account}>
                          {item.account}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-4 flex flex-col">
                  <label className="mb-1 text-gray-700">類別</label>
                  <select
                    className="rounded-xl border p-2"
                    {...register("record_type", { required: "請選擇類別" })}
                  >
                    <option value="收入">收入</option>
                    <option value="支出">支出</option>
                    <option value="轉帳">轉帳</option>
                  </select>
                </div>

                {recordType === "轉帳" ? (
                  <div className="mb-4 flex flex-col">
                    <label className="mb-1 text-gray-700">轉入</label>
                    <select
                      className="rounded-xl border p-2"
                      {...register("targetaccount", {
                        required:
                          recordType === "轉帳" ? "請選擇轉入帳戶" : false,
                      })}
                    >
                      {Array.isArray(accountsToRender) &&
                        accountsToRender.map((item, index) => (
                          <option key={index} value={item.account}>
                            {item.account}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <div className="mb-4 flex flex-col">
                    <label className="mb-1 text-gray-700">分類</label>
                    <select
                      className="rounded-xl border p-2"
                      {...register("class", {
                        required:
                          recordType !== "轉帳" ? "請選擇子分類" : false,
                      })}
                    >
                      {Array.isArray(optionsToRender) &&
                        optionsToRender.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {Array.isArray(projectData) &&
                  projectData.some((item) => item.isediting) && (
                    <div className="mb-4 flex flex-col">
                      <label className="mb-1 text-gray-700">專案</label>
                      <select
                        className="rounded-xl border p-2"
                        {...register("project")}
                      >
                        {projectData
                          .filter((item) => item.isediting === true)
                          .map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                <div className="mb-4 flex flex-col">
                  <div className="mb-1 text-gray-700">幣別</div>

                  <div className="flex cursor-pointer items-center justify-center rounded-lg border p-1">
                    {currentTransaction.currency}
                  </div>
                </div>
                <div className="mb-4 flex flex-col">
                  <label className="mb-1 text-gray-700">金額</label>
                  <input
                    className="rounded-xl border p-2"
                    type="number"
                    {...register("amount", {
                      required: "請輸入金額",
                      valueAsNumber: true,
                      validate: (value) => value > 0 || "金額必須大於 0",
                    })}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-2 rounded-xl bg-[#A7CCED] px-4 py-2 text-gray-800 transition duration-200 hover:bg-[#E8E9ED]"
                    onClick={handleCloseEdit}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#607196] px-4 py-2 text-white transition duration-200 hover:bg-[#4C5966]"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
