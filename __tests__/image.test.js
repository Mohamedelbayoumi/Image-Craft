const request = require("supertest")
const sinon = require("sinon")
const jwt = require("jsonwebtoken")

const { server, app } = require("../app")

describe("GET /api/v1/images", () => {
    it("should return an array of images", async () => {

        const response = await request(app).get("/api/v1/images")
            .set('Accept', 'application/json')

        console.log(response.body.data);

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.data).toBeInstanceOf(Array)
    })

    afterAll(() => {
        server.close()
    })
})

describe("POST /api/v1/images", () => {
    it("should return an Image Uploaded Successfully message", async () => {

        sinon.stub(jwt, 'verify')

        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).post("/api/v1/images")
            .set('Accept', 'application/json')
            .set("authorization", "bearer sdsadsafdsfasfsa")
            .field({
                caterogy: "glacier",
                imageName: "snow snow snow",
                price: 1223,
                description: "testing ....",
                location: "Egypt"
            })
            .attach("image", "C:/Users/WARE/Downloads/Thwaites-Glacier-scaled.jpg")

        jwt.verify.restore()

        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("Image Uploaded Successfully")
    }, 10000)

    afterAll(() => {
        server.close()
    })

})


describe("GET /api/v1/image", () => {
    it("should return image details, image data and user data", async () => {

        const response = await request(app).get("/api/v1/image")
            .set('Accept', 'application/json').query({ imageId: 5 })

        console.log(response.body);

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("imageDetails")
        expect(response.body).toHaveProperty("imageData")
        expect(response.body).toHaveProperty("userData")

    })

    afterAll(() => {
        server.close()
    })
})

describe("GET /api/v1/image-downloading/:imageId", () => {
    it("should download the ordered image on the client side", async () => {

        sinon.stub(jwt, 'verify')
        jwt.verify.returns({
            userId: 1
        })

        const response = await request(app).get('/api/v1/image-downloading/1')
            .set("authorization", "bearer sdsadsafdsfasfsa")

        jwt.verify.restore()

        expect(response.status).toBe(200)
        expect(response.headers['content-disposition']).toMatch(/attachment; filename=/)
        expect(response.headers['content-type']).toMatch(/image/)
    })

    afterAll(() => {
        server.close()
    })
})

