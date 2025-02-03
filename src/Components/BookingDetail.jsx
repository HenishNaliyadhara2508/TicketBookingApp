import { useNavigate, useLocation } from "react-router-dom";

const BookingDetail = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const location = useLocation();

    const { 
        seatData, 
        totalAmount, 
        movieName, 
        selectedDate, 
        selectedTime,
        showtimeId
    } = location.state || {};

    console.log("Received state:", location.state);

    const selectedSeats = seatData?.seats || [];

    const serviceCharge = Math.round(totalAmount * 0.06);
    const finalTotalAmount = totalAmount + serviceCharge;

    const formatSeats = (seats) => {
        return seats.length > 0 
            ? seats.map(seat => `${seat.row}${seat.column}`).join(", ") 
            : "No seats selected";
    };

    const handleTotalPay = async () => {
        try {
            const formattedSeats = selectedSeats.map((seat) => ({
                row: seat.row,
                column: seat.column,
                layoutType: seat.layoutType,
            }));

            const orderPayload = {
                showtimeId,
                seatData: {
                    seats: formattedSeats,
                },
            };

            console.log("Sending Order Payload:", JSON.stringify(orderPayload, null, 2));

            const response = await fetch("http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });


            if (response.status !== 200 && response.status !== 201) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Order API Response:", result);

            
            if (result && result.paymentUrl && result.orderId) {
                const { paymentUrl, orderId } = result;
                localStorage.setItem("orderId",orderId)

                window.location.href = paymentUrl;  

            } else {
                throw new Error("Invalid API response format. Missing paymentUrl or orderId.");
            }

        } catch (error) {
            console.error("Error placing order:", error.message);
            alert(`Failed to process the order. Reason: ${error.message}`);
        }
    };

    const handleCancel = () => {
        navigate('/Home/Movie');
    };

    return (
        <div className="container d-flex flex-column border border-primary w-25 rounded mx-auto my-auto mt-5 px-5 py-2">
            <div className="container text-primary fs-2 mb-4">
                Booking Detail
            </div>
            <div className="container mb-4">
                <div>Movie Title</div>
                <div className="text-secondary">{movieName || "Movie Title"}</div>
            </div>
            <div className="container mb-4">
                <div>Date</div>
                <div className="text-secondary">{selectedDate || "Select Date"}</div>
            </div>
            <div className="container mb-3 d-flex justify-content-between">
                <div >
                    <div>Tickets ({selectedSeats.length})</div>
                    <div className="text-secondary">{formatSeats(selectedSeats)}</div>
                </div>
                <div className=" mb-4">
                    <div>Time</div>
                    <div className="text-secondary">{selectedTime || "Select Time"}</div>
                </div>
            </div>

            <div className="container text-primary">
                Transaction Detail
            </div>
            <div className="container d-flex justify-content-between">
                <div>
                    <div>SEAT Charges</div>
                    
                </div>
                <div className="">
                    <div>${totalAmount}</div>
                    
                </div>
            </div>
            <hr />
            <div className="container mb-3 d-flex justify-content-between">
                <div>Total Payment</div>
                <div>${totalAmount}</div>
            </div>

            <div className="fs-6">
                *Purchased ticket cannot be canceled
            </div>
            <div>
                <button type="button" className="btn btn-outline-primary w-100 mt-2 me-2 mb-3" onClick={handleTotalPay}>
                    Total Pay ${totalAmount} - Proceed
                </button>
            </div>
            <div>
                <button type="button" className="btn btn-outline-secondary w-100 me-2 mb-3" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default BookingDetail;
