"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface CustomOTPProps {
  length: number
  value: string
  onChange: (value: string) => void
  className?: string
  containerClassName?: string
}

export function CustomOTP({
  length,
  value,
  onChange,
  className,
  containerClassName,
  ...props
}: CustomOTPProps) {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    inputsRef.current[activeIndex]?.focus()
  }, [activeIndex])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value
    if (!val.match(/^[0-9a-zA-Z]?$/)) {
      return
    }
    const newValue = value.split("")
    newValue[index] = val
    onChange(newValue.join(""))
    if (val && index < length - 1) {
      setActiveIndex(index + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const newValue = value.split("")
        newValue[index] = ""
        onChange(newValue.join(""))
      } else if (index > 0) {
        setActiveIndex(index - 1)
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1)
    } else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveIndex(index + 1)
    }
  }

  return (
    <div className={cn("flex gap-2", containerClassName)}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => { inputsRef.current[i] = el }}
          className={cn(
            "w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
            className
          )}
          {...props}
        />
      ))}
    </div>
  )
}
