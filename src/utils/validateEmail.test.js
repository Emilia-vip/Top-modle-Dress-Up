import validateEmail from "./validateEmail";
describe("validateEmail", () => {
    it("returns true for valid emails", () => {
        expect(validateEmail("ahmad@test.com")).toBe(true);
        expect(validateEmail("ahmad.test@test.com")).toBe(true);
        expect(validateEmail("ahmad_123@test.com")).toBe(true);
        expect(validateEmail("ahmad@te.com")).toBe(true);
        expect(validateEmail("ahmad@test-blabla.com")).toBe(true);
    });
    it("returns false for invalid emails", () => {
        expect(validateEmail("hejhej")).toBe(false);
        expect(validateEmail("ahmad@")).toBe(false);
        expect(validateEmail("ahmad@hotmail")).toBe(false);
        expect(validateEmail("ahmad@hotmail.")).toBe(false);
        expect(validateEmail("ahmad@test_blabla.com")).toBe(false);
    });
    it("returns false for empty strings", () => {
        expect(validateEmail("")).toBe(false);
    });
});
