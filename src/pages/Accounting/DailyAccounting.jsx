import { getFirestoreRefs } from "../../firebase/api";
import { useState, useEffect } from "react";
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
      currency: "TWD",
    },
  });

  const watchType = watch("type");
  const watchAccount = watch("account");
  const selectedCurrency = watch("currency", "TWD"); // 使用 watch 來獲取當前選中的幣別
  const amount = watch("amount");

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
  const { currencies, rates } = useGlobalContext();
  const [convertedAmountDisplay, setConvertedAmountDisplay] = useState(0);

  useEffect(() => {
    let convertedAmountTWD = amount;
    if (selectedCurrency !== "TWD" && amount > 0) {
      if (rates[selectedCurrency] && rates["TWD"]) {
        const rateToUSD = 1 / rates[selectedCurrency];
        const rateToTWD = rates["TWD"];
        convertedAmountTWD = (amount * rateToUSD * rateToTWD).toFixed(2);
      } else {
        alert("匯率資料不可用，無法轉換成 TWD");
        return;
      }
    }
    setConvertedAmountDisplay(convertedAmountTWD);
  }, [amount, selectedCurrency, rates]);

  const onSubmit = async (data) => {
    try {
      const { amount, currency } = data;

      // 將金額轉換為 TWD
      let convertedAmountTWD = amount;
      if (currency !== "TWD") {
        if (rates[currency] && rates["TWD"]) {
          const rateToUSD = 1 / rates[currency];
          const rateToTWD = rates["TWD"];
          convertedAmountTWD = (amount * rateToUSD * rateToTWD).toFixed(2);
        } else {
          alert("匯率資料不可用，無法轉換成 TWD");
          return;
        }
      }
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
                ? currentBalance + Number(convertedAmountTWD)
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
              ? currentBalance + Number(convertedAmountTWD)
              : currentBalance - Number(convertedAmountTWD);

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
        alert("新增成功");
        reset();
        if (watchType === "轉帳") {
          docRef = await addDoc(accountingCollectionRef, {
            account: data.account,
            account_type: accountType,
            amount: Number(data.amount),
            time: startDate,
            targetaccount: data.targetaccount,
            record_type: data.type,
            project: data.project || null,
            currency: data.currency,
            convertedAmountTWD: Number(convertedAmountTWD),
          });
        } else {
          docRef = await addDoc(accountingCollectionRef, {
            account: data.account,
            account_type: accountType,
            amount: Number(data.amount),
            time: startDate,
            class: data.class,
            record_type: data.type,
            project: data.project || null,
            currency: data.currency,
            convertedAmountTWD: Number(convertedAmountTWD),
          });
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
    <div className="flex w-full flex-1 flex-col items-center justify-center rounded-xl bg-white p-4">
      {/* <AddNewClass /> */}
      <div className="mb-2 flex w-full items-center gap-3">
        <div className="text-nowrap text-sm font-semibold md:text-base">
          日期
        </div>
        <div className="flex h-[30px] w-full items-center justify-center rounded-xl border border-black text-center focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-[44px]">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={5}
            timeCaption="時間"
            dateFormat="yyyy/MM/dd h:mm aa"
            className="outline-none"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-2"
      >
        <div className="flex w-full items-center gap-3">
          <div className="text-nowrap text-sm font-semibold text-[##BABFD1] md:text-base">
            帳戶
          </div>
          <select
            className="flex h-[30px] w-full items-center justify-center rounded-xl border border-black text-center md:h-[44px]"
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
        <div className="flex w-full items-center gap-3">
          <div className="text-nowrap text-sm font-semibold text-[##BABFD1] md:text-base">
            類型
          </div>
          <select
            className="flex h-[30px] w-full items-center justify-center rounded-xl border border-black text-center md:h-[44px]"
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
              className="flex h-[30px] w-[200px] items-center justify-center rounded-xl border border-black text-center md:h-[44px] md:w-[250px]"
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
          <div className="flex w-full items-center gap-3">
            <div className="text-nowrap text-sm font-semibold text-[##BABFD1] md:text-base">
              分類
            </div>
            <select
              className="flex h-[30px] w-full items-center justify-center rounded-xl border border-black text-center md:h-[44px]"
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
            <div className="flex w-full items-center gap-3">
              <div className="text-nowrap text-sm font-semibold text-[##BABFD1] md:text-base">
                專案
              </div>

              <select
                className="flex h-[30px] w-full items-center justify-center rounded-xl border border-black text-center md:h-[44px]"
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
        <div className="flex w-full items-center gap-3">
          <div className="text-nowrap text-sm font-semibold md:text-base">
            幣別
          </div>
          <div className="grid w-full grid-cols-6 gap-1 md:h-[44px]">
            {currencies.map(([code]) => (
              <label
                key={code}
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-1 ${
                  selectedCurrency === code
                    ? "bg-[#9DBEBB] text-white"
                    : "bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  value={code}
                  checked={selectedCurrency === code}
                  // onChange={() => {
                  //   setSelectedCurrency(code);
                  // }}
                  className="hidden"
                  {...register("currency", { required: "請選擇幣別" })}
                />
                <div className="text-center">
                  <p className="text-sm font-semibold">{code}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex w-full items-center gap-3">
          <div className="text-nowrap text-sm font-semibold md:text-base">
            金額
          </div>
          <input
            className="flex h-[30px] w-full items-center justify-center rounded-xl border border-black text-center md:h-[44px]"
            type="number"
            placeholder={errors.amount ? errors.amount.message : "金額不為 0"}
            {...register("amount", {
              required: "請輸入金額",
              valueAsNumber: true,
              validate: (value) => value > 0 || "金額必須大於 0",
            })}
          />
        </div>
        {selectedCurrency !== "TWD" && amount ? (
          <div className="font-semibold text-red-400 fade-in">
            等值 TWD${convertedAmountDisplay}
          </div>
        ) : (
          <></>
        )}

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
