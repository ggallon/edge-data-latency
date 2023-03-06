export function Code({ className = "", children }) {
  return (
    <code className={`rounded bg-gray-200 p-1 text-sm ${className}`}>
      {children}
    </code>
  )
}
