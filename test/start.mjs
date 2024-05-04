const authMiddleware = require("../middleware/isAuth")
import { expect } from "chai"

it("should find the user", function () {
    const users = ["mohamed", "jo"]

    expect(users.includes("mohamed")).to.equal(false)
})

authMiddleware.bind()
