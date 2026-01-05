import type { InputHTMLAttributes } from "react";
function MyTextInput({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="border-2 rounded-lg p-2"
      type="text"
      {...props}
    />
  );
}
export default MyTextInput;