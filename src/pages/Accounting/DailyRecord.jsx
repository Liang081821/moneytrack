import { useEffect, useState } from "react";
import {
  fetchAllTranscationData,
  propertyCollectionRef,
} from "../../firebase/api";
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

export default function DailyRecord() {
  const [transaction, setTransaction] = useState([]);
  const { property, classData } = useGlobalContext();

  useEffect(() => {
    const unsubscribe = fetchAllTranscationData(setTransaction);
    return () => unsubscribe();
  }, []);

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
    setValue("targetaccount", item.targetaccount);
  };

  const handleCloseEdit = () => {
    setEditing(false);
    setCurrentTransaction(null);
    reset();
  };

  const recordType = watch("record_type");
  const watchAccount = watch("account");

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

  const handleSaveEdit = async (data) => {
    try {
      const docRef = doc(
        db,
        "record",
        "2001henry99@gmail.com",
        "accounting",
        currentTransaction.id,
      );
      const cleanData = {
        ...data,
        class: data.class || null,
        targetaccount: data.targetaccount || null,
      };
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

      // 檢查是否有變更
      if (
        originalAccount === newAccount &&
        originalAmount === newAmount &&
        originalTargetAccount === newTargetAccount &&
        currentTransaction.record_type === data.record_type &&
        currentTransaction.class === data.class
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
      const querySnapshotNew = await getDocs(qNew);
      const querySnapshotOriginalTarget = qOriginalTarget
        ? await getDocs(qOriginalTarget)
        : null;
      const querySnapshotNewTarget = qNewTarget
        ? await getDocs(qNewTarget)
        : null;

      const updateAccountBalance = async (docSnap, amountChange) => {
        const currentBalance = docSnap.data().balance || 0;
        const newBalance = currentBalance + amountChange;
        await updateDoc(docSnap.ref, { balance: newBalance });
      };

      let amountChangeForOriginalAccount = 0;
      let amountChangeForNewAccount = 0;
      let amountChangeForOriginalTargetAccount = 0;
      let amountChangeForNewTargetAccount = 0;

      if (isOriginalTransfer) {
        if (
          originalAccount === newAccount &&
          originalTargetAccount === newTargetAccount
        ) {
          amountChangeForNewAccount = originalAmount - newAmount;
          amountChangeForNewTargetAccount = newAmount - originalAmount;
        } else if (originalAccount !== newAccount) {
          amountChangeForOriginalAccount = originalAmount;
          amountChangeForNewAccount = -newAmount;
        } else if (originalTargetAccount !== newTargetAccount) {
          amountChangeForOriginalTargetAccount = -originalAmount;
          amountChangeForNewTargetAccount = newAmount;
        } else if (
          originalAccount === newTargetAccount &&
          originalTargetAccount === newAccount
        ) {
          amountChangeForNewAccount = originalAmount + newAmount;
          amountChangeForNewTargetAccount = -(originalAmount + newAmount);

          console.log("Change");
        }
      } else if (isNewTransfer) {
        if (isOriginalIncome) {
          if (originalAccount === newAccount) {
            amountChangeForOriginalAccount = -(originalAmount + newAmount);
            amountChangeForNewTargetAccount = newAmount;
          } else {
            amountChangeForOriginalAccount = -originalAmount;
            amountChangeForNewAccount = -newAmount;
            amountChangeForNewTargetAccount = newAmount;
          }
        } else {
          if (originalAccount === newAccount) {
            amountChangeForOriginalAccount = originalAmount - newAmount;
            amountChangeForNewTargetAccount = newAmount;
          } else {
            if (originalAccount === newTargetAccount) {
              amountChangeForNewTargetAccount = originalAmount + newAmount;
            } else {
              amountChangeForOriginalAccount = originalAmount;
              amountChangeForNewAccount = -newAmount;
              amountChangeForOriginalAccount = originalAmount;
              amountChangeForNewAccount = -newAmount;
              amountChangeForNewTargetAccount = +newAmount;
            }
          }
        }
      } else {
        if (originalAccount === newAccount) {
          // 如果帳戶未更改，計算差額
          if (isOriginalIncome && isNewIncome) {
            amountChangeForOriginalAccount = newAmount - originalAmount;
          } else if (isOriginalExpense && isNewExpense) {
            amountChangeForOriginalAccount = originalAmount - newAmount;
          } else if (isOriginalIncome && isNewExpense) {
            amountChangeForOriginalAccount = -originalAmount - newAmount;
          } else if (isOriginalExpense && isNewIncome) {
            amountChangeForOriginalAccount = originalAmount + newAmount;
          }
        } else {
          // 如果帳戶已更改，還原原始帳戶的餘額
          amountChangeForOriginalAccount = isOriginalIncome
            ? -originalAmount
            : isOriginalExpense
              ? originalAmount
              : 0;

          // 更新新帳戶的餘額
          amountChangeForNewAccount = isNewIncome
            ? newAmount
            : isNewExpense
              ? -newAmount
              : 0;
        }
      }

      // 更新帳戶餘額
      if (!querySnapshotOriginal.empty) {
        querySnapshotOriginal.forEach(async (docSnap) => {
          if (amountChangeForOriginalAccount !== 0) {
            await updateAccountBalance(docSnap, amountChangeForOriginalAccount);
          }
        });
      }

      if (!querySnapshotNew.empty) {
        querySnapshotNew.forEach(async (docSnap) => {
          if (amountChangeForNewAccount !== 0) {
            await updateAccountBalance(docSnap, amountChangeForNewAccount);
          }
        });
      }

      if (!querySnapshotOriginalTarget.empty) {
        querySnapshotOriginalTarget.forEach(async (docSnap) => {
          if (amountChangeForOriginalTargetAccount !== 0) {
            await updateAccountBalance(
              docSnap,
              amountChangeForOriginalTargetAccount,
            );
          }
        });

        if (!querySnapshotNewTarget.empty) {
          querySnapshotNewTarget.forEach(async (docSnap) => {
            if (amountChangeForNewTargetAccount !== 0) {
              await updateAccountBalance(
                docSnap,
                amountChangeForNewTargetAccount,
              );
            }
          });
        }
      }

      // 更新交易文檔
      await setDoc(docRef, cleanData, { merge: true });
      console.log("Document successfully updated!");
      alert("編輯成功");
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(
        db,
        "record",
        "2001henry99@gmail.com",
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
        const targetAmount = Number(currentTransaction.amount);

        if (!querySnapshotTarget.empty) {
          querySnapshotTarget.forEach(async (docSnap) => {
            const currentBalance = docSnap.data().balance || 0;
            const adjustedBalance = currentBalance - targetAmount;
            await updateDoc(docSnap.ref, { balance: adjustedBalance });
          });
        }
      }

      const querySnapshotOriginal = await getDocs(qOriginal);
      const originalAmount = Number(currentTransaction.amount);
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

          await updateDoc(docSnap.ref, { balance: adjustedBalance });
        });
      }
      setEditing(false);
      await deleteDoc(docRef);

      alert("刪除成功");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="h-[380px] w-[420px] overflow-scroll rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div>每日紀錄</div>
      <div>
        {Object.entries(groupedTransactions).map(([date, items]) => (
          <div key={date}>
            <div className="mb-2 mt-6 flex items-center">
              <div>{date}</div>
              <div className="mx-auto w-28 border-[0.5px] border-black"></div>
              <div>
                NT$
                {items.reduce((total, item) => {
                  if (item.record_type === "轉帳") return total;

                  const amount =
                    item.record_type === "支出"
                      ? -Number(item.amount)
                      : Number(item.amount);
                  return total + amount;
                }, 0)}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-black bg-gray-100 p-2"
                  onClick={() => handleEditClick(item)}
                >
                  <div className="flex justify-between">
                    <div>{item.record_type}</div>
                    <div
                      className={
                        item.record_type === "支出"
                          ? "text-[#468189]"
                          : "text-[#9DBEBB]"
                      }
                    >
                      {item.record_type === "支出" ? "-" : ""}
                      NT${item.amount}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      {item.class ? item.class : `轉入 ${item.targetaccount}`}
                    </div>
                    <div className="text-sm text-gray-500">{item.account}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="w-[90%] max-w-lg rounded-lg bg-white p-8">
              <div className="flex items-center justify-between">
                <h2 className="mb-4 text-xl">編輯帳單</h2>
                <button
                  type="button"
                  className="mr-2 rounded-xl bg-red-400 px-4 py-2 text-white"
                  onClick={handleDelete}
                >
                  刪除此筆
                </button>
              </div>
              <form onSubmit={handleSubmit(handleSaveEdit)}>
                <div className="mb-4 flex flex-col">
                  <label className="mb-1">帳戶</label>
                  <select
                    className="rounded-xl border p-2"
                    {...register("account", {
                      required: "請選擇帳戶",
                    })}
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
                  <label className="mb-1">類別</label>
                  <select
                    className="rounded-xl border p-2"
                    {...register("record_type", {
                      required: "請選擇類別",
                    })}
                  >
                    <option value="收入">收入</option>
                    <option value="支出">支出</option>
                    <option value="轉帳">轉帳</option>
                  </select>
                </div>

                {recordType === "轉帳" ? (
                  <div className="mb-4 flex flex-col">
                    <label className="mb-1">轉入</label>
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
                    <label className="mb-1">分類</label>
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

                <div className="mb-4 flex flex-col">
                  <label className="mb-1">金額</label>
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
                    className="mr-2 rounded-xl bg-red-400 px-4 py-2 text-white"
                    onClick={handleCloseEdit}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#9DBEBB] px-4 py-2 text-white"
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
