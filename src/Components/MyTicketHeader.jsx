import { useNavigate, useLocation } from "react-router-dom";

const MyTicketHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Get the current route

  const handleUpcoming = () => {
    navigate("/MyTicket/Upcoming");
  };
  const handleHistory = () => {
    navigate("/MyTicket/History");
  };

  return (
    <>
      <main className="container">
        <div className="container mb-3">
          <h1>Now Showing</h1>
        </div>
        <div className="container d-flex mb-3">
          <div>
            <a
              className={`btn m-2 fs-6 fw-semibold px-5 p-2 ${location.pathname === "/MyTicket/Upcoming" ? "btn-primary text-white" : "text-primary"}`}
              onClick={handleUpcoming}
            >
              Upcoming
            </a>
          </div>
          <div>
            <a
              className={`btn m-2 fs-6 fw-semibold px-5 p-2 ${location.pathname === "/MyTicket/History" ? "btn-primary text-white" : "text-primary"}`}
              onClick={handleHistory}
            >
              History
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default MyTicketHeader;
