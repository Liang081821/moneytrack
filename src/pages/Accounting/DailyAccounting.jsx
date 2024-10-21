import Confirm from "@/components/Confirm";
import { useGlobalContext } from "@/context/GlobalContext";
import { addDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getFirestoreRefs } from "../../firebase/api";
import AddNewClass from "./AddNewClass";

import Button from "@/components/Button";
import PropTypes from "prop-types";

export default function DailyAccounting({ setAccounting }) {
  const { property, classData, projectData, currencies, rates } =
    useGlobalContext();
  const { loginEmail } = useGlobalContext();
  const navigate = useNavigate();

  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
    cancelMessage: "取消",
    confirmMessage: "確認",
  });
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
  const selectedCurrency = watch("currency", "TWD");
  const amount = watch("amount");

  const optionsToRender =
    classData[
      watchType === "收入"
        ? "income"
        : watchType === "支出"
          ? "expense"
          : "transfer"
    ];
  const accountsToRender = property.filter((item) => {
    const parsedAccount = watchAccount ? JSON.parse(watchAccount) : null;
    return parsedAccount ? item.id !== parsedAccount.id : true;
  });
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
      const selectedAccount = data.account ? JSON.parse(data.account) : null;
      const selectedProject = data.project ? JSON.parse(data.project) : null;

      const selectedTargetAccount = data.targetaccount
        ? JSON.parse(data.targetaccount)
        : null;

      const q = query(
        propertyCollectionRef,
        where("id", "==", selectedAccount.id),
      );

      if (data.targetaccount) {
        const qTarget = query(
          propertyCollectionRef,
          where("id", "==", selectedTargetAccount.id),
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
          const newBalance =
            data.type === "收入"
              ? currentBalance + Number(convertedAmountTWD)
              : currentBalance - Number(convertedAmountTWD);

          await updateDoc(docSnap.ref, { balance: newBalance });
        });
      }

      let docRef;

      const accountType = !querySnapshot.empty
        ? querySnapshot.docs[0].data().account_type
        : "";
      try {
        setConfirmData({
          isOpen: true,
          message: `新增成功`,
          onConfirm: () => navigate("/accounting"),
          onCancel: () => setAccounting(false),
          cancelMessage: "再記一筆",
          confirmMessage: "確認",
        });
        reset();
        if (watchType === "轉帳") {
          docRef = await addDoc(accountingCollectionRef, {
            account: selectedAccount.account,
            accountid: selectedAccount.id,
            account_type: accountType,
            targetaccountid: selectedTargetAccount.id,
            amount: Number(data.amount),
            time: startDate,
            targetaccount: selectedTargetAccount.account,
            record_type: data.type,
            projectname: selectedProject ? selectedProject.name : null,
            projectid: selectedProject ? selectedProject.id : null,
            currency: data.currency,
            convertedAmountTWD: Number(convertedAmountTWD),
          });
        } else {
          docRef = await addDoc(accountingCollectionRef, {
            account: selectedAccount.account,
            accountid: selectedAccount.id,

            account_type: accountType,
            amount: Number(data.amount),
            time: startDate,
            class: data.class,
            record_type: data.type,
            projectname: selectedProject ? selectedProject.name : null,
            projectid: selectedProject ? selectedProject.id : null,

            currency: data.currency,
            convertedAmountTWD: Number(convertedAmountTWD),
          });
        }
      } catch (error) {
        console.error("寫入資料時出錯：", error);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const [startDate, setStartDate] = useState(new Date());
  const handleCloseAccounting = () => {
    setAccounting(false);
  };
  DailyAccounting.propTypes = {
    setAccounting: PropTypes.func.isRequired,
  };
  const navigateToAddAccountPage = () => {
    navigate("/property");
    setAccounting(false);
  };
  const navigateToAddClass = () => {
    setNewClassEditing(true);
  };
  const [newclassEditing, setNewClassEditing] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 p-4 fade-in">
      <div className="joyride-accountingproject joyride-startaccounting relative flex w-full flex-col items-center justify-center gap-3 rounded-lg bg-white p-8 md:w-[35%]">
        {/* {alertMessage && (
          <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
        )} */}
        {confirmData.isOpen && (
          <Confirm
            message={confirmData.message}
            onConfirm={() => {
              navigate("/accounting");
              setAccounting(false);
            }}
            onCancel={() => setConfirmData({ ...confirmData, isOpen: false })}
            cancelMessage={confirmData.cancelMessage}
            confirmMessage={confirmData.confirmMessage}
          />
        )}
        <h2 className="text-xl font-semibold"> 記帳面板</h2>
        <div className="flex gap-2 self-end">
          <div className="joyride-class">
            <AddNewClass
              newclassEditing={newclassEditing}
              setNewClassEditing={setNewClassEditing}
            />
          </div>
          <Button onClick={handleCloseAccounting} className="mr-2">
            取消
          </Button>
        </div>
        <div className="flex w-full items-center gap-3">
          <div className="text-nowrap text-sm font-semibold md:text-base">
            日期
          </div>
          <div className="flex h-[30px] w-full items-center justify-center rounded-lg border border-black text-center focus:outline-none focus:ring-2 focus:ring-blue-500 md:h-[44px]">
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
          className="flex w-full flex-col items-center gap-3"
        >
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full gap-3">
              <div className="text-nowrap text-sm font-semibold md:text-base">
                帳戶
              </div>
              <select
                className="flex h-[30px] w-full items-center justify-center rounded-lg border border-black text-center md:h-[44px]"
                {...register("account", {
                  required: "請選擇帳戶",
                })}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "addAccount") {
                    navigateToAddAccountPage();
                  }
                }}
              >
                <option value="">請選擇</option>
                {Array.isArray(property) && property.length > 0 ? (
                  property.map((item) => (
                    <option
                      key={item.id}
                      value={JSON.stringify({
                        id: item.id,
                        account: item.account,
                      })}
                    >
                      {item.account}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="addAccount" disabled>
                      您需要先新增帳戶
                    </option>
                  </>
                )}
              </select>
            </div>

            {errors.account && (
              <p className="text-red-500">{errors.account.message}</p>
            )}
          </div>
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full gap-3">
              <div className="text-nowrap text-sm font-semibold text-[##BABFD1] md:text-base">
                類型
              </div>
              <select
                className="flex h-[30px] w-full items-center justify-center rounded-lg border border-black text-center md:h-[44px]"
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
            {errors.type && (
              <p className="text-red-500">{errors.type.message}</p>
            )}
          </div>
          {watchType === "轉帳" ? (
            <div className="flex w-full flex-col items-center gap-3">
              <div className="flex w-full gap-3">
                <div className="text-nowrap text-sm font-semibold text-[##BABFD1] md:text-base">
                  轉入
                </div>
                <select
                  className="flex h-[30px] w-full items-center justify-center rounded-lg border border-black text-center md:h-[44px]"
                  {...register("targetaccount", {
                    required:
                      watchType === "轉帳" ? "請選擇目標轉入帳戶" : false,
                  })}
                >
                  <option value="">請選擇</option>
                  {Array.isArray(accountsToRender) &&
                    accountsToRender.map((item) => (
                      <option
                        key={item.id}
                        value={JSON.stringify({
                          id: item.id,
                          account: item.account,
                        })}
                      >
                        {item.account}
                      </option>
                    ))}
                </select>
              </div>
              {errors.targetaccount && (
                <p className="text-red-500">{errors.targetaccount.message}</p>
              )}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-3">
              <div className="flex w-full gap-3">
                <div className="text-nowrap text-sm font-semibold text-[##BABFD1] md:text-base">
                  分類
                </div>
                <select
                  className="flex h-[30px] w-full items-center justify-center rounded-lg border border-black text-center md:h-[44px]"
                  {...register("class", {
                    required: watchType !== "轉帳" ? "請選擇分類" : false,
                  })}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "addClass") {
                      navigateToAddClass();
                    }
                  }}
                >
                  <option value="">請選擇</option>
                  {Array.isArray(optionsToRender) &&
                  optionsToRender.length > 0 ? (
                    optionsToRender.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option value="addClass" disabled>
                      您需要先新增分類
                    </option>
                  )}
                </select>
              </div>
              {errors.class && (
                <p className="text-red-500">{errors.class.message}</p>
              )}
            </div>
          )}
          {Array.isArray(projectData) &&
            projectData.some((item) => item.isediting) && (
              <div className="flex w-full items-center gap-3">
                <div className="text-nowrap text-sm font-semibold text-[##BABFD1] md:text-base">
                  專案
                </div>

                <select
                  className="flex h-[30px] w-full items-center justify-center rounded-lg border border-black text-center md:h-[44px]"
                  {...register("project")}
                >
                  <option value="">請選擇</option>
                  {projectData
                    .filter((item) => item.isediting)
                    .map((item) => (
                      <option
                        key={item.id}
                        value={JSON.stringify({
                          id: item.id,
                          name: item.name,
                        })}
                      >
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
              {(currencies.length === 0 ? [["TWD"]] : currencies).map(
                ([code]) => (
                  <label
                    key={code}
                    className={`flex cursor-pointer items-center justify-center rounded-lg border p-1 ${
                      selectedCurrency === code
                        ? "bg-[#545E75] text-white"
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
                ),
              )}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full gap-3">
              <div className="text-nowrap text-sm font-semibold md:text-base">
                金額
              </div>
              <input
                className="flex h-[30px] w-full items-center justify-center rounded-lg border border-black text-center md:h-[44px]"
                type="number"
                placeholder={
                  errors.amount ? errors.amount.message : "金額不為 0"
                }
                {...register("amount", {
                  required: "請輸入金額",
                  valueAsNumber: true,
                  max: {
                    value: 100000000000,
                    message: "須小於一千億",
                  },
                  validate: (value) => value > 0 || "金額必須大於 0",
                })}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500">{errors.amount.message}</p>
            )}
          </div>
          {selectedCurrency !== "TWD" && amount ? (
            <div className="font-semibold text-red-400 fade-in">
              等值 TWD${convertedAmountDisplay}
            </div>
          ) : (
            <></>
          )}

          <div className="flex w-full gap-2">
            <Button type="submit" className="flex-1" variant="add">
              {watchType === "轉帳" ? "我要轉帳" : "我要記一筆"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
