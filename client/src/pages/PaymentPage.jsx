import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CartContext } from "../context/CartContext";
import CheckoutSteps from "../components/common/CheckoutSteps";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CartContext);
  const { shippingAddress, paymentMethod: currentPaymentMethod } = state;

  const [paymentMethod, setPaymentMethod] = useState(currentPaymentMethod);

  useEffect(() => {
    // If shipping address is not set, redirect to shipping page
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: paymentMethod,
    });
    // Navigate to the final "Place Order" screen
    navigate("/placeorder");
  };

  return (
    <>
      <Helmet>
        <title>Payment Method - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12 max-w-md">
        <CheckoutSteps step1 step2 step3 />
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Payment Method
          </h1>
          <form onSubmit={submitHandler}>
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                <input
                  type="radio"
                  id="Razorpay"
                  name="paymentMethod"
                  value="Razorpay"
                  className="h-5 w-5"
                  checked={paymentMethod === "Razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-4 font-semibold">Pay with Razorpay</span>
              </label>
            </div>
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#333333] text-white py-3 rounded-md hover:bg-black transition"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
