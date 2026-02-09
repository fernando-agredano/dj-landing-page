"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 11V8.6a4.5 4.5 0 1 1 9 0V11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.8 11h10.4c.9 0 1.6.7 1.6 1.6v6.6c0 .9-.7 1.6-1.6 1.6H6.8c-.9 0-1.6-.7-1.6-1.6v-6.6c0-.9.7-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 14.2v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * OJO: useSearchParams() debe vivir dentro de un Suspense boundary en Next 15+
 * para evitar el error "missing-suspense-with-csr-bailout".
 */
function BackstageLoginInner() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const next = useMemo(() => {
    const n = params.get("next");
    return n && n.startsWith("/") ? n : "/backstage";
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/backstage/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string })?.error || "PIN incorrecto");
        return;
      }

      router.replace(next);
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      {/* Ambient background (no negro plano) */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgGlowA} />
        <div className={styles.bgGlowB} />
        <div className={styles.bgNoise} />
        <div className={styles.bgVignette} />
      </div>

      <section className={styles.split}>
        {/* LEFT: Hero con imagen */}
        <aside className={styles.hero} aria-hidden="true">
          <div
            className={styles.heroImage}
            style={{
              backgroundImage:
                "url(/images/media-login.jpg), radial-gradient(circle at 20% 20%, rgba(138,92,255,.25), transparent 55%)",
            }}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <div className={styles.heroBrand}>
              <div className={styles.brandMark}>
                <div className={styles.brandDiamond} />
              </div>
              <div className={styles.brandText}>
                <div className={styles.brandTop}>
                  <span className={styles.brandName}>BIOSFERA</span>{" "}
                  <span className={styles.brandAccent}>PRODUCCIÓN</span>
                </div>
                <div className={styles.brandSub}>
                  Backstage / Control de agenda
                </div>
              </div>
            </div>

            <div className={styles.heroTitle}>Control privado</div>
            <div className={styles.heroSubtitle}>
              Actualiza fechas, estados y horarios. Se refleja automáticamente
              en la agenda pública.
            </div>

            <div className={styles.heroPills}>
              <span className={styles.pill}>Privados</span>
              <span className={styles.pill}>Clubs</span>
              <span className={styles.pill}>Festivales</span>
            </div>
          </div>
        </aside>

        {/* RIGHT: Login */}
        <div className={styles.panel}>
          <div className={styles.card}>
            <header className={styles.header}>
              <div className={styles.kicker}>
                <span className={styles.kickerDot} />
                <span>Panel privado</span>
              </div>
              <h1 className={styles.title}>Iniciar sesión</h1>
              <p className={styles.subtitle}>
                Ingresa el PIN para gestionar la agenda. Acceso solo por URL.
              </p>
            </header>

            <form onSubmit={onSubmit} className={styles.form}>
              <label className={styles.label}>
                <span className={styles.labelText}>PIN</span>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon} aria-hidden="true">
                    <IconLock className={styles.iconSvg} />
                  </span>
                  <input
                    className={styles.input}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    type="password"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="••••"
                    aria-label="PIN"
                  />
                </div>
              </label>

              {error && (
                <div className={styles.alert} role="alert">
                  <div className={styles.alertBadge}>!</div>
                  <div className={styles.alertText}>{error}</div>
                </div>
              )}

              <button
                className={styles.primaryBtn}
                disabled={loading}
                type="submit"
              >
                <span>{loading ? "Entrando..." : "Acceder"}</span>
                <IconArrow className={styles.btnIcon} />
              </button>

              <div className={styles.meta}>
                <span className={styles.metaPill}>
                  Guarda <code className={styles.inlineCode}>/backstage</code>{" "}
                  en favoritos
                </span>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function BackstageLoginPage() {
  return (
    <Suspense fallback={<div />}>
      <BackstageLoginInner />
    </Suspense>
  );
}
