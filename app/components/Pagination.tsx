"use client"

import React from "react"
import Link from "next/link"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath?: string
}

export default function Pagination({ currentPage, totalPages, basePath = "/blog/page" }: PaginationProps) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = []
    // Always include first page
    pages.push(1)
    
    // Calculate range around current page
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)
    
    // Add ellipsis indicator if needed before start
    if (start > 2) {
      pages.push('...')
    }
    
    // Add pages in range
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add ellipsis indicator if needed after end
    if (end < totalPages - 1) {
      pages.push('...')
    }
    
    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  if (totalPages <= 1) {
    return null
  }
  
  return (
    <nav className="flex justify-center mt-12">
      <ul className="flex space-x-2">
        {/* Previous button */}
        {currentPage > 1 && (
          <li>
            <Link 
              href={currentPage === 2 ? "/blog" : `${basePath}/${currentPage - 1}`} 
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Previous
            </Link>
          </li>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-2">...</span>
            ) : page === 1 ? (
              <Link 
                href="/blog" 
                className={`px-3 py-2 rounded ${
                  currentPage === 1 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 transition-colors'
                }`}
              >
                {page}
              </Link>
            ) : (
              <Link 
                href={`${basePath}/${page}`} 
                className={`px-3 py-2 rounded ${
                  currentPage === page 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 transition-colors'
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        
        {/* Next button */}
        {currentPage < totalPages && (
          <li>
            <Link 
              href={`${basePath}/${currentPage + 1}`} 
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Next
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

