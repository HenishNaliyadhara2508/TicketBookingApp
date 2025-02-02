import { useNavigate } from "react-router-dom"


const Navbar = () => {
  const navigate = useNavigate();

  const handleHome= ()=>{
    navigate('/Home/Movie')
  }
  const handleMyTicket= ()=>{
    navigate('/MyTicket/Upcoming')
  }
  const handleLogout = () => {
    navigate('/')
  }

  return (
    <nav className="d-flex justify-content-between m-2">
      <div className="m-2">
        <img src="" alt="Cinemas" className="img-thumbnail" />
      </div>
      <div className="m-2 d-flex justify-content-center align-items-center">
        <div className="mx-3">
          <a  className="container text-primary" onClick={handleHome}>Home</a>
        </div>
        <div className="mx-3">
          <a className="text-primary" onClick={handleMyTicket}>My Ticket</a>
        </div>
      </div>
      <div className="m-2">
        <button type="button" className="btn btn-danger justify-content-between text-light" onClick={handleLogout}>
          
            Logout
          
        </button>
      </div>
    </nav>
  )
}

export default Navbar