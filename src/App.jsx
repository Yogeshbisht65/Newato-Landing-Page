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
  DatabaseZap,
  FileText,
  Fingerprint,
  Gauge,
  History,
  LockKeyhole,
  Mic,
  MousePointer2,
  Play,
  Power,
  RadioTower,
  ScanSearch,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  TimerReset,
  Workflow,
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
    copy: "It lays out the full execution path first, with pause points the user can lock before the agent begins.",
    icon: Brain,
    metric: "9-step preview",
  },
  {
    title: "Execute",
    eyebrow: "Cross-tool action",
    copy: "It controls browser SaaS, desktop apps, files, and workflows from one instruction without waiting for official integrations.",
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
    copy: "The zero-friction entry point. It works inside browser SaaS tools by reading DOM, page state, form fields, and open tabs.",
    features: ["GHL, HubSpot, Notion, Sheets, Gmail", "Parallel prompt tabs", "Cross-tab @mention context"],
  },
  {
    title: "Newato OS",
    eyebrow: "Desktop system app",
    price: "From Rs. 999/mo",
    icon: AppWindow,
    copy: "The full execution layer for Windows first, Mac later. It controls installed software with vision, mouse, keyboard, and checkpoints.",
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
    title: "Version Fingerprints",
    value: "3-5x",
    label: "faster target",
    copy: "At task start, Newato builds an app/version fingerprint. Known screens need fewer expensive vision calls.",
  },
  {
    title: "Delta Screenshots",
    value: "70%",
    label: "fewer heavy calls",
    copy: "Later steps compare changed pixels and route only unexpected states back to the full reasoning layer.",
  },
  {
    title: "Operator Graph",
    value: "30+",
    label: "sessions to learn",
    copy: "Repeated workflows become a living map of how the user's business actually runs.",
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
  const trackRef = useRef(null);
  const showcaseRef = useRef(null);
  const desktopRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 120 });
  const leftX = useTransform(smoothX, [-1, 1], [-28, 28]);
  const leftY = useTransform(smoothY, [-1, 1], [22, -22]);
  const rightX = useTransform(smoothX, [-1, 1], [24, -24]);
  const rightY = useTransform(smoothY, [-1, 1], [-18, 18]);
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

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
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

      if (thinkingRef.current && trackRef.current) {
        const cards = gsap.utils.toArray(".think-card");
        const distance = () => Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 80);

        const horizontalTween = gsap.to(trackRef.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            id: "thinkingTrack",
            trigger: thinkingRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { scale: 0.9, opacity: 0.45, rotateY: index % 2 === 0 ? 10 : -10 },
            {
              scale: 1,
              opacity: 1,
              rotateY: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left center",
                end: "center center",
                scrub: true,
              },
            },
          );
        });
      }

      if (showcaseRef.current && desktopRef.current) {
        gsap.fromTo(
          desktopRef.current,
          { scale: 0.82, rotateX: 10, y: 80, filter: "blur(12px)" },
          {
            scale: 1,
            rotateX: 0,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: "top 75%",
              end: "center 45%",
              scrub: 1,
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
      <CursorGlow />
      <Hero
        heroRef={heroRef}
        leftX={leftX}
        leftY={leftY}
        rightX={rightX}
        rightY={rightY}
        centerX={centerX}
        centerY={centerY}
      />
      <BriefSection />
      <ThinkingSection thinkingRef={thinkingRef} trackRef={trackRef} />
      <ProductStackSection />
      <TrustSection />
      <ShowcaseSection showcaseRef={showcaseRef} desktopRef={desktopRef} />
      <MoatSection />
      <CapabilitiesSection />
      <WaitlistSection />
    </main>
  );
}

function CursorGlow() {
  return (
    <>
      <div className="cursor-glow" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}

function NeuralCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: true });
    let frame;
    let width = 0;
    let height = 0;
    let particles = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(120, Math.floor((width * height) / 12000));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 1.7 + 0.4,
        hue: index % 3 === 0 ? 265 : index % 3 === 1 ? 206 : 154,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const gradient = context.createRadialGradient(width * 0.5, height * 0.35, 0, width * 0.5, height * 0.35, width * 0.68);
      gradient.addColorStop(0, "rgba(91, 72, 255, 0.16)");
      gradient.addColorStop(0.4, "rgba(0, 145, 255, 0.08)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.lineWidth = 1;
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const other = particles[nextIndex];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 132) {
            const opacity = (1 - distance / 132) * 0.18;
            context.strokeStyle = `hsla(${particle.hue}, 100%, 70%, ${opacity})`;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        context.fillStyle = `hsla(${particle.hue}, 100%, 74%, 0.72)`;
        context.shadowColor = `hsla(${particle.hue}, 100%, 62%, 0.55)`;
        context.shadowBlur = 12;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="neural-canvas" aria-hidden="true" />;
}

function Hero({ heroRef, leftX, leftY, rightX, rightY, centerX, centerY }) {
  return (
    <section ref={heroRef} className="hero-section">
      <NeuralCanvas />
      <div className="hero-fog hero-fog-one" />
      <div className="hero-fog hero-fog-two" />
      <nav className="nav-bar" aria-label="Main navigation">
        <a href="#top" className="brand-lockup" aria-label="NEWATO home">
          <span className="brand-glyph">N</span>
          <span>NEWATO</span>
        </a>
        <div className="nav-links">
          <a href="#thinking">How it thinks</a>
          <a href="#trust">Trust</a>
          <a href="#showcase">Showcase</a>
        </div>
        <MagneticButton href="#waitlist" className="nav-cta">
          Early Access
        </MagneticButton>
      </nav>

      <div className="hero-depth">
        <motion.div className="hero-widget hero-widget-left" style={{ x: leftX, y: leftY }}>
          <CommandPalette />
        </motion.div>
        <motion.div className="hero-widget hero-widget-right" style={{ x: rightX, y: rightY }}>
          <TaskTimelinePanel compact />
        </motion.div>
      </div>

      <motion.div className="hero-content" style={{ x: centerX, y: centerY }}>
        <motion.div
          className="eyebrow-pill"
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Sparkles size={15} />
          Intelligence layer above every tool
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 42, filter: "blur(18px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          The AI that doesn't just answer. It executes.
        </motion.h1>
        <motion.p
          className="hero-subhead"
          initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.24, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Newato is the desktop AI operating layer for operators. It sees your tools, plans the workflow, executes across
          them, pauses when you intervene, and resumes with the full context intact.
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
          <MagneticButton href="#showcase" className="secondary-cta">
            <Play size={17} />
            Watch Live Demo
          </MagneticButton>
        </motion.div>
        <InteractiveCommandDemo />
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
          <span className="tiny-mark">N</span>
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

function ThinkingSection({ thinkingRef, trackRef }) {
  return (
    <section id="thinking" ref={thinkingRef} className="thinking-section section-pad">
      <div className="section-heading sticky-heading">
        <span className="eyebrow">How it thinks</span>
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
    </section>
  );
}

function BriefSection() {
  return (
    <section className="brief-section section-pad">
      <div className="brief-layout">
        <div className="section-heading reveal">
          <span className="eyebrow">Founding thesis</span>
          <h2>The last layer, not another silo.</h2>
          <p>
            Every serious operator already uses multiple excellent tools. The missing product is the intelligence layer
            above them: one command, one goal stack, one execution surface across the entire workflow.
          </p>
        </div>
        <div className="brief-card glass-panel reveal">
          <span className="panel-kicker">Design target</span>
          <blockquote>After Newato, what tool does anyone need to build?</blockquote>
          <p>The answer should be none. That is the north star behind the product.</p>
        </div>
        <div className="brief-stats">
          <div className="brief-stat glass-panel reveal">
            <strong>Windows first</strong>
            <span>Built for India's SMB operators and the machines they actually use.</span>
          </div>
          <div className="brief-stat glass-panel reveal">
            <strong>No API required</strong>
            <span>Newato can operate like a human: screen, mouse, keyboard, and plain-language intent.</span>
          </div>
          <div className="brief-stat glass-panel reveal">
            <strong>Cross-tool by default</strong>
            <span>GHL to Sheets to Notion to Outlook without copying context between agents.</span>
          </div>
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
          edit, it compares the screen, updates the master prompt, and resumes from the checkpoint.
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

function ShowcaseSection({ showcaseRef, desktopRef }) {
  return (
    <section id="showcase" ref={showcaseRef} className="showcase-section section-pad">
      <div className="section-heading reveal">
        <span className="eyebrow">Live product showcase</span>
        <h2>One instruction across the whole digital world.</h2>
        <p>
          The overlay appears with Ctrl+Shift+Space, understands the active software, shows the step timeline, then executes
          across SaaS tabs and installed desktop apps.
        </p>
      </div>
      <div ref={desktopRef} className="desktop-stage">
        <div className="desktop-topbar">
          <div className="traffic-lights">
            <span />
            <span />
            <span />
          </div>
          <div className="desktop-address">
            <Search size={15} />
              newato://goal-stack/ghl-sheets-notion
          </div>
          <TimerReset size={17} />
        </div>
        <div className="desktop-grid">
          <div className="desktop-column">
            <CommandPalette mini />
            <div className="chat-stack glass-panel">
              <div className="chat-line user">Pull last week's client data from GHL into this Sheets template.</div>
              <div className="chat-line ai">I found GHL, Sheets, and Notion. Step 6 is locked for manual review.</div>
              <div className="approval-card">
                <ShieldCheck size={17} />
                <span>Approve 9-step execution plan</span>
                <button type="button">Approve</button>
              </div>
            </div>
          </div>
          <ExecutionDetailCard />
          <TaskTimelinePanel />
        </div>
      </div>
    </section>
  );
}

function MoatSection() {
  return (
    <section className="moat-section section-pad">
      <div className="section-heading reveal">
        <span className="eyebrow">Technical moat</span>
        <h2>Built to get cheaper, faster, and smarter with use.</h2>
        <p>
          Newato does not treat every screenshot like a brand-new mystery. It compounds app knowledge through version
          fingerprints, delta screenshots, and the Operator Graph.
        </p>
      </div>
      <div className="moat-grid">
        {moatCards.map((card) => (
          <article className="moat-card glass-panel reveal" key={card.title}>
            <span>{card.title}</span>
            <strong>{card.value}</strong>
            <em>{card.label}</em>
            <p>{card.copy}</p>
          </article>
        ))}
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
        <h2>The future won't click. It will command.</h2>
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
