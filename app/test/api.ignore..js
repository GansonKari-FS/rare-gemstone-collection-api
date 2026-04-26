require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const Gem = require("../models/Gem");
const CertifiedGemstone = require("../models/CertifiedGemstone");

jest.setTimeout(30000);

let ruby;
let emerald;
let sapphire;
let amethyst;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  await Gem.deleteMany({});
  await CertifiedGemstone.deleteMany({});

  ruby = await Gem.create({
    name: "Burmese Ruby",
    color: "Red",
    carat: 3.2,
    origin: "Myanmar",
    rarity: "Rare",
    inStock: true,
  });

  emerald = await Gem.create({
    name: "Zambian Emerald",
    color: "Green",
    carat: 4.8,
    origin: "Zambia",
    rarity: "Very Rare",
    inStock: true,
  });

  sapphire = await Gem.create({
    name: "Ceylon Sapphire",
    color: "Blue",
    carat: 2.4,
    origin: "Sri Lanka",
    rarity: "Rare",
    inStock: true,
  });

  amethyst = await Gem.create({
    name: "Brazilian Amethyst",
    color: "Purple",
    carat: 6.1,
    origin: "Brazil",
    rarity: "Common",
    inStock: false,
  });

  await CertifiedGemstone.create([
    {
      certificationLab: "IGL",
      certificateNumber: "IGL-RUBY-320",
      appraisalValue: 4200,
      isLabCreated: false,
      gemstone: ruby._id,
    },
    {
      certificationLab: "IGL",
      certificateNumber: "IGL-EMERALD-480",
      appraisalValue: 7500,
      isLabCreated: false,
      gemstone: emerald._id,
    },
    {
      certificationLab: "GIA",
      certificateNumber: "GIA-SAPPHIRE-240",
      appraisalValue: 3600,
      isLabCreated: false,
      gemstone: sapphire._id,
    },
    {
      certificationLab: "AGS",
      certificateNumber: "AGS-AMETHYST-610",
      appraisalValue: 850,
      isLabCreated: false,
      gemstone: amethyst._id,
    },
  ]);
});

afterAll(async () => {
  await Gem.deleteMany({});
  await CertifiedGemstone.deleteMany({});
  await mongoose.connection.close();
});

describe("Gemstone API query tests", () => {
  test("should filter gemstones using greater than and less than operators", async () => {
    const response = await request(app).get(
      "/api/gemstones?carat[gte]=2&carat[lte]=5",
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    response.body.data.forEach((gem) => {
      expect(gem.carat).toBeGreaterThanOrEqual(2);
      expect(gem.carat).toBeLessThanOrEqual(5);
    });
  });

  test("should use select to return only name and carat fields", async () => {
    const response = await request(app).get("/api/gemstones?select=name,carat");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const gem = response.body.data[0];

    expect(gem).toHaveProperty("name");
    expect(gem).toHaveProperty("carat");
    expect(gem).not.toHaveProperty("color");
    expect(gem).not.toHaveProperty("__v");
  });

  test("should sort gemstones by carat descending", async () => {
    const response = await request(app).get("/api/gemstones?sort=-carat");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const data = response.body.data;

    expect(data[0].carat).toBeGreaterThanOrEqual(data[1].carat);
  });

  test("should paginate gemstones", async () => {
    const response = await request(app).get("/api/gemstones?page=1&limit=2");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(2);
    expect(response.body.data.length).toBeLessThanOrEqual(2);
  });
});

describe("Certified Gemstone API query tests", () => {
  test("should filter certified gemstones by appraisal value range", async () => {
    const response = await request(app).get(
      "/api/certified-gemstones?appraisalValue[gte]=2000&appraisalValue[lte]=8000",
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    response.body.data.forEach((item) => {
      expect(item.appraisalValue).toBeGreaterThanOrEqual(2000);
      expect(item.appraisalValue).toBeLessThanOrEqual(8000);
    });
  });

  test("should use select on certified gemstones", async () => {
    const response = await request(app).get(
      "/api/certified-gemstones?select=certificationLab,appraisalValue",
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const item = response.body.data[0];

    expect(item).toHaveProperty("certificationLab");
    expect(item).toHaveProperty("appraisalValue");
    expect(item).not.toHaveProperty("certificateNumber");
    expect(item).not.toHaveProperty("__v");
  });

  test("should sort certified gemstones by appraisal value descending", async () => {
    const response = await request(app).get(
      "/api/certified-gemstones?sort=-appraisalValue",
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const data = response.body.data;

    expect(data[0].appraisalValue).toBeGreaterThanOrEqual(
      data[1].appraisalValue,
    );
  });

  test("should paginate certified gemstones", async () => {
    const response = await request(app).get(
      "/api/certified-gemstones?page=1&limit=2",
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(2);
    expect(response.body.data.length).toBeLessThanOrEqual(2);
  });
});
