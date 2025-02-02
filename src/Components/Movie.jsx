import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import HomeHeader from "./HomeHeader";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";


const Movie = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    
    const today = new Date().toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    fetch(
      "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/movies",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      });
  }, []);

  const handleImage = (movieId) => {
    if (!selectedDate) return;
    navigate(`/Movie/${movieId}/${selectedDate.replace(/\//g, "-")}`); 
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="container">
          <HomeHeader />
        </div>

        
      

        <div className="container">
          <div className="row">
            {movies.map((movie) => (
              <div className="col-3 mb-3" key={movie.id}>
                <a onClick={() => handleImage(movie.id)}>
                  <img
                    src={movie.image}
                    className="card-img-top rounded movie-image"
                    alt={movie.name}
                  />
                </a>
                <div className="text-center fs-5">{movie.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Movie;
