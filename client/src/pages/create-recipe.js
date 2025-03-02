import React, { useState, useRef } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const ingredientInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });

    if (name === "imageUrl") {
      setImagePreview(value);
    }
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = { id: ingredients[index].id, value };
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, { id: uuidv4(), value: "" }];
    setRecipe({ ...recipe, ingredients });

    setTimeout(() => {
      if (ingredientInputRef.current) {
        ingredientInputRef.current.focus();
      }
    }, 100);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!recipe.name || !recipe.ingredients.length || !recipe.instructions) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://mern-recipe-app1-server.onrender.com/recipes",
        { ...recipe },
        { headers: { authorization: cookies.access_token } }
      );

      alert("Recipe Created");
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          placeholder="Enter recipe name"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
          placeholder="Describe your recipe..."
          maxLength={200}
        ></textarea>
        <small>{recipe.description.length}/200 characters</small>

        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={ingredient.id}
            ref={index === recipe.ingredients.length - 1 ? ingredientInputRef : null}
            type="text"
            value={ingredient.value}
            onChange={(event) => handleIngredientChange(event, index)}
            placeholder="Enter ingredient"
          />
        ))}
        <button type="button" onClick={handleAddIngredient}>
          ➕ Add Ingredient
        </button>

        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          placeholder="Write step-by-step instructions..."
          required
          maxLength={500}
        ></textarea>
        <small>{recipe.instructions.length}/500 characters</small>

        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL"
        />
        
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Recipe Preview" />
          </div>
        )}

        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
          placeholder="Enter cooking time"
          min="1"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
};