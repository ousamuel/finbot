"use client";
import { useState } from "react";
import { Image } from "@nextui-org/image";
// import RobotBackground from "./Robot";
export default function Home() {
  const [messages, setMessages] = useState<any>([
    {
      role: "assistant",
      content: "Ask me for financial advice!",
    },
  ]);
  const [message, setMessage] = useState<string>("");

  const sendMessage = async () => {
    const newMessage = { role: "user", content: message };
    const updatedMessages = [
      ...messages,
      newMessage,
      { role: "assistant", content: "" },
    ];
    setMessages(updatedMessages);
    setMessage("");

    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessages),
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        const processText = async ({
          done,
          value,
        }: {
          done: boolean;
          value: Uint8Array;
        }) => {
          if (done) {
            return result;
          }
          let text = decoder.decode(value, { stream: true });
          // console.log(text);
          text = text.replace("\n", "<br/>");

          result += text;

          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });

          return reader.read().then(processText);
        };

        await reader.read().then(processText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <main className="h-[100vh] w-[100vw] flex flex-col justify-between">
      {/* <RobotBackground /> */}
      <section className="chat-box p-5 mx-auto">
        <div className="scroller-content">
          {messages.map((message: any, i: number) => {
            let splitm = message.content.split("<br/>");
            return (
              <div
                key={i}
                className={
                  i % 2 == 0 ? "chat-message" : "chat-message justify-end"
                }
              >
                <div className={i % 2 == 0 ? "triangle-left" : ""}></div>
                <div
                  className={
                    i % 2 == 0
                      ? "bg-green-200 max-w-[60%] p-3 rounded-md"
                      : "bg-gray-200 max-w-[60%] p-3 rounded-md"
                  }
                >
                  {/* {message.content} */}
                  {splitm.map((mes: any, j: number) => (
                    <p className={j > 0 ? "mt-4" : ""} key={j}>
                      {mes}
                    </p>
                  ))}
                </div>
                <div className={i % 2 == 0 ? "" : "triangle-right"}></div>
              </div>
            );
          })}
        </div>
        <h1 className="text-green-200 bg-black p-2 py-3 mb-3 rounded-md text-center uppercase">
          <strong className="text-xl">Finbot</strong>
          <br /> dedicated to providing personalized financial advice, planning,
          and support.
        </h1>
      </section>
      <section
        id="user-message"
        className="w-full h-[10vh] min-h-[75px] mx-auto"
      >
        <form
          className="flex justify-center"
          onSubmit={(e) => {
            sendMessage();
            e.preventDefault();
          }}
        >
          <div className='w-4/5 px-4 rounded-full bg-black text-gray-200'>

          <input
            className="bg-transparent h-fit w-full py-2 px-5 outline-none "
            value={message}
            placeholder="Hit Enter to send a message"
            onChange={(e) => setMessage(e.target.value)}
            />
            </div>

          {/* <input type="submit" value="Send" onClick={sendMessage} /> */}
        </form>
      </section>
    </main>
  );
}
