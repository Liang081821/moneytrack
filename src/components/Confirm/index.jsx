import PropTypes from "prop-types";
import Button from "../Button";

export default function Confirm({
  message,
  onConfirm,
  onCancel,
  cancelMessage,
  confirmMessage,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
        <p className="mb-4 text-xl font-semibold">{message}</p>
        <div className="flex gap-4">
          <Button onClick={onCancel} className="flex-1">
            {cancelMessage}
          </Button>
          <Button onClick={onConfirm} className="flex-1" variant="retain">
            {confirmMessage}
          </Button>
        </div>
      </div>
    </div>
  );
}
Confirm.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  cancelMessage: PropTypes.string.isRequired,
  confirmMessage: PropTypes.string.isRequired,
};
