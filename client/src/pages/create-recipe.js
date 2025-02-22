import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    cookingTime: "",
    userOwner: userID,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    setRecipe((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleAddIngredient = () => {
    setRecipe((prev) => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!recipe.name || !recipe.description || recipe.ingredients.some((ing) => !ing.trim()) || !recipe.instructions) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await axios.post(
        "https://mern-recipe-app1-server.onrender.com/recipes",
        recipe,
        {
          headers: { authorization: cookies.access_token },
        }
      );
      alert("Recipe Created Successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Failed to create recipe. Please try again.");
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={recipe.name} onChange={handleChange} required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={recipe.description} onChange={handleChange} required />

        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              value={ingredient}
              onChange={(event) => handleIngredientChange(event, index)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>

        <label htmlFor="instructions">Instructions</label>
        <textarea id="instructions" name="instructions" value={recipe.instructions} onChange={handleChange} required />

        <label htmlFor="imageUrl">Image URL</label>
        <input type="text" id="imageUrl" name="imageUrl" value={recipe.imageUrl} onChange={handleChange} />

        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input type="number" id="cookingTime" name="cookingTime" value={recipe.cookingTime} onChange={handleChange} required min="1" />

        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
};