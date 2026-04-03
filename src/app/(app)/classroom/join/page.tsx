"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { getClassroomByCode } from "@/lib/classroom"

export default function JoinClassroom() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [shake, setShake] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    const classroom = getClassroomByCode(code)
    if (classroom) {
      setSuccess(`You joined ${classroom.name}!`)
      setTimeout(() => router.push(`/classroom/${classroom.id}`), 1500)
    } else {
      setShake(true)
      setError("Invalid code. Check with your teacher.")
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-20">
      <h1 className="text-2xl font-bold text-center">Join a classroom</h1>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        Enter the code your teacher gave you
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xs">
        <motion.input
          animate={shake ? { x: [0, -8, 8, -8, 0] } : {}}
          transition={{ duration: 0.3 }}
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setError("")
          }}
          placeholder="XXXXXX"
          className="w-full rounded-xl border border-border bg-muted px-4 py-4 text-center text-2xl font-mono uppercase tracking-[0.5em] outline-none focus:ring-2 focus:ring-indigo-200"
        />

        {error && (
          <p className="mt-2 text-center text-sm text-red-500">{error}</p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 text-center text-sm text-green-600 font-medium"
          >
            {success}
          </motion.p>
        )}

        <Button
          type="submit"
          className="mt-4 w-full rounded-xl py-3"
          disabled={code.length < 6 || !!success}
        >
          Join
        </Button>
      </form>
    </div>
  )
}
