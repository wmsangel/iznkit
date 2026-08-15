/**
 * Launch mode.
 *
 * While no real payment provider is wired up, every tool is free: the "unlock"
 * flow (StubProvider) already hands back a clean, watermark-free PDF instantly.
 * FREE_MODE only changes the *messaging* — prices become "Free" and the paywall
 * copy turns into an optional donation ask.
 *
 * Flip to `false` (or gate on an env var) once checkout is live.
 */
export const FREE_MODE = true;
