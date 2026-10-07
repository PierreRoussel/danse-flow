"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CopyButton({
  text,
  label = "Copier les titres",
  copiedLabel = "Liste copiée",
  size = "lg",
  variant = "default",
  className,
  selectId,
}: {
  text: string
  label?: string
  copiedLabel?: string
  size?: "sm" | "lg"
  variant?: "default" | "outline" | "ghost"
  className?: string
  selectId?: string
}) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      const field = selectId
        ? (document.getElementById(selectId) as HTMLTextAreaElement | null)
        : null
      if (field) {
        field.focus()
        field.select()
        ok = document.execCommand("copy")
      }
    }
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      className={cn(buttonVariants({ size, variant }), className)}
      onClick={() => void onCopy()}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? copiedLabel : label}
    </button>
  )
}
