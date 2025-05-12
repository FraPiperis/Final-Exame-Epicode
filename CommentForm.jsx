import { useState } from "react";

function CommentForm({ postId, onNewComment }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/blogPosts/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content })
    });

    const data = await res.json();
    const newComment = data[data.length - 1]; // prendi l'ultimo commento aggiunto
    onNewComment(newComment);

    setAuthor("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Il tuo nome o email"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        placeholder="Scrivi un commento..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Invia</button>
    </form>
  );
}

export default CommentForm;
