import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center items-center space-x-4 my-8">
      {/* Step 1: Login */}
      <div>
        {step1 ? (
          <Link
            to="/login"
            className="flex items-center text-[#BFA181] font-semibold"
          >
            <FaCheck className="mr-2" /> Sign In
          </Link>
        ) : (
          <span className="text-gray-400">Sign In</span>
        )}
      </div>
      <div className="text-gray-300">-----</div>
      {/* Step 2: Shipping */}
      <div>
        {step2 ? (
          <Link
            to="/shipping"
            className="flex items-center text-[#BFA181] font-semibold"
          >
            <FaCheck className="mr-2" /> Shipping
          </Link>
        ) : (
          <span className="text-gray-400">Shipping</span>
        )}
      </div>
      <div className="text-gray-300">-----</div>
      {/* Step 3: Payment */}
      <div>
        {step3 ? (
          <Link
            to="/payment"
            className="flex items-center text-[#BFA181] font-semibold"
          >
            Payment
          </Link>
        ) : (
          <span className="text-gray-400">Payment</span>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
