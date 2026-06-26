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
} from "lucide-react";

export default function EmployerJobForm() {
  const { token, user } = useAuth();
  const [step, setStep] = useState(1);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem("employer_job_draft", JSON.stringify(formData));
    alert("Draft saved successfully to local storage!");
  };

  const handleNext = () => {
    setError("");
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
        localStorage.removeItem("employer_job_draft");
        setStep(4);
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
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Submit Position
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Post an internship position for Kinesiology students
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          {[
            { num: 1, label: "Account" },
            { num: 2, label: "Details" },
            { num: 3, label: "Review" },
            { num: 4, label: "Done" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2 flex-1 justify-center last:flex-none">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  step >= s.num
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s.num && s.num < 4 ? "✓" : s.num}
              </div>
              <span
                className={`text-xs font-medium transition-colors hidden sm:inline ${
                  step >= s.num ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {s.num < 4 && (
                <div
                  className={`h-px flex-1 mx-2 hidden sm:block ${
                    step > s.num ? "bg-gray-900" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6 relative">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 uppercase tracking-wide flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Organization / Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building size={16} />
                  </div>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Windsor Physiotherapy"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="519-555-0199"
                    required
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                <Save size={14} className="text-gray-500" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-white bg-gray-900 hover:bg-gray-800 font-medium text-sm transition-colors"
              >
                Next Step
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 uppercase tracking-wide flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              Job Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Position Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Clinical Kinesiology Intern"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discipline Category
                </label>
                <select
                  name="discipline"
                  value={formData.discipline}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                >
                  {disciplines.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Eligible Majors
                </label>
                <input
                  type="text"
                  name="majors_eligible"
                  value={formData.majors_eligible}
                  onChange={handleChange}
                  placeholder="Kinesiology - All"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={16} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Windsor"
                    required
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Province
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                >
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Compensation
                </label>
                <select
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Apply Method
                </label>
                <select
                  name="apply_method"
                  value={formData.apply_method}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                >
                  <option value="link">Website Link</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {formData.apply_method === "link"
                    ? "Application URL"
                    : "Contact Email"}
                </label>
                <input
                  type={formData.apply_method === "link" ? "url" : "email"}
                  name="apply_url"
                  value={formData.apply_url}
                  onChange={handleChange}
                  placeholder={
                    formData.apply_method === "link"
                      ? "https://..."
                      : "email@company.com"
                  }
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Duties, requirements, skills..."
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors hidden sm:flex"
                >
                  <Save size={14} className="text-gray-500" />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md text-white bg-gray-900 hover:bg-gray-800 font-medium text-sm transition-colors"
                >
                  Review
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 uppercase tracking-wide flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              Review & Submit
            </h2>

            <div className="space-y-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Contact Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Company</span>
                    <span className="font-medium text-gray-900">{formData.organization}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Contact</span>
                    <span className="font-medium text-gray-900">{formData.contact_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Email</span>
                    <span className="font-medium text-gray-900">{formData.contact_email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Phone</span>
                    <span className="font-medium text-gray-900">{formData.contact_phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Position Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Job Title</span>
                    <span className="font-medium text-gray-900">{formData.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Discipline</span>
                    <span className="font-medium text-gray-900">{formData.discipline}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Location</span>
                    <span className="font-medium text-gray-900">{formData.city}, {formData.province}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Compensation</span>
                    <span className="font-medium text-gray-900">{formData.compensation}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Start Date</span>
                    <span className="font-medium text-gray-900">{formData.start_date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-0.5">Eligible Majors</span>
                    <span className="font-medium text-gray-900">{formData.majors_eligible}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 text-xs block mb-0.5">Apply At</span>
                    <span className="font-medium text-gray-900 break-all">{formData.apply_url}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 text-xs block mb-0.5">Description</span>
                    <p className="font-medium text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 rounded-md text-white bg-gray-900 hover:bg-gray-800 font-medium text-sm transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Position"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-12 text-center space-y-6">
            <div className="mx-auto h-12 w-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-gray-900" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">
                Position Submitted
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                Your internship listing has been submitted and is pending review by a CHPH supervisor.
              </p>
            </div>

            <div className="pt-4">
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
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-900 hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
