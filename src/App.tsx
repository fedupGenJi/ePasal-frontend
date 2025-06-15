import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.json())
      .then((data) => {
        console.log("📨 Response from Rust backend:", data.message);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch from backend:", err);
      });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-900">Hello from React frontend!</h1>
    </div>
  );
}
