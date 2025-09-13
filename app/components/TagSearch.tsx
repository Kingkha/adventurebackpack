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
        <Tag className="mr-2" />
        Filter by Top Tags
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagSelect(null)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedTag === null ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTag === tag ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tag} ({count})
          </button>
        ))}
      </div>
    </div>
  )
}

