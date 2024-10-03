import PropTypes from "prop-types";

export default function TransactionCard({
  item,
  onEditClick,
  showTime = true,
  showProject = true,
}) {
  return (
    <div
      key={item.id}
      className={`rounded-xl border p-3 transition-all duration-200 ${
        item.record_type === "支出"
          ? "bg-[#5e687f] text-white"
          : item.record_type === "轉帳"
            ? "bg-[#A7CCED] text-gray-800"
            : "bg-[#82A0BC] text-gray-800"
      }`}
      onClick={() => onEditClick(item)}
    >
      {showTime && <div>{item.time.toDate().toLocaleDateString()}</div>}

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
          item.record_type === "支出" ? "text-gray-300" : "text-gray-800"
        }`}
      >
        <div className="text-sm">
          {item.class ? item.class : `轉入 ${item.targetaccount}`}
        </div>
        <div className="text-sm">{item.account}</div>
      </div>
      {showProject && item.project && (
        <div
          className={`${
            item.record_type === "支出" ? "text-white" : "text-gray-800"
          }`}
        >
          <p>{item.project}</p>
        </div>
      )}
    </div>
  );
}
TransactionCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    record_type: PropTypes.oneOf(["支出", "收入", "轉帳"]).isRequired,
    time: PropTypes.object.isRequired, // Assuming this is a Firebase Timestamp
    currency: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    class: PropTypes.string,
    targetaccount: PropTypes.string,
    account: PropTypes.string.isRequired,
    project: PropTypes.string,
  }).isRequired,
  onEditClick: PropTypes.func.isRequired,
  showTime: PropTypes.bool,
  showProject: PropTypes.bool,
};
