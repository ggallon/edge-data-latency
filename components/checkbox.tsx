import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import cn from "clsx"
import { motion } from "framer-motion"

export function Checkbox({
  name,
  description,
  label,
  disabled = false,
  isChecked,
  onChangeEvent,
}) {
  return (
    <div className="flex items-center">
      <div className="relative flex h-4 w-4 items-center justify-center">
        <motion.span
          className="absolute inline-flex h-full w-full rounded bg-indigo-500"
          variants={{
            unchecked: {
              opacity: 0,
              scale: 1,
            },
            checked: {
              opacity: [0.5, 0],
              scale: 1.4,
              transition: {
                type: "tween",
                ease: "easeOut",
                duration: 0.8,
              },
            },
          }}
          initial={isChecked ? "checked" : "unchecked"}
          animate={isChecked ? "checked" : "unchecked"}
        />
        <CheckboxPrimitive.Root
          id={name}
          checked={isChecked}
          disabled={disabled}
          name={name}
          onCheckedChange={(e) => onChangeEvent(e)}
          className={cn(
            "relative h-full w-full rounded border border-gray-300",
            "data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500",
            "transition-color duration-500 ease-out"
          )}
          aria-describedby={`${name}-description`}
        >
          <CheckIcon
            checked={isChecked}
            className="-ml-[1px] -mt-[1px] h-4 w-4 text-white"
          />
        </CheckboxPrimitive.Root>
      </div>
      <div className="ml-2 text-sm">
        <label htmlFor={name} className="font-medium text-gray-700">
          {label}
        </label>
        <span id="global-description" className="text-gray-500">
          <span className="sr-only">{label}</span> {description}
        </span>
      </div>
    </div>
  )
}

function CheckIcon({ checked, ...props }) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <motion.path
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          unchecked: {
            pathLength: 0,
            opacity: 0,
            transition: {
              duration: 0.5,
            },
          },
          checked: {
            pathLength: 1,
            opacity: 1,
            transition: {
              type: "tween",
              ease: "easeOut",
              delay: 0.2,
              duration: 0.3,
            },
          },
        }}
        initial={checked ? "checked" : "unchecked"}
        animate={checked ? "checked" : "unchecked"}
      />
    </svg>
  )
}
