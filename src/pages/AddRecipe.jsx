import RecipeForm from "../components/Recipe/RecipeForm";
export default function AddRecipe({ user, onDone }) {
  return <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}><RecipeForm user={user} onDone={onDone} /></div>;
}
