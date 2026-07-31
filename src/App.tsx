import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Results from './pages/Results';
import Callback from './pages/Callback';

function FadeRoutes({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [display, setDisplay] = useState(children);
  useEffect(() => {
    setDisplay(children);
  }, [location.pathname, children]);
  return <div key={location.pathname} className="animate-fade-in">{display}</div>;
}

export default function App() {
  return (
    <FadeRoutes>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </FadeRoutes>
  );
}
