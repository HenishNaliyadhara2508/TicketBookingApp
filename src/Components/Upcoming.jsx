import { useEffect, useState } from "react";
import MyTicketHeader from "./MyTicketHeader";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Upcoming = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();

        // Get the current date and time
        const currentDateTime = new Date();

        // Filter orders to show only 'completed' orders with a startTime in the future
        const upcomingOrders = data.filter((order) => {
          const { showtime, status } = order;

          // Only show orders with 'completed' status
          if (status !== "COMPLETED") {
            return false;
          }

          // Get the order's start time and convert it to a Date object
          const orderStartTime = new Date(showtime?.startTime);

          // Only include orders with a startTime greater than the current time
          if (orderStartTime > currentDateTime) {
            return true;
          }

          return false; // Exclude orders with past start times
        });

        setOrders(upcomingOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleDownloadTicket = (orderId) => {
    navigate(`/download-ticket/${orderId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <MyTicketHeader />
      <div className="container d-flex w-100 flex-wrap">
        {orders.map((order) => {
          const { showtime, seatData, totalPrice, id } = order;
          const movieTitle = showtime?.movie?.name || "Unknown Movie";
          const showtimeTime = new Date(showtime?.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const seats =
            seatData?.seats.map((seat) => `${seat.row}${seat.column}`).join(", ") ||
            "No seats selected";
          const date = new Date(showtime?.startTime).toLocaleDateString();

          return (
            <div
              key={id}
              className="container mb-5 d-flex flex-column border border-primary w-25 rounded m-2 me-5"
            >
              <div className="container m-3">
                <div className="text-primary">Date</div>
                <div>{date}</div>
              </div>
              <div className="container m-3">
                <div className="text-primary">Movie Title</div>
                <div>{movieTitle}</div>
              </div>
              <div className="container m-3 d-flex justify-content-between">
                <div>
                  <div className="text-primary">Ticket</div>
                  <div>{seats}</div>
                </div>
                <div className="mx-4">
                  <div className="text-primary">Hours</div>
                  <div>{showtimeTime}</div>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-primary m-3 w-75"
                  onClick={() => handleDownloadTicket(id)}
                >
                  Download Ticket
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Upcoming;
