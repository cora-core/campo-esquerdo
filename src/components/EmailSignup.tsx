'use client';

import React, { useEffect, useState } from 'react';

/*
 * Email signup popup, styled like the floating ContentHub window
 * (black 1px borders, white box, expand.svg close button, fadeScale animation).
 *
 * Submits to the Cloudflare Worker in /newsletter-worker (D1 database, live CSV export).
 * Endpoint comes from NEXT_PUBLIC_NEWSLETTER_URL, e.g.
 *   https://campo-esquerdo-newsletter.<subdomain>.workers.dev/subscribe
 */

const RAW_NEWSLETTER_URL = process.env.NEXT_PUBLIC_NEWSLETTER_URL;

// The value lives in .env.local and is baked in when the app is compiled, so it must
// be a real URL at build/dev time. Anything else (undefined, or the unfilled
// "...campo-esquerdo-newsletter.<you>.workers.dev..." placeholder) is treated as
// "not configured" instead of being handed to fetch(), where it only surfaces as a
// generic TypeError.
const NEWSLETTER_URL =
  RAW_NEWSLETTER_URL && /^https?:\/\/[^<>\s]+$/.test(RAW_NEWSLETTER_URL.trim())
    ? RAW_NEWSLETTER_URL.trim()
    : undefined;

/** Human-readable reason for the failure, shown as a tooltip and logged to the console. */
function describeFailure(status: number, data: { error?: string }): string {
  const code = data?.error;
  if (code === 'origin') return 'The worker rejected this page origin — add it to ALLOWED_ORIGINS in newsletter-worker/wrangler.toml.';
  if (code === 'email') return 'The worker rejected the email address.';
  if (code === 'choice') return 'No newsletter option was selected.';
  if (code === 'json') return 'The worker could not parse the request body.';
  if (code === 'server') return 'The worker threw an error — check its logs (npx wrangler tail).';
  return `The worker answered HTTP ${status}.`;
}

interface EmailSignupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailSignup({ isOpen, onClose }: EmailSignupProps) {
  const [email, setEmail] = useState('');
  // Unchecked by default: explicit opt-in (LGPD)
  const [blogPosts, setBlogPosts] = useState(false);
  const [events, setEvents] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot, stays empty for humans

  // Same sizing as the ContentHub buttons
  const buttonFontSize = 'clamp(0.625rem, 1vw, 0.875rem)';
  const btnSize = 'clamp(1.5rem, 3.5vw, 2.5rem)';

  const close = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      if (status === 'done') {
        // Clear the form after a successful signup; keep a half-typed one otherwise
        setEmail('');
        setBlogPosts(false);
        setEvents(false);
      }
      setStatus('idle');
      setErrorDetail('');
      onClose();
    }, 300);
  };

  // Escape closes the popup
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!NEWSLETTER_URL) {
      console.error(
        '[newsletter] NEXT_PUBLIC_NEWSLETTER_URL is missing or still a placeholder:',
        RAW_NEWSLETTER_URL ?? '(unset)',
        '— set it to the deployed worker URL (…/subscribe) in .env.local, then restart `next dev` / rebuild.'
      );
      setErrorDetail('Form endpoint not configured (NEXT_PUBLIC_NEWSLETTER_URL).');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorDetail('');
    try {
      const res = await fetch(NEWSLETTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, blog: blogPosts, eventos: events, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('done');
        return;
      }
      console.error('[newsletter] signup rejected', { url: NEWSLETTER_URL, status: res.status, data });
      setErrorDetail(describeFailure(res.status, data));
      setStatus('error');
    } catch (err) {
      // Network failure, CORS rejection, DNS error, invalid URL…
      console.error('[newsletter] request failed', { url: NEWSLETTER_URL, err });
      const msg = (err as Error)?.message ?? String(err);
      setErrorDetail(
        `Could not reach the worker (${msg}). If the console shows a CORS error, add ` +
          `${window.location.origin} to ALLOWED_ORIGINS in newsletter-worker/wrangler.toml.`
      );
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  const checkboxClass =
    'appearance-none flex-shrink-0 w-4 h-4 border border-black bg-white checked:bg-black cursor-pointer transition-colors';

  return (
    // Transparent click-catcher: clicking outside the window closes it
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={close}>
      <div
        className="font-ui-gothic w-[90vw] max-w-md"
        style={{ animation: isClosing ? 'fadeScaleOut 0.3s ease-out forwards' : 'fadeScaleIn 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-signup-title"
      >
        <style jsx>{`
          @keyframes fadeScaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeScaleOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
        `}</style>

        {/* Top row: close box + horizontal line + title tab (mirrors the ContentHub top row) */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={close}
            className="border border-black flex items-center justify-center flex-shrink-0 bg-white hover:bg-gray-50 transition-colors"
            style={{ width: btnSize, height: btnSize }}
            title="Fechar"
            aria-label="Fechar"
          >
            X
          </button>
          <div className="flex-1 border-t border-black" />
          <div
            id="email-signup-title"
            className="border border-black flex-shrink-0 flex items-center justify-center bg-gray-300"
            style={{ fontSize: buttonFontSize, height: btnSize, paddingLeft: '1em', paddingRight: '1em' }}
          >
            NEWSLETTER
          </div>
        </div>

        {/* Main box */}
        <div className="border border-black border-t-0 bg-white p-6">
          {status === 'done' ? (
            <p className="text-center text-sm py-8">email cadastrado com sucesso!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-center font-bold text-xl uppercase">jamais enviaremos spam</p>

              {/* Honeypot: hidden from people, bots fill it and get silently ignored */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                aria-label="Email"
                className="w-full border border-black bg-white px-3 py-2 text-sm outline-none focus:bg-gray-50 placeholder:text-gray-400"
              />

              <div className="space-y-3 text-sm">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogPosts}
                    onChange={(e) => setBlogPosts(e.target.checked)}
                    className={`${checkboxClass} mt-0.5`}
                  />
                  <span>receber notificações de novas entradas no blog</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={events}
                    onChange={(e) => setEvents(e.target.checked)}
                    className={`${checkboxClass} mt-0.5`}
                  />
                  <span>receber notificações de novos eventos/workshops</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-4">
                {status === 'error' && (
                  <span className="text-xs" role="alert" title={errorDetail} data-reason={errorDetail}>
                    ERRO :( PROVAVELMENTE É ALGO DO NOSSO LADO. TENTE NOVAMENTE MAIS TARDE.
                  </span>
                )}
                <button
                  type="submit"
                  disabled={(!blogPosts && !events) || status === 'sending'}
                  className="border border-black bg-white px-4 uppercase transition-colors hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black"
                  style={{ fontSize: buttonFontSize, height: btnSize }}
                >
                  {status === 'sending' ? 'ENVIANDO…' : 'ENVIAR'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
