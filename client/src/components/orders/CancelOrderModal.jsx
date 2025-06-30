import { useState } from "react";
import { ClipLoader } from "react-spinners";

const CancelOrderModal = ({ onConfirm, onCancel, loading }) => {
  const [reason, setReason] = useState("");
  const cancellationReasons = [
    "Ordered by mistake",
    "Item not required anymore",
    "Found a better price elsewhere",
    "Delivery is delayed",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(reason);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold font-serif mb-4 text-text-primary">
        Cancel Order
      </h2>
      <p className="text-text-secondary mb-6">
        Please let us know why you are cancelling this order. This helps us
        improve our service.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          {cancellationReasons.map((r) => (
            <label
              key={r}
              className="flex items-center p-3 rounded-md has-[:checked]:bg-page-bg has-[:checked]:ring-2 has-[:checked]:ring-brand-accent cursor-pointer transition"
            >
              <input
                type="radio"
                name="cancellationReason"
                value={r}
                required
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
                className="h-4 w-4"
              />
              <span className="ml-3 text-text-primary">{r}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-md bg-gray-200 text-text-primary font-semibold hover:bg-gray-300"
          >
            Go Back
          </button>
          <button
            type="submit"
            disabled={!reason || loading}
            className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-gray-400 flex items-center"
          >
            {loading ? (
              <ClipLoader size={20} color="white" className="mr-2" />
            ) : null}
            Confirm Cancellation
          </button>
        </div>
      </form>
    </div>
  );
};

export default CancelOrderModal;
