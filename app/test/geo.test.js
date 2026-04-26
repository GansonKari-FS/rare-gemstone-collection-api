require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const GeoData = require("../../models/GeoData");

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  await GeoData.deleteMany({});

  await GeoData.create([
    {
      latitude: 30.6954,
      longitude: -91.744,
      displayName: "Melville",
      city: "Melville",
      state: "Louisiana",
      country: "United States",
    },
    {
      latitude: 30.4515,
      longitude: -91.1871,
      displayName: "Baton Rouge",
      city: "Baton Rouge",
      state: "Louisiana",
      country: "United States",
    },
    {
      latitude: 29.9511,
      longitude: -90.0715,
      displayName: "New Orleans",
      city: "New Orleans",
      state: "Louisiana",
      country: "United States",
    },
  ]);
});

afterAll(async () => {
  await GeoData.deleteMany({});
  await mongoose.connection.close();
});

describe("GeoData API Tests", () => {
  it("should return only selected fields", async () => {
    const res = await request(app)
      .get("/api/geo-data/all?select=displayName,city")
      .expect(200);

    expect(res.body.success).toBe(true);

    const data = res.body.data[0];

    expect(data.displayName).toBeDefined();
    expect(data.city).toBeDefined();

    expect(data.latitude).toBeUndefined();
    expect(data.longitude).toBeUndefined();
  });

  it("should return paginated results", async () => {
    const res = await request(app)
      .get("/api/geo-data/all?page=1&limit=2")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(2);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  it("should return sorted data ascending", async () => {
    const res = await request(app)
      .get("/api/geo-data/all?sort=displayName")
      .expect(200);

    expect(res.body.success).toBe(true);

    const data = res.body.data;

    expect(data.length).toBeGreaterThan(1);

    for (let i = 0; i < data.length - 1; i++) {
      expect(data[i].displayName <= data[i + 1].displayName).toBe(true);
    }
  });

  it("should return sorted data descending", async () => {
    const res = await request(app)
      .get("/api/geo-data/all?sort=-displayName")
      .expect(200);

    expect(res.body.success).toBe(true);

    const data = res.body.data;

    expect(data.length).toBeGreaterThan(1);

    for (let i = 0; i < data.length - 1; i++) {
      expect(data[i].displayName >= data[i + 1].displayName).toBe(true);
    }
  });
});
