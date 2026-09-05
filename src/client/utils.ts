// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/client/utils.ts — THE ONE UTILITY YOU'LL USE EVERY DAY
// ═══════════════════════════════════════════════════════════════════════════
// `cn(...)` = "class names". It takes any number of class strings (or
// conditionals) and produces ONE clean string. Used across the whole
// template for styled components.
//
//   cn("a b", condition && "c")   → "a b"          (condition false)
//   cn("a b", condition && "c")   → "a b c"        (condition true)
//
// Internally:
//   clsx       → joins classes & handles conditionals
//   twMerge    → smart dedupe: later classes override conflicting earlier
//                ones (so "px-2 px-4" collapses to just "px-4")
//
// Memorize: className={cn("base", { "extra": isActive })} is the standard
// pattern for conditional styling all over this codebase.
// ═══════════════════════════════════════════════════════════════════════════
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}