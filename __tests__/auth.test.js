const request = require('supertest')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const { server, app } = require("../app");

const User = require("../models/user");


describe("POST /api/v1/login/:device", () => {

    it("should return an access token and user data with a status code 200", async () => {

        const response = await request(app).post("/api/v1/login/web")
            .send({ email: "ahmedmohsen@yahoo.com", password: "mentafi" })
            .set('Accept', 'application/json');

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body).toHaveProperty("accessToken")
        expect(response.body).toHaveProperty("userData")

    })

    afterAll(() => {
        server.close()
    })
})

describe("POST /api/v1/signup", () => {
    it("should return a Registered Successfully message with a status code 201", async () => {

        const response = await request(app).post("/api/v1/signup")
            .set('Accept', 'application/json')
            .send({
                userName: "Mohamed",
                phoneNumber: "0122435235445",
                email: "test@test.com",
                password: "mentafi"
            })

        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("Registered Successfully")
    })

    afterAll(async () => {
        await User.destroy({
            where: {
                userName: "Mohamed"
            }
        })
        server.close()
    })
})

describe("GET /api/v1/newToken", () => {
    it("should send an access token to the client", async () => {

        sinon.stub(jwt, 'verify')
        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).get("/api/v1/newToken")
            .set('Cookie', 'refreshToken=sadwdawsdwdwdwdwdw; Path=/api/v1/newToken; HttpOnly; SameSite=Strict')
            .send()

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.accessToken).toBeTruthy()
    })
    afterAll(() => {
        server.close()
    })
})

describe("POST /api/v1/logout", () => {
    it("should the delete the cookie and returns a message that refresh token is deleted ", async () => {

        const response = await request(app).post('/api/v1/logout')
            .set('Cookie', 'refreshToken=sadwdawsdwdwdwdwdw; Path=/api/v1/newToken; HttpOnly; SameSite=Strict')
            .send()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.headers['set-cookie']).toBeTruthy()
        expect(response.body.message).toBe("Refresh Token Deleted Successfully")
    })
    afterAll(() => {
        server.close()
    })
})