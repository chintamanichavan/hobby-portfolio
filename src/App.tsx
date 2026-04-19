import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Photography from './pages/Photography';
import Poetry from './pages/Poetry';
import Travel from './pages/Travel';
import Cooking from './pages/Cooking';
import Guitar from './pages/Guitar';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/poetry" element={<Poetry />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/cooking" element={<Cooking />} />
        <Route path="/guitar" element={<Guitar />} />
      </Routes>
    </BrowserRouter>
  );
}
