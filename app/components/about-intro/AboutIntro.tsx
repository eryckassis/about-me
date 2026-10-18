const team = [
  {
    name: "Espartaco Degano",
    role: "Head Architect",
  },
  {
    name: "Fernanda Nessier",
    role: "Co-founder",
  },
  {
    name: "Juan Mantz",
    role: "Creative Director",
  },
  {
    name: "Camila Cappato",
    role: "Architect & ID",
  },
  {
    name: "Giuliano Barbotti",
    role: "Junior Architect",
  },
];

export function AboutIntro() {
  return (
    <section
      aria-labelledby="about-title"
      className="mt-14.75 w-full max-w-[320px] font-medium text-black xl:col-span-2 xl:col-start-1"
    >
      <h1 id="about-title" className="sr-only">
        About Estudio Bang
      </h1>

      <div className="space-y-[18.9px] text-justify text-[14px] leading-[18.9px] tracking-[-0.02em] xl:space-y-[22.4px] xl:text-left xl:leading-[22.4px]">
        <p>
          We are a Barcelona-based architecture team with more than fifteen
          years of experience across architecture, interiors, and product
          design.
        </p>

        <p>
          We have worked alongside teams and professionals in Argentina, Spain,
          Australia, the United States, and the Middle East.
        </p>

        <p>
          Our projects combine a clear point of view, artistic sensitivity, and
          technical knowledge to shape spaces and objects that tell stories.
        </p>
      </div>

      <div className="mt-6 border-t border-[rgba(0,0,0,0.16)] pt-6">
        <h2 className="sr-only">Team</h2>

        <ul className="space-y-2">
          {team.map((member) => (
            <li
              key={member.name}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-[14px] leading-[22.4px] tracking-[-0.02em]">
                {member.name}
              </span>

              <span className="shrink-0 text-left text-[12px] leading-[19.2px] font-semibold tracking-[-0.02em] text-black/50 uppercase">
                {member.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
