import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name from the current module's URL
const __filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(__filename);

export function isValidMongoId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  return true;
}

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

export function formatReadableDate(date) {
  const options = {
    year: "numeric",
    month: "short", // "Jan", "Feb", etc.
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(date).toLocaleString("en-US", options);
}
