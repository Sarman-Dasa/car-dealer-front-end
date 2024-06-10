import "./App.css";
import RouterView from "./router/RouterView";
import { useDispatch } from "react-redux";
import { setLoginUserData } from "./store/app";

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    dispatch(setLoginUserData(user));
  }

  return (
    <div className="App">
      <RouterView />
    </div>
  );
}

export default App;
