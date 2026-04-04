"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type AuthMode = "login" | "register";
type LoginMode = "password" | "otp";
type RegisterStep = 1 | 2 | 3;
type UserType = "student" | "working_professional";

const COUNTRY_CODES = [
    { code: "+1", label: "US/CA (+1)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+61", label: "Australia (+61)" },
    { code: "+65", label: "Singapore (+65)" },
    { code: "+91", label: "India (+91)" },
    { code: "+971", label: "UAE (+971)" },
];

const CITY_SUGGESTIONS = [
    "Bengaluru",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Pune",
    "Chennai",
    "Dubai",
    "London",
    "New York",
    "Singapore",
];

function isValidEmail(value: string) {
    return /^\S+@\S+\.\S+$/.test(value.trim());
}

function isValidName(value: string) {
    return /^[A-Za-z][A-Za-z .'-]{1,99}$/.test(value.trim());
}

function normalizeMobile(countryCode: string, mobile: string) {
    const c = countryCode.replace(/\D/g, "");
    const m = mobile.replace(/\D/g, "");
    return `+${c}${m}`;
}

function passwordRuleFlags(password: string) {
    return {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
}

function isStrongPassword(password: string) {
    const rules = passwordRuleFlags(password);
    return rules.length && rules.upper && rules.lower && rules.number && rules.special;
}

function maskOtpInput(value: string) {
    return value.replace(/\D/g, "").slice(0, 6);
}

async function parseResponse(response: Response) {
    try {
        return await response.json();
    } catch {
        return {} as Record<string, unknown>;
    }
}

function PasswordField({
    label,
    value,
    onChange,
    placeholder,
    visible,
    onToggle,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    visible: boolean;
    onToggle: () => void;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder={placeholder}
                    required
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center rounded-r-xl text-slate-500 transition-colors hover:text-sky-700"
                    aria-label={visible ? "Hide password" : "Show password"}
                    title={visible ? "Hide password" : "Show password"}
                >
                    <span className={`transition-transform duration-200 ${visible ? "scale-110 rotate-6 text-sky-700" : "scale-100 rotate-0"}`}>
                        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default function AuthPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const recoveryMode = searchParams.get("recovery") === "1";
    const recoveryError = searchParams.get("error");
    const resetSuccess = searchParams.get("reset") === "success";

    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [loginMode, setLoginMode] = useState<LoginMode>("password");
    const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotRequestSent, setForgotRequestSent] = useState(false);

    const [registerData, setRegisterData] = useState({
        fullName: "",
        email: "",
        countryCode: "+91",
        mobile: "",
        password: "",
        dateOfBirth: "",
        acceptedTerms: false,
        otp: "",
        userType: "student" as UserType,
        studyField: "",
        domain: "",
        companyRole: "",
        city: "",
    });

    const [loginPasswordData, setLoginPasswordData] = useState({
        email: "",
        password: "",
    });

    const [loginOtpData, setLoginOtpData] = useState({
        email: "",
        otp: "",
        otpRequested: false,
    });

    const [forgotEmail, setForgotEmail] = useState("");
    const [recoveryData, setRecoveryData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);
    const [showRecoveryConfirmPassword, setShowRecoveryConfirmPassword] = useState(false);

    useEffect(() => {
        if (otpCooldown <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [otpCooldown]);

    useEffect(() => {
        const supabase = createBrowserSupabaseClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
            if (event === "SIGNED_IN" && !recoveryMode) {
                // If we just signed in and there's a recovery fragment, switch to recovery view
                if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
                    router.replace("/auth?recovery=1");
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [recoveryMode, router]);

    useEffect(() => {
        if (recoveryMode && !resetSuccess && !recoveryError) {
            setError("");
            setMessage("Checking your recovery link...");
        }
    }, [recoveryMode, resetSuccess, recoveryError]);

    useEffect(() => {
        if (!recoveryMode || resetSuccess || recoveryError) {
            return;
        }
    
        let active = true;
        let retryCount = 0;
        const maxRetries = 10; // Increased retries

        const supabase = createBrowserSupabaseClient();

        // 1. Listen for the EXACT moment the session is established via hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
            if (active && (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") && session) {
                setMessage("Link verified! You can now set your new password.");
                setError("");
            }
        });

        // 2. Poll getSession as a backup (with manual hash fallback)
        const syncRecoverySession = async () => {
            try {
                const { data: { session: existingSession } } = await supabase.auth.getSession();
                
                // If it's still missing, try to manually set it from the hash
                if (!existingSession && typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
                    const hash = window.location.hash.substring(1);
                    const params = new URLSearchParams(hash);
                    const accessToken = params.get("access_token");
                    const refreshToken = params.get("refresh_token");

                    if (accessToken && refreshToken) {
                        const { data: { session: newSession }, error: setSessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });
                        
                        if (newSession && active) {
                            setError("");
                            setMessage("Link verified! (Manual) You can now set your new password.");
                            return;
                        }
                        if (setSessionError) {
                            console.error("Manual setSession failed:", setSessionError.message);
                        }
                    }
                }

                if (!existingSession && active) {
                    const hasAccess = typeof window !== "undefined" && (window.location.hash.includes("access_token=") || window.location.hash.includes("type=recovery"));
                    const hasCode = searchParams.get("code");

                    if (retryCount < maxRetries) {
                        retryCount++;
                        const delay = (hasAccess || hasCode) ? 1500 : 800;
                        setTimeout(syncRecoverySession, delay);
                        return;
                    }

                    // Only show formal error if we have waited long enough and no signs of login exist
                    if (!hasAccess && !hasCode) {
                        setError("Auth session missing! Please ensure you use the latest link from your email and cookies are enabled.");
                    }
                } else if (existingSession && active) {
                    setError((prev) => prev.includes("Auth session") ? "" : prev);
                    setMessage("Link verified! You can now set your new password.");
                }
            } catch (sessionError) {
                if (!active) return;
                setError(sessionError instanceof Error ? sessionError.message : "Unable to prepare password recovery.");
            }
        };
    
        syncRecoverySession();
        return () => { 
            active = false; 
            subscription.unsubscribe();
        };
    }, [recoveryMode, resetSuccess, recoveryError, searchParams]);

    useEffect(() => {
        if (recoveryError === "otp_only") {
            setError("Email sign-in links are disabled. Please use the 6-digit OTP from your email to continue.");
            setMessage("");
            return;
        }

        if (recoveryError === "invalid_or_expired_link") {
            const details = searchParams.get("details");
            const detailMsg = details ? ` (${details})` : "";
            setError(`This recovery link is invalid or expired. Please request a new password reset email.${detailMsg}`);
            setMessage("");
            return;
        }

        if (resetSuccess) {
            setMessage("Password reset successful. You can now log in with your new password.");
            setError("");
        }
    }, [recoveryError, resetSuccess, searchParams]);

    const registerPasswordRules = passwordRuleFlags(registerData.password);
    const recoveryPasswordRules = passwordRuleFlags(recoveryData.password);
    const normalizedRegisterMobile = normalizeMobile(registerData.countryCode, registerData.mobile);
    const isRegisterStepOneValid =
        isValidName(registerData.fullName) &&
        isValidEmail(registerData.email) &&
        /^\+\d{8,15}$/.test(normalizedRegisterMobile) &&
        isStrongPassword(registerData.password) &&
        Boolean(registerData.dateOfBirth) &&
        registerData.acceptedTerms;
    const isRegisterStepThreeValid =
        isValidName(registerData.fullName) &&
        registerData.city.trim().length > 0 &&
        ((registerData.userType === "student" && registerData.studyField.trim().length >= 2) ||
            (registerData.userType === "working_professional" &&
                registerData.domain.trim().length >= 2 &&
                registerData.companyRole.trim().length >= 2));
    const isRecoveryValid =
        isStrongPassword(recoveryData.password) &&
        recoveryData.password === recoveryData.confirmPassword;

    const clearFeedback = () => {
        setError("");
        setMessage("");
    };

    const pushToDashboard = () => {
        router.push("/dashboard");
        router.refresh();
    };

    const switchMode = (mode: AuthMode) => {
        setAuthMode(mode);
        clearFeedback();
        setForgotOpen(false);
        if (mode === "register") {
            setRegisterStep(1);
        }
    };

    const handleRegisterRequestOtp = async (event?: FormEvent) => {
        event?.preventDefault();
        if (!isRegisterStepOneValid) {
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: registerData.fullName,
                    email: registerData.email,
                    countryCode: registerData.countryCode,
                    mobile: registerData.mobile,
                    password: registerData.password,
                    dateOfBirth: registerData.dateOfBirth,
                    acceptedTerms: registerData.acceptedTerms,
                }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to send the verification OTP.");
            }

            setRegisterData((prev) => ({ ...prev, otp: "" }));
            setRegisterStep(2);
            setOtpCooldown(30);
            setMessage(`Email OTP sent to ${(data.target as string) || registerData.email}.`);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Failed to send the verification OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterVerifyOtp = async (event: FormEvent) => {
        event.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: registerData.email,
                    otp: registerData.otp,
                }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to verify the OTP.");
            }

            setRegisterStep(3);
            setMessage("Email verified. Complete your profile to finish registration.");
        } catch (verifyError) {
            setError(verifyError instanceof Error ? verifyError.message : "Failed to verify the OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (event: FormEvent) => {
        event.preventDefault();
        if (!isRegisterStepThreeValid) {
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/profile/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: registerData.fullName,
                    preferredServices: [],
                    userType: registerData.userType,
                    studyField: registerData.userType === "student" ? registerData.studyField : "",
                    domain: registerData.userType === "working_professional" ? registerData.domain : "",
                    companyRole: registerData.userType === "working_professional" ? registerData.companyRole : "",
                    city: registerData.city,
                }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to save your profile.");
            }

            setMessage("Registration complete. Redirecting to your dashboard...");
            pushToDashboard();
        } catch (profileError) {
            setError(profileError instanceof Error ? profileError.message : "Failed to save your profile.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (event: FormEvent) => {
        event.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginPasswordData),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to log in with password.");
            }

            setMessage("Login successful. Redirecting to your dashboard...");
            pushToDashboard();
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "Failed to log in with password.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRequestOtp = async (event?: FormEvent) => {
        event?.preventDefault();
        if (!isValidEmail(loginOtpData.email)) {
            setError("Enter a valid email address.");
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginOtpData.email }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to send the login OTP.");
            }

            setLoginOtpData((prev) => ({ ...prev, otpRequested: true, otp: "" }));
            setOtpCooldown(30);
            setMessage(`Login OTP sent to ${(data.target as string) || loginOtpData.email}.`);
        } catch (otpError) {
            setError(otpError instanceof Error ? otpError.message : "Failed to send the login OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginVerifyOtp = async (event: FormEvent) => {
        event.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginOtpData.email,
                    otp: loginOtpData.otp,
                }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to verify the login OTP.");
            }

            setMessage("Login successful. Redirecting to your dashboard...");
            pushToDashboard();
        } catch (verifyError) {
            setError(verifyError instanceof Error ? verifyError.message : "Failed to verify the login OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordRequest = async (event: FormEvent) => {
        event.preventDefault();
        if (!isValidEmail(forgotEmail)) {
            setError("Enter a valid email address.");
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to send the reset email.");
            }

            setForgotRequestSent(true);
            setMessage(`Password reset link sent to ${(data.target as string) || forgotEmail}.`);
        } catch (forgotError) {
            setError(forgotError instanceof Error ? forgotError.message : "Failed to send the reset email.");
        } finally {
            setLoading(false);
        }
    };

    const handleRecoveryReset = async (event: FormEvent) => {
        event.preventDefault();
        if (!isRecoveryValid) {
            if (recoveryData.password !== recoveryData.confirmPassword) {
                setError("Passwords do not match.");
            } else {
                setError("Use a strong password that meets all the rules.");
            }
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const supabase = createBrowserSupabaseClient();
            const { error } = await supabase.auth.updateUser({
                password: recoveryData.password,
            });

            if (error) {
                throw new Error(error.message || "Failed to reset your password.");
            }

            try {
                const supabase = createBrowserSupabaseClient();
                await supabase.auth.signOut();
            } catch {
                // Ignore sign-out cleanup errors after a successful password reset.
            }

            setAuthMode("login");
            router.replace("/auth?reset=success");
            router.refresh();
        } catch (resetError) {
            setError(resetError instanceof Error ? resetError.message : "Failed to reset your password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#eef6ff] via-[#f8fbff] to-[#ecfff7] text-slate-900">
            <Header />

            <section className="py-10 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.15fr]">
                        <aside className="rounded-3xl border border-sky-100 bg-[#0a2f4a] p-6 text-white shadow-[0_20px_60px_rgba(10,47,74,0.25)] md:p-8">
                            <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
                                Maestro Career
                            </p>
                            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl text-white uppercase">
                                PRODUCTION-READY AUTH BUILT AROUND EMAIL VERIFICATION.
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-sky-100 md:text-lg">
                                Production auth now runs with email verification and an OTP-first sign-in journey. Every
                                verified registration and login is persisted into Supabase so you can track who exists,
                                who is active, and when they last signed in.
                            </p>
                            <div className="mt-8 space-y-3 text-base leading-relaxed text-sky-100">
                                <p>1. Signup uses a 6-digit email OTP with Supabase sessions.</p>
                                <p>2. Login verifies users from Supabase and updates login activity in profile records.</p>
                                <p>3. Password recovery stays secure with email reset links.</p>
                            </div>
                        </aside>

                        <div className="rounded-3xl border border-[#d7e7f7] bg-white p-5 shadow-[0_20px_60px_rgba(19,69,105,0.12)] md:p-8">
                            {message && (
                                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {error}
                                </div>
                            )}

                            {recoveryMode ? (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Password Recovery</p>
                                        <h2 className="mt-2 text-2xl font-bold text-slate-900">Set your new password</h2>
                                        <p className="mt-2 text-sm text-slate-600">
                                            This screen is available only through a valid recovery email link from Supabase.
                                        </p>
                                    </div>

                                    <form onSubmit={handleRecoveryReset} className="space-y-4 rounded-2xl border border-slate-200 p-5">
                                        <PasswordField
                                            label="New Password"
                                            value={recoveryData.password}
                                            onChange={(value) =>
                                                setRecoveryData((prev) => ({ ...prev, password: value }))
                                            }
                                            placeholder="Create a strong password"
                                            visible={showRecoveryPassword}
                                            onToggle={() => setShowRecoveryPassword((prev) => !prev)}
                                        />

                                        <PasswordField
                                            label="Confirm Password"
                                            value={recoveryData.confirmPassword}
                                            onChange={(value) =>
                                                setRecoveryData((prev) => ({ ...prev, confirmPassword: value }))
                                            }
                                            placeholder="Re-enter your password"
                                            visible={showRecoveryConfirmPassword}
                                            onToggle={() => setShowRecoveryConfirmPassword((prev) => !prev)}
                                        />

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <p className={recoveryPasswordRules.length ? "text-emerald-700" : "text-slate-500"}>8+ characters</p>
                                            <p className={recoveryPasswordRules.upper ? "text-emerald-700" : "text-slate-500"}>1 uppercase</p>
                                            <p className={recoveryPasswordRules.lower ? "text-emerald-700" : "text-slate-500"}>1 lowercase</p>
                                            <p className={recoveryPasswordRules.number ? "text-emerald-700" : "text-slate-500"}>1 number</p>
                                            <p className={recoveryPasswordRules.special ? "text-emerald-700" : "text-slate-500"}>1 special</p>
                                            <p className={recoveryData.password === recoveryData.confirmPassword && recoveryData.confirmPassword ? "text-emerald-700" : "text-slate-500"}>Passwords match</p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading || !isRecoveryValid}
                                            className="w-full rounded-xl bg-[#0d3f63] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3350] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loading ? "Updating password..." : "Reset Password"}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <div className="inline-flex rounded-xl bg-slate-100 p-1">
                                        <button
                                            type="button"
                                            onClick={() => switchMode("login")}
                                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${authMode === "login" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
                                        >
                                            Login
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => switchMode("register")}
                                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${authMode === "register" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
                                        >
                                            Create Account
                                        </button>
                                    </div>

                                    {authMode === "login" && (
                                        <div className="mt-6 space-y-5">
                                            <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        clearFeedback();
                                                        setLoginMode("password");
                                                        setForgotOpen(false);
                                                    }}
                                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${loginMode === "password" ? "bg-[#0d3f63] text-white" : "text-slate-600"}`}
                                                >
                                                    Email + Password
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        clearFeedback();
                                                        setLoginMode("otp");
                                                        setForgotOpen(false);
                                                    }}
                                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${loginMode === "otp" ? "bg-[#0d3f63] text-white" : "text-slate-600"}`}
                                                >
                                                    Email + OTP
                                                </button>
                                            </div>

                                            {loginMode === "password" && (
                                                <form onSubmit={handlePasswordLogin} className="space-y-4 rounded-2xl border border-slate-200 p-5">
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                                                        <input
                                                            type="email"
                                                            value={loginPasswordData.email}
                                                            onChange={(event) =>
                                                                setLoginPasswordData((prev) => ({ ...prev, email: event.target.value }))
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                            placeholder="you@example.com"
                                                            required
                                                        />
                                                    </div>

                                                    <PasswordField
                                                        label="Password"
                                                        value={loginPasswordData.password}
                                                        onChange={(value) =>
                                                            setLoginPasswordData((prev) => ({ ...prev, password: value }))
                                                        }
                                                        placeholder="Enter your password"
                                                        visible={showLoginPassword}
                                                        onToggle={() => setShowLoginPassword((prev) => !prev)}
                                                    />

                                                    <div className="flex items-center justify-between gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                clearFeedback();
                                                                setForgotOpen((prev) => !prev);
                                                                setForgotRequestSent(false);
                                                                setForgotEmail(loginPasswordData.email);
                                                            }}
                                                            className="text-sm font-medium text-sky-700"
                                                        >
                                                            Forgot password?
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="rounded-xl bg-[#0d3f63] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3350] disabled:opacity-70"
                                                        >
                                                            {loading ? "Logging in..." : "Login"}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}

                                            {loginMode === "otp" && (
                                                <form
                                                    onSubmit={loginOtpData.otpRequested ? handleLoginVerifyOtp : handleLoginRequestOtp}
                                                    className="space-y-4 rounded-2xl border border-slate-200 p-5"
                                                >
                                                    <p className="text-sm text-slate-600">
                                                        Use a one-time code sent to your email. No mobile OTP is used in this flow.
                                                    </p>

                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                                                        <input
                                                            type="email"
                                                            value={loginOtpData.email}
                                                            onChange={(event) =>
                                                                setLoginOtpData((prev) => ({
                                                                    ...prev,
                                                                    email: event.target.value,
                                                                    otpRequested: prev.email === event.target.value ? prev.otpRequested : false,
                                                                    otp: prev.email === event.target.value ? prev.otp : "",
                                                                }))
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                            placeholder="you@example.com"
                                                            required
                                                        />
                                                    </div>

                                                    {loginOtpData.otpRequested && (
                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium text-slate-700">Email OTP</label>
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={loginOtpData.otp}
                                                                onChange={(event) =>
                                                                    setLoginOtpData((prev) => ({
                                                                        ...prev,
                                                                        otp: maskOtpInput(event.target.value),
                                                                    }))
                                                                }
                                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg tracking-[0.45em] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                                placeholder="123456"
                                                                maxLength={6}
                                                                required
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        {loginOtpData.otpRequested ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => void handleLoginRequestOtp()}
                                                                disabled={otpCooldown > 0 || loading}
                                                                className="text-sm font-medium text-sky-700 disabled:text-slate-400"
                                                            >
                                                                {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Resend OTP"}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-slate-500">A 6-digit OTP will be sent by email.</span>
                                                        )}

                                                        <button
                                                            type="submit"
                                                            disabled={loading || (loginOtpData.otpRequested && loginOtpData.otp.length !== 6)}
                                                            className="rounded-xl bg-[#0d3f63] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3350] disabled:opacity-70"
                                                        >
                                                            {loading
                                                                ? loginOtpData.otpRequested
                                                                    ? "Verifying..."
                                                                    : "Sending OTP..."
                                                                : loginOtpData.otpRequested
                                                                    ? "Verify & Login"
                                                                    : "Send OTP"}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}

                                            {forgotOpen && (
                                                <form onSubmit={handleForgotPasswordRequest} className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
                                                    <div className="space-y-2">
                                                        <h3 className="text-lg font-semibold text-slate-900">Reset your password</h3>
                                                        <p className="text-sm text-slate-600">
                                                            We will send a password recovery link through email using Supabase and Brevo.
                                                        </p>
                                                    </div>

                                                    <div className="mt-4">
                                                        <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                                                        <input
                                                            type="email"
                                                            value={forgotEmail}
                                                            onChange={(event) => setForgotEmail(event.target.value)}
                                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                            placeholder="you@example.com"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setForgotOpen(false);
                                                                setForgotRequestSent(false);
                                                                clearFeedback();
                                                            }}
                                                            className="text-sm font-medium text-slate-600"
                                                        >
                                                            Close
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="rounded-xl bg-[#0d3f63] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3350] disabled:opacity-70"
                                                        >
                                                            {loading ? "Sending..." : "Email Reset Link"}
                                                        </button>
                                                    </div>

                                                    {forgotRequestSent && (
                                                        <p className="mt-3 text-sm text-emerald-700">
                                                            Check your inbox and spam folder for the recovery email.
                                                        </p>
                                                    )}
                                                </form>
                                            )}
                                        </div>
                                    )}

                                    {authMode === "register" && (
                                        <div className="mt-6 space-y-5">
                                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                <span className={registerStep >= 1 ? "text-sky-700" : ""}>Step 1: Account</span>
                                                <span>/</span>
                                                <span className={registerStep >= 2 ? "text-sky-700" : ""}>Step 2: Email OTP</span>
                                                <span>/</span>
                                                <span className={registerStep >= 3 ? "text-sky-700" : ""}>Step 3: Profile</span>
                                            </div>

                                            {registerStep === 1 && (
                                                <form onSubmit={handleRegisterRequestOtp} className="space-y-4 rounded-2xl border border-slate-200 p-5">
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                                                        <input
                                                            type="text"
                                                            value={registerData.fullName}
                                                            onChange={(event) =>
                                                                setRegisterData((prev) => ({ ...prev, fullName: event.target.value }))
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                            placeholder="John Doe"
                                                            required
                                                        />
                                                        {registerData.fullName && !isValidName(registerData.fullName) && (
                                                            <p className="mt-1 text-xs text-rose-600">Enter a valid full name.</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                                                        <input
                                                            type="email"
                                                            value={registerData.email}
                                                            onChange={(event) =>
                                                                setRegisterData((prev) => ({ ...prev, email: event.target.value }))
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                            placeholder="you@example.com"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium text-slate-700">Country Code</label>
                                                            <select
                                                                value={registerData.countryCode}
                                                                onChange={(event) =>
                                                                    setRegisterData((prev) => ({ ...prev, countryCode: event.target.value }))
                                                                }
                                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                            >
                                                                {COUNTRY_CODES.map((country) => (
                                                                    <option key={country.code} value={country.code}>
                                                                        {country.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium text-slate-700">Mobile Number</label>
                                                            <input
                                                                type="tel"
                                                                value={registerData.mobile}
                                                                onChange={(event) =>
                                                                    setRegisterData((prev) => ({ ...prev, mobile: event.target.value }))
                                                                }
                                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                                placeholder="9876543210"
                                                                required
                                                            />
                                                            {registerData.mobile && !/^\+\d{8,15}$/.test(normalizedRegisterMobile) && (
                                                                <p className="mt-1 text-xs text-rose-600">Enter a valid mobile number.</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <PasswordField
                                                            label="Create Password"
                                                            value={registerData.password}
                                                            onChange={(value) =>
                                                                setRegisterData((prev) => ({ ...prev, password: value }))
                                                            }
                                                            placeholder="Create a strong password"
                                                            visible={showRegisterPassword}
                                                            onToggle={() => setShowRegisterPassword((prev) => !prev)}
                                                        />
                                                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                            <p className={registerPasswordRules.length ? "text-emerald-700" : "text-slate-500"}>8+ characters</p>
                                                            <p className={registerPasswordRules.upper ? "text-emerald-700" : "text-slate-500"}>1 uppercase</p>
                                                            <p className={registerPasswordRules.lower ? "text-emerald-700" : "text-slate-500"}>1 lowercase</p>
                                                            <p className={registerPasswordRules.number ? "text-emerald-700" : "text-slate-500"}>1 number</p>
                                                            <p className={registerPasswordRules.special ? "text-emerald-700" : "text-slate-500"}>1 special</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-slate-700">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={registerData.dateOfBirth}
                                                            onChange={(event) =>
                                                                setRegisterData((prev) => ({ ...prev, dateOfBirth: event.target.value }))
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                            required
                                                        />
                                                    </div>

                                                    <label className="flex items-start gap-2 text-sm text-slate-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={registerData.acceptedTerms}
                                                            onChange={(event) =>
                                                                setRegisterData((prev) => ({
                                                                    ...prev,
                                                                    acceptedTerms: event.target.checked,
                                                                }))
                                                            }
                                                            className="mt-1"
                                                        />
                                                        <span>
                                                            I agree to the Terms, Privacy Policy, and email verification flow.
                                                        </span>
                                                    </label>

                                                    <button
                                                        type="submit"
                                                        disabled={!isRegisterStepOneValid || loading}
                                                        className="w-full rounded-xl bg-[#0d3f63] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3350] disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {loading ? "Sending OTP..." : "Continue"}
                                                    </button>
                                                </form>
                                            )}

                                            {registerStep === 2 && (
                                                <form onSubmit={handleRegisterVerifyOtp} className="space-y-4 rounded-2xl border border-slate-200 p-5">
                                                    <div className="space-y-2">
                                                        <h3 className="text-lg font-semibold text-slate-900">Verify your email</h3>
                                                        <p className="text-sm text-slate-600">
                                                            Enter the 6-digit OTP sent to {registerData.email}. Your mobile number is stored
                                                            for your profile, not for verification.
                                                        </p>
                                                    </div>

                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={registerData.otp}
                                                        onChange={(event) =>
                                                            setRegisterData((prev) => ({
                                                                ...prev,
                                                                otp: maskOtpInput(event.target.value),
                                                            }))
                                                        }
                                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg tracking-[0.45em] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                        placeholder="123456"
                                                        maxLength={6}
                                                        required
                                                    />

                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <div className="flex gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => setRegisterStep(1)}
                                                                className="text-sm font-medium text-slate-600"
                                                            >
                                                                Back
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => void handleRegisterRequestOtp()}
                                                                disabled={otpCooldown > 0 || loading}
                                                                className="text-sm font-medium text-sky-700 disabled:text-slate-400"
                                                            >
                                                                {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Resend OTP"}
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={loading || registerData.otp.length !== 6}
                                                            className="rounded-xl bg-[#0d3f63] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3350] disabled:opacity-70"
                                                        >
                                                            {loading ? "Verifying..." : "Verify & Continue"}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}

                                            {registerStep === 3 && (
                                                <form onSubmit={handleCompleteProfile} className="space-y-4 rounded-2xl border border-slate-200 p-5">
                                                    <div>
                                                        <p className="mb-2 text-sm font-medium text-slate-700">User Type</p>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setRegisterData((prev) => ({
                                                                        ...prev,
                                                                        userType: "student",
                                                                        domain: "",
                                                                        companyRole: "",
                                                                    }))
                                                                }
                                                                className={`rounded-xl border px-3 py-2 text-sm font-medium ${registerData.userType === "student" ? "border-[#0d3f63] bg-[#e6f2fb] text-[#0d3f63]" : "border-slate-300 text-slate-600"}`}
                                                            >
                                                                Student
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setRegisterData((prev) => ({
                                                                        ...prev,
                                                                        userType: "working_professional",
                                                                        studyField: "",
                                                                    }))
                                                                }
                                                                className={`rounded-xl border px-3 py-2 text-sm font-medium ${registerData.userType === "working_professional" ? "border-[#0d3f63] bg-[#e6f2fb] text-[#0d3f63]" : "border-slate-300 text-slate-600"}`}
                                                            >
                                                                Working Professional
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {registerData.userType === "student" && (
                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium text-slate-700">What are you studying?</label>
                                                            <input
                                                                type="text"
                                                                value={registerData.studyField}
                                                                onChange={(event) =>
                                                                    setRegisterData((prev) => ({
                                                                        ...prev,
                                                                        studyField: event.target.value,
                                                                    }))
                                                                }
                                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                                placeholder="B.Tech Computer Science"
                                                                required
                                                            />
                                                        </div>
                                                    )}

                                                    {registerData.userType === "working_professional" && (
                                                        <>
                                                            <div>
                                                                <label className="mb-1 block text-sm font-medium text-slate-700">Domain / Industry</label>
                                                                <input
                                                                    type="text"
                                                                    value={registerData.domain}
                                                                    onChange={(event) =>
                                                                        setRegisterData((prev) => ({ ...prev, domain: event.target.value }))
                                                                    }
                                                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                                    placeholder="Software, Finance, Design"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-1 block text-sm font-medium text-slate-700">Company Name / Role</label>
                                                                <input
                                                                    type="text"
                                                                    value={registerData.companyRole}
                                                                    onChange={(event) =>
                                                                        setRegisterData((prev) => ({
                                                                            ...prev,
                                                                            companyRole: event.target.value,
                                                                        }))
                                                                    }
                                                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                                    placeholder="Acme Corp / Product Analyst"
                                                                    required
                                                                />
                                                            </div>
                                                        </>
                                                    )}

                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                                                        <input
                                                            list="auth-city-suggestions"
                                                            value={registerData.city}
                                                            onChange={(event) =>
                                                                setRegisterData((prev) => ({ ...prev, city: event.target.value }))
                                                            }
                                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                            placeholder="Enter your city"
                                                            required
                                                        />
                                                        <datalist id="auth-city-suggestions">
                                                            {CITY_SUGGESTIONS.map((city) => (
                                                                <option key={city} value={city} />
                                                            ))}
                                                        </datalist>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={loading || !isRegisterStepThreeValid}
                                                        className="w-full rounded-xl bg-[#0d3f63] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3350] disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {loading ? "Saving..." : "Take Me to Dashboard"}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
