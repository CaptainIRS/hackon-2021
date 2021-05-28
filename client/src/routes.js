import { Router } from "preact-router";

import { useSelector } from "react-redux";

const Routes = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;
  const th = theme ? "dark1" : "light1";
  return (
    <div className={`whole ${th}`}>
      <Router />
    </div>
  );
};

export default Routes;
