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
  "Map competitive landscape",
  "Synthesize gap analysis",
  "Generate strategic narrative",
  "Build execution slide deck",
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
    metric: "12 steps",
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
    metric: "4.3k tokens",
  },
];

const capabilities = [
  {
    title: "Newato Web",
    icon: RadioTower,
    copy: "DOM-level browser execution across SaaS platforms. Gmail, Notion, LinkedIn, Google Docs — interacted with at the structure level, not the pixel level.",
  },
  {
    title: "Newato OS",
    icon: AppWindow,
    copy: "Native Windows automation with accessibility-layer precision. Excel, VS Code, Slack, Figma, Outlook — controlled like a human operator who never makes mistakes.",
  },
  {
    title: "Pause. Override. Continue.",
    icon: Workflow,
    copy: "Interrupt any running workflow at any step. Make manual corrections. Newato re-orients around your change and continues — without losing context or starting over.",
  },
  {
    title: "Visual State Intelligence",
    icon: ScanSearch,
    copy: "A single screen scan builds a structural fingerprint of your environment. Subsequent steps use delta detection — only processing what changed. Fast, precise, and resource-efficient.",
  },
  {
    title: "Workflow Graph",
    icon: Brain,
    copy: "Newato maps the tools, people, and tasks that define how you work. Every execution makes the graph sharper. Every workflow becomes faster than the last.",
  },
  {
    title: "Instant Agent Recall",
    icon: Zap,
    copy: "Frequently executed workflows are kept warm in memory. Repeated tasks activate in near-zero time. The more you use Newato, the less you wait.",
  },
  {
    title: "Build Mode",
    icon: TerminalSquare,
    copy: "An integrated execution environment with live code view, step timeline, and real-time preview — for operators who want to inspect, modify, and extend their agent workflows.",
  },
  {
    title: "Newato Mobile",
    icon: CalendarClock,
    copy: "Voice-triggered remote execution from your phone. Issue commands, receive results, and stay in sync with your desktop agent — from anywhere.",
  },
];

const productCards = [
  {
    title: "Newato Web",
    eyebrow: "Browser extension",
    icon: RadioTower,
    copy: "The zero-friction entry point. Newato works inside browser SaaS tools by reading DOM, page state, form fields, and open tabs.",
    stage: "Fastest way in",
    pulse: "Live DOM + tab context",
    features: ["GHL, HubSpot, Notion, Sheets, Gmail", "Parallel prompt tabs", "Cross-tab @mention context"],
  },
  {
    title: "Newato OS",
    eyebrow: "Desktop system app",
    icon: AppWindow,
    copy: "The full execution layer for Windows first, Mac later. Newato controls installed software with vision, mouse, keyboard, and checkpoints.",
    stage: "Deep execution core",
    pulse: "Vision + keyboard + mouse",
    features: ["Any-app execution", "Persistent goal stack", "Local encrypted audit ledger"],
  },
  {
    title: "Newato Mobile",
    eyebrow: "Voice continuity",
    icon: Mic,
    copy: "Speak a goal from your phone, let the laptop execute, and receive compact status cards with pause/resume control.",
    stage: "Remote command layer",
    pulse: "Voice in, execution out",
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
    title: "Summarize Unread Emails",
    status: "done",
    tokens: "12s",
    log: "12 unread emails analyzed. 3 high-priority replies flagged for today.",
  },
  {
    title: "Competitive Landscape Mapped",
    status: "done",
    tokens: "4.8s",
    log: "14 competitor websites scanned. Pricing and features structured.",
  },
  {
    title: "Gap Analysis Synthesized",
    status: "done",
    tokens: "2.1s",
    log: "6 positioning gaps identified where competitors underserve mid-market.",
  },
  {
    title: "Strategic Narrative Review",
    status: "paused",
    tokens: "step 9",
    log: "Draft executive summary ready. Confirm preferred angle.",
  },
  {
    title: "Slides Being Generated",
    status: "done",
    tokens: "18s",
    log: "Google Slides deck structured with recommended positioning.",
  },
];

const docsNavigation = [
  {
    title: "Introduction",
    items: [
      { id: "what-is-newato", label: "What is Newato?" },
      { id: "quick-start", label: "Quick start" },
      { id: "how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Architecture",
    items: [
      { id: "system-architecture", label: "System architecture" },
      { id: "directory-map", label: "Directory map" },
      { id: "runtime-flow", label: "Runtime flow" },
      { id: "analysis-mode", label: "Analysis mode" },
    ],
  },
  {
    title: "Platform",
    items: [
      { id: "tooling-and-models", label: "Tooling and models" },
      { id: "development-workflow", label: "Development workflow" },
      { id: "observability", label: "Observability" },
    ],
  },
];

const docsSections = [
  {
    id: "what-is-newato",
    title: "What is Newato?",
    kicker: "Overview",
    paragraphs: [
      "Newato is a local AI execution platform that runs on your computer, accepts natural-language commands, and turns them into real actions across the browser, desktop apps, files, and workflows.",
      "It combines a React frontend, a Python backend, and an Electron desktop shell so operators can trigger work from one command surface while the system plans, executes, and reports progress in real time.",
      "The product is built around autonomous execution, but with human control still preserved through checkpointing, pause-resume behavior, and analysis-first planning.",
    ],
    bullets: [
      "Natural language task execution",
      "Browser, code, screen, and desktop tooling",
      "Parallel task handling with concurrency limits",
      "Local persistence, usage tracking, and observability",
    ],
  },
  {
    id: "quick-start",
    title: "Quick start",
    kicker: "Get running locally",
    paragraphs: [
      "The core local setup follows the same flow described in your project docs: install Node.js and Python, run the setup script once, then start the development environment.",
    ],
    code: `# Prerequisites
Node.js 20+
Python 3.11+

# Setup
.\\scripts\\setup.ps1

# Start development
.\\scripts\\start-dev.ps1`,
    bullets: [
      "Press Ctrl + Shift + Space to open the overlay",
      "Type a task in plain English",
      "Let Newato plan and execute across the connected runtime",
    ],
  },
  {
    id: "how-it-works",
    title: "How it works",
    kicker: "Execution model",
    paragraphs: [
      "A user submits a task through the overlay or frontend. The request reaches the backend over WebSocket or HTTP, then moves through routing, planning, task management, tool execution, and event broadcasting.",
      "The system is designed so execution can span browser automation, code operations, screen understanding, and external AI providers while still reporting granular progress back to the UI.",
    ],
    cards: [
      { title: "Input", copy: "Overlay, frontend UI, and natural-language commands", icon: Mic },
      { title: "Planning", copy: "Routing, analysis, orchestration, and goal decomposition", icon: Brain },
      { title: "Execution", copy: "Browser tools, code tools, screen tools, and providers", icon: Workflow },
      { title: "Updates", copy: "Broadcaster-driven status streaming back to the UI", icon: Activity },
    ],
  },
  {
    id: "system-architecture",
    title: "System architecture",
    kicker: "Core layers",
    paragraphs: [
      "Newato is structured as a three-layer system: Electron for the desktop shell and system integration, React for the interface layer, and Python for the backend runtime, orchestration, tools, and persistence.",
      "That layered split makes it possible to keep UI, agent logic, and OS-level behavior independent while still coordinating them through IPC, WebSocket, and HTTP boundaries.",
    ],
    cards: [
      { title: "Electron desktop app", copy: "Global shortcuts, overlay windows, tray behavior, and IPC bridge", icon: AppWindow },
      { title: "React frontend", copy: "Task UI, overlays, progress surfaces, and realtime rendering", icon: Layers3 },
      { title: "Python backend", copy: "Task manager, providers, tools, router, analysis engine, and database", icon: TerminalSquare },
    ],
  },
  {
    id: "directory-map",
    title: "Directory map",
    kicker: "Project structure",
    paragraphs: [
      "Your architecture file describes a clean separation between backend, frontend, Electron, scripts, and project-level documentation. The docs view below turns that into a more readable mental model.",
    ],
    cards: [
      { title: "backend/", copy: "Core agent logic, analysis engine, task manager, providers, tools, and database modules", icon: Zap },
      { title: "frontend/", copy: "React app, reusable components, hooks, store, and task UI surfaces", icon: RadioTower },
      { title: "electron/", copy: "Window management, preload bridge, system integration, and desktop packaging", icon: AppWindow },
      { title: "scripts/", copy: "Setup, dev startup, smoke tests, and automation helpers", icon: FileText },
    ],
  },
  {
    id: "runtime-flow",
    title: "Runtime flow",
    kicker: "From prompt to result",
    paragraphs: [
      "The execution pipeline described in the architecture docs is straightforward: user input enters the UI, the backend routes it, task management orchestrates it, providers and tools do the work, the database stores outcomes, and the broadcaster pushes updates back to the interface.",
    ],
    steps: [
      "User submits a task from the overlay or frontend",
      "Router receives the request through HTTP or WebSocket",
      "Task manager coordinates planning and execution lifecycle",
      "Agent chooses providers and tools for the job",
      "Execution results are stored and broadcast back live",
    ],
  },
  {
    id: "analysis-mode",
    title: "Analysis mode",
    kicker: "Pre-execution planning",
    paragraphs: [
      "Newato supports an explicit analysis-only mode. In this path, the backend returns structured planning output without creating a task, calling tools, mutating the database, or starting execution.",
      "This is useful when you want to inspect resource requirements, token usage, or a proposed execution path before the run actually begins.",
    ],
    code: `POST /tasks/analysis

POST /tasks
{
  "description": "Research competitors and summarize findings in a markdown file",
  "analysis": true
}`,
    bullets: [
      "No task is queued",
      "No tools are executed",
      "No database writes are performed",
      "Response is structured analysis JSON only",
    ],
  },
  {
    id: "tooling-and-models",
    title: "Tooling and models",
    kicker: "Execution stack",
    paragraphs: [
      "The current stack in your project docs includes React 18, Electron, Python FastAPI, Playwright, SQLite, and multi-provider model support. The runtime is designed to route work between providers and tools rather than relying on a single execution path.",
    ],
    cards: [
      { title: "Frontend", copy: "React 18, Vite, and a task-focused UI layer", icon: RadioTower },
      { title: "Runtime", copy: "Python backend with routing, orchestration, and tool registry", icon: Workflow },
      { title: "Models", copy: "Claude, DeepSeek, Groq, and tracked LLM usage paths", icon: Brain },
      { title: "Automation", copy: "Playwright, code tools, browser tools, and screen tools", icon: ScanSearch },
    ],
  },
  {
    id: "development-workflow",
    title: "Development workflow",
    kicker: "Local iteration",
    paragraphs: [
      "Your development flow starts backend and frontend services, waits for backend health, then launches Electron in dev mode. Frontend changes hot-reload through Vite, backend changes auto-reload through the Python server, and Electron changes require a restart.",
      "That flow makes local iteration fast while preserving the real desktop shell behavior the product depends on.",
    ],
    code: `1. Start Python backend
2. Start React dev server
3. Wait for /ping health check
4. Launch Electron with --dev
5. Load overlay and sidebar windows
6. Connect websocket to the backend runtime`,
  },
  {
    id: "observability",
    title: "Observability",
    kicker: "Usage tracking",
    paragraphs: [
      "The project docs also describe a usage tracking layer routed through LiteLLM Proxy with Langfuse and local SQLite logging. That means model calls can be tracked by user, session, agent, latency, and spend instead of staying opaque.",
      "For a system like Newato, that observability layer matters because autonomous workflows need cost visibility, traceability, and debugging at the agent-call level.",
    ],
    bullets: [
      "LiteLLM proxy for routed model usage",
      "Langfuse for tracing and observability",
      "SQLite backup table for local usage events",
      "Metrics API for tokens, cost, latency, and error rates",
    ],
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
  const [isLive, setIsLive] = useState(false);
  const showLaunchCover = !isLive;

  useEffect(() => {
    const handleToggle = (e) => {
      if (e.shiftKey && (e.key === "L" || e.key === "l")) {
        setIsLive((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleToggle);
    return () => window.removeEventListener("keydown", handleToggle);
  }, []);

  const [view, setView] = useState(() => (window.location.hash.startsWith("#docs") ? "docs" : "home"));

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 120 });
  const centerX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const centerY = useTransform(smoothY, [-1, 1], [-8, 8]);

  useEffect(() => {
    const syncView = () => {
      setView(window.location.hash.startsWith("#docs") ? "docs" : "home");
    };

    syncView();
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    if (view !== "home") return undefined;

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
  }, [view]);

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
    if (view !== "home") return undefined;

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
  }, [view]);

  return (
    <main ref={rootRef} className={`app-shell ${view === "docs" ? "docs-shell" : ""}`}>
      <CustomCursor />
      {view === "docs" ? (
        <DocsPage />
      ) : (
        <>
          <Hero
            heroRef={heroRef}
            centerX={centerX}
            centerY={centerY}
            showLaunchCover={showLaunchCover}
          />
          {showLaunchCover ? (
            <>
              <LogoContinuityBridge />
              <LaunchSoonSection />
            </>
          ) : (
            <>
              <HeroMoatShowcase />
              <BriefSection />
              <ThinkingSection thinkingRef={thinkingRef} thinkingStageRef={thinkingStageRef} trackRef={trackRef} />
              <ProductStackSection />
              <TrustSection />
              <CapabilitiesSection />
              <WaitlistSection />
            </>
          )}
          {!showLaunchCover && <NewatoFloatingOverlay />}
        </>
      )}
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

function DocsPage() {
  return (
    <section className="docs-page">
      <div className="docs-topbar">
        <a href="#top" className="brand-lockup" aria-label="NEWATO home">
          <LogoMark />
          <span>NEWATO</span>
        </a>
        <div className="docs-topbar-actions">
          <div className="docs-search" aria-hidden="true">
            <span>Search documentation...</span>
            <kbd>Ctrl K</kbd>
          </div>
          <a href="#waitlist" className="docs-toplink">Feedback</a>
          <a href="#waitlist" className="docs-learn">Get Started</a>
        </div>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-intro">
            <span>Using Newato Runtime</span>
            <small>Execution OS for browser, desktop, and agent workflows</small>
          </div>
          {docsNavigation.map((group) => (
            <div className="docs-nav-group" key={group.title}>
              <strong>{group.title}</strong>
              <div>
                {group.items.map((item) => (
                  <a key={item.id} href={`#docs-${item.id}`}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <div className="docs-main-scroll">
          <div className="docs-main-layout">
            <div className="docs-content">
              <header className="docs-hero">
                <span className="docs-kicker">Newato Docs</span>
                <h1>
                  <span>NEWATO</span>
                  <span>Docs for the execution runtime</span>
                </h1>
                <p>
                  Everything in this page is shaped from your README and architecture notes: what Newato is, how it runs,
                  how the system is structured, and how the development flow behaves end to end.
                </p>
              </header>

              {docsSections.map((section) => (
                <article key={section.id} id={`docs-${section.id}`} className="docs-section-block">
                  <div className="docs-section-head">
                    <span>{section.kicker}</span>
                    <h2>{section.title}</h2>
                  </div>

                  <div className="docs-copy">
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets ? (
                    <ul className="docs-list">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>
                          <Check size={15} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.steps ? (
                    <div className="docs-steps">
                      {section.steps.map((step, index) => (
                        <div key={step} className="docs-step">
                          <strong>{String(index + 1).padStart(2, "0")}</strong>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {section.cards ? (
                    <div className="docs-cards">
                      {section.cards.map((card) => {
                        const Icon = card.icon;
                        return (
                          <div key={card.title} className="docs-card">
                            <div className="docs-card-icon">
                              <Icon size={18} />
                            </div>
                            <h3>{card.title}</h3>
                            <p>{card.copy}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {section.code ? (
                    <div className="docs-codeblock">
                      <div className="docs-codebar">
                        <span>Example</span>
                        <small>PowerShell / API</small>
                      </div>
                      <pre>{section.code}</pre>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>

            <aside className="docs-toc">
              <div className="docs-toc-card">
                <strong>On this page</strong>
                <div>
                  {docsSections.map((section) => (
                    <a key={section.id} href={`#docs-${section.id}`}>
                      {section.title}
                    </a>
                  ))}
                </div>
                <a href="#top" className="docs-edit-link">Back to landing</a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
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

function Hero({ heroRef, centerX, centerY, showLaunchCover }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const isValidEmail = useMemo(() => /.+@.+\..+/.test(email), [email]);

  const handleNotifySubmit = async (event) => {
    event.preventDefault();
    if (!notifyOpen) {
      setNotifyOpen(true);
      return;
    }
    if (!isValidEmail) return;

    const savedEmails = JSON.parse(window.localStorage.getItem("newatoWaitlistEmails") || "[]");
    if (!savedEmails.includes(email)) {
      window.localStorage.setItem("newatoWaitlistEmails", JSON.stringify([...savedEmails, email]));
    }

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.warn("Waitlist API unavailable; email saved in localStorage only.", error);
    }

    setSubmitted(true);
  };

  return (
    <section id="top" ref={heroRef} className="hero-section">
      <AmbientBackdrop />
      <nav className="nav-bar" aria-label="Main navigation">
        <a href="#top" className="brand-lockup" aria-label="NEWATO home">
          <LogoMark />
          <span>NEWATO</span>
        </a>
        {!showLaunchCover && (
          <div className="nav-actions">
            <a href="#docs" className="nav-docs">
              Docs
            </a>
            <MagneticButton href="#waitlist" className="nav-cta">
              Get Started
            </MagneticButton>
          </div>
        )}
      </nav>

      <div className="hero-grid">
        <motion.div className="hero-content hero-copy" style={{ x: centerX, y: centerY }}>

          <motion.h1
            initial={{ opacity: 0, y: 42, filter: "blur(18px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: 0.1,
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <span><strong>Newato</strong></span>
            <span>AI That <strong>Executes</strong></span>
          </motion.h1>
          <motion.p
            className="hero-subhead"
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.24, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Newato is a <strong>computer-native AI agent</strong> that thinks, plans, and executes across every app, browser, and file on your machine — from a single instruction. No scripts. No shortcuts. No manual steps.
          </motion.p>
          <RelatableWorkflows />
          {!showLaunchCover && (
            <div className="hero-actions">
              <motion.form
                className="hero-notify-form"
                onSubmit={handleNotifySubmit}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <label htmlFor="hero-email" className="sr-only">Email address</label>
                <AnimatePresence initial={false}>
                  {notifyOpen && (
                    <motion.input
                      id="hero-email"
                      key="hero-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setSubmitted(false);
                      }}
                      placeholder="Enter your email"
                      aria-label="Email address"
                      autoFocus
                      initial={{ width: 0, opacity: 0, x: 16 }}
                      animate={{ width: "100%", opacity: 1, x: 0 }}
                      exit={{ width: 0, opacity: 0, x: 16 }}
                      transition={{ duration: 2.2, ease: [0.12, 0.84, 0.22, 1] }}
                    />
                  )}
                </AnimatePresence>
                <button type="submit" className={notifyOpen ? "is-open primary-hero-btn" : "primary-hero-btn"} disabled={notifyOpen && !isValidEmail}>
                  Early Access
                  <ArrowRight size={18} />
                </button>
              </motion.form>
              <motion.a
                href="#docs"
                className="secondary-hero-btn"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                Read the Docs
              </motion.a>
            </div>
          )}
          <AnimatePresence>
            {!showLaunchCover && submitted && (
              <motion.p
                className="hero-notify-success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                You are on the list. We will notify you first.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="hero-visual">
          <InteractiveCommandDemo />
          <TaskTimelinePanel compact />
        </div>
      </div>
      <div className="scroll-indicator" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

function RelatableWorkflows() {
  const tasks = [
    { icon: Mic, text: "Draft follow-up emails for conference contacts" },
    { icon: FileText, text: "Highlight overspending in Q2 budget spreadsheet" },
    { icon: ScanSearch, text: "Summarize deliverables from client proposal" },
    { icon: RadioTower, text: "Update Notion calendar with Slack standup move" },
    { icon: History, text: "Flag unread emails needing today's reply" },
    { icon: Fingerprint, text: "Send connection requests to profile viewers" }
  ];

  return (
    <div className="relatable-workflows" aria-label="Common user workflows">
      {tasks.map((task, i) => (
        <motion.div
          key={i}
          className="workflow-pill"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
          whileHover={{ x: 6, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <span className="pill-icon"><task.icon size={13} strokeWidth={2.5} /></span>
          <span>{task.text}</span>
        </motion.div>
      ))}
    </div>
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

function LogoContinuityBridge() {
  return (
    <div className="logo-continuity-bridge" aria-hidden="true">
      <span className="bridge-line" />
      <span className="bridge-dot bridge-dot-one" />
      <span className="bridge-dot bridge-dot-two" />
      <span className="bridge-dot bridge-dot-three" />
    </div>
  );
}

function LaunchSoonSection() {
  const launchDate = useMemo(() => new Date("2026-05-09T00:00:00"), []);
  const [remaining, setRemaining] = useState(() => Math.max(0, launchDate.getTime() - Date.now()));
  const [earlyEmail, setEarlyEmail] = useState("");
  const [earlySubmitted, setEarlySubmitted] = useState(false);
  const [earlyFocused, setEarlyFocused] = useState(false);
  const [earlyTyping, setEarlyTyping] = useState(false);
  const isEarlyValid = useMemo(() => /.+@.+\..+/.test(earlyEmail), [earlyEmail]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, launchDate.getTime() - now);
      setRemaining(diff);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [launchDate]);

  const handleEarlySubmit = async (event) => {
    event.preventDefault();
    if (!isEarlyValid) return;
    const saved = JSON.parse(window.localStorage.getItem("newatoWaitlistEmails") || "[]");
    if (!saved.includes(earlyEmail)) {
      window.localStorage.setItem("newatoWaitlistEmails", JSON.stringify([...saved, earlyEmail]));
    }
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: earlyEmail }),
      });
    } catch (e) {
      // saved locally
    }
    setEarlySubmitted(true);
  };

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const startDate = new Date("2026-05-01T00:00:00").getTime();
  const totalDuration = launchDate.getTime() - startDate;
  const progress = Math.min(100, Math.max(0, ((totalDuration - remaining) / totalDuration) * 100));
  const countdown = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <section className="launch-soon-section">
      <div className="launch-axis" aria-hidden="true">
        <span className="axis-line" />
        <span className="axis-dot axis-dot-one" />
        <span className="axis-dot axis-dot-two" />
        <span className="axis-dot axis-dot-three" />
        <span className="axis-bloom axis-bloom-left" />
        <span className="axis-bloom axis-bloom-right" />
        <span className="axis-bloom axis-bloom-left axis-bloom-small" />
        <span className="axis-bloom axis-bloom-right axis-bloom-small" />
        <span className="axis-bloom-core" />
      </div>
      <div className="launch-soon-content">

        <motion.h2
          initial={{ opacity: 0, y: 28, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Launching Very Soon
        </motion.h2>


        <motion.div
          className="launch-countdown-strip"
          aria-label="Countdown to launch"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {countdown.map((item) => (
            <div className="countdown-segment" key={item.label}>
              <strong>{String(item.value).padStart(2, "0")}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>

        <div className="launch-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <motion.div
          className="early-access-card"
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.44, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="early-access-glow" aria-hidden="true" />
          <div className="early-access-header">
            <div className="early-access-icon">
              <Zap size={18} />
            </div>
            <div>
              <strong>Get Early Access</strong>
              <span>Be among the first operators to use Newato</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {earlySubmitted ? (
              <motion.div
                className="early-success"
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Check size={22} />
                <div>
                  <strong>You're on the list!</strong>
                  <span>We'll reach out with your private access link.</span>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="early-access-form"
                onSubmit={handleEarlySubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label htmlFor="early-email" className="sr-only">Email address</label>
                <motion.div
                  className={`early-input-wrap ${earlyFocused ? 'is-focused' : ''} ${earlyTyping ? 'is-typing' : ''}`}
                  animate={earlyFocused ? { scale: 1.018 } : { scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="early-input-scan" aria-hidden="true" />
                  <input
                    id="early-email"
                    type="email"
                    value={earlyEmail}
                    onChange={(e) => { setEarlyEmail(e.target.value); setEarlyTyping(e.target.value.length > 0); }}
                    onFocus={() => setEarlyFocused(true)}
                    onBlur={() => setEarlyFocused(false)}
                    placeholder="Enter your email address"
                    aria-label="Email address for early access"
                  />
                  <motion.button
                    type="submit"
                    className="early-submit-btn"
                    disabled={!isEarlyValid}
                    animate={isEarlyValid ? { opacity: 1, x: 0 } : { opacity: 0.45, x: 0 }}
                    whileHover={isEarlyValid ? { scale: 1.04 } : {}}
                    whileTap={isEarlyValid ? { scale: 0.97 } : {}}
                  >
                    <span>Request Access</span>
                    <motion.span
                      animate={isEarlyValid ? { x: [0, 3, 0] } : { x: 0 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.2 }}
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
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
          <strong>Map competitive landscape and synthesize positioning gaps</strong>
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
          <h3>Competitive Gap Analysis</h3>
        </div>
        <span className="status-badge done">done</span>
      </div>
      <div className="metrics-grid">
        <div>
          <small>Total tokens processed</small>
          <strong>6.1k</strong>
        </div>
        <div>
          <small>Execution steps</small>
          <strong>{completed}/14</strong>
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
  const [commandIndex, setCommandIndex] = useState(0);

  const commands = [
    "Map competitive landscape and synthesize positioning gaps",
    "Search Google Drive for the March client proposal and summarise deliverables"
  ];

  useEffect(() => {
    let isMounted = true;

    const runDemo = async () => {
      if (!isMounted) return;
      const command = commands[commandIndex];

      // Reset
      setPhase(0);
      setTyped("");
      setVisibleSteps(0);
      setTokens(0);

      await new Promise(r => setTimeout(r, 1200));

      // Human-like typing
      for (let i = 0; i <= command.length; i++) {
        if (!isMounted) return;
        setTyped(command.slice(0, i));
        await new Promise(r => setTimeout(r, 40 + Math.random() * 55));
      }

      await new Promise(r => setTimeout(r, 800));
      setPhase(1);

      // Staggered steps
      for (let i = 1; i <= steps.length; i++) {
        if (!isMounted) return;
        setVisibleSteps(i);
        await new Promise(r => setTimeout(r, 500 + Math.random() * 120));
      }

      await new Promise(r => setTimeout(r, 600));
      setPhase(2);

      await new Promise(r => setTimeout(r, 8000));
      if (isMounted) {
        setCommandIndex((prev) => (prev + 1) % commands.length);
        runDemo();
      }
    };

    runDemo();

    return () => { isMounted = false; };
  }, [commandIndex]);

  useEffect(() => {
    if (phase !== 2) return undefined;

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1200, 1);
      setTokens(Math.round(92 * (1 - Math.pow(1 - progress, 4))));
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
          <h2>Plan first, Execute with checkpoints.</h2>
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
          Start where work already happens, deepen into the desktop, and keep the same goal stack reachable from anywhere.
        </p>
      </div>
      <div className="product-grid">
        {productCards.map((product, index) => {
          const Icon = product.icon;
          return (
            <motion.article
              className="product-card glass-panel reveal"
              key={product.title}
              initial={{ opacity: 0, y: 42, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-12%" }}
              whileHover={{ y: -12, rotateX: 3, rotateY: index === 1 ? 0 : index === 0 ? 3 : -3 }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="product-aurora"
                aria-hidden="true"
                animate={{
                  x: ["-12%", "10%", "-8%"],
                  y: ["0%", "-8%", "6%"],
                  scale: [1, 1.08, 0.98],
                }}
                transition={{
                  duration: 8 + index,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
              <div className="product-topline">
                <motion.div
                  className="product-icon"
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.06 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon size={24} />
                </motion.div>
                <motion.div
                  className="product-stage"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + index * 0.08, duration: 0.55 }}
                >
                  <span className="product-stage-dot" />
                  {product.stage}
                </motion.div>
              </div>
              <span className="product-eyebrow">{product.eyebrow}</span>
              <h3>{product.title}</h3>
              <p>{product.copy}</p>
              <motion.div
                className="product-signal"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.24 + index * 0.08, duration: 0.55 }}
              >
                <span className="signal-label">Execution signal</span>
                <strong>{product.pulse}</strong>
              </motion.div>
              <ul>
                {product.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-18%" }}
                    transition={{ delay: 0.3 + index * 0.08 + featureIndex * 0.08, duration: 0.45 }}
                  >
                    <Check size={14} />
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="product-beam"
                aria-hidden="true"
                animate={{ x: ["-40%", "120%"] }}
                transition={{
                  duration: 3.8 + index * 0.35,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1.4,
                }}
              />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function TrustSection() {
  const permissionRows = [
    ["Full plan generated", "Before execution begins", Workflow],
    ["Step locked by operator", "Paused at step 6", LockKeyhole],
    ["Human input detected", "Execution suspended", MousePointer2],
    ["Context preserved", "Agent re-plans and resumes", Brain],
  ];

  return (
    <section id="trust" className="trust-section section-pad">
      <div className="section-heading reveal">
        <span className="eyebrow">Transparent by design</span>
        <h2>Execution Ledger</h2>
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
              <span className="panel-kicker">Transparent by design</span>
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;
    const saved = JSON.parse(window.localStorage.getItem("newatoWaitlistEmails") || "[]");
    if (!saved.includes(email)) {
      window.localStorage.setItem("newatoWaitlistEmails", JSON.stringify([...saved, email]));
    }
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (e) { /* saved locally */ }
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="waitlist-section section-pad">
      <div className="waitlist-glow" />
      <div className="waitlist-particles" aria-hidden="true">
        {[...Array(6)].map((_, i) => <span key={i} className={`w-particle w-p-${i}`} />)}
      </div>
      <motion.div
        className="waitlist-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-heading">
          <motion.span
            className="waitlist-badge"
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="waitlist-badge-dot" />
            Private Access · 500 Seats
          </motion.span>
          <h2>The future doesn&apos;t click through menus.<br />It commands.</h2>
          <p>Join the private rollout. One intelligence layer. Every tool you already use — finally working for you.</p>
        </div>

        <div className="waitlist-card glass-panel">
          <div className="waitlist-card-shine" aria-hidden="true" />
          <div className="waitlist-perks">
            {[
              { icon: Zap, text: "Priority access to the full Newato agent runtime" },
              { icon: ShieldCheck, text: "Pause-resume execution control from day one" },
              { icon: Brain, text: "Workflow graph trained on your environment" },
            ].map(({ icon: Icon, text }) => (
              <div className="waitlist-perk" key={text}>
                <span className="perk-icon"><Icon size={15} /></span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="waitlist-success"
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="success-icon"><Check size={24} /></div>
                <div>
                  <strong>You&apos;re in.</strong>
                  <span>Newato will reach out with your private access link when your slot opens.</span>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="waitlist-form-inner"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label htmlFor="waitlist-email" className="sr-only">Email address</label>
                <div className="waitlist-input-row">
                  <input
                    id="waitlist-email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setSubmitted(false); }}
                    type="email"
                    placeholder="you@company.com"
                    aria-label="Email address"
                  />
                  <button type="submit" className="waitlist-submit" disabled={!isValid}>
                    Request Early Access
                    <ArrowRight size={17} />
                  </button>
                </div>
                <p className="waitlist-trust">
                  <LockKeyhole size={11} /> No spam. No noise. Limited to 500 operators in the first cohort.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

export default App;
