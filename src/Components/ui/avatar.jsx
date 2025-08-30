
import * as React from "react";

export function Avatar({ className = "", children, ...props }) {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = "", className = "", ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-square h-full w-full ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({ children, className = "", ...props }) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
