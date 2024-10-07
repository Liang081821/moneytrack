import PropTypes from "prop-types";
import Button from "../Button";

export default function Alert({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
        <p className="mb-4 text-xl font-semibold">{message}</p>
        <Button onClick={onClose} className="w-full" variant="retain">
          確定
        </Button>
      </div>
    </div>
  );
}
Alert.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
