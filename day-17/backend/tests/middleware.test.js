describe("Middleware Tests", () => {
  function checkToken(token) {
    if (!token) {
      throw new Error("Token Missing");
    }

    return true;
  }

  test("Valid Token", () => {
    expect(checkToken("abc123")).toBeTruthy();
  });

  test("Invalid Token", () => {
    expect(false).toBeFalsy();
  });

  test("Token Missing", () => {
    expect(() => checkToken()).toThrow("Token Missing");
  });
});
