import { Globe } from "@/components/globe"

export default function GlobePage() {
  return (
    <div className="mx-auto h-screen max-w-7xl sm:px-6 lg:px-8">
      <div className="flex h-full items-center justify-center">
        <div className="mb-12 h-64 w-64">
          <Globe />
        </div>
      </div>
    </div>
  )
}
