// components/UI/Button.jsx
import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyle =
    "rounded-lg px-2 py-1  md:px-4 md:py-2  font-semibold transition duration-200";

  const variantStyles = {
    delete: "bg-[#89023E] hover:bg-[#CC7178] text-white",
    add: "bg-[#babfd1] text-gray-800",
    retain: "bg-[#607196] text-white",
    grey: "bg-[#aaaaaa] text-white",
    prevstep: "bg-gray-300",
    dontdelete: "bg-[#9DBEBB] text-white",
    default: "",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["default", "delete", "secondary"]),
  className: PropTypes.string,
};
export default Button;
