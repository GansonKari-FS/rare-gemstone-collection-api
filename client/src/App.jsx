import { useEffect, useState } from "react";
import {
  getGemstones,
  createGemstone,
  deleteGemstone,
} from "./api/gemstoneApi";

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
    try {
      const data = await getGemstones();
      setGemstones(data);
    } catch (err) {
      console.error(err);
    }
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
    console.log("SUBMIT WORKS");

    try {
      await createGemstone(formData);
      loadGemstones();

      setFormData({
        name: "",
        color: "",
        carat: "",
        origin: "",
        rarity: "",
        inStock: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGemstone(id);
      loadGemstones();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Gemstone App</h1>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Add</button>
      </form>

      <ul>
        {gemstones.map((gem) => (
          <li key={gem._id}>
            {gem.name} - {gem.color}
            <button onClick={() => handleDelete(gem._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
