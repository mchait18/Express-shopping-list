process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");


let candy = { name: "Candy Canes", price: 1.25 };

beforeEach(function () {
    items.push(candy);
});

afterEach(function () {
    // make sure this *mutates*, not redefines, `cats`
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ items: [candy] })
    })
})

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${candy.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ name: candy.name, price: candy.price })
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/icecube`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Creating an item", async () => {
        const res = await request(app).post("/items").send({ name: "Chocolate", price: 2.75 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: "Chocolate", price: 2.75 } });
    })
    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    })
})

describe("/PATCH /items/:name", () => {
    test("Updating an item's name", async () => {
        const res = await request(app).patch(`/items/${candy.name}`).send({ name: "Monster", price: 2.20 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "Monster", price: 2.20 } });
    })
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).patch(`/items/Cand`).send({ name: "Monster", price: 2.20 });
        expect(res.statusCode).toBe(404);
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${candy.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/bonkers`);
        expect(res.statusCode).toBe(404);
    })
})

