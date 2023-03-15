import { GitHubLogo } from "@/components/icons/github"

export function Footer() {
  return (
    <footer className="w-full bg-[#f5f5f7]">
      <div className="px-safe-area mx-auto w-full max-w-5xl py-4 px-6 md:flex md:items-center md:justify-between md:py-6 lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            key="GitHub"
            href="#"
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">GitHub</span>
            <GitHubLogo className="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-4 sm:mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            Copyright © 2023 Proactice. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
