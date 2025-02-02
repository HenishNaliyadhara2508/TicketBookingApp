import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Login from './Components/Login'
import Signup from './Components/Signup'
import Movie from './Components/Movie'
import MovieBooking from './Components/MovieBooking'
import Theater from './Components/Theater'
import TheaterName from './Components/TheaterName'
import Upcoming from './Components/Upcoming'
import History from './Components/History'
import Seat from './Components/Seat'
import SeatSelection from './Components/SeatSelection'
import BookingDetail from './Components/BookingDetail'
import Payment from './Components/Payment'
import PaymentSuccess from './Components/PaymentSuccess'
import Ticket from './Components/Ticket'
import Cancel from './Components/Cancel';
import DownloadTicket from './Components/downloadTicket';


function App() {

  return (
    <> 
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/Home/Movie" element={<Movie/>}/>
        <Route path="/Movie/:movieId/:date" element={<MovieBooking/>}/>
        <Route path="/Home/Theater" element={<Theater/>}/>
        <Route path="/Theater/:theaterId/:date" element={<TheaterName/>}/>
        <Route path="/MyTicket/Upcoming" element={<Upcoming/>}/>
        <Route path="/MyTicket/History" element={<History/>}/>
        <Route path="/SeatSelection" element={<SeatSelection/>}/>
        <Route path="/Seat" element={<Seat/>}/>
        <Route path="/BookingDetail" element={<BookingDetail/>}/>
        <Route path="/Payment" element={<Payment/>}/>
        <Route path="/success" element={<PaymentSuccess/>}/>
        <Route path="/failed" element ={<Cancel/>}/>
        <Route path="/Ticket" element={<Ticket/>}/>
        <Route path="/Download-Ticket/:orderId" element={<DownloadTicket/>}/>
      </Routes>
    </Router>
    </>
    )
}

export default App
