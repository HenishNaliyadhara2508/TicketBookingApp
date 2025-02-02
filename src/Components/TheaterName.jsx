import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TheaternameHeader from "./TheaternameHeader";
import Seat from "./Seat";

// Function to format time in AM/PM format
const formatTime = (isoString) => {
  const date = new Date(isoString);

  // Use Intl.DateTimeFormat to format the time in 12-hour format (AM/PM)
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures AM/PM format
  };

  const timeString = new Intl.DateTimeFormat("en-US", options).format(date);

  return timeString; // This will return in "hh:mm AM/PM" format
};

const TheaterName = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { theaterId, date: urlDate } = useParams();

  const [selectedDate, setSelectedDate] = useState(
    urlDate || new Date().toISOString().split("T")[0] // Default to today's date if no date in the URL
  );
  const [theaterName, setTheaterName] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectedShowId, setSelectedShowId] = useState(null);

  const [movieName, setMovieName] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility

  useEffect(() => {
    if (!selectedDate) return;

    fetch(
      `http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/theaters/${theaterId}/shows?date=${selectedDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTheaterName(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [theaterId, selectedDate, token]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    navigate(`/Theater/${theaterId}/${newDate}`);
  };

  const handleTimeSelect = (
    movieId,
    movieName,
    showTime,
    showtimeId,
    screenId
  ) => {
    const formattedTime = formatTime(showTime);

    setSelectedTimes((prevSelectedTimes) => ({
      ...prevSelectedTimes,
      [movieId]: {
        time: formattedTime,
        showtimeId,
        screenId,
      },
    }));

    setSelectedShow({
      movieId,
      time: formattedTime,
      showtimeId,
      screenId,
      movieName,
    });

    setSelectedShowId(showtimeId);
    setMovieName(movieName);
  };

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="container">
        <TheaternameHeader
          selectedDate={selectedDate}
          onDateSelect={handleDateChange} 
        />
        <hr />
      </div>

      <div className="container">
        <div className="container justify-content-between">
          {theaterName.length > 0 ? (
            theaterName.map((movie) => (
              <div key={movie.id} className="container">
                <div className="container d-flex justify-content-between align-items-center">
                  <div className="w-75">
                    <div className="fs-3 fw-semibold text-primary">
                      {movie.name}
                    </div>
                    <div>{movie.languages.join(", ")}, 2D</div>
                    <div>{movie.description}</div>
                    <div className="mt-3 fs-5 fw-semibold">Times:</div>
                    <div className="d-flex flex-wrap gap-2">
                      {movie.showTimes.map((showTime) => (
                        <button
                          key={showTime.id}
                          type="button"
                          className={`btn btn-outline-dark ${
                            selectedTimes[movie.id]?.time ===
                            formatTime(showTime.startTime)
                              ? "btn-info text-white"
                              : ""
                          }`}
                          onClick={() =>
                            handleTimeSelect(
                              movie.id,
                              movie.name,
                              showTime.startTime,
                              showTime.id,
                            )
                          }
                        >
                          {formatTime(showTime.startTime)}{" "}
                          
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-primary fs-5 px-5 py-2"
                      onClick={handleBookNow}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <div>No shows available for this date.</div>
          )}
        </div>
      </div>

      
      <Seat
        show={isModalOpen}
        handleClose={handleModalClose}
        locationState={{
          selectedDate,
          selectedTime: selectedShow?.time,
          movieName,
          showtimeId: selectedShowId,
        }}
      />
    </div>
  );
};

export default TheaterName;
