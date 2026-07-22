let user;

beforeEach(() => {
  console.log("Before Test");
  user = {
    name: "Sam",
    age: 22,
  };
});

afterEach(() => {
  console.log("After Test");
});

describe("User Tests", () => {
  test("User Name", () => {
    expect(user.name).toBe("Sam");
  });

  test("User Age", () => {
    expect(user.age).toBe(22);
  });

  test("User Address", () => {
    user.address = null;

    expect(user.address).toBeNull();
  });
});
