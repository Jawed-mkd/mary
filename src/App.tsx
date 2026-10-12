import { useState } from "react";
import StarField from "./components/StarField";
import Envelope from "./components/Envelope";
import MessageSection from "./components/MessageSection";
import ReminderCards from "./components/ReminderCards";
import KindWords from "./components/KindWords";
import PeaceSection from "./components/PeaceSection";
import LetterSection from "./components/LetterSection";
import FinalGift from "./components/FinalGift";
import "./App.css";

function App() {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  return (
    <div className="app">
      <StarField />

      {!isEnvelopeOpened ? (
        <Envelope onOpen={() => setIsEnvelopeOpened(true)} />
      ) : (
        <main className="main-content" role="main">
          <MessageSection />
          <ReminderCards />
          <KindWords />
          <PeaceSection />
          <LetterSection />
          <FinalGift />
        </main>
      )}
    </div>
  );
}

export default App;
