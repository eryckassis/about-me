const team = [
  {
    name: "Photography",
    role: "VISUAL STORYTELLING",
  },
  {
    name: "Creative Direction",
    role: "VISUAL CONCEPTS",
  },
  {
    name: "UI/UX Design",
    role: "DIGITAL EXPERIENCES",
  },
  {
    name: "Interaction Design",
    role: "MOTION & INTERACTION",
  },
  {
    name: "Software Engineering",
    role: "CREATIVE TECHNOLOGY",
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
          Im a Brazil-based creative professional working at the intersection of
          photography, digital design, and visual storytelling.
        </p>

        <p>
          With a background in software engineering, interaction design, and
          luxury digital experiences, I bring a unique perspective to visual
          composition, attention to detail, and creative expression.
        </p>

        <p>
          My work explores the interplay of light, form, and emotion—blending
          artistic sensitivity with technical expertise to craft visual
          narratives that resonate.
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
