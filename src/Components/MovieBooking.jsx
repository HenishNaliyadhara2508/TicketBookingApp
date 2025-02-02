import { useState, useEffect } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Seat from "./Seat"; // Import the Seat Modal component

const MovieBooking = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { movieId, date } = useParams();

  const [selectedDate, setSelectedDate] = useState(date || "");
  const [movieDetails, setMovieDetails] = useState({});
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedScreenId, setSelectedScreenId] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const getNextSevenDays = () => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push({
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          date: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
          fullDate: date,
          formattedDate: `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`,
        });
      }
      return days;
    };
    setWeekDates(getNextSevenDays());
  }, []);

  useEffect(() => {
    if (!movieId || !date) return;
    fetch(`http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/show-times/${movieId}/by-date?date=${encodeURIComponent(date)}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setMovieDetails(data.movie || {});
        setTheaters(data.theaters || []);
      })
      .catch((error) => console.error("Fetch Error:", error));
  }, [movieId, date]);

  const handleBack = () => navigate("/Movie");

  const handleTheaterSelect = (theaterId) => {
    const selected = theaters.find((theater) => theater.id === theaterId);
    setSelectedTheater(selected);
    setSelectedTime("");
  };

  const handleTimeSelect = (showTimeId, startTime) => {
    const formattedTime = new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    setSelectedTime(formattedTime);
    setSelectedShowId(showTimeId);
    
  };

  const handleDateSelect = (newDate) => {
    setSelectedDate(newDate);
    navigate(`/Movie/${movieId}/${encodeURIComponent(newDate)}`);
  };

  const handleBookNow = () => {
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  return (
    <>
      <Navbar />
      <div className="row justify-content-between">
        <div className="container col-8">
          <div className="container">
            <div className="p-2">
              <a onClick={handleBack} className="d-flex">
                <IoArrowBackOutline style={{ color: "rgb(128, 128, 128)", marginTop: "18px" }} />
                <div className="m-2 fs-5 fw-semibold text-dark">Back</div>
              </a>
            </div>

            <h2 className="text-primary m-3">Date</h2>
            <div className="container">
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {weekDates.map((item, index) => (
                  <button
                    key={index}
                    className={`btn btn-outline-info border border-dark text-dark ${selectedDate === item.formattedDate ? "btn-info text-white" : ""}`}
                    onClick={() => handleDateSelect(item.formattedDate)}
                  >
                    {item.date} <br /> {item.day}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-primary m-3">Theater</h2>
            <div className="d-flex flex-wrap w-75">
              {theaters.length > 0 ? (
                theaters.map((theater) => (
                  <button
                    key={theater.id}
                    type="button"
                    className={`btn border border-dark rounded p-2 m-2 ${selectedTheater?.id === theater.id ? "btn-info text-white" : "btn-outline-info text-dark"}`}
                    onClick={() => handleTheaterSelect(theater.id)}
                  >
                    <div className="d-flex">
                      <FaMapMarkerAlt style={{ color: "rgb(119, 117, 117)", fontSize: "14px", marginTop: "5px", marginRight: "2px" }} />
                      <div>{theater.name}</div>
                    </div>
                  </button>
                ))
              ) : (
                <p>Loading theaters...</p>
              )}
            </div>

            <div>
              <h2 className="text-primary m-3">Time</h2>
              <div className="d-flex flex-wrap justify-content-start">
                {selectedTheater?.showtimes &&
                selectedTheater.showtimes.length > 0 ? (
                  selectedTheater.showtimes.map((showtime) => (
                    <button
                      key={showtime.showTimeId}
                      type="button"
                      className={`btn border border-dark rounded m-2 p-1 ${selectedTime === new Date(showtime.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) ? "btn-info text-white" : "btn-outline-info text-dark"}`}
                      onClick={() => handleTimeSelect(showtime.showTimeId, showtime.startTime)}
                    >
                      {new Date(showtime.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </button>
                  ))
                ) : (
                  <p>No showtimes available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        
        <div className="container py-4 col-3">
          <div className="mb-3 d-flex justify-content-center align-items-center">
            <img src={movieDetails.image} alt="Movie_Poster" className="rounded" />
          </div>
          <div className="text-primary mx-5">{movieDetails.name}</div>
          <div className="mx-5">
            <div>{movieDetails.description || "Movie description here.."}</div>
            <div className="d-flex">
              <div className="container mb-3">
                <div>Duration</div>
                <div>Language</div>
                <div>Type</div>
              </div>
              <div className="container">
                <div>{movieDetails.duration || "N/A"}</div>
                <div>{movieDetails.languages || "N/A"}</div>
                <div>{movieDetails.category || "N/A"}</div>
              </div>
            </div>
          </div>
          <div className="border border-primary rounded p-3 w-auto justify-content-end">
            <div className="m-3">
              <h3 className="text-primary text-center">{selectedTheater ? selectedTheater.name : "Select Theater"}</h3>
            </div>
            <div className="mb-3">
              <h6>{selectedDate || "Select Date"}</h6>
              <h6>{selectedTime || "Select Time"}</h6>
            </div>
            <div>*Seat Selection can be done after this</div>
            <div>
              <button onClick={handleBookNow} type="button" className="btn btn-outline-info w-100">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <Seat
        show={showModal}
        handleClose={handleCloseModal}
        locationState={{
          selectedDate,
          selectedTime,
          movieName: movieDetails.name,
          showtimeId: selectedShowId,
        }}
      />
    </>
  );
};

export default MovieBooking;
