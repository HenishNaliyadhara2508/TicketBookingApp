import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const {
    totalAmount: finalTotalAmount,
    seatData,
    selectedDate,
    selectedTime,
    movieName,
    showtimeId,
    paymentUrl,  
    orderId,
  } = location.state || {};

  const token = localStorage.getItem("authToken"); // Assuming you're storing token in localStorage

  // Accessing selected seats from seatData
  const selectedSeats = seatData?.seats || []; // Extracting seats array

  const handleTotalPay = async () => {
    try {
      // Ensure selectedSeats is correctly populated and formatted
      const formattedSeats = selectedSeats.map((seat) => ({
        row: seat.row,
        column: seat.column,
        layoutType: seat.layoutType,
      }));
  
      const orderPayload = {
        showtimeId,  // Ensure selectedShowId is valid and populated
        seatData: { seats: formattedSeats },
      };
  
      console.log("Sending Order Payload:", orderPayload);
  
      const response = await fetch("http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Ensure token is valid
        },
        body: JSON.stringify(orderPayload),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response from API:", errorResponse);  // Log error details from the server
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Order API Response:", result);
  
      // Handle the success response
      window.location.href = result.data.paymentUrl;
  
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to process the order. Please try again.");
    }
  };
  
  const handleCancel = () => {
    navigate("/Home/Movie");
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container d-flex flex-column border border-primary w-25 rounded px-4">
        <form>
          <div className="text-primary fs-1">
            Payment
            <hr />
          </div>
          <div>Pay With</div>
          <div className="mb-3">
            <input type="radio" name="Credit Card" id="" />
            <label htmlFor="">Credit Card</label>
          </div>
          <div className="d-flex flex-column mb-3">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              placeholder="1234 5678 2451 4896"
              pattern="[0-9\s]{13,19}"
              required
            />
          </div>
          <div className="row g-3">
            <div className="col mb-3">
              <label htmlFor="">Expiration Date</label>
              <input
                type="month"
                className="form-control"
                placeholder="MM/YYYY"
              />
            </div>
            <div className="col mb-3">
              <label htmlFor="">CVV</label>
              <input
                type="number"
                className="form-control"
                placeholder="123"
              />
            </div>
          </div>
          <div className="mb-3">
            <input type="checkbox" name="Checkbox" id="" />
            <label htmlFor="">Save Card Details</label>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-outline-primary w-100 mt-2 me-2 mb-4"
              onClick={handleTotalPay}
            >
              Total Pay ${finalTotalAmount}
            </button>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-outline-secondary w-100 me-2 mb-4"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
