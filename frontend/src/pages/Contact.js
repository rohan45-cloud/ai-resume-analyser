import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all required fields');
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1200);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="section-title">Get in Touch</h1>
          <p className="section-subtitle">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="card flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <FiMail className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Email Us</h3>
                <p className="text-sm text-gray-500 mt-1">support@resumeai.com</p>
              </div>
            </div>
            <div className="card flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <FiPhone className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Call Us</h3>
                <p className="text-sm text-gray-500 mt-1">+91 98765 43210</p>
              </div>
            </div>
            <div className="card flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <FiMapPin className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Visit Us</h3>
                <p className="text-sm text-gray-500 mt-1">Greater Noida, Uttar Pradesh, India</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-field" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={6} className="input-field resize-none" placeholder="Tell us more..." required />
                </div>
                <button type="submit" disabled={sending} className="btn-primary inline-flex items-center gap-2">
                  {sending ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><FiSend /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
