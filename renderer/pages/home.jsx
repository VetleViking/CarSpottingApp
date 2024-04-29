import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [message, setMessage] = React.useState('No message found')

  React.useEffect(() => {
    window.ipc.on('message', (message) => {
      setMessage(message)
    })
  }, [])

  return (
    <div>
      <Link href="/next">gå dit</Link>
    </div>
  )
}
