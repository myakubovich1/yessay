"use client";

import { motion, useReducedMotion } from "framer-motion";

const INK = "#171912";
const LIME = "#c8f85a";
const LIME_STRONG = "#a8d83d";
const PAPER = "#fffdf8";
const CREAM = "#f6f1e8";
const ORANGE = "#ff8b5e";
const LAVENDER = "#cfc3ff";
const MUTED = "#7b7f73";

const float = {
  duration: 6.8,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const signals = [
  { label: "Prompt match", score: "96", width: 104, color: LIME },
  { label: "Evidence", score: "88", width: 92, color: LAVENDER },
  { label: "Citations", score: "91", width: 98, color: ORANGE },
];

export function RevisionAnimation() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="flex h-full w-full items-center justify-center px-5 py-7"
      data-animation="revision"
      role="img"
      aria-label="An elegant Yessay report scans a draft, resolves its most important issues, and reaches a readiness score of 92."
    >
      <svg
        viewBox="0 0 420 370"
        className="w-full max-w-[410px]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="revision-canvas"
            x1="32"
            y1="24"
            x2="388"
            y2="346"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#292d22" />
            <stop offset="0.56" stopColor={INK} />
            <stop offset="1" stopColor="#11130e" />
          </linearGradient>
          <linearGradient
            id="revision-paper"
            x1="82"
            y1="68"
            x2="345"
            y2="292"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PAPER} />
            <stop offset="1" stopColor="#eee8dd" />
          </linearGradient>
          <linearGradient
            id="revision-scan"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop stopColor={LIME} stopOpacity="0" />
            <stop offset="0.5" stopColor={LIME} stopOpacity="0.28" />
            <stop offset="1" stopColor={LIME} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="revision-aura" cx="50%" cy="50%" r="50%">
            <stop stopColor={LIME} stopOpacity="0.44" />
            <stop offset="1" stopColor={LIME} stopOpacity="0" />
          </radialGradient>
          <pattern
            id="revision-grid"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.1" fill={PAPER} opacity="0.09" />
          </pattern>
          <filter
            id="revision-shadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="16"
              stdDeviation="13"
              floodColor="#070904"
              floodOpacity="0.32"
            />
          </filter>
          <clipPath id="revision-report-clip">
            <rect x="70" y="66" width="280" height="230" rx="22" />
          </clipPath>
        </defs>

        <rect
          x="16"
          y="12"
          width="388"
          height="342"
          rx="38"
          fill="url(#revision-canvas)"
          stroke={INK}
          strokeWidth="2"
        />
        <rect
          x="17"
          y="13"
          width="386"
          height="340"
          rx="37"
          fill="url(#revision-grid)"
        />

        <motion.ellipse
          cx="290"
          cy="112"
          rx="142"
          ry="128"
          fill="url(#revision-aura)"
          animate={
            reducedMotion
              ? { opacity: 0.68 }
              : { opacity: [0.42, 0.78, 0.42], scale: [0.92, 1.06, 0.92] }
          }
          transition={float}
          style={{ transformOrigin: "290px 112px" }}
        />

        <g opacity="0.42">
          <path
            d="M44 102 C75 45 150 23 215 43"
            fill="none"
            stroke={PAPER}
            strokeDasharray="2 9"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M374 251 C343 318 272 344 208 329"
            fill="none"
            stroke={LIME}
            strokeDasharray="2 9"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>

        <BrandMark />

        <motion.g
          animate={
            reducedMotion
              ? { y: 0 }
              : { y: [0, -5, 0], rotate: [-0.35, 0.35, -0.35] }
          }
          transition={float}
          style={{ transformOrigin: "210px 190px" }}
        >
          <g opacity="0.72" transform="rotate(-5 210 184)">
            <rect
              x="76"
              y="68"
              width="280"
              height="230"
              rx="22"
              fill={LAVENDER}
              stroke={INK}
              strokeWidth="2"
            />
          </g>
          <g opacity="0.82" transform="rotate(4 210 184)">
            <rect
              x="70"
              y="72"
              width="280"
              height="230"
              rx="22"
              fill={LIME}
              stroke={INK}
              strokeWidth="2"
            />
          </g>

          <g filter="url(#revision-shadow)">
            <rect
              x="70"
              y="66"
              width="280"
              height="230"
              rx="22"
              fill="url(#revision-paper)"
              stroke={INK}
              strokeWidth="2.2"
            />

            <path
              d="M70 108 H350"
              stroke={INK}
              strokeOpacity="0.12"
              strokeWidth="1.5"
            />
            <rect
              x="88"
              y="80"
              width="24"
              height="24"
              rx="8"
              fill={LIME}
              stroke={INK}
              strokeWidth="1.7"
            />
            <path
              d="M95 86 h7 l4 4 v8 h-11 z M102 86 v5 h4 M98 94 l2 2 l4-5"
              fill="none"
              stroke={INK}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
            <text
              x="122"
              y="90"
              fill={INK}
              fontFamily="inherit"
              fontSize="9"
              fontWeight="900"
              letterSpacing="0.4"
            >
              YESSAY REPORT
            </text>
            <text
              x="122"
              y="101"
              fill={MUTED}
              fontFamily="inherit"
              fontSize="6.5"
              fontWeight="750"
              letterSpacing="1"
            >
              REVISION INTELLIGENCE
            </text>

            <rect
              x="276"
              y="82"
              width="56"
              height="20"
              rx="10"
              fill={INK}
            />
            <motion.circle
              cx="287"
              cy="92"
              r="3"
              fill={LIME}
              animate={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: [0.45, 1, 0.45], scale: [0.85, 1.15, 0.85] }
              }
              transition={{ duration: 2.2, repeat: Infinity }}
              style={{ transformOrigin: "287px 92px" }}
            />
            <text
              x="296"
              y="95"
              fill={PAPER}
              fontFamily="inherit"
              fontSize="6.5"
              fontWeight="900"
              letterSpacing="0.7"
            >
              COMPLETE
            </text>

            <Score reducedMotion={reducedMotion} />

            <g>
              <text
                x="192"
                y="132"
                fill={MUTED}
                fontFamily="inherit"
                fontSize="7"
                fontWeight="850"
                letterSpacing="1.1"
              >
                REPORT SIGNALS
              </text>
              {signals.map((signal, index) => (
                <Signal
                  key={signal.label}
                  {...signal}
                  index={index}
                  reducedMotion={reducedMotion}
                />
              ))}
            </g>

            <path
              d="M88 240 H332"
              stroke={INK}
              strokeOpacity="0.1"
              strokeWidth="1.5"
            />
            <rect x="88" y="253" width="18" height="18" rx="6" fill={INK} />
            <path
              d="M97 257 l1.6 4.2 l4.4 1.8 l-4.4 1.8 l-1.6 4.2 l-1.6-4.2 l-4.4-1.8 l4.4-1.8 z"
              fill={LIME}
            />
            <text
              x="114"
              y="261"
              fill={INK}
              fontFamily="inherit"
              fontSize="7.5"
              fontWeight="900"
            >
              3 PRIORITY FIXES RESOLVED
            </text>
            <text
              x="114"
              y="271"
              fill={MUTED}
              fontFamily="inherit"
              fontSize="6.3"
              fontWeight="700"
            >
              Clearer argument · stronger evidence
            </text>

            <g clipPath="url(#revision-report-clip)">
              <motion.rect
                x="68"
                y="68"
                width="284"
                height="52"
                fill="url(#revision-scan)"
                animate={
                  reducedMotion
                    ? { y: 174, opacity: 0 }
                    : {
                        y: [0, 174, 174],
                        opacity: [0, 1, 0],
                      }
                }
                transition={{
                  duration: 5.8,
                  times: [0, 0.55, 0.72],
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: "easeInOut",
                }}
              />
              <motion.path
                d="M76 94 H344"
                stroke={LIME}
                strokeWidth="2"
                animate={
                  reducedMotion
                    ? { y: 174, opacity: 0 }
                    : {
                        y: [0, 174, 174],
                        opacity: [0, 0.9, 0],
                      }
                }
                transition={{
                  duration: 5.8,
                  times: [0, 0.55, 0.72],
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: "easeInOut",
                }}
              />
            </g>
          </g>
        </motion.g>

        <CompletionBadge reducedMotion={reducedMotion} />

        <motion.g
          animate={
            reducedMotion
              ? { rotate: 0 }
              : { rotate: [0, 90, 180, 270, 360] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "365px 62px" }}
        >
          <path
            d="M365 50 L368 59 L377 62 L368 65 L365 74 L362 65 L353 62 L362 59 Z"
            fill={ORANGE}
            stroke={INK}
            strokeWidth="1.4"
          />
        </motion.g>
      </svg>
    </div>
  );
}

function BrandMark() {
  return (
    <g>
      <circle cx="48" cy="49" r="5" fill={LIME} />
      <text
        x="61"
        y="53"
        fill={PAPER}
        fontFamily="inherit"
        fontSize="8"
        fontWeight="900"
        letterSpacing="1.6"
      >
        YESSAY
      </text>
      <path
        d="M326 49 H370"
        stroke={PAPER}
        strokeLinecap="round"
        strokeOpacity="0.2"
        strokeWidth="2"
      />
    </g>
  );
}

function Score({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <g>
      <circle cx="132" cy="170" r="42" fill={CREAM} />
      <circle
        cx="132"
        cy="170"
        r="33"
        fill="none"
        stroke={INK}
        strokeOpacity="0.1"
        strokeWidth="7"
      />
      <motion.circle
        cx="132"
        cy="170"
        r="33"
        fill="none"
        stroke={LIME_STRONG}
        strokeLinecap="round"
        strokeWidth="7"
        pathLength="1"
        strokeDasharray="1"
        initial={false}
        animate={
          reducedMotion
            ? { strokeDashoffset: 0.08 }
            : { strokeDashoffset: [0.88, 0.08, 0.08] }
        }
        transition={{
          duration: 5.8,
          times: [0, 0.48, 1],
          repeat: Infinity,
          repeatDelay: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        transform="rotate(-90 132 170)"
      />
      <text
        x="132"
        y="168"
        fill={INK}
        fontFamily="inherit"
        fontSize="25"
        fontWeight="950"
        textAnchor="middle"
        dominantBaseline="central"
      >
        92
      </text>
      <text
        x="132"
        y="190"
        fill={MUTED}
        fontFamily="inherit"
        fontSize="6.5"
        fontWeight="900"
        letterSpacing="1.2"
        textAnchor="middle"
      >
        READINESS
      </text>
      <rect x="104" y="217" width="56" height="15" rx="7.5" fill={INK} />
      <circle cx="115" cy="224.5" r="3" fill={LIME} />
      <text
        x="123"
        y="227"
        fill={PAPER}
        fontFamily="inherit"
        fontSize="6"
        fontWeight="850"
      >
        READY
      </text>
    </g>
  );
}

function Signal({
  label,
  score,
  width,
  color,
  index,
  reducedMotion,
}: {
  label: string;
  score: string;
  width: number;
  color: string;
  index: number;
  reducedMotion: boolean;
}) {
  const y = 151 + index * 29;

  return (
    <g>
      <text
        x="192"
        y={y}
        fill={INK}
        fontFamily="inherit"
        fontSize="7.5"
        fontWeight="850"
      >
        {label}
      </text>
      <text
        x="322"
        y={y}
        fill={INK}
        fontFamily="inherit"
        fontSize="7.5"
        fontWeight="950"
        textAnchor="end"
      >
        {score}
      </text>
      <rect
        x="192"
        y={y + 7}
        width="130"
        height="5"
        rx="2.5"
        fill={INK}
        opacity="0.09"
      />
      <motion.rect
        x="192"
        y={y + 7}
        height="5"
        rx="2.5"
        fill={color}
        initial={false}
        animate={
          reducedMotion
            ? { width }
            : { width: [8, 8, width, width], opacity: [0.45, 1, 1, 1] }
        }
        transition={{
          duration: 5.8,
          delay: index * 0.12,
          times: [0, 0.14, 0.48, 1],
          repeat: Infinity,
          repeatDelay: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </g>
  );
}

function CompletionBadge({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={
        reducedMotion
          ? { y: 0, scale: 1, opacity: 1 }
          : {
              y: [8, 0, -3, 0],
              scale: [0.94, 1.03, 1, 1],
              opacity: [0, 1, 1, 1],
            }
      }
      transition={{
        duration: 5.8,
        times: [0, 0.42, 0.68, 1],
        repeat: Infinity,
        repeatDelay: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformOrigin: "299px 307px" }}
    >
      <rect
        x="238"
        y="287"
        width="126"
        height="41"
        rx="15"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2"
        filter="url(#revision-shadow)"
      />
      <circle
        cx="260"
        cy="307.5"
        r="11"
        fill={LIME}
        stroke={INK}
        strokeWidth="1.7"
      />
      <path
        d="M254.5 307.5 l3.7 3.7 l7.2-8.2"
        fill="none"
        stroke={INK}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <text
        x="278"
        y="305"
        fill={INK}
        fontFamily="inherit"
        fontSize="7"
        fontWeight="950"
        letterSpacing="0.5"
      >
        SUBMISSION READY
      </text>
      <text
        x="278"
        y="316"
        fill={MUTED}
        fontFamily="inherit"
        fontSize="6.2"
        fontWeight="750"
      >
        Final review complete
      </text>
    </motion.g>
  );
}
