import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase/Firebase";
import { useDispatch } from "react-redux";
import { userLogOut } from "../store/app";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FaCar } from "react-icons/fa";
function VerticalLayout() {
  const userInfo = useSelector((state) => state.app.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = async () => {
    await signOut(auth);
    navigate("/sign-in", { replace: true });
    setTimeout(() => {
      dispatch(userLogOut());
      localStorage.removeItem("user");
    }, 200);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-2">
      <div className="container-fluid ms-5">
        <Link to="/" className="navbar-brand">
          <FaCar />
        </Link>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {userInfo && (
              <>
                <Link to="/cars" className="nav-link">
                  Cars
                </Link>
                <Link to="add-car" className="nav-link">
                  Add Car
                </Link>
              </>
            )}
          </Nav>
          <Nav>
            {!userInfo ? (
              <>
                <Link to="sign-in">
                  <Button variant="outline-primary" className="me-2">
                    Sign In
                  </Button>
                </Link>
                <Link to="sign-up">
                  <Button variant="outline-primary">Sign Up</Button>
                </Link>
              </>
            ) : (
              <div>
                <p className="d-inline">
                  Signed in as: <b>{userInfo.full_name}</b>
                  <Link to="/profile">
                    <ImProfile color="#166EFD" />
                  </Link>
                </p>
                <Button className="ms-5 mt-1" onClick={logOut}>
                  LogOut
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default VerticalLayout;
