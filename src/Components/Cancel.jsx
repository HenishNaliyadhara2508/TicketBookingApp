import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        
        const paymentData = JSON.parse(localStorage.getItem("paymentDetails")) || {};

        console.log("Payment Failed. Restoring Details:", paymentData);
    }, []);

    return (
        <div className="container text-center mt-5">
            <h2 className="text-danger"> Payment Failed!</h2>
            <p>Unfortunately, your payment was not successful. Please try again.</p>
            <button className="btn btn-primary" onClick={() => navigate("/Movie")}>
                Return to Movies
            </button>
            <button className="btn btn-danger ms-3" onClick={() => navigate(-1)}>
                Retry Payment
            </button>
        </div>
    );
};

export default Cancel;
