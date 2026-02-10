import { jsx as _jsx } from "react/jsx-runtime";
function MyTextInput({ ...props }) {
    return (_jsx("input", { className: "border-2 rounded-lg p-2", type: "text", ...props }));
}
export default MyTextInput;
