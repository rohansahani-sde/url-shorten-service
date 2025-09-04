import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col">
      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-extrabold mb-4">🔗 My URL Shortener</h1>
        <p className="text-lg max-w-2xl mb-6">
          Simplify your links and make them shareable.  
          A fast and secure URL shortener for everyone.
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-indigo-700 font-semibold rounded-xl shadow-lg hover:bg-indigo-800 transition"
          >
            Sign Up
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10">🚀 Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-gray-100 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-3">Fast</h3>
            <p>Shorten any link instantly with just one click.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-3">Secure</h3>
            <p>All URLs are encrypted and safe to share.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-3">Free</h3>
            <p>Use the service for free with no hidden costs.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm bg-indigo-700">
        © {new Date().getFullYear()} MyURLShortener. All rights reserved.
      </footer>
    </div>
  );
}
