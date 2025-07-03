import { Link, useLocation } from "react-router-dom"; // Import useLocation
import {
  FiCheckCircle,
  FiChevronRight,
  FiUser,
  FiTruck,
  FiCreditCard,
  FiPackage,
} from "react-icons/fi"; // More modern icons

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const location = useLocation(); // Get current location to highlight active step

  // Determine if a step is active (current page)
  const isStepActive = (stepPath) => location.pathname === stepPath;

  // Define a reusable Step component for clarity
  const Step = ({ isActive, isCompleted, title, path, icon: Icon }) => {
    const stepClasses = `
      relative flex flex-col items-center flex-1 z-10
      ${
        isCompleted
          ? "text-brb-primary"
          : isActive
          ? "text-gray-800"
          : "text-gray-400"
      }
      transition-colors duration-300
    `;

    const connectorClasses = `
      absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2
      w-full h-1 bg-gray-200 z-0
      ${isCompleted ? "bg-brb-primary" : ""}
      transition-colors duration-300
    `;

    const circleClasses = `
      relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white
      ${
        isCompleted
          ? "bg-brb-primary"
          : isActive
          ? "bg-gray-800"
          : "bg-gray-300"
      }
      flex-shrink-0
    `;

    const titleClasses = `
      mt-2 text-sm font-medium whitespace-nowrap
      ${
        isCompleted
          ? "text-brb-primary"
          : isActive
          ? "text-gray-800"
          : "text-gray-500"
      }
    `;

    const linkContent = (
      <>
        <div className={circleClasses}>
          {isCompleted ? (
            <FiCheckCircle className="text-xl" />
          ) : (
            <Icon className="text-lg" />
          )}
        </div>
        <span className={titleClasses}>{title}</span>
      </>
    );

    return (
      <div className={stepClasses}>
        {/* Connector line (only render on steps after the first) */}
        {title !== "Sign In" && <div className={connectorClasses}></div>}

        {/* Step content (circle + title) */}
        {isCompleted || isActive ? ( // Allow clicking on completed or active step
          <Link
            to={path}
            className="flex flex-col items-center hover:opacity-80"
          >
            {linkContent}
          </Link>
        ) : (
          <div className="flex flex-col items-center cursor-not-allowed opacity-70">
            {linkContent}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 md:py-10">
      <div className="relative flex justify-between items-center text-center max-w-2xl mx-auto">
        <Step
          stepPath="/login"
          isCompleted={step1}
          isActive={isStepActive("/login")}
          title="Sign In"
          path="/login"
          icon={FiUser}
        />
        <Step
          stepPath="/shipping"
          isCompleted={step2}
          isActive={isStepActive("/shipping")}
          title="Shipping"
          path="/shipping"
          icon={FiTruck}
        />
        <Step
          stepPath="/payment"
          isCompleted={step3}
          isActive={isStepActive("/payment")}
          title="Payment"
          path="/payment"
          icon={FiCreditCard}
        />
        <Step
          stepPath="/placeorder" // Assuming placeorder is the final step path
          isCompleted={step4}
          isActive={isStepActive("/placeorder")}
          title="Place Order"
          path="/placeorder"
          icon={FiPackage}
        />
      </div>
    </div>
  );
};

export default CheckoutSteps;
