import { Globe } from "@/components/globe"

export default function GlobePage() {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 h-screen">
      <div className="flex items-center justify-center h-full">
        <div className="mb-12 h-64 w-64">
          <Globe />
        </div>
      </div>
    </div>
  )
}
