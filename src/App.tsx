import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrapeReels from "./components/ScrapeReels";
import AudioView from "./components/AudioView";
import AccountsView from "./components/AccountsView";


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

        {/* Account Management UI PAGE */}
        <Route path="/settings/accounts" element={<AccountsView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
