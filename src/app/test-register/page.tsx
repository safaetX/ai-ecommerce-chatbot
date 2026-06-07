"use client";

export default function TestRegisterPage() {
  const registerUser = async () => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Safaet",
        email: "safaet@example.com",
        password: "password123",
      }),
    });

    const data = await response.json();

    console.log(data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="p-10">
      <button
        onClick={registerUser}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Register Test User
      </button>
    </div>
  );
}