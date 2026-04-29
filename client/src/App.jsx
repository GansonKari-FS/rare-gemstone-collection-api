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

  const loadGemstones = async () => {
    const data = await getGemstones();
    setGemstones(data);
  };

  useEffect(() => {
    loadGemstones();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createGemstone(formData);

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

  const handleDelete = async (id) => {
    await deleteGemstone(id);
    loadGemstones();
  };

  return (
    <div className="app">
      <section className="hero">
        <div className="hero-gem hero-gem-left">💎</div>

        <div>
          <h1>Rare Gemstone Collection</h1>
          <p>
            This React client connects to my Node.js, Express, MongoDB, and
            Mongoose API.
          </p>
        </div>

        <div className="hero-gem hero-gem-right">💚</div>
      </section>

      <section className="form-section">
        <h2>✧ Add a Gemstone ✧</h2>

        <form className="gem-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="💎 Gemstone name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="color"
            placeholder="🎨 Color"
            value={formData.color}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="carat"
            placeholder="💠 Carat"
            value={formData.carat}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="origin"
            placeholder="🌎 Origin"
            value={formData.origin}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="rarity"
            placeholder="⭐ Rarity"
            value={formData.rarity}
            onChange={handleChange}
            required
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            In stock
          </label>

          <button type="submit">💎 Add Gemstone 💎</button>
        </form>
      </section>

      <section className="gem-list">
        {gemstones.map((gem) => (
          <div className="gem-card" key={gem._id}>
            <div className="gem-image">
              {gem.name.toLowerCase().includes("ruby")
                ? "💖"
                : gem.name.toLowerCase().includes("emerald")
                  ? "💚"
                  : "💎"}
            </div>

            <h3>{gem.name}</h3>

            <p>
              <span>🎨 Color:</span> {gem.color}
            </p>
            <p>
              <span>💠 Carat:</span> {gem.carat}
            </p>
            <p>
              <span>🌎 Origin:</span> {gem.origin}
            </p>
            <p>
              <span>⭐ Rarity:</span> {gem.rarity}
            </p>
            <p>
              <span>✅ Status:</span>{" "}
              {gem.inStock ? "In Stock" : "Out of Stock"}
            </p>

            <button
              className="delete-btn"
              onClick={() => handleDelete(gem._id)}
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </section>

      <div className="footer-text">✦ Collect. Admire. Appreciate. ✦</div>
    </div>
  );
}

export default App;
