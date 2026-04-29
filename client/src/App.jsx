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

  useEffect(() => {
    loadGemstones();
  }, []);

  const loadGemstones = async () => {
    const data = await getGemstones();
    setGemstones(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  await createGemstone({
    ...formData,
    carat: Number(formData.carat),
  });

  // 🔥 FORCE reload AFTER POST completes
  const updated = await getGemstones();
  setGemstones(updated);

  setFormData({
    name: "",
    color: "",
    carat: "",
    origin: "",
    rarity: "",
    inStock: true,
  });
};
  const handleDelete = async (id) => {
    await deleteGemstone(id);
    loadGemstones();
  };

  return (
    <div className="app">
      <h1 className="title">💎 Rare Gemstone Collection 💎</h1>

      <form className="gem-form" onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Color"
        />
        <input
          name="carat"
          value={formData.carat}
          onChange={handleChange}
          placeholder="Carat"
        />
        <input
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          placeholder="Origin"
        />
        <input
          name="rarity"
          value={formData.rarity}
          onChange={handleChange}
          placeholder="Rarity"
        />

        <label>
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          In Stock
        </label>

        <button type="submit">Add Gemstone</button>
      </form>

      <div className="gem-list">
        {gemstones.map((gem) => (
          <div className="gem-card" key={gem._id}>
            <h3>{gem.name}</h3>
            <p>Color: {gem.color}</p>
            <p>Carat: {gem.carat}</p>
            <p>Origin: {gem.origin}</p>
            <p>Rarity: {gem.rarity}</p>
            <p>{gem.inStock ? "In Stock" : "Out of Stock"}</p>

            <button onClick={() => handleDelete(gem._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
