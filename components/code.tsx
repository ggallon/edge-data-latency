export function Code({ className = '', children }) {
  return (
    <code className={`bg-gray-200 text-sm p-1 rounded ${className}`}>
      {children}
    </code>
  );
}
