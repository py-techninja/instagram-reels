import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrapeReels from "./component/ScrapeReels";
import AudioView from "./component/AudioView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME → same as /audio */}
        <Route path="/" element={<AudioView />} />

        {/* PUBLIC AUDIO PAGE */}
        <Route path="/audio/:audioId" element={<AudioView />} />

        {/* SCRAPER UI PAGE */}
        <Route path="/scrape/reels" element={<ScrapeReels />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
