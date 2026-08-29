"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";

export default function InquiryForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        if (!fullName || !email.trim() || !message.trim()) {
            setError("Please fill in your name, email, and message.");
            return;
        }

        setLoading(true);

        try {
            const formattedMessage = category ? `[Category: ${category}] ${message.trim()}` : message.trim();
            const res = await fetch("/api/inquiry/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName,
                    email: email.trim(),
                    message: formattedMessage,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to submit inquiry.");
            }

            setSuccess(true);
            setFirstName("");
            setLastName("");
            setEmail("");
            setCategory("");
            setMessage("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-background/50 transition-colors duration-500">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h2 className="text-5xl font-bold text-foreground tracking-tighter mb-6">
                            Start Your <span className="text-gradient">Evolution</span>
                        </h2>
                        <p className="text-xl text-muted-foreground font-medium">
                            Ready to discover your true potential? Send us a message and our experts will guide you through the next steps.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass p-8 md:p-16 rounded-[3rem] relative overflow-hidden"
                    >
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12 space-y-4"
                            >
                                <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">Inquiry Received!</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Thank you for reaching out. Our career advisory team will review your inquiry and get back to you shortly.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition"
                                >
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                {error && (
                                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label htmlFor="first-name" className="block text-sm font-bold text-foreground/70 tracking-wider ml-1">First name</label>
                                        <motion.input
                                            whileFocus={{ scale: 1.01 }}
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="last-name" className="block text-sm font-bold text-foreground/70 tracking-wider ml-1">Last name</label>
                                        <motion.input
                                            whileFocus={{ scale: 1.01 }}
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-bold text-foreground/70 tracking-wider ml-1">Email address</label>
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="inquiry-type" className="block text-sm font-bold text-foreground/70 tracking-wider ml-1">Inquiry Category</label>
                                    <select
                                        id="inquiry-type"
                                        name="inquiry-type"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground focus:border-primary focus:bg-card outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a category (optional)</option>
                                        <option value="coaching">Career Coaching</option>
                                        <option value="resume">Resume Review</option>
                                        <option value="interview">Interview Preparation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="block text-sm font-bold text-foreground/70 tracking-wider ml-1">Message</label>
                                    <motion.textarea
                                        whileFocus={{ scale: 1.01 }}
                                        id="message"
                                        name="message"
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="block w-full rounded-2xl border-2 border-border px-6 py-4 bg-card/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card outline-none transition-all resize-none"
                                        placeholder="Tell us how we can help you..."
                                    ></motion.textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center px-8 py-5 bg-primary text-primary-foreground text-lg font-bold rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all group disabled:opacity-50"
                                >
                                    {loading ? "Sending Inquiry..." : "Send Inquiry"}
                                    <Send className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                                </motion.button>
                            </form>
                        )}
                        
                        {/* Decorative background blob in form */}
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

