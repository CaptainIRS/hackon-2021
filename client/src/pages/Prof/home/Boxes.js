import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCalendar,
  faUsers,
  faBookReader,
  faChalkboardTeacher,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
const boxes = [
  { name: "Create Profile", icon: faPlus, url: "/prof/create" },
  { name: "Send Certificate", icon: faCalendar, url: "prof/cert" },
  { name: "Study Material", icon: faBookReader, url: "/prof/study" },
  { name: "Online Class", icon: faChalkboardTeacher, url: "/prof/online" },
  { name: "Assignment", icon: faListAlt, url: "/prof/assign" },
];

import { route } from "preact-router";

export default function Boxes() {
  const user = useSelector((state) => state.user);
  const theme = user.theme;

  const light = (
    <>
      {boxes.map((box, index) => (
        <span
          md={4}
          className="box d-flex justify-content-center light2"
          id={box.name}
          onClick={() => box.name !== "Online Class" ? route(box.url, true) : window.location.assign(box.url)}
          key={index + 6}
          name={box.name}
        >
          <FontAwesomeIcon
            icon={box.icon}
            size="4x"
            className="tpm"
            id={box.name}
            name={box.name}
            onClick={() => box.name !== "Online Class" ? route(box.url, true) : window.location.assign(box.url)}
          />
          <h6
            className="btm"
            id={box.name}
            name={box.name}
            onClick={() => box.name !== "Online Class" ? route(box.url, true) : window.location.assign(box.url)}
          >
            {box.name}
          </h6>
        </span>
      ))}
    </>
  );
  const dark = (
    <>
      {boxes.map((box, index) => (
        <span
          md={4}
          className="box d-flex justify-content-center dark2"
          id={box.name}
          onClick={() => box.name !== "Online Class" ? route(box.url, true) : window.location.assign(box.url)}
          key={index}
          name={box.name}
        >
          <FontAwesomeIcon
            icon={box.icon}
            size="4x"
            className="tpm text-white"
            id={box.name}
            key={box.name}
            name={box.name}
            onClick={() => box.name !== "Online Class" ? route(box.url, true) : window.location.assign(box.url)}
          />
          <h6
            className="btm dark-color"
            id={box.name}
            name={box.name}
            onClick={() => box.name !== "Online Class" ? route(box.url, true) : window.location.assign(box.url)}
          >
            {box.name}
          </h6>
        </span>
      ))}
    </>
  );
  return <center>{theme ? dark : light}</center>;
}
