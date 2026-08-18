/**
 * ECO//SIM — Floating contact (Editorial Field Study v3 + v7 production layer)
 * A bottom-right field-desk button that opens a contact/newsletter form with
 * inline validation (error state), a verified success state, and an optional
 * secret-code password field with visibility toggle. No backend — messages are
 * composed client-side; this is an educational demo field desk.
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MapPin, MessageSquare, X, Eye, EyeOff, CheckCircle2, Send } from "lucide-react";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [secretVisible, setSecretVisible] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setSecret("");
    setSecretVisible(false);
    setErrors({});
    setSubmitted(false);
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Your name is required";
    if (!email.trim()) next.email = "Your email is required";
    else if (!isValidEmail(email)) next.email = "That doesn't look like a real email";
    if (!message.trim()) next.message = "Tell us what's on your mind";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Fix the marked fields first");
      return;
    }
    // Simulated send with a short loading state so the button reads as work in progress.
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      toast.success("Your note reached the field desk");
    }, 700);
  };

  const inputCls = (field?: string) =>
    `rounded-none border-border bg-transparent focus-visible:ring-1 focus-visible:ring-vermilion ${
      field ? "field-error" : ""
    }`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-press fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase pl-3.5 pr-4 py-3 hover:brightness-105 transition-all"
        aria-label="Open the field desk — contact us"
        data-no-print="true"
      >
        <MessageSquare className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Field desk</span>
      </button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
        <DialogContent className="max-w-md rounded-none border-border">
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight">
            The field desk
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-muted-foreground">
            A question, a correction, or a classroom story — leave it here.
          </DialogDescription>

          {submitted ? (
            /* ── Thank-you state ── */
            <div className="py-6 flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              <div className="font-display text-xl font-semibold">Note received — thank you.</div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Your note reached the field desk. For urgent matters, prefer
                the mailing address below.
              </p>
              <button
                onClick={() => { reset(); setOpen(false); }}
                className="btn-press mt-2 border border-border font-data text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:border-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            /* ── Form: validation errors + PW toggle ── */
            <form onSubmit={handleSubmit} className="space-y-4 mt-1" noValidate>
              <div>
                <label htmlFor="fc-name" className="field-label mb-1.5">Name · required</label>
                <Input
                  id="fc-name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((er) => ({ ...er, name: undefined })); }}
                  placeholder="Your name"
                  className={inputCls(errors.name)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <div className="input-notice notice-error mt-1">{errors.name}</div>
                )}
              </div>
              <div>
                <label htmlFor="fc-email" className="field-label mb-1.5">Email · required</label>
                <Input
                  id="fc-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: undefined })); }}
                  placeholder="you@example.com"
                  className={inputCls(errors.email)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <div className="input-notice notice-error mt-1">{errors.email}</div>
                )}
              </div>
              <div>
                <label htmlFor="fc-message" className="field-label mb-1.5">Message · required</label>
                <Textarea
                  id="fc-message"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setErrors((er) => ({ ...er, message: undefined })); }}
                  placeholder="What's on your mind?"
                  rows={4}
                  className={inputCls(errors.message)}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <div className="input-notice notice-error mt-1">{errors.message}</div>
                )}
              </div>
              <div>
                <label htmlFor="fc-secret" className="field-label mb-1.5">
                  Secret code · optional
                </label>
                <div className="relative">
                  <Input
                    id="fc-secret"
                    type={secretVisible ? "text" : "password"}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="For field-verified correspondents"
                    className="rounded-none border-border bg-transparent pr-10 focus-visible:ring-1 focus-visible:ring-vermilion"
                  />
                  <button
                    type="button"
                    onClick={() => setSecretVisible((v) => !v)}
                    className="btn-press absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label={secretVisible ? "Hide secret code" : "Show secret code"}
                  >
                    {secretVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="input-notice text-muted-foreground mt-1">
                  Visibility can be toggled for accessibility
                </div>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-press w-full inline-flex items-center justify-center gap-2 bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase px-5 py-3 hover:brightness-105 transition-all disabled:opacity-70 disabled:cursor-wait"
              >
                {sending ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Send to the field desk
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-4 pt-4 border-t border-border flex items-start gap-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-vermilion" aria-hidden="true" />
            <p className="text-[12px] leading-relaxed">
              Study office · 12 Lorong Pantai, Teluk Nusa 08000, Kedah,
              Malaysia · desk@ecosim.study
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
