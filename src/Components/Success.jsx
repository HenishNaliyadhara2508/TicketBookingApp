import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        
        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get("session_id");

        if (sessionId) {
            
            const paymentData = JSON.parse(localStorage.getItem("paymentDetails")) || {};

            
            navigate("/PaymentSuccess", { state: { sessionId, ...paymentData } });

            
            localStorage.removeItem("paymentDetails");
        } else {
            alert("No session ID found! Redirecting to home.");
            navigate("/");
        }
    }, [navigate]);

    return <div>Processing Payment Success...</div>; 
};

export default Success;
