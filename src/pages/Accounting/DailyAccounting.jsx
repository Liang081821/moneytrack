import {
  accountingCollectionRef,
  propertyCollectionRef,
} from "../../firebase/api";

import { addDoc, query, getDocs, updateDoc, where } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/context/GlobalContext";
import AddNewClass from "./AddNewClass";

export default function DailyAccounting() {
  const { property, classData } = useGlobalContext();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account: "",
      type: "",
      class: "",
      amount: 0,
      targetaccount: "",
    },
  });

  const watchType = watch("type");
  const watchAccount = watch("account");
  const watchTargetAccount = watch("targetaccount");

  const optionsToRender =
    classData[
      watchType === "收入"
        ? "income"
        : watchType === "支出"
          ? "expense"
          : "transfer"
    ];
  const accountsToRender = property.filter((item) => {
    return item.account !== watchAccount;
  });

  const onSubmit = async (data) => {
    try {
      const q = query(
        propertyCollectionRef,
        where("account", "==", data.account),
      );

      if (data.targetaccount) {
        const qTarget = query(
          propertyCollectionRef,
          where("account", "==", data.targetaccount),
        );
        const qTargetSnapshot = await getDocs(qTarget);

        if (!qTargetSnapshot.empty) {
          qTargetSnapshot.forEach(async (docSnap) => {
            const currentBalance = docSnap.data().balance || 0;
            const newBalance =
              data.type === "轉帳"
                ? currentBalance + Number(data.amount)
                : currentBalance;
            await updateDoc(docSnap.ref, { balance: newBalance });
          });
        }
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          const currentBalance = docSnap.data().balance || 0;
          console.log(currentBalance);
          const newBalance =
            data.type === "收入"
              ? currentBalance + Number(data.amount)
              : currentBalance - Number(data.amount);

          await updateDoc(docSnap.ref, { balance: newBalance });
        });
      } else {
        console.log("No such document!");
      }

      let docRef;

      const accountType = !querySnapshot.empty
        ? querySnapshot.docs[0].data().account_type
        : "";

      if (watchType === "轉帳") {
        docRef = await addDoc(accountingCollectionRef, {
          account: data.account,
          account_type: accountType,
          amount: Number(data.amount),
          time: new Date(),
          targetaccount: data.targetaccount,
          record_type: data.type,
        });
      } else {
        docRef = await addDoc(accountingCollectionRef, {
          account: data.account,
          account_type: accountType,
          amount: Number(data.amount),
          time: new Date(),
          class: data.class,
          record_type: data.type,
        });
      }

      reset();
      alert("新增成功");

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="relative flex h-[380px] w-[420px] flex-col items-center rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="h-[48px] w-[345px] text-center">每日記帳</div>
      <AddNewClass />
      <div className="mb-1 flex items-center gap-3">
        <div>日期</div>
        <div className="flex h-[48px] w-[250px] items-center justify-center rounded-xl border border-black text-center">
          2024.08.31
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-1"
      >
        <div className="flex items-center gap-3">
          <div>帳戶</div>
          <select
            className="flex h-[48px] w-[250px] items-center justify-center rounded-xl border border-black text-center"
            {...register("account", {
              required: "請選擇帳戶",
            })}
          >
            <option value="">請選擇</option>
            {Array.isArray(property) &&
              property.map((item) => (
                <option key={item.id} value={item.account}>
                  {item.account}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div>類型</div>
          <select
            className="flex h-[48px] w-[250px] items-center justify-center rounded-xl border border-black text-center"
            {...register("type", {
              required: "請選擇類型",
            })}
          >
            <option value="">請選擇</option>
            <option>收入</option>
            <option>支出</option>
            <option>轉帳</option>
          </select>
        </div>
        {watchType === "轉帳" ? (
          <div className="flex items-center gap-3">
            <div>轉入</div>
            <select
              className="flex h-[48px] w-[250px] items-center justify-center rounded-xl border border-black text-center"
              {...register("targetaccount", {
                required: watchType === "轉帳" ? "請選擇目標轉入帳戶" : false,
              })}
            >
              <option value="">請選擇</option>
              {Array.isArray(accountsToRender) &&
                accountsToRender.map((item) => (
                  <option key={item.id} value={item.account}>
                    {item.account}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div>分類</div>
            <select
              className="flex h-[48px] w-[250px] items-center justify-center rounded-xl border border-black text-center"
              {...register("class", {
                required: watchType !== "轉帳" ? "請選擇目標轉入帳戶" : false,
              })}
            >
              <option value="">請選擇</option>
              {Array.isArray(optionsToRender) &&
                optionsToRender.map((item) => (
                  <option key={item.id} value={item.value}>
                    {item}
                  </option>
                ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div>金額</div>
          <input
            className="flex h-[48px] w-[250px] items-center justify-center rounded-xl border border-black text-center"
            type="number"
            placeholder={errors.amount ? errors.amount.message : "金額不為 0"}
            {...register("amount", {
              required: "請輸入金額",
              valueAsNumber: true,
              validate: (value) => value > 0 || "金額必須大於 0",
            })}
          />
        </div>

        <button type="submit" className="rounded-xl border border-black p-1">
          {watchType === "轉帳" ? "我要轉帳" : "我要記一筆"}
        </button>
      </form>
    </div>
  );
}
