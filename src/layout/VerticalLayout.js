import { Button, NavDropdown, Image } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userLogOut } from "../store/app";
import { useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { axiosPostResponse } from "../services/axios";
function VerticalLayout() {
  const userInfo = useSelector((state) => state.app.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = async () => {
    // await signOut(auth);
    const response  = await axiosPostResponse('user/logout');
    console.log('response: ', response);
    
    navigate("/sign-in", { replace: true });
    setTimeout(() => {
      dispatch(userLogOut());
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }, 200);
  };

  return (
    <Navbar expand="lg" className="vertical-menu">
      <div className="container-fluid ms-5">
        <Link to="/" className="navbar-brand">
          <FaCar className="text-light" />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">
              Home
            </Link>
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
              <div className="d-flex">
                <p className="my-xxl-auto">
                  Signed in as:<b>{userInfo.full_name}</b>
                </p>
                <NavDropdown
                  title={
                    <Image
                      src={ process.env.REACT_APP_API_IMAGE_PATH +
                        "/" + userInfo.avatar}
                      alt="S"
                      roundedCircle
                      width="24px"
                      height="24px"
                    />
                  }
                  id="basic-nav-dropdown"
                  className="p-0"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/change-password">
                    Change password
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <Button
                      className="btn btn-secondary w-100"
                      onClick={logOut}
                    >
                      LogOut
                    </Button>
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default VerticalLayout;
