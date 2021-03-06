import { Router } from "preact-router";
import ProfHome from "./pages/Prof/home";
import StudentHome from "./pages/Student/home";
import StudentJoin from "./pages/Student/JoinCourse";
import ProfAssign from "./pages/Prof/assignmentComponents/Assignment";
import ProfViewAssign from "./pages/Prof/assignmentComponents/ViewSubmissions";
import ProfNewAssign from "./pages/Prof/assignmentComponents/NewAssignment";
import ProfManageAssign from "./pages/Prof/assignmentComponents/ManageAssignments";
import ProfCreateCourse from "./pages/Prof/CreateCourse";
import ProfReg from "./pages/Prof/authComponents/Register";
import StudentReg from "./pages/Student/authComponents/Register";
import StudentAssign from "./pages/Student/assignmentComponents/Assignments";
import StudentSubmit from "./pages/Student/assignmentComponents/SubmitWork";
import ProfStudy from "./pages/Prof/studymaterialComponents/StudyMaterial";
import StudentStudy from "./pages/Student/studymaterialsComponents/StudyMaterials";
import FirstPage from "./pages/FirstPage";
import StudentCert from './pages/Student/requestCertificate/RequestCertificate'
import ProfVerified from './pages/Prof/verifiedFilesComponents/'
import StudentVerified from './pages/Student/verifiedFilesComponents/'

import { useSelector } from "react-redux";

const Routes = () => {
  console.log("hai")
  const user = useSelector((state) => state.user);
  const theme = user.theme;
  const th = theme ? "dark1" : "light1";
  return (
    <div className={`whole ${th}`}>
      <Router>
        <FirstPage path="/" />
        <StudentCert path="/student/certs" />
        <ProfVerified path="/prof/certs" />
        <StudentVerified path="/student/verify" />
        <StudentAssign path="/student/assign" />
        <StudentSubmit path="/student/submit/:id" />
        <StudentReg path="/student/register/" />
        <ProfReg path="/prof/register/" />
        <ProfHome path="/prof/home" />
        <StudentHome path="/student/home" />
        <ProfAssign path="/prof/assign" />
        <ProfManageAssign path="/prof/ManageAssignments" />
        <ProfNewAssign path="/prof/NewAssignment" />
        <ProfViewAssign path="/prof/ViewSubmissions/:id" />
        <ProfCreateCourse path="/prof/create" />
        <StudentJoin path="/student/join" />
        <ProfStudy path="/prof/study" />
        <StudentStudy path="/student/study" />

      </Router>
    </div>
  );
};

export default Routes;
