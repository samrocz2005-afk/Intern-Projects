describe("Book Tests", () => {

    const books = ["Java", "NodeJS", "React"];

    test("Book Exists", () => {

        expect(books).toContain("Java");

    });

    test("Total Books", () => {

        expect(books).toHaveLength(3);

    });

    test("First Book", () => {

        expect(books[0]).toBe("Java");

    });

    test("Book List", () => {

        expect(books).toEqual([
            "Java",
            "NodeJS",
            "React"
        ]);

    });

});