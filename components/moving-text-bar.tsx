"use client"

export default function MovingTextBar() {
  return (
    <div className="w-full overflow-hidden bg-slate-900 py-3">
      <div className="relative flex whitespace-nowrap">
        <div className="animate-ticker flex items-center">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="mx-12 text-sm font-medium text-white">
              #stopjewishhate
            </span>
          ))}
        </div>
        <div className="animate-ticker flex items-center" aria-hidden="true">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="mx-12 text-sm font-medium text-white">
              #stopjewishhate
            </span>
          ))}
        </div>
      </div>
    </div>
  )
} 