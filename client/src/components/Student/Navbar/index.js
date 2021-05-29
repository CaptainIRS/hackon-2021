import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { changeTheme } from "../../../redux/userActions";
import { route } from "preact-router";
export default function NavBar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const theme = user.theme;
  const rd = () => {
    route("/student/home", true);
  };
  const ct = () => {
    dispatch(changeTheme());
  };
  const dark = (
    <Navbar expand className="dark2">
      <NavbarBrand className="text-white">STUDENT</NavbarBrand>
      <Nav className="ml-auto pd-3" navbar>
        <NavItem>
          <Tooltip title="Home">
            <IconButton className="dark2" onClick={rd} aria-label="Home">
              <FontAwesomeIcon icon={faHome} className="text-white" />
            </IconButton>
          </Tooltip>
        </NavItem>
        <NavItem>
          <Tooltip title="Change Theme">
            <IconButton
              className="dark2"
              onClick={ct}
              aria-label="ChanegeTheme"
            >
              <FontAwesomeIcon icon={faMoon} className="text-white" />
            </IconButton>
          </Tooltip>
        </NavItem>
      </Nav>
    </Navbar>
  );
  const light = (
    <Navbar expand className="light2">
      <NavbarBrand>STUDENT</NavbarBrand>
      <Nav className="ml-auto pd-3" navbar>
        <NavItem>
          <Tooltip title="Home">
            <IconButton className="light2" onClick={rd} aria-label="Home">
              <FontAwesomeIcon icon={faHome} />
            </IconButton>
          </Tooltip>
        </NavItem>
        <NavItem>
          <Tooltip title="Change Theme">
            <IconButton
              className="light2"
              onClick={ct}
              aria-label="ChanegeTheme"
            >
              <FontAwesomeIcon icon={faSun} />
            </IconButton>
          </Tooltip>
        </NavItem>
      </Nav>
    </Navbar>
  );
  return theme ? dark : light;
}
