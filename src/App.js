import "./App.css";
import Table from "./components/table";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Table />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
