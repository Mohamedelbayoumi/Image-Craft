const request = require("supertest")
const sinon = require("sinon")
const jwt = require("jsonwebtoken")

const { server, app } = require("../app")

describe(" POST /api/v1/images/like/:imageId", () => {
    it("should send a response message User liked The Image Successfully", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).post("/api/v1/images/like/1")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("User liked The Image Successfully")
    })

    afterAll(() => {
        server.close()
    })
})

describe(" POST /api/v1/images/unlike/:imageId", () => {
    it("should send a response message User Unliked The Image", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).post("/api/v1/images/unlike/1")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("User Unliked The Image")
    })

    afterAll(() => {
        server.close()
    })
})

describe(" GET /profile/liked-images", () => {
    it("should send an array of liked images ", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).get("/profile/liked-images")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.data).toBeInstanceOf(Array)
    })

    afterAll(() => {
        server.close()
    })
})

describe(" GET /profile/uploaded-images", () => {
    it("should send an array of uploaded images ", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).get("/profile/uploaded-images")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.data).toBeInstanceOf(Array)
    })

    afterAll(() => {
        server.close()
    })
})

describe(" GET /profile/ordered-images", () => {
    it("should send an array of ordered images ", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).get("/profile/ordered-images")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.data).toBeInstanceOf(Array)
    })

    afterAll(() => {
        server.close()
    })
})

describe(" PATCH /profile/image", () => {
    it("should send a message Image Changed Successfully ", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).patch("/profile/image")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")
            .attach("image", "C:/Users/WARE/Downloads/Thwaites-Glacier-scaled.jpg")


        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("Image Changed Successfully")
    })

    afterAll(() => {
        server.close()
    })
})

describe(" GET /profile", () => {
    it("should send the user information and the array of uploaded images ", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).get("/profile")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.userInfo).toBeInstanceOf(Object)
        expect(response.body.uploadedImages).toBeInstanceOf(Array)
    })

    afterAll(() => {
        server.close()
    })
})

describe(" DELETE /user", () => {
    it("should send a message User Deleted Successfully ", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).delete("/user")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("User Deleted Successfully")
    })

    afterAll(() => {
        server.close()
    })
})