import { useState } from "react";
import { Prompt } from "../App";
import LoadingSpinner from "./LoadingSpinner";

type Role = "user" | "assistant" | "system";
type Message = {
    role: Role;
    content: string;
}
const DUMMY_MESSAGES: Message[] = [
    // { role: "user", content: "Kannst du mir helfen?" },
    // { role: "assistant", content: "Ja, sehr gerne!" },
];

export default function ChatWindow(props: { prompt: Prompt }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "system" as Role, content: props.prompt.prompt },
        ...DUMMY_MESSAGES
    ]);

    async function generateAnswer(payload: Message[]) {
        const response = await fetch(`${import.meta.env.VITE_OLLAMA_BACKEND}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral:8x7b-instruct-v0.1-q3_K_M",
                messages: payload,
                stream: false
            })
        });
        if (!response.ok) {
            console.error("Failed to generate answer", response);
            return;
        }

        const data = await response.json();
        payload.push({ role: "assistant", content: data.message.content });
        setMessages(payload);
        setLoading(false);
    }

    async function generateAnswerDummy(payload: Message[]) {
        setTimeout(() => {
            setLoading(false);
            payload.push({ role: "assistant", content: `Ich bin ein Dummy und antworte immer das Gleiche. Das Ollama Backend ist erreichbar unter ${import.meta.env.VITE_OLLAMA_BACKEND}` })
            setMessages(payload);
        }, 3000);
    };

    return (
        <div className='chat-window container my-5'>
            <h1 className="text-center">Chatte mit einem/einer {props.prompt.title}</h1>
            <div className="row mt-5">
                <div className="col-4 text-center">
                    <img src={props.prompt.img} alt="Chatbot Avatar" style={{ maxHeight: 200 }} />
                    <h3 className="mt-3">{props.prompt.name}</h3>
                    <p>{props.prompt.title}</p>
                </div>

                <div className="col-8 chat-container d-flex flex-column justify-content-between"
                    style={{ height: "60vh", borderLeft: "2px solid #7f8c8d" }}
                >
                    {/* <p>Prompt: "{props.prompt.prompt}"</p> */}
                    <div className="row message-container">
                        {messages.slice(1).map((message, index) => (
                            <div key={index} className="col-12">
                                <div className={`message-${message.role}`}>{message.content}</div>
                            </div>
                        ))}
                    </div>

                    {loading && <LoadingSpinner />}

                    <form
                        className="mt-3"
                        onSubmit={e => {
                            e.preventDefault();
                            if (!loading) {
                                // build API payload
                                const user_message: Message = { role: "user", content: input };

                                // update UI
                                const new_messages = [...messages];
                                new_messages.push(user_message);
                                setMessages(new_messages);

                                setInput("");

                                setLoading(true);

                                // generate answer
                                generateAnswer(new_messages);
                                // generateAnswerDummy(new_messages);
                            }
                        }}>
                        <div className="input-group">
                            <input
                                className="form-control"
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Mein Handy funktioniert nicht mehr. Was soll ich tun?"
                            />
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-send-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                </svg>
                            </button>
                            {/* <button class="btn btn-outline-secondary" type="button" id="button-addon1">Button</button> */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
