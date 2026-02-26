import React from "react";
import { Message } from "../data/mockData";

interface Props {
  messages: Message[];
}

const MessagesTab: React.FC<Props> = ({ messages }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Messages</h2>

      {messages.map((m) => (
        <div key={m.id} className="border p-4 rounded-lg mb-3">
          <p className="font-semibold">{m.subject}</p>
          <p className="text-sm text-gray-500">{m.from}</p>
          <p className="mt-1 text-gray-700">{m.preview}</p>
        </div>
      ))}
    </div>
  );
};

export default MessagesTab;
