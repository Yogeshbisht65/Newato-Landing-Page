import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  Activity,
  AppWindow,
  ArrowRight,
  Brain,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDot,
  FileText,
  Fingerprint,
  Gauge,
  History,
  Layers3,
  LockKeyhole,
  Mic,
  MousePointer2,
  PauseCircle,
  Play,
  Power,
  RadioTower,
  ScanSearch,
  Share2,
  ShieldCheck,
  TerminalSquare,
  Workflow,
  X,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  "Identify GHL, Sheets, and Notion context",
  "Generate a reversible 9-step plan",
  "Lock the manual review step",
  "Resume and verify final handoff",
];

const thinkCards = [
  {
    title: "See",
    eyebrow: "Version-aware vision",
    copy: "Newato reads the screen, open tabs, app state, and version fingerprint before touching anything.",
    icon: ScanSearch,
    metric: "One rich scan",
  },
  {
    title: "Plan",
    eyebrow: "Step timeline",
    copy: "Newato lays out the full execution path first, with pause points the user can lock before the agent begins.",
    icon: Brain,
    metric: "9-step preview",
  },
  {
    title: "Execute",
    eyebrow: "Cross-tool action",
    copy: "Newato controls browser SaaS, desktop apps, files, and workflows from one instruction without waiting for official integrations.",
    icon: Zap,
    metric: "Any app",
  },
  {
    title: "Resume",
    eyebrow: "Human-in-loop",
    copy: "If you touch the mouse, Newato pauses, watches your edit, updates the master prompt, and continues from the checkpoint.",
    icon: ShieldCheck,
    metric: "No black box",
  },
];

const capabilities = [
  {
    title: "Newato Web",
    icon: RadioTower,
    copy: "Chrome-first execution for SaaS tools using page, DOM, tab, and form intelligence.",
  },
  {
    title: "Newato OS",
    icon: AppWindow,
    copy: "Windows desktop control for Excel, Slack, VS Code, Figma, Outlook, files, and native apps.",
  },
  {
    title: "Pause-Resume-Tweak",
    icon: Workflow,
    copy: "Lock steps, interrupt with the mouse, edit manually, then let the agent re-plan and continue.",
  },
  {
    title: "Version Detection",
    icon: ScanSearch,
    copy: "One full visual scan creates a fingerprint; later steps use fast delta checks where possible.",
  },
  {
    title: "Operator Graph",
    icon: Brain,
    copy: "Newato learns which tools, people, and tasks connect inside each user's business.",
  },
  {
    title: "Warm Agent Pool",
    icon: Zap,
    copy: "Frequently used agents stay ready, turning repeated workflows into near-instant activations.",
  },
  {
    title: "IDE Experience",
    icon: TerminalSquare,
    copy: "Build mode opens code, live preview, and step timeline in one adaptive workspace.",
  },
  {
    title: "Newato Mobile",
    icon: CalendarClock,
    copy: "Voice-first remote execution with pause states synced back to the connected laptop.",
  },
];

const productCards = [
  {
    title: "Newato Web",
    eyebrow: "Browser extension",
    price: "Free -> Rs. 499/mo",
    icon: RadioTower,
    copy: "The zero-friction entry point. Newato works inside browser SaaS tools by reading DOM, page state, form fields, and open tabs.",
    features: ["GHL, HubSpot, Notion, Sheets, Gmail", "Parallel prompt tabs", "Cross-tab @mention context"],
  },
  {
    title: "Newato OS",
    eyebrow: "Desktop system app",
    price: "From Rs. 999/mo",
    icon: AppWindow,
    copy: "The full execution layer for Windows first, Mac later. Newato controls installed software with vision, mouse, keyboard, and checkpoints.",
    features: ["Any-app execution", "Persistent goal stack", "Local encrypted audit ledger"],
  },
  {
    title: "Newato Mobile",
    eyebrow: "Voice continuity",
    price: "Connected companion",
    icon: Mic,
    copy: "Speak a goal from your phone, let the laptop execute, and receive compact status cards with pause/resume control.",
    features: ["Cross-device goal stack", "Haptic step confirmation", "Hindi and vernacular roadmap"],
  },
];

const moatCards = [
  {
    title: "Pause mid-run",
    eyebrow: "Human control loop",
    value: "01",
    mark: "Pause",
    label: "Review, tweak, resume",
    copy: "Stop between steps, make a manual edit, and continue from the same live context.",
    icon: PauseCircle,
    tone: "control",
  },
  {
    title: "Shared context",
    eyebrow: "Workspace memory",
    value: "02",
    mark: "Sync",
    label: "One goal across every tab",
    copy: "GHL, Sheets, Notion, Gmail, and local apps stay connected in one goal stack.",
    icon: Share2,
    tone: "context",
  },
  {
    title: "Smart routing",
    eyebrow: "Algorithmic routing",
    value: "03",
    mark: "Route",
    label: "Lower cost, faster paths",
    copy: "Newato switches between vision, DOM, cached fingerprints, and lightweight deltas.",
    icon: Gauge,
    tone: "efficient",
  },
];

const timelineItems = [
  {
    title: "Read GHL client data",
    status: "done",
    tokens: "1.2k",
    log: "GHL version and pipeline state identified",
  },
  {
    title: "Format Sheets template",
    status: "done",
    tokens: "2.4k",
    log: "Rows mapped into weekly client schema",
  },
  {
    title: "Manual review column",
    status: "paused",
    tokens: "step 6",
    log: "Locked for user edit before resume",
  },
  {
    title: "Publish Notion summary",
    status: "done",
    tokens: "4 min",
    log: "Q1 project page updated and verified",
  },
];

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return undefined;
    }

    let frame;
    const started = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, target]);

  return value;
}

function useInViewOnce(ref, margin = "0px") {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.28 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin, ref, visible]);

  return visible;
}

function App() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const thinkingRef = useRef(null);
  const thinkingStageRef = useRef(null);
  const trackRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 120 });
  const centerX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const centerY = useTransform(smoothY, [-1, 1], [-8, 8]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handlePointer = (event) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      mouseX.set((event.clientX / width - 0.5) * 2);
      mouseY.set((event.clientY / height - 0.5) * 2);
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    const handlePointerOver = (event) => {
      const isInteractive = event.target.closest("a, button, input, textarea, select, [role='button']");
      document.documentElement.classList.toggle("cursor-on-action", Boolean(isInteractive));
    };

    const handlePointerDown = () => {
      document.documentElement.classList.add("cursor-is-pressed");
    };

    const handlePointerUp = () => {
      document.documentElement.classList.remove("cursor-is-pressed");
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.classList.remove("cursor-on-action", "cursor-is-pressed");
    };
  }, [mouseX, mouseY]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reveals = gsap.utils.toArray(".reveal");
      reveals.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 36, filter: "blur(14px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
            },
          },
        );
      });

      gsap.to(".timeline-float", {
        x: 0,
        opacity: 1,
        rotateY: -7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".trust-section",
          start: "top 72%",
          end: "top 30%",
          scrub: 1,
        },
      });

      if (thinkingRef.current && thinkingStageRef.current && trackRef.current) {
        const measureThinkingDistance = () => {
          const stage = thinkingStageRef.current;
          const track = trackRef.current;
          if (!stage || !track) return 0;

          const distance = Math.max(0, track.scrollWidth - stage.clientWidth);
          stage.style.setProperty("--thinking-distance", `${distance}px`);
          return distance;
        };

        measureThinkingDistance();

        gsap.fromTo(
          trackRef.current,
          { x: 0 },
          {
            x: () => -measureThinkingDistance(),
            ease: "none",
            scrollTrigger: {
              id: "thinkingTrack",
              trigger: thinkingStageRef.current,
              start: "top top",
              end: () => `+=${Math.max(window.innerHeight * 0.65 + measureThinkingDistance(), measureThinkingDistance() * 1.15)}`,
              scrub: 0.9,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefreshInit: measureThinkingDistance,
            },
          },
        );
      }

      gsap.to(".neon-sweep", {
        xPercent: 220,
        duration: 2.4,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 1.2,
      });
    }, rootRef.current);

    return () => context.revert();
  }, []);

  return (
    <main ref={rootRef} className="app-shell">
      <CustomCursor />
      <Hero
        heroRef={heroRef}
        centerX={centerX}
        centerY={centerY}
      />
      <HeroMoatShowcase />
      <BriefSection />
      <ThinkingSection thinkingRef={thinkingRef} thinkingStageRef={thinkingStageRef} trackRef={trackRef} />
      <ProductStackSection />
      <TrustSection />
      <CapabilitiesSection />
      <WaitlistSection />
      <NewatoFloatingOverlay />
    </main>
  );
}

function CustomCursor() {
  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="cursor-ring" />
      <span className="cursor-core" />
      <span className="cursor-trail" />
    </div>
  );
}

function LogoMark({ small = false }) {
  return (
    <img
      className={`newato-logo-image ${small ? "newato-logo-image-small" : ""}`}
      src="/newato-logo.jpeg"
      alt=""
      aria-hidden="true"
    />
  );
}

function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-mesh" />
      <div className="ambient-grid" />
      <div className="ambient-beam ambient-beam-one" />
      <div className="ambient-beam ambient-beam-two" />
      <div className="ambient-plane ambient-plane-one" />
      <div className="ambient-plane ambient-plane-two" />
    </div>
  );
}

function NewatoFloatingOverlay() {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isOverlayShortcut =
        event.ctrlKey && event.shiftKey && (event.code === "Space" || event.key === " " || event.key === "Spacebar");

      if (isOverlayShortcut) {
        event.preventDefault();
        event.stopPropagation();
        if (event.repeat) return;
        setOpen((current) => !current);
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowHint(false), 4200);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="newato-floating-hint"
            initial={{ opacity: 0, x: 18, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.96 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            Press Ctrl + Shift + Space, or click this dot to open
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        className="newato-floating-dot"
        aria-label="Open Newato overlay"
        onClick={() => setOpen(true)}
        onPointerEnter={() => setShowHint(true)}
        onPointerLeave={() => setShowHint(false)}
        onFocus={() => setShowHint(true)}
        onBlur={() => setShowHint(false)}
        initial={{ opacity: 0, x: 28, scale: 0.82 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="floating-orb">
          <span className="orb-core" />
          <span className="orb-ring" />
        </span>
        <span className="floating-status" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="newato-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="newato-overlay-backdrop"
              aria-label="Close Newato overlay"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="newato-overlay-panel"
              initial={{ opacity: 0, x: 26, scale: 0.94, filter: "blur(12px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 18, scale: 0.96, filter: "blur(10px)" }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Newato execution overlay"
            >
              <div className="overlay-header">
                <div className="overlay-brand">
                  <div>
                    <span>NEWATO</span>
                    <small>Local operator</small>
                  </div>
                </div>
                <div className="overlay-tabs" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="overlay-running">Running</span>
                <button type="button" className="overlay-esc" aria-label="Collapse overlay" onClick={() => setOpen(false)}>
                  Esc
                </button>
                <button type="button" aria-label="Close overlay" onClick={() => setOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="overlay-command">
                <Mic size={18} />
                <div>
                  <span>Ask Newato</span>
                  <strong>Execute across apps</strong>
                </div>
                <button type="button" className="analyse-button">Analyse</button>
                <button type="button">
                  Do
                </button>
              </div>
              <div className="overlay-task">
                <span className="task-pulse" />
                <div>
                  <strong>open chrome</strong>
                  <small>Standing by with the latest task context</small>
                </div>
              </div>
              <div className="overlay-actions">
                <button type="button">All Chats</button>
                <button type="button">Continue</button>
              </div>
              <p className="overlay-shortcut">Press Ctrl + Shift + Space to toggle. Press Esc to collapse.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroMoatShowcase() {
  return (
    <motion.section
      id="moats"
      className="moats-section"
      initial={{ opacity: 0, y: 44, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-moats">
        <div className="hero-moats-heading">
          <span className="eyebrow">Why Newato is different</span>
          <h2>
            <span>Built for agents</span>
            <span>that actually finish work.</span>
          </h2>
        </div>
        <div className="moat-showcase">
          {moatCards.map((card, index) => {
            return (
              <motion.article
                className={`moat-feature moat-${card.tone}`}
                key={card.title}
                initial={{ opacity: 0, y: 30, rotateX: 6 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ delay: index * 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -12, rotateX: 2, rotateY: index === 1 ? 0 : index === 0 ? -3 : 3 }}
              >
                <div className="moat-feature-shine" />
                <div className="moat-visual" aria-hidden="true">
                  {card.tone === "control" && (
                    <div className="control-visual">
                      <button type="button" aria-label="Pause execution">
                        <PauseCircle size={28} />
                      </button>
                      <div className="control-rail">
                        <span />
                        <span />
                        <span />
                      </div>
                      <button type="button" aria-label="Play execution">
                        <Play size={27} />
                      </button>
                    </div>
                  )}
                  {card.tone === "context" && (
                    <div className="context-visual">
                      <div className="tab-card tab-card-one">GHL</div>
                      <div className="tab-card tab-card-two">Sheets</div>
                      <div className="tab-card tab-card-three">Notion</div>
                      <div className="context-node">
                        <Layers3 size={26} />
                      </div>
                    </div>
                  )}
                  {card.tone === "efficient" && (
                    <div className="routing-visual">
                      <div className="route-core">
                        <Gauge size={30} />
                      </div>
                      <span className="route-line route-line-one" />
                      <span className="route-line route-line-two" />
                      <span className="route-line route-line-three" />
                      <span className="route-chip route-chip-one">vision</span>
                      <span className="route-chip route-chip-two">DOM</span>
                      <span className="route-chip route-chip-three">delta</span>
                    </div>
                  )}
                </div>
                <div className="moat-copy">
                  <div className="moat-copy-head">
                    <span>{card.eyebrow}</span>
                    <strong>{card.mark}</strong>
                  </div>
                  <h3>{card.title}</h3>
                  <em>{card.label}</em>
                  <p>{card.copy}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
        <div className="moat-proof-strip">
          <div>
            <Power size={17} />
            <span>Interruptible execution</span>
          </div>
          <div>
            <Share2 size={17} />
            <span>Shared context graph</span>
          </div>
          <div>
            <Zap size={17} />
            <span>Dynamic cost routing</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Hero({ heroRef, centerX, centerY }) {
  return (
    <section id="top" ref={heroRef} className="hero-section">
      <AmbientBackdrop />
      <nav className="nav-bar" aria-label="Main navigation">
        <a href="#top" className="brand-lockup" aria-label="NEWATO home">
          <LogoMark />
          <span>NEWATO</span>
        </a>
        <div className="nav-links">
        <a href="#thinking">How NEWATO thinks</a>
          <a href="#trust">Trust</a>
          <a href="#moats">Moats</a>
        </div>
        <MagneticButton href="#waitlist" className="nav-cta">
          Early Access
        </MagneticButton>
      </nav>

      <motion.div className="hero-content hero-copy" style={{ x: centerX, y: centerY }}>
        <motion.div
          className="eyebrow-pill"
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Workflow size={15} />
          Execution operating layer
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 42, filter: "blur(18px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>NEWATO</span>
          <span>AI That Executes </span>
        </motion.h1>
        <motion.p
          className="hero-subhead"
          initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.24, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          The computer-native agent for your workspace that plans, build, executes across apps & web on one command.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticButton href="#waitlist" className="primary-cta">
            Join Early Access
            <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton href="#moats" className="secondary-cta">
            <Layers3 size={17} />
            See Our Moats
          </MagneticButton>
        </motion.div>
      </motion.div>
      <div className="scroll-indicator" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

function MagneticButton({ children, href, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });

  const handleMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={`magnetic-button ${className}`}
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.a>
  );
}

function CommandPalette({ mini = false }) {
  return (
    <motion.div className={`command-palette glass-panel ${mini ? "command-mini" : ""}`} whileHover={{ scale: 1.025, rotateX: 1, rotateY: -2 }}>
      <div className="widget-glow" />
      <div className="command-topline">
        <div className="command-brand">
          <LogoMark small />
          <span>NEWATO</span>
        </div>
        <span className="esc-key">Esc</span>
      </div>
      <div className="command-input-row">
        <div className="voice-button" aria-hidden="true">
          <Mic size={18} />
        </div>
        <div className="command-input">
          <span>Ask Newato to execute...</span>
          <strong>Pull GHL data into Sheets</strong>
        </div>
      </div>
      <div className="command-actions">
        <button type="button">
          <FileText size={15} />
          PDF
        </button>
        <button type="button" className="do-button">
          Do
          <ChevronRight size={15} />
        </button>
      </div>
      <button type="button" className="all-chats">
        <History size={15} />
        All Chats
      </button>
    </motion.div>
  );
}

function TaskTimelinePanel({ compact = false }) {
  return (
    <div className={`timeline-panel glass-panel ${compact ? "timeline-compact" : ""}`}>
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Recent execution</span>
          <h3>Task Timeline</h3>
        </div>
        <Activity size={18} />
      </div>
      <div className="timeline-list">
        {timelineItems.map((item, index) => (
          <motion.div
            className="timeline-item"
            key={item.title}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: index * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={`status-dot ${item.status}`} />
            <div>
              <strong>{item.title}</strong>
              <small>{item.log}</small>
            </div>
            <div className="timeline-meta">
              <span className={`status-badge ${item.status}`}>{item.status}</span>
              <em>{item.tokens}</em>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="execution-log">
        <span>execution.log</span>
        <code>pause_resume: ready</code>
      </div>
    </div>
  );
}

function ExecutionDetailCard() {
  const ref = useRef(null);
  const active = useInViewOnce(ref, "-8% 0px");
  const tokens = useCountUp(70, active);
  const completed = useCountUp(9, active, 950);

  return (
    <motion.div
      ref={ref}
      className="execution-detail glass-panel"
      initial={{ opacity: 0, scale: 0.88, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="neon-sweep" />
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Execution detail</span>
          <h3>GHL to Notion handoff</h3>
        </div>
        <span className="status-badge done">done</span>
      </div>
      <div className="metrics-grid">
        <div>
          <small>Vision calls saved</small>
          <strong>{tokens}%</strong>
        </div>
        <div>
          <small>Steps completed</small>
          <strong>{completed}/9</strong>
        </div>
      </div>
      <div className="chat-bubble">
        <span>Newato</span>
        <p>Client data is formatted in Sheets and the Notion project page has the final Q1 summary.</p>
      </div>
      <div className="success-panel">
        <Check size={18} />
        <div>
          <strong>Verified outcome</strong>
          <small>GHL source, Sheets rows, and Notion summary checked against the original goal.</small>
        </div>
      </div>
    </motion.div>
  );
}

function InteractiveCommandDemo() {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState("");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const command = "Pull GHL data into Sheets";
    let interval;
    let timeout;

    const run = () => {
      setPhase(0);
      setTyped("");
      setVisibleSteps(0);
      setTokens(0);

      let index = 0;
      interval = setInterval(() => {
        index += 1;
        setTyped(command.slice(0, index));
        if (index === command.length) {
          clearInterval(interval);
          setPhase(1);

          steps.forEach((_, stepIndex) => {
            setTimeout(() => setVisibleSteps(stepIndex + 1), 520 + stepIndex * 430);
          });

          setTimeout(() => setPhase(2), 2400);
        }
      }, 80);

      timeout = setTimeout(run, 6200);
    };

    run();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (phase !== 2) return undefined;

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 900, 1);
      setTokens(Math.round(70 * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  return (
    <motion.div
      className="command-demo glass-panel"
      initial={{ opacity: 0, y: 28, filter: "blur(16px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.52, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="demo-input">
        <TerminalSquare size={18} />
        <span>{typed}</span>
        <i />
      </div>
      <AnimatePresence mode="popLayout">
        {phase >= 1 && (
          <motion.div
            className="parse-chip"
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <CircleDot size={14} />
            Parsing intent into actions
          </motion.div>
        )}
      </AnimatePresence>
      <div className="demo-steps">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            className={`demo-step ${visibleSteps > index ? "active" : ""}`}
            initial={false}
            animate={{ opacity: visibleSteps > index ? 1 : 0.3, x: visibleSteps > index ? 0 : -10 }}
          >
            <Check size={14} />
            <span>{step}</span>
          </motion.div>
        ))}
      </div>
      <div className="demo-footer">
        <span className={`done-light ${phase === 2 ? "is-on" : ""}`}>Done</span>
        <span>{tokens}% vision calls saved</span>
      </div>
    </motion.div>
  );
}

function ThinkingSection({ thinkingRef, thinkingStageRef, trackRef }) {
  return (
    <section id="thinking" ref={thinkingRef} className="thinking-section section-pad">
      <div ref={thinkingStageRef} className="thinking-sticky">
        <div className="section-heading sticky-heading">
          <span className="eyebrow">How NEWATO thinks</span>
          <h2>Plan first. Execute with checkpoints.</h2>
        </div>
        <div ref={trackRef} className="think-track" id="thinkingTrack">
          {thinkCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <article className="think-card glass-panel" key={card.title}>
                <span className="card-index">0{index + 1}</span>
                <div className="think-icon">
                  <Icon size={26} />
                </div>
                <span>{card.eyebrow}</span>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <strong>{card.metric}</strong>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BriefSection() {
  const briefStats = [
    {
      title: "Windows first",
      copy: "Built for India's SMB operators and the machines they actually use.",
      icon: AppWindow,
    },
    {
      title: "No API required",
      copy: "Newato can operate like a human: screen, mouse, keyboard, and plain-language intent.",
      icon: MousePointer2,
    },
    {
      title: "Cross-tool by default",
      copy: "GHL to Sheets to Notion to Outlook without copying context between agents.",
      icon: Workflow,
    },
  ];

  return (
    <section className="brief-section section-pad">
      <div className="brief-layout">
        <div className="section-heading reveal">
          <span className="eyebrow">Founding thesis</span>
          <h2>The final layer, not another silo.</h2>
          <p>
            Every serious operator already uses multiple excellent tools. Newato aims to become the intelligence layer
            above them: one command, one goal stack, one execution surface across the workflow.
          </p>
        </div>
        <div className="brief-card glass-panel reveal">
          <div className="brief-card-mark" aria-hidden="true">
            <Layers3 size={24} />
          </div>
          <span className="panel-kicker">Design target</span>
          <blockquote>Newato aims to be the final layer operators need.</blockquote>
          <p>That is the north star behind the product: reduce tool switching, not replace the tools teams already trust.</p>
        </div>
        <div className="brief-stats">
          {briefStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div className="brief-stat glass-panel reveal" key={stat.title}>
                <div className="brief-stat-icon" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <strong>{stat.title}</strong>
                <span>{stat.copy}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductStackSection() {
  return (
    <section className="product-section section-pad">
      <div className="section-heading reveal">
        <span className="eyebrow">Product stack</span>
        <h2>Land in the browser. Expand into the OS.</h2>
        <p>
          Newato Web brings the first habit. Newato OS becomes the monetization engine. Mobile gives the same goal stack a
          voice-first control surface.
        </p>
      </div>
      <div className="product-grid">
        {productCards.map((product) => {
          const Icon = product.icon;
          return (
            <motion.article
              className="product-card glass-panel reveal"
              key={product.title}
              whileHover={{ y: -10, rotateX: 1.5 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
              <div className="product-icon">
                <Icon size={24} />
              </div>
              <span>{product.eyebrow}</span>
              <h3>{product.title}</h3>
              <p>{product.copy}</p>
              <strong>{product.price}</strong>
              <ul>
                {product.features.map((feature) => (
                  <li key={feature}>
                    <Check size={14} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function TrustSection() {
  const permissionRows = [
    ["Full plan preview", "Before run", Workflow],
    ["Locked step", "Pause at step 6", LockKeyhole],
    ["Mouse touched", "Auto-pause", MousePointer2],
    ["Resume with context", "Re-plan", Brain],
  ];

  return (
    <section id="trust" className="trust-section section-pad">
      <div className="section-heading reveal">
        <span className="eyebrow">Pause-Resume-Tweak</span>
        <h2>You stay in control. Newato keeps moving.</h2>
        <p>
          Before execution, Newato shows the full plan. During execution, touching the mouse pauses instantly. After your
          edit, Newato compares the screen, updates the master prompt, and resumes from the checkpoint.
        </p>
      </div>
      <div className="trust-layout">
        <div className="vault-visual reveal">
          <div className="vault-rings" />
          <div className="vault-core">
            <Fingerprint size={58} />
            <span>Master Prompt</span>
          </div>
          <div className="vault-orbit orbit-one">
            <ShieldCheck size={18} />
          </div>
          <div className="vault-orbit orbit-two">
            <LockKeyhole size={18} />
          </div>
          <div className="vault-orbit orbit-three">
            <Gauge size={18} />
          </div>
        </div>
        <div className="trust-panel glass-panel timeline-float">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Human control loop</span>
              <h3>Execution Ledger</h3>
            </div>
            <Power size={18} />
          </div>
          <div className="permission-list">
            {permissionRows.map(([label, state, Icon]) => (
              <div className="permission-row" key={label}>
                <Icon size={18} />
                <span>{label}</span>
                <strong>{state}</strong>
              </div>
            ))}
          </div>
          <div className="audit-strip">
            <div>
              <small>Audit ledger</small>
              <strong>Local</strong>
            </div>
            <div>
              <small>Screenshot policy</small>
              <strong>On-device</strong>
            </div>
            <div>
              <small>Confidence gate</small>
              <strong>75%</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section className="capabilities-section section-pad">
      <div className="section-heading reveal">
        <span className="eyebrow">Capability map</span>
        <h2>The features from the brief, made usable.</h2>
      </div>
      <div className="capability-grid">
        {capabilities.map((capability, index) => {
          const Icon = capability.icon;
          return (
          <motion.article
            className="capability-card glass-panel reveal"
            key={capability.title}
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ "--delay": `${index * 60}ms` }}
          >
            <Icon size={24} />
            <h3>{capability.title}</h3>
            <p>{capability.copy}</p>
          </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isValid = useMemo(() => /.+@.+\..+/.test(email), [email]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="waitlist-section section-pad">
      <div className="waitlist-glow" />
      <div className="section-heading reveal">
        <span className="eyebrow">Early access</span>
        <h2>The future won't click. NEWATO will command.</h2>
        <p>Join the private rollout for operators who want one intelligence layer above every tool they already use.</p>
      </div>
      <form className="waitlist-form glass-panel reveal" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSubmitted(false);
            }}
            type="email"
            placeholder="you@company.com"
            aria-label="Email address"
          />
        </div>
        <button type="submit" disabled={!isValid}>
          Join Early Access
          <ArrowRight size={18} />
        </button>
      </form>
      <AnimatePresence>
        {submitted && (
          <motion.p
            className="submission-note"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            You're on the list. NEWATO will be in touch.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}

export default App;

