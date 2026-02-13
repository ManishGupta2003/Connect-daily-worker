import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Chat = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const userMongoId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!state?.problemId) {
      navigate("/");
      return;
    }

    socket.emit("join_room", state.problemId);

    fetchMessages();

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    const res = await axios.get(
      `http://localhost:3000/chat/${state.problemId}`,
    );
    setMessages(res.data);
  };

  const handleSend = () => {
    if (!newMsg.trim()) return;

    const msgData = {
      problemId: state.problemId,
      senderId: userMongoId,
      receiverId: state.receiverMongoId,
      senderName: localStorage.getItem("userName"),
      receiverName: state.receiverName || "User",
      message: newMsg,
    };

    socket.emit("send_message", msgData);
    setNewMsg("");
  };

  const handleApprove = async () => {
    await axios.put(`http://localhost:3000/assign/${state.problemId}`, {
      workerId: state.receiverMongoId,
    });
    alert("Worker approved!");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 shadow flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{state.problemTitle}</h2>
          <p className="text-xs opacity-80">Live Chat</p>
        </div>

        {userRole === "client" && (
          <button
            onClick={handleApprove}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
          >
            Approve
          </button>
        )}
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-100 to-gray-200">
        {messages.map((msg) => {
          const isMe = String(msg.senderId) === String(userMongoId);

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2 shadow ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {/* NAME */}
                <div className="text-xs opacity-70 mb-1 font-semibold">
                  {msg.senderName || "Unknown"}
                </div>

                {/* MESSAGE */}
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT BOX */}
      <div className="p-3 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
