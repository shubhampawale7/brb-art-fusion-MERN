import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { FiAlertCircle, FiCheck, FiXCircle } from "react-icons/fi"; // Using Feather Icons

const CancelOrderModal = ({ onConfirm, onCancel, loading }) => {
  const [reason, setReason] = useState("");
  const cancellationReasons = [
    "Ordered by mistake / Change of mind",
    "Item not required anymore",
    "Found a better price elsewhere",
    "Delivery is delayed / Too long wait time",
    "Received damaged or incorrect item", // Added a new common reason
    "Other (please specify below)", // Renamed for clarity
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) {
      // This is a redundant check if radio buttons are required, but good for custom input
      // If 'Other' is selected, ensure the textarea has content.
      if (
        e.target.otherReason &&
        reason === "Other (please specify below)" &&
        !e.target.otherReason.value.trim()
      ) {
        alert("Please provide details for 'Other' reason."); // Use toast.error if available
        return;
      }
      alert("Please select a reason for cancellation."); // Use toast.error if available
      return;
    }

    // If 'Other' is selected, pass the custom reason
    const finalReason =
      reason === "Other (please specify below)"
        ? e.target.otherReason.value.trim()
        : reason;
    onConfirm(finalReason);
  };

  return (
    <div className="p-6 sm:p-8 bg-white rounded-lg shadow-xl text-gray-800">
      {" "}
      {/* Increased padding, stronger shadow */}
      <h2 className="text-3xl font-bold mb-4 text-center flex items-center justify-center">
        <FiAlertCircle className="mr-3 text-red-500 text-4xl" />{" "}
        {/* Larger, red icon */}
        Cancel Order
      </h2>
      <p className="text-gray-600 mb-6 text-center text-base leading-relaxed">
        Please tell us why you'd like to cancel. Your feedback helps us improve!
      </p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mb-6">
          {" "}
          {/* Increased vertical spacing between radio options */}
          {cancellationReasons.map((r) => (
            <label
              key={r}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200
                border-2 ${
                  reason === r
                    ? "border-brb-primary bg-brb-primary-light"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <input
                type="radio"
                name="cancellationReason"
                value={r}
                required
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
                className="h-5 w-5 text-brb-primary focus:ring-brb-primary border-gray-300 mr-3" // Styled radio button
              />
              <span className="text-base font-medium flex-grow">{r}</span>{" "}
              {/* Larger text */}
              {reason === r && (
                <FiCheck className="text-brb-primary text-xl ml-auto" />
              )}{" "}
              {/* Checkmark icon for selected */}
            </label>
          ))}
          {reason === "Other (please specify below)" && (
            <textarea
              name="otherReason"
              placeholder="Please provide details..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-brb-primary focus:border-brb-primary outline-none mt-3 transition"
              required // Make required if 'Other' is selected
            ></textarea>
          )}
        </div>

        <div className="flex flex-col sm:flex-row-reverse justify-end gap-3 mt-8">
          {" "}
          {/* Responsive button layout */}
          <button
            type="submit"
            disabled={!reason || loading}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-base"
          >
            {loading ? (
              <ClipLoader size={20} color="white" className="mr-2" />
            ) : (
              <FiXCircle className="mr-2" />
            )}{" "}
            {/* Icon for Cancel */}
            Confirm Cancellation
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors shadow-sm text-base flex items-center justify-center"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CancelOrderModal;
