const request = require("supertest")
const sinon = require("sinon")
const jwt = require("jsonwebtoken")

const { server, app } = require("../app")

describe(" POST /api/v1/payment-intent", () => {
    it("should send a response message User liked The Image Successfully", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).post("/api/v1/payment-intent")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")
            .send({ totalPrice: 3000 })

        jwt.verify.restore()

        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.clientSecret).toBeInstanceOf(String)
    })

    afterAll(() => {
        server.close()
    })
})

describe("POST /api/v1/order", () => {
    it("should return a response message Order Created Successfully", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).post("/api/v1/order")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("Order Created Successfully")

    })

    afterAll(() => {
        server.close()
    })
})

