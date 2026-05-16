import React from "react"
import { Tag } from "lucide-react"

interface TagSearchProps {
  tags: { tag: string; count: number }[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
}

export default function TagSearch({ tags, selectedTag, onTagSelect }: TagSearchProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Tag className="mr-2" aria-hidden="true" />
        Filter by Top Tags
      </h2>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
        <button
          type="button"
          onClick={() => onTagSelect(null)}
          aria-pressed={selectedTag === null}
          className={`inline-flex items-center min-h-[36px] px-3 py-1.5 rounded-full text-sm touch-manipulation ${
            selectedTag === null ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagSelect(tag)}
            aria-pressed={selectedTag === tag}
            className={`inline-flex items-center min-h-[36px] px-3 py-1.5 rounded-full text-sm touch-manipulation ${
              selectedTag === tag ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tag} ({count})
          </button>
        ))}
      </div>
    </div>
  )
}

