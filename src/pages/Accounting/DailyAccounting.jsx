import { getFirestoreRefs } from "../../firebase/api";
import { useState } from "react";
import { addDoc, query, getDocs, updateDoc, where } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/context/GlobalContext";
// import AddNewClass from "./AddNewClass";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DailyAccounting() {
  const { property, classData, projectData } = useGlobalContext();
  const { loginEmail } = useGlobalContext();
  const { accountingCollectionRef, propertyCollectionRef } =
    getFirestoreRefs(loginEmail);

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
      targetaccount: "",
    },
  });

  const watchType = watch("type");
  const watchAccount = watch("account");
  // const watchTargetAccount = watch("targetaccount");

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

      try {
        if (watchType === "轉帳") {
          docRef = await addDoc(accountingCollectionRef, {
            account: data.account,
            account_type: accountType,
            amount: Number(data.amount),
            time: startDate,
            targetaccount: data.targetaccount,
            record_type: data.type,
            project: data.project || null,
          });
          alert("新增成功");
          reset();
        } else {
          docRef = await addDoc(accountingCollectionRef, {
            account: data.account,
            account_type: accountType,
            amount: Number(data.amount),
            time: startDate,
            class: data.class,
            record_type: data.type,
            project: data.project || null,
          });
          alert("新增成功");
          reset();
        }
      } catch (error) {
        console.error("寫入資料時出錯：", error);
        alert("新增失敗：" + error.message);
      }
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="relative flex h-[300px] w-[280px] flex-col items-center rounded-xl border border-gray-200 bg-white p-2 shadow-lg md:h-[450px] md:w-[500px] md:p-4">
      <div className="h-[48px] text-center font-semibold md:w-[345px]">
        每日記帳
      </div>
      {/* <AddNewClass /> */}
      <div className="mb-2 flex items-center gap-3">
        <div className="text-sm font-semibold text-[##BABFD1] md:text-base">
          日期
        </div>
        <div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={5}
            timeCaption="時間"
            dateFormat="yyyy/MM/dd h:mm aa"
            className="flex h-[30px] w-[200px] items-center justify-center rounded-xl border border-black text-center focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-[48px] md:w-[250px]"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-[##BABFD1] md:text-base">
            帳戶
          </div>
          <select
            className="flex h-[30px] w-[200px] items-center justify-center rounded-xl border border-black text-center md:h-[48px] md:w-[250px]"
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
          <div className="text-sm font-semibold text-[##BABFD1] md:text-base">
            類型
          </div>
          <select
            className="flex h-[30px] w-[200px] items-center justify-center rounded-xl border border-black text-center md:h-[48px] md:w-[250px]"
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
            <div className="text-sm font-semibold text-[##BABFD1] md:text-base">
              轉入
            </div>
            <select
              className="flex h-[30px] w-[200px] items-center justify-center rounded-xl border border-black text-center md:h-[48px] md:w-[250px]"
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
            <div className="text-sm font-semibold text-[##BABFD1] md:text-base">
              分類
            </div>
            <select
              className="flex h-[30px] w-[200px] items-center justify-center rounded-xl border border-black text-center md:h-[48px] md:w-[250px]"
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
        {Array.isArray(projectData) &&
          projectData.some((item) => item.isediting) && (
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-[##BABFD1] md:text-base">
                專案
              </div>

              <select
                className="flex h-[30px] w-[200px] items-center justify-center rounded-xl border border-black text-center md:h-[48px] md:w-[250px]"
                {...register("project")}
              >
                <option value="">請選擇</option>
                {projectData
                  .filter((item) => item.isediting)
                  .map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

        <div className="flex items-center gap-3">
          <div className="text-[##BABFD1 text-sm font-semibold md:text-base">
            金額
          </div>
          <input
            className="flex h-[30px] w-[200px] items-center justify-center rounded-xl border border-black text-center md:h-[48px] md:w-[250px]"
            type="number"
            placeholder={errors.amount ? errors.amount.message : "金額不為 0"}
            {...register("amount", {
              required: "請輸入金額",
              valueAsNumber: true,
              validate: (value) => value > 0 || "金額必須大於 0",
            })}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#607196] p-1 text-sm text-white md:p-2 md:text-base"
        >
          {watchType === "轉帳" ? "我要轉帳" : "我要記一筆"}
        </button>
      </form>
    </div>
  );
}
