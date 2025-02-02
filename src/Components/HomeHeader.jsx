import { useNavigate } from "react-router-dom"


function HomeHeader() {
    const navigate = useNavigate();

    const handleMovie = ()=>{
        navigate('/Home/Movie');
    }
    const handleTheater = ()=>{
        navigate('/Home/Theater');
    }
    return (
        <>
        
            <div className="container mb-3">
                <h1>Now Showing</h1>
            </div>
            <div className=" d-flex justify-content-start mb-3">
                <div className="me-2 ">
                    
                        <button type="button" className={`btn m-2 fs-6 fw-semibold px-5 p-2 ${location.pathname === "/Home/Movie" ? "btn-primary text-white" : "text-primary"}`} onClick={handleMovie}>
                            Movie
                        </button>
                    
                </div>
                <div className="me-2  ">
                    
                        <button type="button" className={`btn m-2 fs-6 fw-semibold px-5 p-2 ${location.pathname === "/Home/Theater" ? "btn-primary text-white" : "text-primary"}`} onClick={handleTheater}>
                            Theater
                        </button>
                    
                </div>
            </div>
        </>
    )
}

export default HomeHeader