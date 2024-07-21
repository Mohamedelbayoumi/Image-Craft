const request = require("supertest")
const sinon = require("sinon")
const jwt = require("jsonwebtoken")

const { server, app } = require("../app");


descibe("GET /api/v1/cart", () => {
    it("should return an array of images", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).get("/api/v1/cart")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        console.log(response);

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.data).toBeInstanceOf(Array)
    })

    afterAll(() => {
        server.close()
    })
})


descibe("POST /api/v1/cart", () => {
    it("should return an Image Added To Cart message", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).post("/api/v1/cart")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")
            .send({ imageId: 5, imagePrice: '' })

        console.log(response);

        jwt.verify.restore()

        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("Image Added To Cart")
    })

    afterAll(() => {
        server.close()
    })
})

descibe("PATCH /api/v1/cart/:imageId", () => {
    it("should return an Image Removed From Cart message", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).patch("/api/v1/cart/1")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")
            .send({ imagePrice: 1000 })

        console.log(response);

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("Image Removed From Cart")

    })

    afterAll(() => {
        server.close()
    })
})

descibe("DELETE /api/v1/cart", () => {
    it("should return a Cart Deleted Successfully message", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).delete("/api/v1/cart")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        console.log(response);

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("Cart Deleted Successfully")
    })

    afterAll(() => {
        server.close()
    })
})

