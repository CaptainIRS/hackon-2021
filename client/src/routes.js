import { Router } from "preact-router";
import ProfHome from "./pages/Prof/home";
import StudentHome from "./pages/Student/home";
import StudentJoin from "./pages/Student/JoinCourse";
import ProfAssign from "./pages/Prof/assignmentComponents/Assignment";
import ProfViewAssign from "./pages/Prof/assignmentComponents/ViewSubmissions";
import ProfNewAssign from "./pages/Prof/assignmentComponents/NewAssignment";
import ProfManageAssign from "./pages/Prof/assignmentComponents/ManageAssignments";
import ProfEditAssign from "./pages/Prof/assignmentComponents/EditAssignment";
import ProfCreateCourse from "./pages/Prof/CreateCourse";
import ProfReg from "./pages/Prof/authComponents/Register";
import StudentReg from "./pages/Student/authComponents/Register";
import FirstPage from "./pages/FirstPage";
import Add from "./pages/add";
import Upload from "./pages/upload";

import { useSelector } from "react-redux";

const Routes = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;
  const th = theme ? "dark1" : "light1";
  return (
    <div className={`whole ${th}`}>
      <Router>
        <FirstPage path="/" />
        <StudentReg path="/student/login/" />
        <ProfReg path="/prof/login/" />
        <ProfHome path="/prof/home" />
        <StudentHome path="/student/home" />
        <Add path="/add/" />
        <Upload path="/upload" />
        <ProfAssign path="/prof/assign" />
        <ProfManageAssign path="/prof/ManageAssignments" />
        <ProfEditAssign path="/prof/EditAssignment" />
        <ProfNewAssign path="/prof/NewAssignment" />
        <ProfViewAssign path="/prof/ViewSubmissions" />
        <ProfCreateCourse path="/prof/create" />
        <StudentJoin path="/student/join" />
      </Router>
    </div>
  );
};

export default Routes;
