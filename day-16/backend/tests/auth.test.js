describe("Authentication Tests", () => {

    test("Login Success", () => {

        const isLoggedIn = true;

        expect(isLoggedIn).toBe(true);
        expect(isLoggedIn).toBeTruthy();

    });

    test("Login Failed", () => {

        const isLoggedIn = false;

        expect(isLoggedIn).toBe(false);
        expect(isLoggedIn).toBeFalsy();

    });

    test("User Details", () => {

        const user = {
            name: "Sam",
            role: "Admin"
        };

        expect(user).toEqual({
            name: "Sam",
            role: "Admin"
        });

    });

});