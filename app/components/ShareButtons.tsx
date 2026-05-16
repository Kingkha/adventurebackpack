"use client"

import { Facebook, Linkedin, Twitter, Link as LinkIcon, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ShareButtonsProps {
    url: string
    title: string
    className?: string
}

export default function ShareButtons({ url, title, className }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy url: ", err)
        }
    }

    const shareLinks = [
        {
            name: "Twitter",
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            icon: Twitter,
            color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10",
        },
        {
            name: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            icon: Facebook,
            color: "hover:text-[#4267B2] hover:bg-[#4267B2]/10",
        },
        {
            name: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            icon: Linkedin,
            color: "hover:text-[#0077b5] hover:bg-[#0077b5]/10",
        },
    ]

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className="text-sm font-semibold text-gray-900 mr-2">Share this article:</span>

            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "p-2 rounded-full text-gray-500 transition-all duration-200",
                        link.color
                    )}
                    aria-label={`Share on ${link.name}`}
                >
                    <link.icon className="w-5 h-5" />
                </a>
            ))}

            <button
                onClick={handleCopy}
                className={cn(
                    "p-2 rounded-full text-gray-500 transition-all duration-200 hover:text-gray-900 hover:bg-gray-100",
                    copied && "text-green-600 hover:text-green-700 bg-green-50"
                )}
                aria-label="Copy link"
            >
                {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
            </button>
        </div>
    )
}
