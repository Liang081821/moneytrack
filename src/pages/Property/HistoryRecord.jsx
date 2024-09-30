import Saving from "./Saving";
import Consume from "./Consume";
import Invest from "./Invest";
import AddNewFunction from "./addNewAccount";
import { useGlobalContext } from "@/context/GlobalContext";
import { getFirestoreRefs } from "@/firebase/api";
import { addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
export default function HistoryRecord() {
  const { property } = useGlobalContext();
  const { historyData } = useGlobalContext();

  const { loginEmail } = useGlobalContext();
  const { historyCollectionRef } = getFirestoreRefs(loginEmail);
  const calculateProperty = async () => {
    const types = {
      saving: "儲蓄",
      expense: "消費",
      investment: "投資",
    };

    const newTotals = Object.fromEntries(
      Object.entries(types).map(([key, type]) => [
        key,
        property
          .filter((item) => item.account_type === type)
          .reduce(
            (accumulator, currentValue) =>
              accumulator + (currentValue.balance || 0),
            0,
          ),
      ]),
    );

    const totalAssets = property.reduce(
      (accumulator, currentValue) => accumulator + (currentValue.balance || 0),
      0,
    );

    try {
      alert("添加成功");
      const docRef = await addDoc(historyCollectionRef, {
        saving: newTotals.saving,
        expense: newTotals.expense,
        investment: newTotals.investment,
        totalAssets: totalAssets,
        time: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteRecord = async (id) => {
    try {
      const docRef = doc(db, "record", loginEmail, "history", id);

      alert("刪除成功");
      await deleteDoc(docRef);
    } catch (e) {
      console.error(e);
    }
  };

  const getPercentage = (amount, total) =>
    total ? (Math.abs(amount) / Math.abs(total)) * 100 : 0;

  return (
    <div className="w-full bg-gradient-to-r from-[#bbe0e1] via-[#ebf0f6] to-[#bbe0e1] pl-11 pt-10 md:pl-0">
      <div className="flex flex-col px-10">
        <div className="mb-5 flex w-full justify-end">
          <button
            onClick={calculateProperty}
            className="fixed right-0 top-56 z-10 overflow-hidden rounded-xl bg-[#607196] p-1 text-sm text-white transition-all md:p-2 md:text-base"
          >
            統計最新資產
          </button>
          <AddNewFunction></AddNewFunction>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:flex-nowrap">
          <Saving />
          <Consume />
          <Invest />
        </div>
        <div className="mx-auto w-full">
          {historyData.length !== 0 ? (
            <div className="mb-9 mt-5 flex w-full flex-col items-center justify-center rounded-xl bg-white p-2">
              <div className="font-semibold">資產紀錄</div>
              {historyData
                .slice()
                .sort((a, b) => b.time.toDate() - a.time.toDate())
                .map((item) => (
                  <div
                    key={item.id}
                    className="m-1 flex min-h-[100px] w-full flex-col items-center gap-3 rounded-xl bg-[#E8E9ED] p-2 md:flex-row"
                  >
                    <div className="w-[110px] rounded-xl p-2 text-center">
                      {item.time.toDate().toLocaleDateString()}
                    </div>
                    <div className="flex w-full">
                      <div
                        className="t flex h-8 w-14 items-center justify-center rounded-xl bg-[#9DBEBB]"
                        style={{
                          width: `${getPercentage(item.saving, item.totalAssets)}%`,
                        }}
                      >
                        {getPercentage(item.saving, item.totalAssets).toFixed(
                          1,
                        )}
                        %
                      </div>
                      <div
                        className="flex h-8 w-full items-center justify-center rounded-xl bg-[#F4E9CD]"
                        style={{
                          width: `${getPercentage(item.expense, item.totalAssets)}%`,
                        }}
                      >
                        {getPercentage(item.expense, item.totalAssets).toFixed(
                          1,
                        )}
                        %
                      </div>
                      <div
                        className="flex h-8 w-14 items-center justify-center rounded-xl bg-[#D4BEBE]"
                        style={{
                          width: `${getPercentage(item.investment, item.totalAssets)}%`,
                        }}
                      >
                        {getPercentage(
                          item.investment,
                          item.totalAssets,
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center md:flex-row">
                      <div className="flex h-[60px] w-full flex-col items-center justify-center rounded-xl border bg-[#9DBEBB] p-3">
                        <div>儲蓄</div>
                        <div>NT${item.saving}</div>
                      </div>
                      <div className="flex h-[60px] w-full flex-col items-center justify-center rounded-xl border bg-[#F4E9CD] p-3">
                        <div>消費</div>
                        <div>NT${item.expense}</div>
                      </div>
                      <div className="flex h-[60px] w-full flex-col items-center justify-center rounded-xl border bg-[#D4BEBE] p-3">
                        <div>投資</div>
                        <div>NT${item.investment}</div>
                      </div>
                      <div className="flex h-[60px] w-full flex-col items-center justify-center rounded-xl p-3">
                        <div>總資產</div>
                        <div>NT${item.totalAssets}</div>
                      </div>

                      <button
                        onClick={() => deleteRecord(item.id)}
                        className="flex h-[60px] w-full flex-col items-center justify-center rounded-xl border bg-[#89023E] p-2 text-white transition duration-200 hover:bg-[#CC7178]"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="mb-4 mt-4 flex h-[100px] w-full items-center justify-center rounded-lg border bg-slate-500 text-white opacity-40">
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
              <p>統計資產解鎖..</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
