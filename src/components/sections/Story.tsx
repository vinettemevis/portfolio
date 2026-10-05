import { Eyebrow, Reveal } from "@/components/motion";

const TRUE_THINGS = [
  "Here by choice, not by force",
  "Obsessed with making everyone's life easier",
  "Learns on the fly - Selenium, Appium, JMeter, now Python API automation",
  "Ask me how cooking oils affect your cycle",
];

export default function Story() {
  return (
    <section id="story" className="relative overflow-hidden py-28 sm:py-36">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>The Long Way Round</Eyebrow>
              <h2 className="max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
                I like the unglamorous half of the job.
              </h2>
            </Reveal>
            <div className="mt-8 max-w-prose space-y-6 text-[1.05rem] leading-relaxed text-ink-soft">
              <Reveal delay={0.08}>
                <p>
                  I look for the task someone still does by hand, at real cost
                  to their time, and I build the software that carries it for
                  them. That instinct moved me from customer support to
                  quality engineering, where I taught myself Selenium, Appium,
                  and Python at night, and then into product, where I get to
                  build the thing itself. Nine years in, it still decides
                  what I choose to work on.
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <p>
                  The work I&rsquo;m proudest of at CallHub is an engine I
                  built for a union that was about to drop a service its
                  members counted on. For seven or eight years, someone
                  rebuilt 104 campaigns a year by hand. Now they set it up
                  once, in about fifteen minutes, and roughly 40,000 home
                  care workers still get the text that reminds them when to
                  file for pay.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p>
                  I own P2P texting, agent quality, and billing. I write the
                  specs, price the features, ship them, and check whether
                  they moved the number; when something doesn&rsquo;t work, I
                  say so and fix it. Most of that work is now AI: a layer
                  that scores real calls and coaches the agent who needs it,
                  and a mock-call trainer that started as a hackathon idea
                  and now rehearses live agents against AI personas. Good
                  software lets a few people do the work of many, and that is
                  the kind of problem I want to keep taking on.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-12">
            <Reveal delay={0.15}>
              <figure className="border-l-2 border-accent pl-6">
                <blockquote className="font-display text-2xl italic leading-[1.2] pb-1 text-ink sm:text-[1.7rem]">
                  &ldquo;I want work I&rsquo;d do anyway: honest products,
                  built with people who are here for the long term.&rdquo;
                </blockquote>
              </figure>
            </Reveal>
            <Reveal delay={0.25}>
              <div>
                <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint">
                  A few true things
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {TRUE_THINGS.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-ink/15 bg-paper-alt px-4 py-2 text-[0.82rem] leading-snug text-ink-soft"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
