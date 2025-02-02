import  { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";

const DownloadTicket = () => {
  const { orderId } = useParams();  
  const [ticketData, setTicketData] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const token = localStorage.getItem("authToken"); 
    
  const navigate = useLocation();
 
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await fetch(`http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch ticket data");
        }

        const data = await response.json();
        setTicketData(data);  
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchTicketData();
  }, [orderId, token]);  

  
  const generatePDF = () => {
    if (!ticketData) return;  

    const doc = new jsPDF();

    
    doc.setFontSize(16);
    doc.text(`Ticket for Order ID: ${ticketData.id}`, 10, 10);
    doc.text(`Movie Title: ${ticketData.showtime.movie.name}`, 10, 20);
    doc.text(`Showtime: ${new Date(ticketData.showtime.startTime).toLocaleString()}`, 10, 30);
    doc.text(`Seats: ${ticketData.seatData.seats.map(seat => `${seat.row}${seat.column}`).join(", ")}`, 10, 40);
    doc.text(`Total Price: $${ticketData.totalPrice}`, 10, 50);

    
    doc.save(`ticket-${ticketData.id}.pdf`);
  };

  
  if (loading) {
    return <div>Loading ticket data...</div>;
  }

  
  if (!ticketData) {
    return <div>Error: Ticket data not found</div>;
  }
  const handleBackToHomepage = () => {
    navigate('/Home/Movie');
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="text-center">
        <h1>Download Your Ticket</h1>
        <p>Order ID: {ticketData.id}</p>
        <p>Movie Title: {ticketData.showtime.movie.name}</p>
        <p>Showtime: {new Date(ticketData.showtime.startTime).toLocaleString()}</p>
        <p>Seats: {ticketData.seatData.seats.map(seat => `${seat.row}${seat.column}`).join(", ")}</p>
        <p>Total Price: ${ticketData.totalPrice}</p>

        <div className="container">
          <button className="btn btn-primary mx-2" onClick={generatePDF}>
            Download Ticket
          </button>
          <button
            onClick={handleBackToHomepage}
            type="button"
            className="btn btn-secondary mx-2"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};



export default DownloadTicket;
