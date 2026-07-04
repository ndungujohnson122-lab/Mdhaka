import React, { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight,
  Send,
  Building,
  ShieldCheck,
  Compass,
  Hammer
} from "lucide-react";

export default function ContactSection() {
  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Residential Build",
    aesthetic: "Modernist",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please enter your name and email.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Title */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-8 mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
          Get in Touch with Our Builders
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-zinc-900 dark:text-white mt-2 tracking-tight">
          Consult Our Builders
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-light max-w-2xl">
          Contact us to talk about your custom home project, select building materials, or ask any questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Office Details & Brand Values (5 columns) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Headquarters Card */}
          <div className="bg-zinc-950 dark:bg-zinc-950/80 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-transparent dark:border-zinc-800 shadow-xl">
            <h3 className="font-display font-bold text-lg text-white tracking-tight flex items-center space-x-2">
              <Building className="w-5 h-5 text-zinc-400" />
              <span>Headquarters</span>
            </h3>

            <div className="space-y-4 text-xs font-light text-zinc-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  480 Solstice Point Freeway, Suite 12A<br />
                  Malibu, CA 90265
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>+1 (310) 555-0142</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>info@mdhakaholding.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Mon - Fri • 8:00 AM - 5:00 PM PST</span>
              </div>
            </div>
          </div>

          {/* Core Commitments List */}
          <div className="space-y-6 p-2">
            <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-widest font-mono text-[10px]">
              Our Building Commitments
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">1. Site Assessment</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light mt-0.5">
                    We check your soil quality, weather safety, and solar angles before we start planning your home.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">2. Custom Home Layouts</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light mt-0.5">
                    We design every room to have plenty of fresh air, sunlight, and a natural, open feel.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 mt-0.5">
                  <Hammer className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">3. Quality Materials Sourcing</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light mt-0.5">
                    We source high-quality eco-friendly wood, long-lasting concrete, and modern windows directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Form (7 columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-3xl p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Message Received</h3>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-xs mx-auto">
                Thank you for contacting us! Our building team will review your project details and get back to you within 1 business day.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", phone: "", projectType: "Residential Build", aesthetic: "Modernist", notes: "" });
                }}
                className="mt-6 text-xs font-mono uppercase tracking-widest font-semibold underline text-zinc-900 dark:text-white cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Send Another Form
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white mb-2 tracking-tight">
                Tell Us About Your Project
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                    Your Full Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Jane Henderson"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                    Email Address *
                  </label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., jane@example.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                    Phone Number
                  </label>
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                    Type of Project
                  </label>
                  <select 
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  >
                    <option value="Residential Build">Custom House Build</option>
                    <option value="Commercial Cantilever">Commercial / Business Building</option>
                    <option value="Sustainable Renovation">Eco-Friendly Renovation</option>
                    <option value="Structural Drafting">House Planning & Permits</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                  Preferred Style
                </label>
                <select 
                  value={formData.aesthetic}
                  onChange={(e) => setFormData({ ...formData, aesthetic: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                >
                  <option value="Modernist">Modern Style (Concrete & Glass)</option>
                  <option value="Scandinavian">Scandinavian Style (Warm Wood)</option>
                  <option value="Eco-Friendly">Eco-Friendly Style (Sunlight & Stone)</option>
                  <option value="Industrial">Industrial Style (Steel & Metals)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                  Tell us more details
                </label>
                <textarea 
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell us about your location, your budget, when you want it completed, or any other details you have in mind..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-xs tracking-wider uppercase py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
              >
                <span>Send Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
