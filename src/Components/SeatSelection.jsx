import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedSeatsNumber,
    movieName,
    selectedDate,
    selectedTime,
    showtimeId,
  } = location.state || {};
  const token = localStorage.getItem("authToken");

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [blockedSeats, setBlockedSeats] = useState([]);

  useEffect(() => {
    const fetchShowtimeData = async () => {
      try {
        const response = await fetch(
          `http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/show-times/${showtimeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        const { screen, orders } = data.data;
        console.log("Orders:", orders); // Debugging step to see orders data

        // Parse the layout
        const layout =
          typeof screen.layout === "string"
            ? JSON.parse(screen.layout)
            : screen.layout;

        const blockedSeats = orders.reduce((acc, order) => {
          const seats = order.seatData.seats.map((seat) => ({
            row: seat.row,
            column: seat.column,
            layoutType: seat.layoutType,
          }));
          return acc.concat(seats);
        }, []);

        setBlockedSeats(blockedSeats);

        const layoutWithPrice = layout.map((layoutType) => {
          const priceForLayout = data.data.price.find(
            (p) => p.layoutType === layoutType.type
          );
          return {
            layoutType: layoutType.type,
            rows: layoutType.layout.rows,
            columns: layoutType.layout.columns,
            price: priceForLayout ? priceForLayout.price : 0,
            blockedSeats, // Include blocked seats here
          };
        });

        setSeats(layoutWithPrice);
      } catch (error) {
        console.error("Error fetching showtime data:", error);
      } finally {
        // This will always run after try or catch
        console.log("Fetch process completed");
      }
    };

    fetchShowtimeData();
  }, [showtimeId]);

  const handleSelectSeat = (seat, price, row, layoutType) => {
    const totalSelectedSeats = selectedSeats.length;

    // Prevent selection if totalSelectedSeats >= selectedSeatsNumber
    if (
      totalSelectedSeats >= selectedSeatsNumber &&
      !selectedSeats.some((s) => s.row === row && s.column === seat)
    ) {
      alert(`You can only select a maximum of ${selectedSeatsNumber} seats.`);
      return; // Don't allow further selection
    }

    // Update selected seats: toggle selection (add/remove)
    let updatedSeats;
    let updatedTotalAmount;

    if (selectedSeats.some((s) => s.row === row && s.column === seat)) {
      // Deselect the seat
      updatedSeats = selectedSeats.filter(
        (s) => !(s.row === row && s.column === seat)
      );

      // Recalculate the total amount by removing the deselected seat's price
      updatedTotalAmount = updatedSeats.reduce(
        (sum, seat) => sum + seat.price,
        0
      );
    } else {
      // Select the seat and store the price along with the seat details
      updatedSeats = [
        ...selectedSeats,
        { row, column: seat, layoutType, price },
      ];

      // Recalculate the total amount by adding the selected seat's price
      updatedTotalAmount = updatedSeats.reduce(
        (sum, seat) => sum + seat.price,
        0
      );
    }

    setSelectedSeats(updatedSeats);
    setTotalAmount(updatedTotalAmount);
  };

  const handlePayNow = async () => {
    const isBlocked = selectedSeats.some((selectedSeat) =>
      blockedSeats.some(
        (blockedSeat) =>
          blockedSeat.row === selectedSeat.row &&
          blockedSeat.column === selectedSeat.column
      )
    );

    if (isBlocked) {
      alert(
        "One or more of the selected seats are already booked. Please choose another seat."
      );
      return;
    }

    try {
      // Proceed with payment logic
      await navigate("/BookingDetail", {
        state: {
          showtimeId,
          seatData: { seats: selectedSeats },
          totalAmount,
          movieName,
          selectedDate,
          selectedTime,
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleSeat = () => {
    navigate(-1);
  };
  console.log(blockedSeats);
  return (
    <div className="container">
      <div className="container d-flex p-2">
        <a onClick={handleSeat} className="d-flex">
          <IoArrowBackOutline
            style={{ color: "rgb(0, 89, 255)", marginTop: "18px" }}
            className="fa-2x fs-4"
          />
          <h6 className="m-2 fs-1 text-primary fw-bold">Select Seat</h6>
        </a>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <div className="w-auto">
          {Array.isArray(seats) && seats.length > 0 ? (
            seats.map((seatCategory, index) => (
              <SeatCategory
                key={index}
                title={`$${seatCategory.price} ${seatCategory.layoutType}`}
                rows={seatCategory.rows}
                price={seatCategory.price}
                layoutType={seatCategory.layoutType}
                selectedSeats={selectedSeats}
                blockedSeats={blockedSeats} 
                onSelect={handleSelectSeat}
              />
            ))
          ) : (
            <div>Loading seats...</div>
          )}

          <div className="border border-secondary border-5 rounded mt-5"></div>
          <div className="text-center mb-3">All eyes this way please</div>
          <div className="container m-3">
            <div className="container mt-5">
              <button
                type="button"
                className="btn btn-outline-primary w-100 p-2"
                onClick={handlePayNow}
                disabled={selectedSeats.length < selectedSeatsNumber}
              >
                Pay Now ${totalAmount}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeatCategory = ({
  title,
  rows,
  price,
  layoutType,
  selectedSeats,
  onSelect,
  blockedSeats, 
}) => (
  <>
    <div className="container m-3">
      <h5>{title}</h5>
      <hr />
    </div>
    {/* Iterate over rows */}
    {rows.map((row) => (
      <div key={row} className="container">
        <div className="row">
          {Array.from({ length: 10 }, (_, seatIndex) => {
            const seat = seatIndex + 1;

            console.log(blockedSeats);
            const isBlocked = blockedSeats.some(
              (blockedSeat) =>
                blockedSeat.row === row && blockedSeat.column === seat
            );

            return (
              <div className="col" key={`${row}-${seat}`}>
                <button
                  type="button"
                  className={`mb-1 p-2 w-100 ${
                    isBlocked
                      ? "btn btn-secondary" // Blocked seats are gray
                      : selectedSeats.some(
                          (s) => s.row === row && s.column === seat
                        )
                      ? "btn btn-primary"
                      : "btn btn-outline-dark"
                  }`}
                  onClick={() =>
                    !isBlocked && onSelect(seat, price, row, layoutType)
                  }
                  disabled={isBlocked}
                >
                  {row}
                  {seat}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </>
);

export default SeatSelection;
