import { useState } from "react";
import { login } from "../services/api";

function AuthLayout({ children }) {
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2a4a 0%, #1e4d8c 50%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{ background: "white", borderRadius: 24, padding: "48px 40px", width: 380, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #1e4d8c, #2563eb)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 28 }}>🔍</div>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#1e3a5f" }}>
                        Procure<span style={{ color: "#2563eb" }}>Watch</span>
                    </h1>
                    <p style={{ margin: "6px 0 0", fontSize: 13, color: "#9ca3af" }}>Public Procurement Analysis System</p>
                </div>
                {children}
            </div>
        </div>
    );
}

function AuthInput({ type = "text", placeholder, value, onChange, onKeyDown }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
    );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin, onGoRegister }) {
    const [form,    setForm]    = useState({ usernameOrEmail: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState("");

    const handleLogin = async () => {
        if (!form.usernameOrEmail || !form.password) {
            setError("Please enter your username and password.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            // POST /api/auth/login → { token, userId, username, email, role }
            const user = await login(form.usernameOrEmail, form.password);
            // Зачувај го токенот во localStorage за идни повици
            localStorage.setItem("pw_token", user.token);
            localStorage.setItem("pw_user",  JSON.stringify(user));
            onLogin(user);
        } catch (err) {
            setError("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#1e3a5f", textAlign: "center" }}>Sign In</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <AuthInput
                    placeholder="Username or Email"
                    value={form.usernameOrEmail}
                    onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
                <AuthInput
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
                {error && (
                    <div style={{ fontSize: 12, color: "#dc2626", background: "#fef2f2", borderRadius: 8, padding: "8px 12px", border: "1px solid #fecaca" }}>
                        {error}
                    </div>
                )}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{ padding: "13px", background: loading ? "#93c5fd" : "linear-gradient(135deg, #1e4d8c, #2563eb)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "Signing in…" : "Log In"}
                </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 20 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Don't have an account? </span>
                <span onClick={onGoRegister} style={{ fontSize: 12, color: "#2563eb", cursor: "pointer", fontWeight: 600 }}>Sign up</span>
            </div>
        </AuthLayout>
    );
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
function Register({ onGoLogin }) {
    const [form,    setForm]    = useState({ fullName: "", email: "", username: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = async () => {
        if (!form.fullName || !form.username || !form.email || !form.password || !form.confirm) {
            setError("Please fill in all required fields.");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: form.fullName,
                    email:    form.email,
                    username: form.username,
                    password: form.password,
                }),
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Registration failed.");
            }
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Registration failed. Username or email may already exist.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                    <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#1e3a5f" }}>Account Created!</h2>
                    <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Your account has been created. You can now sign in.</p>
                    <button onClick={onGoLogin} style={{ padding: "12px 28px", background: "linear-gradient(135deg, #1e4d8c, #2563eb)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                        Go to Sign In
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#1e3a5f", textAlign: "center" }}>Create Account</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <AuthInput placeholder="Full Name *"     value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                <AuthInput placeholder="Email *"         value={form.email}    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <AuthInput placeholder="Username *"      value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                <AuthInput type="password" placeholder="Password * (min. 6 chars)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <AuthInput type="password" placeholder="Confirm Password *"         value={form.confirm}  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleRegister()} />
                {error && (
                    <div style={{ fontSize: 12, color: "#dc2626", background: "#fef2f2", borderRadius: 8, padding: "8px 12px", border: "1px solid #fecaca" }}>
                        {error}
                    </div>
                )}
                <button onClick={handleRegister} disabled={loading} style={{ padding: "13px", background: loading ? "#93c5fd" : "linear-gradient(135deg, #1e4d8c, #2563eb)", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
                    {loading ? "Creating account…" : "Sign Up"}
                </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 18 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Already have an account? </span>
                <span onClick={onGoLogin} style={{ fontSize: 12, color: "#2563eb", cursor: "pointer", fontWeight: 600 }}>Sign in</span>
            </div>
        </AuthLayout>
    );
}

export default function LoginPage({ onLogin }) {
    const [screen, setScreen] = useState("login");
    if (screen === "register") return <Register onGoLogin={() => setScreen("login")} />;
    return <Login onLogin={onLogin} onGoRegister={() => setScreen("register")} />;
}
