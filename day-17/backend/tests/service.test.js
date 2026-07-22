describe("Service Tests", () => {
  test("Mock Function", () => {
    const saveBook = jest.fn();

    saveBook("Java");

    expect(saveBook).toHaveBeenCalled();
  });

  test("Called Times", () => {
    const saveBook = jest.fn();

    saveBook();
    saveBook();

    expect(saveBook).toHaveBeenCalledTimes(2);
  });

  test("Called With", () => {
    const saveBook = jest.fn();

    saveBook("React");

    expect(saveBook).toHaveBeenCalledWith("React");
  });
});
