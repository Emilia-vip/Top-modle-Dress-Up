import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function useLoadingSpinner() {
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-black/70", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 border-4 border-purple-300 border-t-purple-800 rounded-full animate-spin" }), _jsx("p", { className: "text-purple-200 text-sm tracking-widest", children: "Loading..." })] }) }));
}
