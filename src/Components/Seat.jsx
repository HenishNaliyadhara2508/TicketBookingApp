import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap"; 

const Seat = ({ show, handleClose, locationState }) => {
  const navigate = useNavigate();
  const { selectedDate, selectedTime, movieName, showtimeId } = locationState || {}; 
  const [selectedSeats, setSelectedSeats] = useState(null); 

  const handleSelectSeat = () => {
    if (selectedSeats === null) {
      alert("Please select a seat count.");
      return;
    }

    navigate('/SeatSelection', { 
      state: { 
        selectedSeatsNumber: selectedSeats, 
        selectedDate, 
        selectedTime, 
        movieName,
        showtimeId,
      } 
    });
  };

  const handleSeatClick = (seats) => {
    setSelectedSeats(seats);
  };

  const getButtonClass = (seats) => {
    return seats === selectedSeats 
      ? 'btn border-dark mb-2 px-3 fs-5 bg-primary text-light' 
      : 'btn border-dark mb-2 px-3 fs-5';
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      
      <Modal.Body>
        <div className="text-primary fs-3 mb-3 text-center">How many seats?</div>
        <div className="container mb-3">
          <div className="row mb-2">
            {[1, 2, 3, 4, 5].map((seats) => (
              <div className="col" key={seats}>
                <button
                  type="button"
                  className={getButtonClass(seats)}
                  onClick={() => handleSeatClick(seats)}
                >
                  {seats}
                </button>
              </div>
            ))}
          </div>
          <div className="row mb-2">
            {[6, 7, 8, 9, 10].map((seats) => (
              <div className="col" key={seats}>
                <button
                  type="button"
                  className={getButtonClass(seats)}
                  onClick={() => handleSeatClick(seats)}
                >
                  {seats}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outline-primary" onClick={handleSelectSeat}>
          Select seats
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Seat;
