import "./App.css";
import RouterView from "./router/RouterView";
import { useDispatch } from "react-redux";
import { setLoginUserData } from "./store/app";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    dispatch(setLoginUserData(user));
  }

  return (
    <div className="App">
      <ToastContainer />
      <RouterView />
    </div>
  );
}

export default App;
