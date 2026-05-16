"use client"

import { useEffect, useState } from "react"

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const update = () => {
            const doc = document.documentElement
            const max = doc.scrollHeight - window.innerHeight
            if (max <= 0) return setProgress(0)
            setProgress(Math.min(100, Math.max(0, (window.scrollY / max) * 100)))
        }

        update()
        window.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update)
        return () => {
            window.removeEventListener("scroll", update)
            window.removeEventListener("resize", update)
        }
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-[1000] h-2 bg-black/15 pointer-events-none">
            <div className="h-full bg-green-600" style={{ width: `${progress}%` }} />
        </div>
    )
}
