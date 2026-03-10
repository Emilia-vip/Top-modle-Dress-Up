import type { InputHTMLAttributes } from "react";
function MyTextInput({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="border-2 border-gray-400 rounded-lg p-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
      type="text"
      {...props}
    />
  );
}
export default MyTextInput;