import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/my-chats/${userId}`);
        setChats(res.data);
      } catch (error) {
        console.error("Chat list error:", error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 shadow">
        <h2 className="text-lg font-semibold">Chats</h2>
        <p className="text-xs opacity-80">Your conversations</p>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chats.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No conversations yet.
          </p>
        )}

        {chats.map((chat, index) => (
          <div
            key={index}
            onClick={() =>
              navigate("/chat", {
                state: {
                  problemId: chat.problemId,
                  problemTitle: chat.problemName,
                  receiverMongoId: chat.otherUserId,
                },
              })
            }
            className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer p-4 flex items-center gap-3"
          >
            {/* PROFILE CIRCLE */}
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              {chat.problemName?.charAt(0).toUpperCase()}
            </div>

            {/* TEXT AREA */}
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 truncate">
                  {chat.otherUserName || "User Chat"}
                </h3>

                <span className="text-xs text-gray-400">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-sm text-blue-600 truncate">
                🔧 {chat.problemName}
              </p>

              <p className="text-sm text-gray-500 truncate mt-1">
                💬 {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
