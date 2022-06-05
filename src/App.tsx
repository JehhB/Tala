import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { ConstellationPage } from "./pages";
import { NoteContainer } from "./components";

const App = function () {
  return (
    <Router>
      <Routes>
        <Route index element={<Navigate to="JohnDoe/Constellation" />} />
        <Route path=":user">
          <Route index element={<Navigate to="./Constellation" />} />
          <Route path=":constellation" element={<ConstellationPage />}>
            <Route
              caseSensitive
              path=":notes"
              element={<NoteContainer title="test" />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
