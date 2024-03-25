import { useRef, useState } from "react";
import { Prompt } from "../App";

type Role = "user" | "assistant" | "system";
type Message = {
    role: Role;
    content: string;
}

const SAMPLE_QUESTIONS = [
    "Mein Handy funktioniert nicht mehr. Was soll ich tun?",
    "Ich würde gerne meinen Vertrag kündigen. Was muss ich dafür tun?",
    "Ich möchte gerne ihr Produkt kaufen. Wo kann ich das tun?"
];

export default function ChatWindow(props: { prompt: Prompt | null }) {
    if (!props.prompt) return <div>Error: No prompt was passed to chat window.</div>;

    const [customPrompt, setCustomPrompt] = useState(props.prompt.prompt);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const lastResponse = useRef(null);

    function sendMessage(message: string) {
        if (!loading) {
            // build API payload
            const user_message: Message = { role: "user", content: message };

            // update UI
            const new_messages = [...messages];
            if (new_messages.length === 0) {
                new_messages.push({ role: "system", content: customPrompt });
            }

            new_messages.push(user_message);
            setMessages(new_messages);

            setInput("");

            setLoading(true);

            // generate answer
            generateAnswer(new_messages);
            // generateAnswerDummy(new_messages);
        }
    }

    async function generateAnswer(payload: Message[]) {
        // console.log(payload);
        payload.push({ role: "assistant", content: "" });
        setMessages(payload);

        const response = await fetch(`${import.meta.env.VITE_OLLAMA_BACKEND}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral:8x7b-instruct-v0.1-q3_K_M",
                messages: payload,
                stream: true
            })
        });
        if (!response.ok) {
            console.error("Failed to generate answer", response);
            return;
        }

        if (!response.body) throw new Error("error");
        const reader = response.body.getReader(); // Convert res.body into an async iterator
        // Iterate over the chunks using the async iterator
        let output = "";
        function parseChunk(chunk: string) {
            const data = JSON.parse(chunk);
            if (data.done) {
                // console.log("DONE!");
                setMessages(old => {
                    old[old.length - 1].content = output;
                    return old
                });
                setLoading(false);
                return false;
            }
            // console.log(data.message.content);
            output = output + data.message.content;
            // @ts-ignore
            lastResponse.current.textContent = output;
        }
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!value) console.error("value is undefined");

            // parse value
            const chunk = new TextDecoder().decode(value);
            for (const item of chunk.split("\n")) {
                if (item == "") continue;
                try {
                    parseChunk(item);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        console.log(`[ERROR] chunk: '${item}'`);
                        continue;
                    }
                    console.error(e);
                }
            }
        }
    }

    return (
        <div className='chat-window container my-4'>
            <h1 className="text-center">Chatte mit: {props.prompt.name}, {props.prompt.gender == "f" ? "die" : "der"} {props.prompt.title}</h1>
            <div className="row mt-5">
                <div className="col-12 col-lg-4 text-center">
                    <img src={props.prompt.img} alt="Chatbot Avatar" style={{ maxHeight: 200 }} />
                    <h3 className="mt-3">{props.prompt.name}</h3>
                    <p>{props.prompt.title}</p>
                    <form>
                        <div className="form-floating">
                            <textarea
                                className="form-control"
                                placeholder="Leave a comment here"
                                id="floatingTextarea"
                                value={customPrompt}
                                onChange={e => setCustomPrompt(e.target.value)}
                                style={{ height: "10rem" }}
                            />
                            <label htmlFor="floatingTextarea">Systemprompt</label>
                        </div>
                        <div className="form-text">Änderung am Systemprompt haben nur bei leeren Konversationen einen Effekt</div>
                        <button className="btn btn-danger" type="button"
                            onClick={e => {
                                e.preventDefault();
                                setMessages([]);
                                setLoading(false);
                            }}
                        >Konversation zurücksetzen</button>
                    </form>
                </div>

                <div className="col-12 col-lg-8 chat-container d-flex flex-column justify-content-between"
                    style={{ height: "60vh", borderLeft: "2px solid #7f8c8d" }}
                >
                    <div className="row message-container">
                        {messages.slice(1).map((message, index) => (
                            <div key={index} className="col-12">
                                {index == messages.length - 2 ?
                                    <div ref={lastResponse} className={`message-${message.role}`}>{message.content}</div> :
                                    <div className={`message-${message.role}`}>{message.content}</div>
                                }
                            </div>
                        ))}
                    </div>

                    <form
                        className="mt-3"
                        onSubmit={e => {
                            e.preventDefault();
                            sendMessage(input);
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
                        </div>
                    </form>
                </div>
                {/* sample questions */}
                <div className="row gy-2 mt-2">
                    {SAMPLE_QUESTIONS.map((question, i) => (
                        <div className="col-12 col-md-4" key={i}>
                            <button
                                className="btn btn-primary w-100"
                                onClick={e => sendMessage(question)}
                            >{question}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
