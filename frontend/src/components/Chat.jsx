import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

const Chat = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
  }, [socket]);

  const sendMessage = () => {
    if (text.trim() === "") return;
    socket.emit("sendMessage", text);
    setText("");
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <div className="h-60 overflow-y-auto mb-2">
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} className="border p-1 w-full" />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-3 py-1 mt-2 rounded">Send</button>
    </div>
  );
};

export default Chat;
