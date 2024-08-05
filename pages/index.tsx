import { useChat } from 'ai/react'
import { Button, Spinner, Input, Avatar } from '@nextui-org/react'
import Markdown from 'react-markdown'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat()

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch relative">
      <div className="flex-grow overflow-y-auto mb-24 px-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex my-2 ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            {m.role === 'user' ? (
              <Avatar isBordered className="mr-4" name="User" size="sm" />
            ) : null}
            <div
              className={`p-4 text-black rounded-xl w-72 text-start ${
                m.role === 'user'
                  ? 'bg-green-100 text-left'
                  : 'bg-blue-100 text-right'
              }`}
            >
              <Markdown>{m.content}</Markdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center justify-start my-2">
            <span>AI: </span>
            <Spinner className="ml-2" size="sm" />
          </div>
        )}
      </div>

      <form
        className="fixed bottom-0 w-full max-w-md p-4 flex items-center bg-slate-950"
        onSubmit={handleSubmit}
      >
        <Input
          fullWidth
          className="flex-grow mr-2"
          placeholder="Say something..."
          value={input}
          onChange={handleInputChange}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
// import { useState } from 'react'
// import { Button } from '@nextui-org/button'
// import { streamComponent } from '@/app/api/action'

// export default function Page() {
//   const [component, setComponent] = useState<React.ReactNode>()

//   return (
//     <div>
//       <form
//         onSubmit={async (e) => {
//           e.preventDefault()
//           setComponent(await streamComponent())
//         }}
//       >
//         <Button>Stream Component</Button>
//       </form>
//       <div>{component}</div>
//     </div>
//   )
// }
