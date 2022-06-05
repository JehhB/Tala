import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ConstellationPage } from "./pages";
import { NoteContainer } from "./components";

const App = function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="JohnDoe/Constellation" />} />
        <Route path=":user">
          <Route path="/:user/" element={<Navigate to="./Constellation" />} />
          <Route path=":constellation" element={<ConstellationPage />}>
            <Route path=":notes" element={<NoteContainer title="test" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
