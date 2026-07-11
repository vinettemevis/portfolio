import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Recognizable city skylines as engraved SVG line-art, anchored to the
 * bottom of each section. Base line-work in ink at low opacity; one or
 * two signature landmarks per city picked out in accent.
 * Elements tagged `skyline-secondary` are hidden on small screens.
 */

export type City = "bangalore" | "tokyo" | "newyork" | "london" | "singapore";

const BASE = {
  stroke: "hsl(var(--ink))",
  strokeOpacity: 0.18,
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
} as const;

const LANDMARK = {
  stroke: "hsl(var(--accent))",
  strokeOpacity: 0.5,
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
} as const;

const SUN = {
  stroke: "hsl(var(--gold))",
  strokeOpacity: 0.55,
  strokeWidth: 1.7,
  strokeLinecap: "round",
  fill: "none",
} as const;

const DEPTH = {
  stroke: "hsl(var(--ink))",
  strokeOpacity: 0.1,
  strokeWidth: 1.15,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "hsl(var(--ink) / 0.018)",
} as const;

/** A quiet second row of buildings makes the skyline read as a city rather
 * than a collection of landmarks. Fine hatching is allowed to fall away on
 * narrow screens, while the larger silhouettes remain. */
function CityDepth({ city }: { city: City }) {
  const silhouettes: Record<City, string> = {
    bangalore:
      "M12 222V190H58V222 M68 222V176H104V222 M350 222V186H394V222 M790 222V174H830V222 M904 222V190H930V222 M1098 222V184H1184V222",
    tokyo:
      "M8 222V184H66V222 M78 222V164H118V222 M242 222V190H270V222 M612 222V178H682V222 M772 222V188H838V222 M1160 222V180H1192V222",
    newyork:
      "M10 222V178H44V222 M148 222V166H188V222 M198 222V190H244V222 M350 222V180H370V222 M584 222V174H620V222 M700 222V188H726V222 M794 222V178H814V222",
    london:
      "M8 222V184H72V222 M86 222V172H138V222 M146 222V194H168V222 M376 222V188H394V222 M764 222V192H776V222 M974 222V176H1014V222 M1134 222V190H1192V222",
    singapore:
      "M8 222V180H56V222 M68 222V190H102V222 M282 222V176H322V222 M432 222V188H470V222 M830 222V178H852V222 M918 222V192H944V222 M1170 222V174H1192V222",
  };
  const streetDetails: Record<City, { structure: string; texture: string }> = {
    bangalore: {
      structure: "M72 222v-30m-12 0q12-24 24 0q-12 9-24 0 M366 222v-26m-11 0q11-20 22 0q-11 8-22 0 M1082 222v-34m-14 0q14-24 28 0q-14 9-28 0",
      texture: "M142 158h26m-26 10h26m72-32h28m-28 10h28m586-30h32m-32 10h32m98 28h34m-34 10h34",
    },
    tokyo: {
      structure: "M64 222v-66m-12 14h24m-18-14h12m-6 0v-16m-36 36h72 M782 222v-58m-11 12h22m-16-12h12m-6 0v-14m-30 34h60",
      texture: "M288 182h36m-36 10h36m70-32h-36m36 10h-36m348 2h44m-44 10h44m382-14h42m-42 10h42",
    },
    newyork: {
      structure: "M174 166v-14h24v14m-20-14v-9h16v9 M590 174v-20h28v20m-22-20v-9h16v9 M716 188l-14 10m14-2-14 10m14-2-14 10",
      texture: "M154 178h24m-24 10h24m30-12h24m-24 10h24m160-24h22m-22 10h22m198 14h22m-22 10h22",
    },
    london: {
      structure: "M44 184v-18h8v18m30-12v-20h8v20m274 16v-17h8v17 M796 222v-38m-8 0h16m-8 0v-16m-5 0h10",
      texture: "M18 196h46m28-12h34m350-4h64m18 0h64m18 0h54m184 14h36m-36 10h36",
    },
    singapore: {
      structure: "M72 222v-44m0 7-18-18m18 12 20-20m-20 12-4-24m4 30 9-27 M928 222v-40m0 7-16-16m16 10 18-18m-18 11-3-22",
      texture: "M292 186h22m-22 10h22m130-8h20m-20 10h20m390-10h18m-18 10h18m260-12h30m-30 10h30",
    },
  };

  return (
    <g {...DEPTH}>
      <path d={silhouettes[city]} />
      <path
        className="skyline-fine"
        d="M18 208H48 M78 192H96 M358 202H386 M798 190H822 M914 204H924 M1110 198H1174"
      />
      <path
        className="skyline-fine skyline-hatching"
        d="M22 214l8-8m6 8 8-8m42 6 7-7m274 15 8-8m431 6 7-7m306 12 8-8m10 8 8-8"
      />
      <path d={streetDetails[city].structure} fill="none" />
      <path className="skyline-fine" d={streetDetails[city].texture} fill="none" />
      <path
        className="skyline-atmosphere"
        d="M42 118q18-14 36 0q16-11 32 0 M742 74q19-15 38 0q17-12 34 0 M1060 132q16-12 32 0q14-10 28 0"
        fill="none"
      />
    </g>
  );
}

function CityMarginalia({ city }: { city: City }) {
  const data: Record<
    City,
    { code: string; coordinates: string; route: string; contour: string }
  > = {
    bangalore: {
      code: "BLR · GARDEN CITY",
      coordinates: "12.9716° N  ·  77.5946° E",
      route: "M74 202 Q238 74 420 164 T782 126 T1128 194",
      contour: "M-20 420 Q160 350 332 416 T676 402 T1034 416 T1240 372",
    },
    tokyo: {
      code: "TYO · KANTŌ",
      coordinates: "35.6762° N  ·  139.6503° E",
      route: "M62 174 Q244 286 430 132 T790 166 T1140 104",
      contour: "M-10 390 Q184 458 354 396 T704 410 T1030 382 T1220 420",
    },
    newyork: {
      code: "NYC · FIVE BOROUGHS",
      coordinates: "40.7128° N  ·  74.0060° W",
      route: "M58 128 C252 252 356 62 554 166 S892 246 1140 116",
      contour: "M-30 404 Q136 356 306 414 T654 390 T1000 422 T1230 376",
    },
    london: {
      code: "LON · THAMES",
      coordinates: "51.5072° N  ·  0.1276° W",
      route: "M54 186 Q218 92 384 172 T716 150 T1148 182",
      contour: "M-20 392 Q142 452 314 396 T646 414 T974 388 T1220 430",
    },
    singapore: {
      code: "SIN · MARINA BAY",
      coordinates: "1.3521° N  ·  103.8198° E",
      route: "M62 148 Q246 244 414 126 T758 164 T1138 92",
      contour: "M-20 414 Q164 362 336 420 T682 394 T1022 416 T1220 382",
    },
  };
  const detail = data[city];

  return (
    <svg
      className="skyline-marginalia absolute inset-0 h-full w-full"
      viewBox="0 0 1200 640"
      preserveAspectRatio="none"
      fill="none"
    >
      <g className="skyline-marginalia-lines" stroke="currentColor">
        <path d={detail.route} strokeDasharray="3 10" />
        <path d={detail.contour} />
        <path d="M26 82H132 M26 82V188 M1174 452H1068 M1174 452V558" />
        <circle cx="92" cy="146" r="38" />
        <circle cx="92" cy="146" r="27" strokeDasharray="2 6" />
        <path d="M92 96V196 M42 146H142 M92 108l7 31 31 7-31 7-7 31-7-31-31-7 31-7z" />
        <path className="skyline-fine" d="M194 74v20m40-20v12m40-12v20m40-20v12m40-12v20m40-20v12 M844 548v18m42-18v10m42-10v18m42-18v10m42-10v18" />
        <path className="skyline-fine" d="M1008 176q22-18 44 0q20-14 40 0 M196 492q18-14 36 0q16-11 32 0" />
      </g>
      <g className="skyline-marginalia-type" fill="currentColor">
        <text x="156" y="91">{detail.code}</text>
        <text x="930" y="542">{detail.coordinates}</text>
        <text className="skyline-fine" x="54" y="221">N · 00°</text>
        <text className="skyline-fine" x="1038" y="205">FIELD NOTE / 01</text>
      </g>
    </svg>
  );
}

/* ── Bangalore: Vidhana Soudha, UB City tower, glass blocks ────── */

function Bangalore({ dawn }: { dawn?: boolean }) {
  return (
    <>
      {dawn && (
        <g {...SUN}>
          <circle cx={1052} cy={92} r={26} />
          <path className="skyline-secondary" d="M1026 84 H1078 M1018 100 H1086" />
        </g>
      )}
      <g {...BASE}>
        <path d="M0 222 H1200" />
        {/* glass blocks, west */}
        <path d="M120 222 V150 H180 V222" />
        <path className="skyline-secondary" d="M132 168 H168 M132 186 H168 M132 204 H168" />
        <path d="M205 222 V126 H258 V222" />
        <path className="skyline-secondary" d="M231 126 V222 M205 156 H258 M205 188 H258" />
        <path className="skyline-secondary" d="M285 222 V164 H336 V222 M285 186 H336" />
        {/* Vidhana Soudha — plinth, colonnade, portico */}
        <path d="M430 222 V198 H770 V222" />
        <path d="M452 198 V152 H748 V198" />
        <path
          className="skyline-secondary"
          d="M474 198 V158 M498 198 V158 M522 198 V158 M546 198 V158 M654 198 V158 M678 198 V158 M702 198 V158 M726 198 V158"
        />
        <path d="M558 198 V130 H642 V198 M552 152 H648" />
        <path className="skyline-secondary" d="M540 210 H660" />
        <path d="M462 152 Q474 138 486 152 M714 152 Q726 138 738 152" />
        {/* UB City shaft */}
        <path d="M845 222 V106 H895 V222" />
        <path className="skyline-secondary" d="M861 106 V222 M879 106 V222" />
        {/* glass blocks, east */}
        <path d="M940 222 V144 H1000 V222" />
        <path className="skyline-secondary" d="M952 166 H988 M952 188 H988" />
        <path className="skyline-secondary" d="M1030 222 V172 H1088 V222" />
        <path className="skyline-secondary" d="M1110 222 V158 H1162 V222 M1122 180 H1150" />
      </g>
      <g {...LANDMARK}>
        {/* Vidhana Soudha dome */}
        <path d="M580 130 V114 H620 V130 M574 114 H626 M574 114 Q600 78 626 114 M600 78 V66" />
        <circle cx={600} cy={63} r={2.5} />
        {/* UB City crown */}
        <path d="M852 106 V94 H888 V106 M861 94 V84 H879 V94 M870 84 V66" />
      </g>
    </>
  );
}

/* ── Tokyo: Tokyo Tower, Skytree, torii gate ───────────────────── */

function Tokyo() {
  return (
    <>
      <g {...BASE}>
        <path d="M0 222 H1200" />
        <path d="M280 222 V172 H332 V222" />
        <path className="skyline-secondary" d="M292 192 H320" />
        <path d="M350 222 V150 H402 V222" />
        <path className="skyline-secondary" d="M362 172 H390 M362 194 H390" />
        <path d="M700 222 V162 H758 V222" />
        <path className="skyline-secondary" d="M712 184 H746" />
        {/* Skytree */}
        <path d="M878 222 L893 86 M922 222 L907 86 M900 86 V30" />
        <path d="M880 132 H920 M886 98 H914" />
        <path className="skyline-secondary" d="M883 180 H917" />
        <path className="skyline-secondary" d="M1000 222 V178 H1056 V222" />
        <path d="M1090 222 V158 H1148 V222" />
        <path className="skyline-secondary" d="M1102 182 H1136" />
      </g>
      <g {...LANDMARK}>
        {/* Torii gate */}
        <path d="M138 222 L144 166 M212 222 L206 166 M118 158 Q175 146 232 158 M134 176 H216" />
        {/* Tokyo Tower lattice */}
        <path d="M455 222 L520 64 M585 222 L520 64 M520 64 V38" />
        <path d="M468 192 H572 M483 156 H557 M497 122 H543" />
        <path d="M486 152 H554 V140 H486 Z M506 102 H534 V93 H506 Z" />
        <path className="skyline-secondary" d="M468 192 L557 156 M572 192 L483 156" />
      </g>
    </>
  );
}

/* ── New York: Empire State, Chrysler, One WTC, Brooklyn Bridge,
      Statue of Liberty ──────────────────────────────────────────── */

function NewYork() {
  return (
    <>
      <g {...BASE}>
        <path d="M0 222 H1200" />
        {/* Statue of Liberty */}
        <path d="M88 222 V196 H132 V222 M84 196 H136" />
        <path d="M102 196 L106 152 M118 196 L114 152 M106 152 Q110 148 114 152" />
        <circle cx={110} cy={142} r={5} />
        <path d="M104 136 L100 129 M110 135 V127 M116 136 L120 129" />
        {/* One WTC */}
        <path d="M262 222 L286 74 M338 222 L314 74 M286 74 H314 M300 74 V32" />
        <path className="skyline-secondary" d="M262 222 L314 74 M338 222 L286 74" />
        <path d="M380 222 V152 H428 V222" />
        <path className="skyline-secondary" d="M392 176 H416 M392 198 H416" />
        {/* Empire State — setback massing */}
        <path d="M470 222 V188 H570 V222 M484 188 V130 H556 V188 M500 130 V88 H540 V130" />
        <path className="skyline-secondary" d="M502 188 V136 M520 188 V136 M538 188 V136" />
        {/* Chrysler shaft */}
        <path d="M635 222 V122 H685 V222" />
        <path className="skyline-secondary" d="M647 140 V222 M673 140 V222" />
        <path className="skyline-secondary" d="M740 222 V168 H788 V222" />
        {/* Brooklyn Bridge */}
        <path d="M820 208 H1192" />
        <path d="M885 222 V140 H915 V222 M892 208 V186 Q900 172 908 186 V208" />
        <path d="M1078 222 V140 H1108 V222 M1085 208 V186 Q1093 172 1101 186 V208" />
        <path d="M820 206 Q852 160 900 142 M900 142 Q996 200 1093 142 M1093 142 Q1140 160 1192 206" />
        <path
          className="skyline-secondary"
          d="M930 160 V208 M960 178 V208 M996 186 V208 M1032 178 V208 M1062 160 V208"
        />
      </g>
      <g {...LANDMARK}>
        {/* Liberty's torch */}
        <path d="M114 150 L129 122" />
        {/* Empire State crown + spire */}
        <path d="M510 88 V76 H530 V88 M516 76 V68 H524 V76 M520 68 V40" />
        <circle cx={520} cy={38} r={2} />
        {/* Chrysler crown arcs + spire */}
        <path d="M635 122 Q660 106 685 122 M643 110 Q660 96 677 110 M650 99 Q660 89 670 99 M660 89 V58" />
      </g>
      <g {...SUN}>
        <circle cx={131} cy={117} r={3.5} />
      </g>
    </>
  );
}

/* ── London: Big Ben, Parliament, London Eye, Shard, St Paul's ─── */

function London() {
  return (
    <>
      <g {...BASE}>
        <path d="M0 222 H1200" />
        {/* London Eye */}
        <circle cx={240} cy={134} r={66} />
        <circle cx={240} cy={134} r={6} />
        <path d="M206 222 L240 140 M274 222 L240 140" />
        <path
          className="skyline-secondary"
          d="M240 134 L306 134 M240 134 L297 167 M240 134 L273 191 M240 134 L240 200 M240 134 L207 191 M240 134 L183 167 M240 134 L174 134 M240 134 L183 101 M240 134 L207 77 M240 134 L240 68 M240 134 L273 77 M240 134 L297 101"
        />
        <path className="skyline-secondary" d="M320 222 V176 H368 V222" />
        {/* Big Ben tower body */}
        <path d="M400 222 V104 H440 V222 M400 148 H440" />
        {/* Houses of Parliament */}
        <path d="M462 222 V170 H688 V222" />
        <path
          className="skyline-secondary"
          d="M478 170 V158 M500 170 V158 M522 170 V158 M544 170 V158 M588 170 V158 M610 170 V158 M632 170 V158 M654 170 V158"
        />
        <path d="M556 170 V144 L566 130 L576 144 V170" />
        <path className="skyline-secondary" d="M462 200 H688" />
        {/* Victoria Tower */}
        <path d="M700 222 V120 H752 V222 M700 120 L726 98 L752 120 M700 120 V106 M752 120 V106" />
        <path className="skyline-secondary" d="M780 222 V180 H826 V222" />
        {/* St Paul's */}
        <path d="M850 222 V184 H952 V222 M868 184 V162 M934 184 V162 M868 162 H934" />
        <path d="M868 162 Q901 114 934 162" />
        <path className="skyline-secondary" d="M838 184 V154 H856 V184 M838 154 Q847 144 856 154" />
        <path className="skyline-secondary" d="M946 184 V154 H964 V184 M946 154 Q955 144 964 154" />
        <path className="skyline-secondary" d="M1148 222 V186 H1196 V222" />
      </g>
      <g {...LANDMARK}>
        {/* Big Ben clock + roof */}
        <circle cx={420} cy={126} r={13} />
        <path d="M420 126 V117 M420 126 L427 124" />
        <path d="M400 104 L420 74 L440 104 M420 74 V58" />
        <circle cx={420} cy={56} r={2} />
        {/* The Shard */}
        <path d="M1032 222 L1080 44 L1128 222 M1056 222 L1080 44 M1104 222 L1080 44" />
      </g>
      <g {...SUN}>
        {/* St Paul's lantern */}
        <path d="M895 127 V114 H907 V127 M901 114 V104" />
        <circle cx={901} cy={102} r={2} />
      </g>
    </>
  );
}

/* ── Singapore: Marina Bay Sands, Supertrees, Singapore Flyer ──── */

function Singapore({ sunrise }: { sunrise?: boolean }) {
  return (
    <>
      {sunrise && (
        <g {...SUN}>
          <circle cx={1120} cy={80} r={28} />
          <path
            className="skyline-secondary"
            d="M1120 40 V28 M1080 52 L1072 44 M1160 52 L1168 44 M1076 80 H1062 M1164 80 H1178"
          />
        </g>
      )}
      <g {...BASE}>
        <path d="M0 222 H1200" />
        {/* Supertree Grove */}
        <path d="M126 222 V152 M134 222 V152 M130 152 L104 122 M130 152 L116 114 M130 152 L130 110 M130 152 L144 114 M130 152 L156 122 M104 122 Q130 104 156 122" />
        <path
          className="skyline-secondary"
          d="M244 222 V160 M252 222 V160 M248 160 L226 134 M248 160 L237 128 M248 160 L248 124 M248 160 L259 128 M248 160 L270 134 M226 134 Q248 118 270 134"
        />
        {/* ArtScience Museum petals */}
        <path
          className="skyline-secondary"
          d="M380 214 Q348 194 342 170 M380 214 Q366 188 364 164 M380 214 V162 M380 214 Q394 188 396 164 M380 214 Q412 194 418 170"
        />
        {/* Marina Bay Sands — three slanted towers */}
        <path d="M500 222 L514 120 M552 222 L546 120 M514 120 H546" />
        <path d="M600 222 L614 120 M652 222 L646 120 M614 120 H646" />
        <path d="M700 222 L714 120 M752 222 L746 120 M714 120 H746" />
        <path className="skyline-secondary" d="M506 180 H549 M606 180 H649 M706 180 H749" />
        <path className="skyline-secondary" d="M860 222 V170 H906 V222" />
        {/* Singapore Flyer */}
        <circle cx={1010} cy={148} r={56} />
        <circle cx={1010} cy={148} r={5} />
        <path d="M976 222 L1010 154 M1044 222 L1010 154" />
        <path
          className="skyline-secondary"
          d="M1010 148 L1066 148 M1010 148 L1049.6 108.4 M1010 148 L1010 92 M1010 148 L970.4 108.4 M1010 148 L954 148 M1010 148 L970.4 187.6 M1010 148 L1010 204 M1010 148 L1049.6 187.6"
        />
        <path className="skyline-secondary" d="M1110 222 V180 H1156 V222" />
      </g>
      <g {...LANDMARK}>
        {/* Supertree, tallest */}
        <path d="M188 222 V136 M196 222 V136 M192 136 L164 102 M192 136 L177 92 M192 136 L192 88 M192 136 L207 92 M192 136 L220 102 M164 102 Q192 82 220 102" />
        {/* SkyPark boat deck spanning the towers */}
        <path d="M478 114 Q640 90 806 98 L820 92 L824 104 Q650 106 482 126 Z" />
      </g>
    </>
  );
}

/* ── Wrapper with slow-drift parallax ──────────────────────────── */

const CITIES: Record<City, (variant?: string) => ReactNode> = {
  bangalore: (v) => <Bangalore dawn={v === "dawn"} />,
  tokyo: () => <Tokyo />,
  newyork: () => <NewYork />,
  london: () => <London />,
  singapore: (v) => <Singapore sunrise={v === "sunrise"} />,
};

export default function Skyline({
  city,
  variant,
  light,
  className,
}: {
  city: City;
  variant?: "dawn" | "sunrise";
  light?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [26, -18]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        light && "opacity-60",
        className,
      )}
    >
      <CityMarginalia city={city} />
      <motion.div className="absolute inset-x-0 bottom-0" style={reduce ? undefined : { y }}>
        <svg
          className="skyline block w-full"
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          fill="none"
        >
          <CityDepth city={city} />
          {CITIES[city](variant)}
        </svg>
      </motion.div>
    </div>
  );
}
