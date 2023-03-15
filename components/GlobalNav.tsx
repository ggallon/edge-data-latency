import { ProacticeLogo } from "@/components/icons/proactice"
import { siteConfig } from "@/config/site"

export function GlobalNav() {
  return (
    <nav className="globalnav-color backdrop-blur-xl backdrop-saturate-150">
      <div className="px-safe-area mx-auto w-full max-w-5xl px-4">
        <div className="flex items-center">
          <div className="flex-1 pr-6">
            <ul className="flex h-12 items-center sm:h-11">
              <li className="flex items-center">
                <a href="#" className="flex items-center">
                  <ProacticeLogo
                    className="h-5 w-5"
                    aria-label={siteConfig.name}
                  />
                  <span className="ml-2">{siteConfig.name}</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-end">
            <div>
              <span className="items-center rounded-full bg-[color:var(--light-color)] px-3 py-0.5 text-sm font-medium text-[color:var(--bg-gray-color)]">
                BETA
              </span>
            </div>
            <div className="mx-2 hidden items-center">
              <a href="#" className="px-2 text-sm">
                Changelog
              </a>
              <a href="#" className="px-2 text-sm">
                Docs
              </a>
            </div>
            <button className="hidden">Feedback</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
