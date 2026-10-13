export function BrandMark() {
  return (
    <div
      aria-label="Estudio Bang"
      className="grid h-6 w-[30px] grid-cols-3 grid-rows-2"
      role="img"
    >
      <span className="col-start-1 row-start-1 bg-foreground" />
      <span className="col-start-3 row-start-1 bg-foreground" />
      <span className="col-span-2 col-start-1 row-start-2 bg-foreground" />
    </div>
  );
}
