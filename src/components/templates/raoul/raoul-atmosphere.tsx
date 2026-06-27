/** Fixed decorative layer — linen grain, soft vignette, morning light */
export function RaoulAtmosphere() {
  return (
    <div className="raoul-atmosphere pointer-events-none" aria-hidden>
      <div className="raoul-atmosphere__grain" />
      <div className="raoul-atmosphere__vignette" />
      <div className="raoul-atmosphere__glow" />
    </div>
  );
}
