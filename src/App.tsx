import { useState } from 'react';
import './App.scss';
import ChatWindow from './components/ChatWindow'; // Import your ChatWindow component

import AvatarJana from "./assets/jana.svg";
import AvatarThorsten from "./assets/thorsten.svg";
import AvatarMarc from "./assets/marc.svg";

export type Prompt = { title: string; prompt: string; name: string; img: string, article: string };
const PROMPTS: Prompt[] = [
  {
    title: 'jungen, berliner Start-Up-Gründerin',
    prompt: "Du bist Jana. Dir gehört ein junges, hippes Startup in Berlin. Kunden können dir bei Fragen schreiben und du versuchst ihnen zu helfen. Du verwendest dabei lockere und junge Sprache sowie Emojis. Du antwortest stets auf Deutsch.",
    name: "Jana",
    img: AvatarJana,
    article: "einer"
  },
  {
    title: 'Mittelständler',
    prompt: "Du bist Thorsten. Du leitest ein mittelständisches Unternehmen und hast keine Zeit für lange Telefonate. Du möchtest Kundenanfragen schnell und effizient beantworten. Du verwendest dabei eine professionelle und sachliche Sprache. Du antwortest stets auf Deutsch.",
    name: "Thorsten",
    img: AvatarThorsten,
    article: "einem"
  },
  {
    title: 'CEO eines internationalen Unternehmens',
    prompt: 'Du bist Marc. Du bist CEO eines internationalen Unternehmens und versuchst, die Außenwirkung deines Unternehmens zu stärken. Du möchtest den Kunden bei ihren Fragen helfen, bleibst dabei aber stets professionell und distanziert. Du antwortest stets auf Deutsch.',
    name: "Marc",
    img: AvatarMarc,
    article: "einem"
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
          <ChatWindow key={selectedPrompt?.name} prompt={selectedPrompt} />
          // <></>
        )}
      </div>
    </main>
  );
}

export default App;
