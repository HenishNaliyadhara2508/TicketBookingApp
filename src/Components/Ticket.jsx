import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Ticket = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

 
  const orderId = localStorage.getItem("orderId");

  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/orders/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
        );
          if (!response.ok) {
            throw new Error("Failed to fetch order details");
          }
          const data = await response.json();
          setOrderDetails(data);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  const handleDownloadTicket = (orderId) => {
    navigate(`/download-ticket/${orderId}`);
  };

  const handleBackToHomepage = () => {
    navigate('/Home/Movie');
  };

  if (!orderDetails) {
    return <div>Loading...</div>; 
  }

  const { showtime, seatData, totalPrice } = orderDetails;
  const movieName = showtime?.movie?.name || "Movie Title";
  const showtimeTime = new Date(showtime?.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  const seats = seatData?.seats.map((seat) => `${seat.row}${seat.column}`).join(", ") || "No seats selected";

  return (
    <div className="container mb-5 d-flex flex-column rounded justify-content-center align-items-center min-vh-100">
      <div className="container mb-5 border border-primary rounded m-auto mt-5 w-auto fs-5">
        <div className="container m-3">
          <div className="text-primary">Date</div>
          <div>{new Date(showtime?.startTime).toLocaleDateString()}</div>
        </div>
        <div className="container m-3">
          <div className="text-primary">Movie Title</div>
          <div>{movieName}</div>
        </div>
        <div className="container m-3 d-flex justify-content-between">
          <div>
            <div className="text-primary">Ticket ({seatData?.seats.length})</div>
            <div>{seats}</div>
          </div>
          <div className="mx-4">
            <div className="text-primary">Hours</div>
            <div>{showtimeTime}</div>
          </div>
        </div>
        <div>
          <button type="button" className="btn btn-outline-primary me-2 w-100 mb-4" onClick={() => handleDownloadTicket(orderId)}>
            Download Ticket
          </button>
        </div>
      </div>
      <div className="container d-flex justify-content-center">
        <a onClick={handleBackToHomepage} type="button" className="btn btn-outline-secondary fs-4 me-2 mb-4 w-25 p-1">
          Back to Homepage
        </a>
      </div>
    </div>
  );
};

export default Ticket;
