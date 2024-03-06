import { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import ChatWindow from './components/ChatWindow'; // Import your ChatWindow component
import { title } from 'process';

import ChatbotAvatar from "./assets/yoga.svg";

export type Prompt = { title: string; prompt: string; name: string; img: any };
const PROMPTS: Prompt[] = [
  {
    title: 'junge, berliner Start-Up-Gründerin',
    prompt: "Du bist Jana. Dir gehört ein junges, hippes Startup in Berlin. Kunden können dir bei Fragen schreiben und du versuchst ihnen nach bestem Wissen und Gewissen zu helfen.",
    name: "Jana",
    img: ChatbotAvatar
  },
  {
    title: 'alter, weißer Mittelständler',
    prompt: "",
    name: "Thorsten",
    img: ChatbotAvatar
  },
  {
    title: 'corporate CEO eines internationalen Unternehmens',
    prompt: 'This is the third prompt',
    name: "Marc",
    img: ChatbotAvatar
  },
]; // Replace with your actual prompts

function App() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(PROMPTS[0]);
  const [showChat, setShowChat] = useState(true);


  const handlePromptSelection = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowChat(true);
  };

  return (
    <main>
      <div className='container my-5'>

        <div className='row'>
          {PROMPTS.map((prompt, index) => (
            <div key={index} className='col-4 justify-content-center align-items-center flex-fill'>
              <button className='btn btn-primary w-100' key={index} onClick={() => handlePromptSelection(prompt)}>
                {prompt.title}
              </button>
            </div>
          ))}
        </div>
        {!showChat ? (
          <></>
        ) : (
          <ChatWindow prompt={selectedPrompt || { prompt: "", title: "", name: "", img: "" }} />
          // <></>
        )}
      </div>
    </main>
  );
}

export default App;
