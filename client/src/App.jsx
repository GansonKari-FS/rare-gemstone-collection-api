import { useEffect, useState } from "react";
import {
  getGemstones,
  createGemstone,
  deleteGemstone,
} from "./api/gemstoneApi";
import "./App.css";

function App() {
  const [gemstones, setGemstones] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    carat: "",
    origin: "",
    rarity: "",
    inStock: true,
  });

  // 🔹 Load gemstones from backend
  const loadGemstones = async () => {
    const data = await getGemstones();
    setGemstones(data);
  };

  useEffect(() => {
    loadGemstones();
  }, []);

  // 🔹 Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Submit new gemstone
  const handleSubmit = async (e) => {
    e.preventDefault();

    await createGemstone({
      ...formData,
      carat: Number(formData.carat),
    });

    // Reset form
    setFormData({
      name: "",
      color: "",
      carat: "",
      origin: "",
      rarity: "",
      inStock: true,
    });

    loadGemstones();
  };

  // 🔹 Delete gemstone
  const handleDelete = async (id) => {
    await deleteGemstone(id);
    loadGemstones();
  };

  return (
    <main className="app">
      <section className="hero">
        <h1>Rare Gemstone Collection</h1>
        <p>
          This React client connects to my Node.js, Express, MongoDB, and
          Mongoose API.
        </p>
      </section>

      {/* FORM */}
      <section className="card">
        <h2>Add a Gemstone</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            name="name"
            placeholder="Gemstone name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="color"
            placeholder="Color"
            value={formData.color}
            onChange={handleChange}
            required
          />

          <input
            name="carat"
            type="number"
            step="0.1"
            placeholder="Carat"
            value={formData.carat}
            onChange={handleChange}
            required
          />

          <input
            name="origin"
            placeholder="Origin"
            value={formData.origin}
            onChange={handleChange}
            required
          />

          <input
            name="rarity"
            placeholder="Rarity"
            value={formData.rarity}
            onChange={handleChange}
            required
          />

          <label className="checkbox">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            In stock
          </label>

          <button type="submit">Add Gemstone</button>
        </form>
      </section>

      {/* LIST */}
      <section className="grid">
        {gemstones.map((gem) => (
          <article key={gem._id} className="gem-card">
            <h3>{gem.name}</h3>
            <p>
              <strong>Color:</strong> {gem.color}
            </p>
            <p>
              <strong>Carat:</strong> {gem.carat}
            </p>
            <p>
              <strong>Origin:</strong> {gem.origin}
            </p>
            <p>
              <strong>Rarity:</strong> {gem.rarity}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {gem.inStock ? "In Stock" : "Out of Stock"}
            </p>

            <button className="delete" onClick={() => handleDelete(gem._id)}>
              Delete
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
