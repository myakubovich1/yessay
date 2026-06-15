"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Beat = "stuck" | "review" | "submitted";

const BEAT_MS: Record<Beat, number> = {
  stuck: 3200,
  review: 3600,
  submitted: 4400,
};

const NEXT: Record<Beat, Beat> = {
  stuck: "review",
  review: "submitted",
  submitted: "stuck",
};

const CAPTIONS: Record<Beat, string> = {
  stuck: "A draft full of questions",
  review: "Yessay finds what matters",
  submitted: "Revised and ready to submit",
};

const INK = "#171912";
const LIME = "#c8f85a";
const PAPER = "#fffdf8";
const CREAM = "#f6f1e8";
const ORANGE = "#ff8b5e";
const LAVENDER = "#cfc3ff";
const MUTED = "#7b7f73";

const soft = {
  duration: 0.65,
  ease: [0.32, 0.72, 0, 1] as const,
};

const spring = {
  type: "spring" as const,
  stiffness: 250,
  damping: 20,
};

export function RevisionAnimation() {
  const reducedMotion = useReducedMotion() ?? false;
  const [beat, setBeat] = useState<Beat>(
    reducedMotion ? "submitted" : "stuck",
  );

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setTimeout(
      () => setBeat(NEXT[beat]),
      BEAT_MS[beat],
    );
    return () => window.clearTimeout(timer);
  }, [beat, reducedMotion]);

  const is = (...beats: Beat[]) => beats.includes(beat);

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 py-7"
      data-animation="revision"
      role="img"
      aria-label="A student moves from struggling with a rough draft to reviewing clear Yessay feedback and confidently submitting the revised essay."
    >
      <svg
        viewBox="0 0 420 370"
        className="w-full max-w-[390px]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="revision-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={LIME} stopOpacity="0.5" />
            <stop offset="100%" stopColor={LIME} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="revision-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#25291f" />
            <stop offset="100%" stopColor={INK} />
          </linearGradient>
        </defs>

        <rect
          x="15"
          y="14"
          width="390"
          height="330"
          rx="34"
          fill={CREAM}
          stroke={INK}
          strokeWidth="2"
        />
        <path
          d="M49 48 H371"
          stroke={INK}
          strokeOpacity="0.08"
          strokeWidth="2"
        />
        <circle cx="48" cy="32" r="4" fill={ORANGE} />
        <circle cx="62" cy="32" r="4" fill={LAVENDER} />
        <circle cx="76" cy="32" r="4" fill={LIME} />

        <motion.ellipse
          cx="250"
          cy="165"
          rx="145"
          ry="125"
          fill="url(#revision-glow)"
          initial={false}
          animate={{
            opacity: is("review", "submitted") ? 1 : 0.12,
            scale: is("review") ? [0.82, 1.08, 0.94] : 0.94,
          }}
          transition={
            is("review")
              ? { duration: 2.7, repeat: Infinity, ease: "easeInOut" }
              : soft
          }
          style={{ transformOrigin: "250px 165px" }}
        />

        <DeadlineChip active={is("stuck")} />

        <motion.g
          initial={false}
          animate={{
            x: is("stuck") ? -3 : 0,
            y: is("stuck") ? 7 : is("submitted") ? -3 : 0,
          }}
          transition={soft}
        >
          <Student beat={beat} />
        </motion.g>

        <Desk />

        <motion.g
          initial={false}
          animate={{ y: is("review") ? [0, -3, 0] : 0 }}
          transition={
            is("review")
              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              : soft
          }
        >
          <Laptop beat={beat} reducedMotion={reducedMotion} />
        </motion.g>

        <motion.g
          initial={false}
          animate={{
            opacity: is("stuck") ? 1 : 0,
            x: is("stuck") ? 0 : -8,
            y: is("stuck") ? 0 : 6,
          }}
          transition={soft}
        >
          <MessyPaper x={48} y={243} rotate={-7} />
          <MessyPaper x={101} y={252} rotate={5} />
          <IssueBubble x={63} y={102} label="?" color={ORANGE} delay={0} />
          <IssueBubble x={332} y={94} label="!" color={LAVENDER} delay={0.35} />
        </motion.g>

        <motion.g
          initial={false}
          animate={{
            opacity: is("submitted") ? 1 : 0,
            scale: is("submitted") ? 1 : 0.7,
          }}
          transition={is("submitted") ? { delay: 0.35, ...spring } : soft}
          style={{ transformOrigin: "336px 76px" }}
        >
          <rect
            x="299"
            y="54"
            width="87"
            height="45"
            rx="14"
            fill={PAPER}
            stroke={INK}
            strokeWidth="2"
          />
          <circle
            cx="320"
            cy="76"
            r="11"
            fill={LIME}
            stroke={INK}
            strokeWidth="2"
          />
          <path
            d="M314 76 l4 4 l8 -9"
            fill="none"
            stroke={INK}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          <text
            x="337"
            y="73"
            fill={INK}
            fontFamily="inherit"
            fontSize="8"
            fontWeight="900"
          >
            ESSAY
          </text>
          <text
            x="337"
            y="84"
            fill={MUTED}
            fontFamily="inherit"
            fontSize="7"
            fontWeight="750"
          >
            SUBMITTED
          </text>
        </motion.g>

        {[
          { x: 285, y: 66, delay: 0.55, color: ORANGE },
          { x: 390, y: 125, delay: 0.72, color: LAVENDER },
          { x: 364, y: 226, delay: 0.9, color: LIME },
        ].map((sparkle) => (
          <motion.path
            key={`${sparkle.x}-${sparkle.y}`}
            d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
            fill={sparkle.color}
            stroke={INK}
            strokeWidth="1.2"
            initial={false}
            animate={
              is("submitted")
                ? {
                    scale: [0, 1, 0.86],
                    rotate: [0, 90, 125],
                    opacity: [0, 1, 0.72],
                  }
                : { scale: 0, opacity: 0 }
            }
            transition={{
              delay: sparkle.delay,
              duration: 1.15,
              ease: "easeOut",
            }}
            style={{ x: sparkle.x, y: sparkle.y }}
          />
        ))}
      </svg>

      <div className="flex flex-col items-center gap-2.5">
        <div className="relative h-4 w-72">
          {(Object.keys(CAPTIONS) as Beat[]).map((captionBeat) => (
            <motion.p
              key={captionBeat}
              initial={false}
              animate={{
                opacity: beat === captionBeat ? 1 : 0,
                y: beat === captionBeat ? 0 : 5,
              }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 text-center text-[10px] font-black uppercase tracking-[0.24em] text-[#6c7065]"
            >
              {CAPTIONS[captionBeat]}
            </motion.p>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(Object.keys(CAPTIONS) as Beat[]).map((dotBeat) => (
            <motion.span
              key={dotBeat}
              initial={false}
              animate={{
                width: beat === dotBeat ? 22 : 6,
                backgroundColor:
                  beat === dotBeat ? INK : "rgba(23, 25, 18, 0.18)",
              }}
              transition={soft}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Student({ beat }: { beat: Beat }) {
  const submitted = beat === "submitted";
  const stuck = beat === "stuck";

  return (
    <g>
      <path
        d="M72 274 C73 232 89 206 121 200 C154 205 169 234 170 274 Z"
        fill={LAVENDER}
        stroke={INK}
        strokeWidth="3"
      />
      <path
        d="M95 206 C102 192 139 191 148 207 L143 223 H99 Z"
        fill={ORANGE}
        stroke={INK}
        strokeWidth="3"
      />
      <motion.g
        initial={false}
        animate={{
          rotate: stuck ? 9 : submitted ? -3 : 0,
          y: stuck ? 8 : 0,
        }}
        transition={soft}
        style={{ transformOrigin: "122px 163px" }}
      >
        <ellipse
          cx="122"
          cy="164"
          rx="39"
          ry="43"
          fill={ORANGE}
          stroke={INK}
          strokeWidth="3"
        />
        <path
          d="M83 160 C80 122 103 109 132 116 C155 121 165 142 158 168 C151 147 143 139 126 135 C108 143 98 146 83 160 Z"
          fill={INK}
        />
        <path
          d="M91 136 C103 115 131 109 151 128"
          fill="none"
          stroke={INK}
          strokeLinecap="round"
          strokeWidth="7"
        />
        <motion.g
          initial={false}
          animate={{ opacity: stuck ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path
            d="M103 166 l8 -2"
            stroke={INK}
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M133 163 l8 2"
            stroke={INK}
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M116 186 q8 -7 16 0"
            fill="none"
            stroke={INK}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </motion.g>
        <motion.g
          initial={false}
          animate={{ opacity: stuck ? 0 : 1 }}
          transition={{ delay: 0.12, duration: 0.28 }}
        >
          <circle cx="108" cy="164" r="2.8" fill={INK} />
          <circle cx="137" cy="164" r="2.8" fill={INK} />
          <motion.path
            d={
              submitted
                ? "M113 181 q10 12 21 0"
                : "M116 183 q8 3 16 0"
            }
            fill="none"
            stroke={INK}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </motion.g>
      </motion.g>

      <motion.path
        d={stuck ? "M99 221 Q76 232 92 255" : "M99 221 Q90 241 109 257"}
        fill="none"
        stroke={INK}
        strokeLinecap="round"
        strokeWidth="14"
        transition={soft}
      />
      <motion.path
        d={
          stuck
            ? "M145 222 Q162 236 156 258"
            : submitted
              ? "M145 222 Q166 204 178 183"
              : "M145 222 Q158 239 151 258"
        }
        fill="none"
        stroke={INK}
        strokeLinecap="round"
        strokeWidth="14"
        transition={soft}
      />
      <motion.circle
        cx={submitted ? 178 : stuck ? 156 : 151}
        cy={submitted ? 183 : 258}
        r="8"
        fill={ORANGE}
        stroke={INK}
        strokeWidth="2"
        transition={soft}
      />
    </g>
  );
}

function Desk() {
  return (
    <g>
      <rect x="42" y="270" width="336" height="22" rx="11" fill={INK} />
      <rect x="60" y="290" width="18" height="47" rx="8" fill={INK} />
      <rect x="342" y="290" width="18" height="47" rx="8" fill={INK} />
    </g>
  );
}

function Laptop({
  beat,
  reducedMotion,
}: {
  beat: Beat;
  reducedMotion: boolean;
}) {
  const reviewing = beat === "review";
  const submitted = beat === "submitted";

  return (
    <g>
      <rect
        x="171"
        y="115"
        width="170"
        height="145"
        rx="16"
        fill={INK}
      />
      <rect
        x="178"
        y="122"
        width="156"
        height="131"
        rx="11"
        fill="url(#revision-screen)"
        stroke={PAPER}
        strokeOpacity="0.12"
      />
      <circle cx="256" cy="118" r="2" fill={PAPER} fillOpacity="0.45" />
      <path
        d="M154 260 H357 L373 275 H142 Z"
        fill={PAPER}
        stroke={INK}
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <rect x="229" y="263" width="55" height="5" rx="2.5" fill={INK} />

      <motion.g
        initial={false}
        animate={{ opacity: beat === "stuck" ? 1 : 0 }}
        transition={soft}
      >
        <rect
          x="196"
          y="144"
          width="104"
          height="8"
          rx="4"
          fill={PAPER}
          fillOpacity="0.34"
        />
        <rect
          x="196"
          y="165"
          width="120"
          height="7"
          rx="3.5"
          fill={PAPER}
          fillOpacity="0.12"
        />
        <rect
          x="196"
          y="183"
          width="92"
          height="7"
          rx="3.5"
          fill={PAPER}
          fillOpacity="0.12"
        />
        <rect
          x="196"
          y="201"
          width="111"
          height="7"
          rx="3.5"
          fill={ORANGE}
          fillOpacity="0.72"
        />
        <path
          d="M201 224 h42"
          stroke={PAPER}
          strokeLinecap="round"
          strokeOpacity="0.2"
          strokeWidth="7"
        />
      </motion.g>

      <motion.g
        initial={false}
        animate={{
          opacity: reviewing ? 1 : 0,
          scale: reviewing ? 1 : 0.94,
        }}
        transition={soft}
        style={{ transformOrigin: "256px 184px" }}
      >
        <rect
          x="192"
          y="138"
          width="128"
          height="98"
          rx="13"
          fill={PAPER}
        />
        <rect
          x="203"
          y="149"
          width="30"
          height="30"
          rx="9"
          fill={LIME}
          stroke={INK}
          strokeWidth="2"
        />
        <path
          d="M212 157 h10 v13 h-10 z M215 160 l4 4 l-4 4"
          fill="none"
          stroke={INK}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <rect x="242" y="153" width="60" height="7" rx="3.5" fill={INK} />
        {[180, 199, 218].map((y, index) => (
          <g key={y}>
            <circle
              cx="208"
              cy={y}
              r="6"
              fill={index === 1 ? ORANGE : LAVENDER}
              stroke={INK}
              strokeWidth="1.5"
            />
            <rect
              x="220"
              y={y - 4}
              width={index === 1 ? 72 : 84}
              height="8"
              rx="4"
              fill={INK}
              fillOpacity="0.16"
            />
          </g>
        ))}
        <motion.rect
          x="189"
          y="139"
          width="134"
          height="20"
          rx="8"
          fill={LIME}
          fillOpacity="0.35"
          initial={false}
          animate={{ y: reviewing ? [0, 77, 0] : 0 }}
          transition={
            reviewing && !reducedMotion
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
        />
        <motion.path
          d="M192 149 H320"
          stroke={LIME}
          strokeWidth="3"
          initial={false}
          animate={{ y: reviewing ? [0, 77, 0] : 0 }}
          transition={
            reviewing && !reducedMotion
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
        />
      </motion.g>

      <motion.g
        initial={false}
        animate={{
          opacity: submitted ? 1 : 0,
          scale: submitted ? 1 : 0.92,
        }}
        transition={submitted ? { delay: 0.1, ...spring } : soft}
        style={{ transformOrigin: "256px 184px" }}
      >
        <circle cx="228" cy="177" r="28" fill={PAPER} />
        <circle
          cx="228"
          cy="177"
          r="21"
          fill="none"
          stroke={LIME}
          strokeLinecap="round"
          strokeWidth="6"
          strokeDasharray="132"
          strokeDashoffset="11"
          transform="rotate(-90 228 177)"
        />
        <text
          x="228"
          y="178"
          fill={INK}
          fontFamily="inherit"
          fontSize="15"
          fontWeight="950"
          textAnchor="middle"
          dominantBaseline="central"
        >
          92
        </text>
        <text
          x="271"
          y="166"
          fill={PAPER}
          fontFamily="inherit"
          fontSize="8"
          fontWeight="900"
        >
          READY TO
        </text>
        <text
          x="271"
          y="178"
          fill={LIME}
          fontFamily="inherit"
          fontSize="11"
          fontWeight="950"
        >
          SUBMIT
        </text>
        <rect x="270" y="190" width="45" height="20" rx="10" fill={LIME} />
        <path
          d="M283 200 l4 4 l8 -9"
          fill="none"
          stroke={INK}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      </motion.g>
    </g>
  );
}

function DeadlineChip({ active }: { active: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        x: active ? 0 : -8,
        y: active ? [0, -3, 0] : 5,
      }}
      transition={
        active
          ? { duration: 2.1, repeat: Infinity, ease: "easeInOut" }
          : soft
      }
    >
      <rect
        x="42"
        y="61"
        width="103"
        height="36"
        rx="18"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2"
      />
      <circle cx="62" cy="79" r="10" fill={ORANGE} />
      <path
        d="M62 73 v7 l5 3"
        fill="none"
        stroke={INK}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <text
        x="79"
        y="76"
        fill={INK}
        fontFamily="inherit"
        fontSize="7"
        fontWeight="850"
      >
        DUE SOON
      </text>
      <text
        x="79"
        y="86"
        fill={MUTED}
        fontFamily="inherit"
        fontSize="6.5"
        fontWeight="750"
      >
        5 issues left
      </text>
    </motion.g>
  );
}

function MessyPaper({
  x,
  y,
  rotate,
}: {
  x: number;
  y: number;
  rotate: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect
        x="0"
        y="0"
        width="64"
        height="47"
        rx="8"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2"
      />
      <path
        d="M11 14 q8 -5 16 0 t16 0 M11 25 q7 5 14 0 t16 0 M11 36 h28"
        fill="none"
        stroke={MUTED}
        strokeLinecap="round"
        strokeWidth="3"
      />
    </g>
  );
}

function IssueBubble({
  x,
  y,
  label,
  color,
  delay,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.g
      animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
      transition={{
        delay,
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <circle
        cx={x}
        cy={y}
        r="17"
        fill={color}
        stroke={INK}
        strokeWidth="2"
      />
      <text
        x={x}
        y={y + 1}
        fill={INK}
        fontFamily="inherit"
        fontSize="16"
        fontWeight="950"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </text>
    </motion.g>
  );
}
