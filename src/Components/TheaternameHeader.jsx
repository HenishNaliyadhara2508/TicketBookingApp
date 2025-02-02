import { IoArrowBackOutline } from "react-icons/io5";
import { FaAngleRight, FaAngleLeft, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const TheaternameHeader = ({ selectedDate, onDateSelect }) => {
  const navigate = useNavigate();
  const { theaterId } = useParams();
  const token = localStorage.getItem("authToken");

  const [weekDates, setWeekDates] = useState([]);
  const [theaterDetails, setTheaterDetails] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    const getNextSevenDays = () => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push({
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          date: date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          }),
          fullDate: date,
          formattedDate: date.toISOString().split("T")[0],
        });
      }
      return days;
    };
    setWeekDates(getNextSevenDays());
  }, []);

  useEffect(() => {
    fetch(
      `http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/theaters/${theaterId}/movies`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setTheaterDetails(data.data);
        }
      });
  }, [theaterId]);

  const handleDateSelect = (newDate) => {
    onDateSelect(newDate);
    navigate(`/Theater/${theaterId}/${newDate}`);
  };

  return (
    <>
      <div className="d-flex conatiner mb-3">
        <IoArrowBackOutline
          className="m-2 p-2"
          style={{ color: "rgb(0, 89, 255)", fontSize: "3rem" }}
          aria-hidden="true"
          onClick={() => navigate("/Home/Theater")}
        />

        <div>
          <div
            className="text-primary fs-1 fw-semibold"
            onClick={() => navigate("/Home/Theater")}
          >
            {theaterDetails.name || "Theater Name"}
          </div>
          <div className="d-flex text-dark">
            <FaMapMarkerAlt
              style={{
                color: "rgb(119, 117, 117)",
                fontSize: "12px",
                margin: "10px 0",
              }}
              aria-hidden="true"
            />
            <div className="m-1 text-secondary">
              {theaterDetails.location || "Location"}
            </div>
          </div>
        </div>
      </div>

      <div className="container d-flex  " style={{width: "43vw", marginLeft : "0"}}>
        <div>
        <FaAngleLeft
          style={{ color: "#060606", fontSize: "20px", marginTop: "15px" }}
        />
        </div>
        <div className="container d-flex flex-wrap" >
          <div style={{ display: "flex", gap: "10px",  }}>
            {weekDates.map((item, index) => (
              <button
                key={index}
                className={`btn btn-outline-info border border-dark text-dark ${
                  selectedDate === item.formattedDate
                    ? "btn-info text-white"
                    : ""
                }`}
                onClick={() => handleDateSelect(item.formattedDate)}
              >
                {item.date} <br /> {item.day}
              </button>
            ))}
          </div>
        </div>
        <div className="d-flex">
        <FaAngleRight style={{ color: "#060606", fontSize: "20px", marginTop: "15px" }} />
        </div>
      </div>
    </>
  );
};

export default TheaternameHeader;
