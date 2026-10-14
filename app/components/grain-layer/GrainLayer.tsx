export function GrainLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-9999 opacity-[0.03]"
      style={{
        backgroundImage: 'url("/textures/grain.gif")',
        backgroundPosition: "0 0",
        backgroundRepeat: "repeat",
        backgroundSize: "290px 290px",
      }}
    />
  );
}
