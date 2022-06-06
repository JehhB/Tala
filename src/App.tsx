import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { ConstellationPage } from "./pages";
import { ConstellationNote } from "./components";

const App = function () {
  return (
    <Router>
      <Routes>
        <Route index element={<Navigate to="JohnDoe/Constellation" />} />
        <Route path=":userName">
          <Route index element={<Navigate to="./Constellation" />} />
          <Route path=":constellationName" element={<ConstellationPage />}>
            <Route
              caseSensitive
              path=":noteName"
              element={<ConstellationNote />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
