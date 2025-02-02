import { useNavigate } from "react-router-dom"
import { FaCheckCircle } from "react-icons/fa";
const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleViewTicket = () => {
    navigate('/Ticket')
  }

  const handleBackToHomepage = () => {
    navigate('/Home/Movie')
  }
  return (
    <div>
        <div className="container d-flex flex-column rounded justify-content-center align-items-center min-vh-100 w-25 px-4">
        <div className="text-center fs-2 mb-3 fw-semibold">
            Payment Successful
        </div>
        <div className="container d-flex justify-content-center">
          
          <FaCheckCircle 
          style={{
            color: "rgb(61, 245, 61)",
            fontSize: "100px",
          }} />
        </div>
        <div className="w-100 d-flex justify-content-center align-items-center">
            <button type="button" className="btn btn-outline-primary mt-3 me-2 mb-4 fs-5 px-5 py-2">
                <a onClick={handleViewTicket}>View Ticket</a></button>
        </div>
        <div className="w-100 d-flex justify-content-center align-items-center">
            <a onClick={handleBackToHomepage} type="button" className="btn btn-outline-secondary me-2 mb-4 fs-5 p-2">Back to Homepage</a>
        </div>
    </div>
    </div>
  )
}

export default PaymentSuccess