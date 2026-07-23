import React, { useState } from 'react';
import { MessageSquare, Check } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/contact/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 4000);
      } else {
        alert('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden bg-white/70 dark:bg-[#0c101d]/70 shadow-2xl p-8">
        
        {/* Decorative Top Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 to-indigo-600" />

        <div className="text-center mb-8">
          <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 inline-flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Get in Touch
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit bugs, request a new client-side tool, or request enterprise API keys.
          </p>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2.5 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>Thank you! Your message was submitted successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Name"
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Inquiry / Message"
            multiline
            rows={5}
            placeholder="Describe your request or bug in detail..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <Button type="submit" className="w-full text-xs font-bold py-3 mt-4" isLoading={isSubmitting}>
            Send Message
          </Button>
        </form>

      </Card>
    </div>
  );
};
export default Contact;
