import { Button, NavDropdown, Image, Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiSliderVertical } from "react-icons/ci";

import { FaCar } from "react-icons/fa";

function VerticalLayout({ handleUserLogout, setLayoutType }) {
  const userInfo = useSelector((state) => state.app.user);

  return (
    <>
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
                        src={
                          process.env.REACT_APP_API_IMAGE_PATH +
                          "/" +
                          userInfo.avatar
                        }
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
                        onClick={() => handleUserLogout()}
                      >
                        LogOut
                      </Button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              )}
            </Nav>
            <CiSliderVertical onClick={() => setLayoutType('sidebar')}/>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <Outlet />
    </>
  );
}

export default VerticalLayout;
