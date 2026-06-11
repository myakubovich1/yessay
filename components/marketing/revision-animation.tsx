"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * One continuous scene, three beats:
 *   struggle — slumped over a messy draft, hand buried in hair
 *   scan     — sits up, a lime beam sweeps the page, scribbles straighten
 *   done     — chin up, arms in a V, score ring pops, sparkles
 *
 * The figure follows premium flat-illustration conventions: faceless
 * profile (emotion lives in the silhouette), no outlines on the body,
 * two-tone skin for depth, capsule limbs with real elbow joints.
 * Transforms and opacity only; honors prefers-reduced-motion.
 */

type Beat = "struggle" | "scan" | "done";

const BEAT_MS: Record<Beat, number> = {
  struggle: 4200,
  scan: 3400,
  done: 4600,
};
const NEXT: Record<Beat, Beat> = {
  struggle: "scan",
  scan: "done",
  done: "struggle",
};

const INK = "#171912";
const LIME = "#c8f85a";
const PAPER = "#fffdf8";
const MUTED = "#a9ad9e";
const ORANGE = "#ff8b5e";
const OLIVE = "#617c12";

const SKIN = "#e9b482";
const SKIN_SHADE = "#cf9a63";
const SHIRT = "#5a7117";
const SHIRT_SHADE = "#475a0c";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };
const soft = { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const };
const fade = { duration: 0.28 };

const CAPTIONS: Record<Beat, string> = {
  struggle: "Stuck on the draft",
  scan: "Scanning the draft",
  done: "Ready to submit",
};

type ArmPose = {
  elbow: [number, number];
  wrist: [number, number];
  hand: [number, number];
};

const NEAR_SHOULDER: [number, number] = [190, 306];
const FAR_SHOULDER: [number, number] = [160, 308];

const NEAR_ARM: Record<Beat, ArmPose> = {
  struggle: { elbow: [254, 384], wrist: [232, 258], hand: [226, 246] },
  scan: { elbow: [234, 352], wrist: [274, 387], hand: [283, 389] },
  done: { elbow: [238, 254], wrist: [252, 202], hand: [256, 190] },
};
const FAR_ARM: Record<Beat, ArmPose> = {
  struggle: { elbow: [180, 366], wrist: [252, 390], hand: [262, 392] },
  scan: { elbow: [176, 362], wrist: [240, 390], hand: [250, 392] },
  done: { elbow: [118, 258], wrist: [104, 206], hand: [102, 194] },
};

function Arm({
  shoulder,
  pose,
  visible,
  skin,
  sleeve,
}: {
  shoulder: [number, number];
  pose: ArmPose;
  visible: boolean;
  skin: string;
  sleeve: string;
}) {
  const [sx, sy] = shoulder;
  const [ex, ey] = pose.elbow;
  const [wx, wy] = pose.wrist;
  const [hx, hy] = pose.hand;
  // sleeve covers the first stretch of the upper arm
  const slx = sx + (ex - sx) * 0.42;
  const sly = sy + (ey - sy) * 0.42;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={fade}
    >
      <path
        d={`M${sx} ${sy} L${ex} ${ey} L${wx} ${wy}`}
        fill="none"
        stroke={skin}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={hx} cy={hy} r="9.5" fill={skin} />
      <path
        d={`M${sx} ${sy} L${slx} ${sly}`}
        fill="none"
        stroke={sleeve}
        strokeWidth="20"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

export function RevisionAnimation() {
  const reduced = useReducedMotion();
  const [beat, setBeat] = useState<Beat>(reduced ? "done" : "struggle");

  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(() => setBeat(NEXT[beat]), BEAT_MS[beat]);
    return () => clearTimeout(timer);
  }, [beat, reduced]);

  const is = (...beats: Beat[]) => beats.includes(beat);

  return (
    <div
      aria-hidden
      className="flex h-full w-full flex-col items-center justify-center gap-5 px-8 py-10"
      data-animation="revision"
    >
      <svg viewBox="0 0 560 470" className="w-full max-w-[460px]">
        {/* ---------- floor shadow ---------- */}
        <ellipse cx="280" cy="436" rx="218" ry="12" fill={INK} opacity="0.07" />

        {/* ---------- report page (hard-shadow tactile card) ---------- */}
        <g>
          <rect x="306" y="128" width="186" height="252" rx="22" fill={INK} />
          <motion.g
            animate={
              is("done") && !reduced
                ? { y: [0, -5, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
                : { y: 0 }
            }
          >
            <rect
              x="298"
              y="120"
              width="186"
              height="252"
              rx="22"
              fill={PAPER}
              stroke={INK}
              strokeWidth="3"
            />
            {/* header */}
            <circle cx="328" cy="152" r="9" fill={LIME} stroke={INK} strokeWidth="2.5" />
            <rect x="346" y="147" width="74" height="9" rx="4.5" fill={INK} />

            {/* messy scribbles (struggle) */}
            <motion.g
              animate={{ opacity: is("struggle") ? 1 : 0 }}
              transition={soft}
              stroke={MUTED}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            >
              <path d="M320 192 q14 -8 28 0 t28 0 t28 0 t28 0 t18 -2" />
              <path d="M320 222 q12 8 24 0 t24 0 t24 0 t24 2" />
              <path d="M320 252 q16 -7 30 0 t30 0 t30 0 t28 -3" />
              <path d="M320 282 q12 7 24 0 t24 0 t20 2" />
              <path d="M320 312 q14 -8 28 0 t26 0" />
            </motion.g>

            {/* clean lines (scan + done) */}
            <g>
              {[192, 222, 252, 282, 312].map((y, i) => (
                <motion.rect
                  key={y}
                  x="318"
                  y={y - 5}
                  rx="5"
                  height="10"
                  fill={i === 1 || i === 3 ? OLIVE : INK}
                  opacity={i === 1 || i === 3 ? 0.85 : 0.16}
                  initial={false}
                  animate={{
                    width: is("struggle") ? 0 : i === 4 ? 86 : 148,
                    transition: is("scan")
                      ? { delay: 0.5 + i * 0.32, duration: 0.45, ease: "easeOut" }
                      : soft,
                  }}
                />
              ))}
              {/* lime highlight pills sliding in behind two rows */}
              {[222, 282].map((y, i) => (
                <motion.rect
                  key={y}
                  x="314"
                  y={y - 9}
                  rx="9"
                  height="18"
                  fill={LIME}
                  opacity="0.55"
                  initial={false}
                  animate={{
                    width: is("done") ? 156 : 0,
                    transition: { delay: 0.25 + i * 0.2, ...soft },
                  }}
                />
              ))}
            </g>

            {/* footer row */}
            <rect x="318" y="340" width="52" height="9" rx="4.5" fill={INK} opacity="0.14" />
            <motion.g
              initial={false}
              animate={
                is("done")
                  ? { scale: 1, transition: { delay: 0.55, ...spring } }
                  : { scale: 0 }
              }
              style={{ originX: "452px", originY: "344px" }}
            >
              <circle cx="452" cy="344" r="13" fill={LIME} stroke={INK} strokeWidth="2.5" />
              <path
                d="M446 344 l4.5 4.5 L458 339"
                stroke={INK}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </motion.g>
          </motion.g>

          {/* scan beam */}
          <motion.g
            initial={false}
            animate={{ opacity: is("scan") ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.g
              initial={false}
              animate={
                is("scan")
                  ? { y: [0, 218, 0, 218], transition: { duration: 3, ease: "easeInOut", times: [0, 0.4, 0.55, 1] } }
                  : { y: 0 }
              }
            >
              <rect x="290" y="132" width="202" height="40" rx="8" fill={LIME} opacity="0.28" />
              <rect x="290" y="150" width="202" height="4" rx="2" fill={LIME} />
              <circle cx="290" cy="152" r="6" fill={LIME} stroke={INK} strokeWidth="2" />
              <circle cx="492" cy="152" r="6" fill={LIME} stroke={INK} strokeWidth="2" />
            </motion.g>
          </motion.g>

          {/* issue chips -> become checks */}
          <Chip x={296} y={112} flip={!is("struggle")} delay={0.35} kind="x" />
          <Chip x={486} y={262} flip={!is("struggle")} delay={0.55} kind="bang" />

          {/* score ring */}
          <motion.g
            initial={false}
            animate={
              is("done")
                ? { scale: 1, rotate: 0, transition: { delay: 0.15, ...spring } }
                : { scale: 0, rotate: -12 }
            }
            style={{ originX: "486px", originY: "128px" }}
          >
            <circle cx="486" cy="128" r="37" fill={INK} />
            <circle cx="482" cy="124" r="37" fill={PAPER} stroke={INK} strokeWidth="3" />
            <motion.circle
              cx="482"
              cy="124"
              r="28"
              fill="none"
              stroke={LIME}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 28}
              initial={false}
              animate={{
                strokeDashoffset: is("done")
                  ? 2 * Math.PI * 28 * 0.08
                  : 2 * Math.PI * 28,
                transition: { delay: 0.4, duration: 1, ease: [0.32, 0.72, 0, 1] },
              }}
              transform="rotate(-90 482 124)"
            />
            <text
              x="482"
              y="124"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="22"
              fontWeight="900"
              fill={INK}
              fontFamily="inherit"
            >
              92
            </text>
          </motion.g>
        </g>

        {/* ---------- sparkles on done ---------- */}
        {[
          { x: 250, y: 120, d: 0.5, s: 1 },
          { x: 530, y: 210, d: 0.65, s: 0.8 },
          { x: 270, y: 330, d: 0.8, s: 0.7 },
          { x: 520, y: 86, d: 0.95, s: 0.9 },
        ].map((sp) => (
          <motion.path
            key={`${sp.x}-${sp.y}`}
            d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z"
            fill={OLIVE}
            initial={false}
            animate={
              is("done")
                ? {
                    scale: [0, sp.s, 0],
                    rotate: [0, 90],
                    transition: { delay: sp.d, duration: 1.4, ease: "easeOut" },
                  }
                : { scale: 0 }
            }
            style={{ x: sp.x, y: sp.y }}
          />
        ))}

        {/* ---------- character (faceless profile, no outlines) ---------- */}
        <motion.g
          initial={false}
          animate={{
            rotate: is("struggle") ? 7 : is("done") ? -5 : 1,
            y: is("struggle") ? 7 : 0,
            x: -14,
            transition: { ...spring, damping: 16 },
          }}
          style={{ originX: "158px", originY: "396px" }}
        >
          {/* breathing */}
          <motion.g
            animate={reduced ? { y: 0 } : { y: [0, -3, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* far arm (shaded, behind torso) */}
            {(Object.keys(FAR_ARM) as Beat[]).map((b) => (
              <Arm
                key={b}
                shoulder={FAR_SHOULDER}
                pose={FAR_ARM[b]}
                visible={beat === b}
                skin={SKIN_SHADE}
                sleeve={SHIRT_SHADE}
              />
            ))}

            {/* torso */}
            <path
              d="M124 396 C118 342 130 306 158 294 C188 281 207 296 206 324 C205 350 206 372 208 396 Z"
              fill={SHIRT}
            />

            {/* head group (tilts per beat) */}
            <motion.g
              initial={false}
              animate={{
                rotate: is("struggle") ? 14 : is("done") ? -8 : 0,
                transition: { ...spring, damping: 15 },
              }}
              style={{ originX: "184px", originY: "298px" }}
            >
              {/* neck */}
              <path d="M172 302 L174 260 L196 260 L196 302 Z" fill={SKIN} />
              {/* head in profile, facing right (nose in silhouette) */}
              <path
                d="M152 230
                   C152 204 166 190 186 190
                   C206 190 219 204 220 224
                   L231 240
                   L220 247
                   C218 261 207 269 192 269
                   L182 269
                   C164 269 152 252 152 230 Z"
                fill={SKIN}
              />
              {/* ear */}
              <ellipse cx="184" cy="238" rx="5.5" ry="7.5" fill={SKIN_SHADE} />
              {/* hair sweep + bun */}
              <path
                d="M150 242
                   C142 204 164 184 190 187
                   C208 189 218 200 220 216
                   C206 206 190 204 176 211
                   C160 219 152 229 150 242 Z"
                fill={INK}
              />
              <circle cx="145" cy="212" r="12" fill={INK} />
            </motion.g>

            {/* near arm (in front of torso; shaded when propping the head
                so the forearm separates from the face) */}
            {(Object.keys(NEAR_ARM) as Beat[]).map((b) => (
              <Arm
                key={b}
                shoulder={NEAR_SHOULDER}
                pose={NEAR_ARM[b]}
                visible={beat === b}
                skin={b === "struggle" ? SKIN_SHADE : SKIN}
                sleeve={SHIRT}
              />
            ))}
          </motion.g>
        </motion.g>

        {/* stress squiggle above head (struggle) */}
        <motion.g
          initial={false}
          animate={
            is("struggle")
              ? { opacity: [0, 1, 1, 0.4], y: [4, 0, 0, -2], transition: { duration: 3.4, times: [0, 0.15, 0.8, 1] } }
              : { opacity: 0 }
          }
        >
          <path
            d="M178 152 q8 -10 16 0 t16 0"
            fill="none"
            stroke={ORANGE}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="220" cy="146" r="3" fill={ORANGE} />
        </motion.g>

        {/* ---------- desk (in front of character) ---------- */}
        <rect x="56" y="392" width="448" height="15" rx="7.5" fill={INK} />
        <rect x="92" y="407" width="11" height="44" rx="5" fill={INK} />
        <rect x="456" y="407" width="11" height="44" rx="5" fill={INK} />
      </svg>

      {/* caption + beat dots */}
      <div className="flex flex-col items-center gap-2.5">
        <div className="relative h-4 w-72">
          {(Object.keys(CAPTIONS) as Beat[]).map((b) => (
            <motion.p
              key={b}
              initial={false}
              animate={{ opacity: beat === b ? 1 : 0, y: beat === b ? 0 : 5 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 text-center text-[11px] font-black uppercase tracking-[0.32em] text-[#6c7065]"
            >
              {CAPTIONS[b]}
            </motion.p>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(Object.keys(CAPTIONS) as Beat[]).map((b) => (
            <motion.span
              key={b}
              initial={false}
              animate={{
                width: beat === b ? 22 : 6,
                backgroundColor: beat === b ? "#171912" : "#17191233",
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

/** Issue chip that flips into a lime check once the scan passes. */
function Chip({
  x,
  y,
  flip,
  delay,
  kind,
}: {
  x: number;
  y: number;
  flip: boolean;
  delay: number;
  kind: "x" | "bang";
}) {
  return (
    <g>
      {/* problem state */}
      <motion.g
        initial={false}
        animate={
          flip
            ? { scale: 0, transition: { delay, duration: 0.25, ease: "easeIn" } }
            : { scale: [1, 1.06, 1], transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }
        }
        style={{ originX: `${x}px`, originY: `${y}px` }}
      >
        <rect x={x - 17} y={y - 17} width="34" height="34" rx="11" fill={PAPER} stroke={INK} strokeWidth="2.5" />
        {kind === "x" ? (
          <>
            <path d={`M${x - 6} ${y - 6} L${x + 6} ${y + 6}`} stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" />
            <path d={`M${x + 6} ${y - 6} L${x - 6} ${y + 6}`} stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d={`M${x} ${y - 8} L${x} ${y + 2}`} stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={x} cy={y + 8} r="2.2" fill={ORANGE} />
          </>
        )}
      </motion.g>
      {/* solved state */}
      <motion.g
        initial={false}
        animate={
          flip
            ? { scale: 1, transition: { delay: delay + 0.22, ...spring } }
            : { scale: 0 }
        }
        style={{ originX: `${x}px`, originY: `${y}px` }}
      >
        <rect x={x - 17} y={y - 17} width="34" height="34" rx="11" fill={LIME} stroke={INK} strokeWidth="2.5" />
        <path
          d={`M${x - 7} ${y} l5 5 l9 -10`}
          stroke={INK}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>
    </g>
  );
}
