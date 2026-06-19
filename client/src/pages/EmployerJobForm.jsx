import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Building,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  Save,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
} from "lucide-react";

export default function EmployerJobForm() {
  const { token, user } = useAuth();
  const [step, setStep] = useState(1);

  // Form Fields State
  const [formData, setFormData] = useState({
    organization: user?.organization || "",
    contact_name: user?.name || "",
    contact_email: user?.email || "",
    contact_phone: "",
    title: "",
    discipline: "Physiotherapy",
    city: "",
    province: "Ontario",
    compensation: "Paid",
    start_date: "",
    majors_eligible: "Kinesiology - All Majors",
    description: "",
    apply_method: "link",
    apply_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem("employer_job_draft");
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch (e) {
        console.error("Error reading draft:", e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

  const handleSaveDraft = () => {
    localStorage.setItem("employer_job_draft", JSON.stringify(formData));
    alert("Draft saved successfully to local storage!");
  };

  const handleNext = () => {
    setError("");
    // Basic step validation
    if (step === 1) {
      if (!formData.contact_name || !formData.contact_email || !formData.contact_phone) {
        setError("Please complete all contact details before proceeding.");
        return;
      }
    } else if (step === 2) {
      if (
        !formData.title ||
        !formData.city ||
        !formData.start_date ||
        !formData.description ||
        !formData.apply_url
      ) {
        setError("Please complete all job details before proceeding.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        localStorage.removeItem("employer_job_draft"); // Clear draft on successful submit
        setStep(4); // Move to Submitted screen
      }
    } catch (err) {
      console.error("Job submit error:", err);
      setError(
        err.response?.data?.message || "Failed to submit job listing. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const disciplines = [
    "Physiotherapy",
    "Chiropractic",
    "Teaching",
    "General Kinesiology",
    "Other",
  ];

  const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Northwest Territories",
    "Nunavut",
    "Yukon",
  ];

  return (
    <div className="max-w-3xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Submit an Internship Position
        </h1>
        <p className="text-slate-500 mt-1">
          Post an internship position for students at the Centre for Human Performance and Health
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          {[
            { num: 1, label: "Account" },
            { num: 2, label: "Job Details" },
            { num: 3, label: "Review" },
            { num: 4, label: "Submitted" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2 flex-1 justify-center last:flex-none">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= s.num
                    ? "bg-[#1a3a5c] text-white shadow-sm"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > s.num && s.num < 4 ? "✓" : s.num}
              </div>
              <span
                className={`text-xs font-bold transition-colors hidden sm:inline ${
                  step >= s.num ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
              {s.num < 4 && (
                <div
                  className={`h-0.5 flex-1 mx-2 rounded hidden sm:block ${
                    step > s.num ? "bg-[#1a3a5c]" : "bg-slate-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Wizard Forms Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1a3a5c]" />

        {/* STEP 1: Contact Details */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <User className="text-[#1a3a5c]" />
              Step 1: Contact & Organization Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Organization / Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Building size={16} />
                  </div>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Windsor Physiotherapy Clinic"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Contact Person Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Contact Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="519-555-0199"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-50">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
              >
                <Save size={16} />
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-[#1a3a5c] hover:bg-[#152e4a] font-bold text-sm transition-all shadow-md"
              >
                Next Step
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Job Details Form */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <FileText className="text-[#1a3a5c]" />
              Step 2: Internship Position details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Position Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Clinical Kinesiology Intern"
                  required
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Discipline Category
                </label>
                <select
                  name="discipline"
                  value={formData.discipline}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all font-medium"
                >
                  {disciplines.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Eligible Kinesiology Majors
                </label>
                <input
                  type="text"
                  name="majors_eligible"
                  value={formData.majors_eligible}
                  onChange={handleChange}
                  placeholder="Kinesiology - Movement Science"
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={16} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Windsor"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Province
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all font-medium"
                >
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Compensation
                </label>
                <select
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all font-medium"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Application Method
                </label>
                <select
                  name="apply_method"
                  value={formData.apply_method}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all font-medium"
                >
                  <option value="link">Direct Website link</option>
                  <option value="email">Email Professor / Coordinator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {formData.apply_method === "link"
                    ? "Application URL"
                    : "Contact Email for Applications"}
                </label>
                <input
                  type={formData.apply_method === "link" ? "url" : "email"}
                  name="apply_url"
                  value={formData.apply_url}
                  onChange={handleChange}
                  placeholder={
                    formData.apply_method === "link"
                      ? "https://company.com/careers"
                      : "coordinator@uwindsor.ca"
                  }
                  required
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Position Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Explain duties, responsibilities, skills required, learning outcomes..."
                  required
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/25 focus:border-[#1a3a5c] focus:bg-white text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-50">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
                >
                  <Save size={16} />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-[#1a3a5c] hover:bg-[#152e4a] font-bold text-sm transition-all shadow-md"
                >
                  Review Details
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Review Details */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <FileText className="text-[#1a3a5c]" />
              Step 3: Review & Submit Position
            </h2>

            <div className="space-y-5 text-sm">
              {/* Org Details block */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                <h3 className="font-extrabold text-slate-800">Organization & Contact Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Company</span>
                    <span className="font-semibold text-slate-700">{formData.organization}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Contact Name</span>
                    <span className="font-semibold text-slate-700">{formData.contact_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Contact Email</span>
                    <span className="font-semibold text-slate-700">{formData.contact_email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Contact Phone</span>
                    <span className="font-semibold text-slate-700">{formData.contact_phone}</span>
                  </div>
                </div>
              </div>

              {/* Job Details block */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                <h3 className="font-extrabold text-slate-800">Position Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Job Title</span>
                    <span className="font-semibold text-slate-700">{formData.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Discipline</span>
                    <span className="font-semibold text-slate-700">{formData.discipline}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Location</span>
                    <span className="font-semibold text-slate-700">{formData.city}, {formData.province}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Compensation</span>
                    <span className="font-semibold text-slate-700">{formData.compensation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Start Date</span>
                    <span className="font-semibold text-slate-700">{formData.start_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold uppercase">Eligible Majors</span>
                    <span className="font-semibold text-slate-700">{formData.majors_eligible}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-xs block font-bold uppercase">
                      {formData.apply_method === "link" ? "Application URL" : "Professor Email"}
                    </span>
                    <span className="font-semibold text-[#1a3a5c] break-all">{formData.apply_url}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-xs block font-bold uppercase">Description</span>
                    <p className="font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {formData.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-50">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-[#1a3a5c] hover:bg-[#152e4a] font-extrabold text-sm transition-all shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Submit Position"
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success / Submitted State */}
        {step === 4 && (
          <div className="py-8 text-center space-y-6 animate-scale">
            <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Job Submitted Successfully!
              </h2>
              <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                Thank you! Your internship listing has been submitted and is currently pending review by the Centre for Human Performance and Health (CHPH) supervisor.
              </p>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    organization: user?.organization || "",
                    contact_name: user?.name || "",
                    contact_email: user?.email || "",
                    contact_phone: "",
                    title: "",
                    discipline: "Physiotherapy",
                    city: "",
                    province: "Ontario",
                    compensation: "Paid",
                    start_date: "",
                    majors_eligible: "Kinesiology - All Majors",
                    description: "",
                    apply_method: "link",
                    apply_url: "",
                  });
                  setStep(1);
                }}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-[#1a3a5c] hover:bg-[#1a3a5c]/5 font-bold text-sm transition-all"
              >
                Submit Another Position
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
