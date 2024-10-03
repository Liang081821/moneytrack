export default function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
        <p className="mb-4 text-xl font-semibold">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[#89023E] px-4 py-2 text-white hover:bg-[#CC7178]"
          >
            確定
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-[#607196] px-4 py-2 text-white hover:bg-[#8b91a1]"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
