import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import MyTicketHeader from "./MyTicketHeader";

const History = () => {
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

        const currentDateTime = new Date();

        const filteredOrders = data.filter((order) => {
          const { showtime, status } = order;

          if (status !== "COMPLETED") {
            return false;
          }

          const orderStartTime = new Date(showtime?.startTime);

          if (orderStartTime < currentDateTime) {
            return true;
          }

          return false;
        });

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleDownloadTicket = (orderId, movieTitle) => {
    navigate(`/download-ticket/${orderId}`, {
      state: {
        movieTitle,
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <MyTicketHeader />
      <div className="container d-flex w-100 flex-wrap">
        {orders.map((order) => {
          const { showtime, seatData, id } = order;
          const movieTitle = showtime?.movie?.name || "Unknown Movie";
          const showtimeTime = new Date(showtime?.startTime).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          );
          const seats =
            seatData?.seats
              .map((seat) => `${seat.row}${seat.column}`)
              .join(", ") || "No seats selected";
          const date = new Date(showtime?.startTime).toLocaleDateString();

          return (
            <div
              key={id}
              className="container mb-5 d-flex flex-column border border-primary w-25 rounded m-2"
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
                  onClick={() => handleDownloadTicket(id, movieTitle)}
                >
                  Download Ticket
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
