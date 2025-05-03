"use client"
import { useChat } from "ai/react"


export default function Chat() {
  const { append, isLoading, messages, input, handleSubmit, handleInputChange } = useChat()
  const noMessages = !messages || messages.length === 0;

  return <div>
    <section>
      {noMessages ? (
        <>
          <p className="starter-text">
            JUST A CHAT BOT
          </p>
        </>
      ) : (
        <>
          {messages.map((message, i) => (
            <div key={i}>{message.content}</div>
          ))}
          {isLoading && <h1>Loading...</h1>}</>
      )}
      <form onSubmit={handleSubmit}>
        <input className="p-2 rounded-md" onChange={handleInputChange} value={input} placeholder="Ask" />
        <input type="submit" />
      </form>
    </section>
  </div>
}
