import { Button, NavDropdown, Image, Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCar } from "react-icons/fa";
import { CiSliderHorizontal } from "react-icons/ci";

function SidebarLayout({ handleUserLogout, setLayoutType }) {
  const userInfo = useSelector((state) => state.app.user);

  return (
    <div>
      <div className="sidebar">
        <div className="container-fluid ms-3">
          <Link to="/" className="navbar-brand text-light justify-content-between space-right2">
            <FaCar />
          </Link>
            <CiSliderHorizontal className="text-light float-end me-4" onClick={() => setLayoutType('vertical')}/>
          <Nav className="flex-column mt-4">
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
          <Nav className="flex-column bottom-nav">
            {!userInfo ? (
              <>
                <Link to="sign-in">
                  <Button variant="outline-light" className="me-2">
                    Sign In
                  </Button>
                </Link>
                <Link to="sign-up">
                  <Button variant="outline-light">Sign Up</Button>
                </Link>
              </>
            ) : (
              <div className="d-flex flex-column align-items-start">
                <p className="my-2 text-light">
                  Signed in as: <b>{userInfo.full_name}</b>
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
                      width="35px"
                      height="35px"
                    />
                  }
                  id="sidebar-nav-dropdown"
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
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;
