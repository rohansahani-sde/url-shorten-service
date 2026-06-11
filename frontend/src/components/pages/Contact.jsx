import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { LuClock } from "react-icons/lu";
import { MdMessage, MdOutlineMailOutline } from "react-icons/md";

export default function Contact() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        "https://formspree.io/f/mnjypypz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Back Button */}
        <div className="pt-8 pb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" />
            Back to previous
          </button>
        </div>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 uppercase">
            Contact Us
          </span>

          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Get In{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>

          <p className="mt-6 text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Have questions, feedback, feature requests, or found a bug?
            We'd love to hear from you. Our engineering team is standing by.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Contact Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300 shadow-2xl shadow-indigo-500/[0.02]">
              <h2 className="text-xl font-bold text-white mb-8 tracking-tight">
                Contact Information
              </h2>

              <div className="space-y-8">
                {/* Email Item */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <MdOutlineMailOutline size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 text-sm sm:text-base">Email Support</h3>
                    <p className="text-slate-400 text-sm mt-0.5 hover:text-indigo-400 transition-colors cursor-pointer">
                      support@snaplink.com
                    </p>
                  </div>
                </div>

                {/* Clock Item */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                    <LuClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 text-sm sm:text-base">Response Time</h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Usually within 24 hours
                    </p>
                  </div>
                </div>

                {/* Scope Item */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                    <MdMessage size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 text-sm sm:text-base">We Can Help With</h3>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                      Feature requests, bug reports, general feedback, analytics issues, and account tier upgrades.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Card */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.05] via-purple-500/[0.05] to-transparent border border-white/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="font-bold text-slate-200 text-sm sm:text-base mb-1.5">
                SnapLink Support Hub
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Your direct inputs shape the future updates of SnapLink. We review every submission line-by-line.
              </p>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300 shadow-2xl shadow-purple-500/[0.02]">
            <h2 className="text-xl font-bold text-white mb-8 tracking-tight">
              Send a Message
            </h2>

            {submitted ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎉</span>
                  <h3 className="text-emerald-400 font-bold text-lg">
                    Message Sent Successfully
                  </h3>
                </div>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Thanks for getting in touch! Our priority support desk has received your ticket, and we'll reach out to your inbox as quickly as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Two-Column Grid for Inputs on Desktop */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.05] outline-none transition-all duration-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.05] outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Feature Request / API Issue"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.05] outline-none transition-all duration-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide details about your query here..."
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.05] outline-none resize-none transition-all duration-200 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none text-sm tracking-wide"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Dispatching Message...
                    </>
                  ) : (
                    "Send Secure Message"
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}