import { FaMapMarkerAlt } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import HomeHeader from "./HomeHeader";
import { useNavigate } from "react-router-dom";

const Theater = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  
  const handleTheater = (theaterId, date) => {
    
    navigate(`/Theater/${theaterId}/${date}`,{
      state :{
        
      }
    });
  };

  const [theaters, setTheaters] = useState([]);

  
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; 
  };

  useEffect(() => {
    fetch("http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/theaters", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTheaters(data.data);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <HomeHeader />
        {theaters.map((theater) => (
          <div
            className="container btn btn-outline-info text-dark d-flex mt-2 border border-dark rounded p-2 justify-content-between"
            key={theater.id}
            onClick={() => handleTheater(theater.id, getTodayDate())} 
          >
            <div className="container">
              <div className="d-flex justify-content-start fs-5 fw-semibold">
                {theater.name}
              </div>
              <div className="d-flex text-dark">
                <FaMapMarkerAlt
                  style={{
                    color: "rgb(119, 117, 117)",
                    fontSize: "12px",
                    margin: "11px 0",
                  }}
                  aria-hidden="true"
                />
                <div className="m-1 text-secondary">{theater.location}</div>
              </div>
            </div>
            <div className="mt-4">
              <FaAngleRight style={{ color: "rgb(6, 6, 6)", fontSize: "20px" }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Theater;
