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

  // const [total, setTotal] = useState();
  // let calculateTotal;
  // const calculateProperty = () => {
  //   const savingaccounts = property.filter(
  //     (item) => item.account_type === "儲蓄",
  //   );
  //   const calculateTotal = savingaccounts.reduce(
  //     (accumulator, currentValue) => {
  //       return accumulator + (currentValue.balance || 0);
  //     },
  //     0,
  //   );
  //   setTotal(calculateTotal);
  //   return;
  // };
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
      const docRef = await addDoc(historyCollectionRef, {
        saving: newTotals.saving,
        expense: newTotals.expense,
        investment: newTotals.investment,
        totalAssets: totalAssets,
        time: new Date(),
      });
      alert("添加成功");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteRecord = async (id) => {
    try {
      const docRef = doc(db, "record", "2001henry99@gmail.com", "history", id);
      await deleteDoc(docRef);
      alert("刪除成功");
    } catch (e) {
      console.error(e);
    }
  };

  const getPercentage = (amount, total) =>
    total ? (Math.abs(amount) / Math.abs(total)) * 100 : 0;

  return (
    <div className="mt-10 w-full">
      <div className="flex flex-col px-20">
        <div className="mb-5 flex w-full justify-end">
          <button
            onClick={calculateProperty}
            className="mb-3 mt-auto flex h-[48px] w-[150px] items-center justify-center rounded-2xl border bg-gradient-to-r from-[#3E79E5] to-[#01B8E3] text-white"
          >
            統計最新資產
          </button>
          <AddNewFunction></AddNewFunction>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Saving />
          <Consume />
          <Invest />
        </div>
        <div className="mt-5">
          {historyData
            .slice()
            .sort((a, b) => b.time.toDate() - a.time.toDate())
            .map((item) => (
              <div
                key={item.id}
                className="m-2 flex h-[100px] items-center gap-4 rounded-xl border border-black p-2"
              >
                <div className="w-[110px] rounded-xl border border-gray-400 p-2 text-center">
                  {item.time.toDate().toLocaleDateString()}
                </div>
                <div className="flex w-full">
                  <div
                    className="t flex h-5 w-14 items-center justify-center rounded-xl bg-[#F4E9CD]"
                    style={{
                      width: `${getPercentage(item.saving, item.totalAssets)}%`,
                    }}
                  >
                    {getPercentage(item.saving, item.totalAssets).toFixed(1)}%
                  </div>
                  <div
                    className="flex h-5 w-full items-center justify-center rounded-xl bg-[#9DBEBB]"
                    style={{
                      width: `${getPercentage(item.expense, item.totalAssets)}%`,
                    }}
                  >
                    {getPercentage(item.expense, item.totalAssets).toFixed(1)}%
                  </div>
                  <div
                    className="flex h-5 w-14 items-center justify-center rounded-xl bg-[#E6A602]"
                    style={{
                      width: `${getPercentage(item.investment, item.totalAssets)}%`,
                    }}
                  >
                    {getPercentage(item.investment, item.totalAssets).toFixed(
                      1,
                    )}
                    %
                  </div>
                </div>
                <div className="flex h-[60px] w-[110px] flex-col items-center justify-center rounded-xl border bg-[#F4E9CD] p-2">
                  <div>儲蓄</div>
                  <div>NT${item.saving}</div>
                </div>
                <div className="flex h-[60px] w-[110px] flex-col items-center justify-center rounded-xl border bg-[#9DBEBB] p-2">
                  <div>消費</div>
                  <div>NT${item.expense}</div>
                </div>
                <div className="flex h-[60px] w-[110px] flex-col items-center justify-center rounded-xl border bg-[#E6A602] p-2">
                  <div>投資</div>
                  <div>NT${item.investment}</div>
                </div>
                <div className="flex h-[60px] w-[110px] flex-col items-center justify-center rounded-xl border border-gray-400 p-2">
                  <div>總資產</div>
                  <div>NT${item.totalAssets}</div>
                </div>
                <button
                  onClick={() => deleteRecord(item.id)}
                  className="flex h-[60px] w-[110px] flex-col items-center justify-center rounded-xl border border-gray-400 p-2"
                >
                  刪除
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
