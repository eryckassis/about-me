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
      className="mt-14.75 font-medium xl:col-span-2 xl:col-start-1"
    >
      <h1 id="about-title" className="sr-only">
        About Estudio Bang
      </h1>

      <div className="space-y-[22.4px] text-[14px] leading-[22.4px] tracking-[-0.02em]">
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

      <div className="mt-6 border-t border-divider pt-6">
        <h2 className="sr-only">Team</h2>

        <ul className="space-y-2">
          {team.map((member) => (
            <li
              key={member.name}
              className="flex items-baseline justify-between gap-4"
            >
              <span className="text-[14px] leading-[22.4px] tracking-[-0.02em]">
                {member.name}
              </span>

              <span className="shrink-0 text-right text-[12px] leading-[19.2px] tracking-[-0.02em] text-muted-foreground uppercase">
                {member.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
