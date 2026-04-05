import { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo, Fragment } from "react";
import { createPortal } from "react-dom";

/* ═══════════════════════════════════════════════════════════════
   RG PORTFOLIO — React Prototype
   Design: Dark cinematic aesthetic inspired by interactionjackson.com
   Font: TTCommonsPro  ·  Palette: #0D0D0D / #F2F2F0 / #E87A4F
   ═══════════════════════════════════════════════════════════════ */

// ─── Theme Context ───────────────────────────────────────────
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const themes = {
  dark: {
    bg: "#0D0D0D",
    bgAlt: "#141414",
    bgCard: "#1A1A1A",
    bgCardHover: "#222222",
    text: "#F2F2F0",
    textMuted: "#999999",
    textDim: "#666666",
    accent: "#E87A4F",
    accentHover: "#F09070",
    border: "#2A2A2A",
    borderLight: "#1F1F1F",
    overlay: "rgba(0,0,0,0.85)",
    chipBg: "#1F1F1F",
    chipText: "#BBBBBB",
    navBg: "rgba(13,13,13,0.92)",
    footerBg: "#0A0A0A",
  },
  light: {
    bg: "#F7F7F5",
    bgAlt: "#EFEFED",
    bgCard: "#FFFFFF",
    bgCardHover: "#F0F0EE",
    text: "#1A1A1A",
    textMuted: "#666666",
    textDim: "#999999",
    accent: "#D0603A",
    accentHover: "#E87A4F",
    border: "#E0E0DE",
    borderLight: "#EAEAE8",
    overlay: "rgba(255,255,255,0.9)",
    chipBg: "#EAEAE8",
    chipText: "#555555",
    navBg: "rgba(247,247,245,0.92)",
    footerBg: "#EFEFED",
  },
};

// ─── Route Context (clean URL router using History API) ──────────────────────
const RouteContext = createContext();
const useRoute = () => useContext(RouteContext);

function Router({ children }) {
  const [path, setPath] = useState(() => {
    // Support legacy hash URLs — redirect /#/path to /path
    const hash = window.location.hash;
    if (hash && hash.startsWith("#/")) {
      const cleanPath = hash.slice(1);
      window.history.replaceState(null, "", cleanPath);
      return cleanPath;
    }
    return window.location.pathname || "/";
  });

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((to) => {
    window.history.pushState(null, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <RouteContext.Provider value={{ path, navigate }}>
      {children}
    </RouteContext.Provider>
  );
}

// ─── Reduce Motion Context ───────────────────────────────────
const MotionContext = createContext();
const useMotion = () => useContext(MotionContext);

// ─── Intersection Observer Hook ──────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { reduced } = useMotion();

  useEffect(() => {
    if (reduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, reduced]);

  return [ref, visible];
}

// ─── Data ────────────────────────────────────────────────────
// Featured case studies (shown on Home)
const FEATURED_PROJECTS = [
  {
    slug: "airtel-recharges",
    title: "Reducing recharge drop-offs from 27.5% → 12.75%",
    context: "Airtel — Redesigned the prepaid recharge funnel on Airtel's highest-traffic web surface, driving measurable GMV uplift.",
    role: "Senior Product Designer",
    platform: "Web (mWeb-first, 85%+ traffic)",
    scale: "350M+ subscribers · $107M/mo",
    year: "2022",
    company: "Bharti Airtel",
    team: "IC designer, end-to-end ownership",
    summary: "Redesigned Airtel's recharge experience to improve decision clarity and conversion. The work is still live on airtel.in, contributing to $107M+ in monthly web recharge volume. Reduced funnel drop-off from 27.5% to 12.75% and lifted CSAT by 12%.",
    nda: false,
    sections: {
      overview: "Recharges was Airtel's highest-traffic web surface — and it was slightly leaking revenue. $107M+ transacted monthly through web with average recharge value between INR 180–250 ($2.5–3.5). The drop-off rate from number-entry to payment completion was 27.5%. Only 12–14% of users logged in on web, making personalisation nearly inaccessible. With 85%+ traffic on mWeb and users skewing toward tier-2 and tier-3 cities, the challenge was designing for low-familiarity users on constrained devices.",
      problem: "The problem statement was clear: resolve funnel attrition on one of Airtel's highest-traffic recharge surfaces. Two parallel goals emerged — reduce the 27.5% drop-off attrition and increase the 12–14% login rate to enable repeat recharge access. A heuristic audit revealed four core UX issues: weak hierarchy (price, validity, and benefits competed for attention instead of guiding decisions), cognitive overload (too many similar plans with equal visual weight creating scan fatigue), lack of past recharge information (users failed to access past recharges via login through the top-right account ingress), and users delaying decisions leading to abandon flow.",
      constraints: "Three real constraints shaped every decision. First, weak analytics instrumentation — the live website had minimal event tracking, no funnel visualisation, no drop-off touchpoints, no heatmaps. I navigated this by designing a proxy research protocol using task-based think-aloud sessions that replicated what analytics would have shown — behavioural observation replaced missing funnel data. Second, a compressed timeline with an imminent GTM deadline — there was no runway for sequential research → ideation, so I ran ideation and evaluation in parallel, defining testable hypotheses upfront so multiple design directions could be tested simultaneously. Third, low-familiarity users on a constrained device surface — 85%+ of traffic was mWeb, skewing heavily to tier-2 and tier-3 users. Advanced UI patterns that worked on the Thanks App could not be assumed to transfer, so I stratified research samples by tech-savviness as a primary variable.",
      approach: "The process was shaped by constraints, not convention. I followed a Hypothesise → Evaluate → Iterate framework. In the hypothesise phase: hypothesis mapping, design system audit, and competitive funnel review. In the evaluate phase: think-aloud protocol, paired samples t-test, and thematic analysis. In the iterate phase: rapid-iterative integration, Theseus DS alignment, and stakeholder reviews. Three core hypotheses drove the design: (1) Login triggers will drive login behaviours that give users an enriched experience, (2) Auto-direction post number entry to packs UI will increase usability and decrease mean completion time vs. a multi-step journey, (3) Improved pack-cards will perform better on task completion time and usability. The evaluation used stratified samples with app usage as a 'savviness' measure, sessions via Zoom with screen-sharing, quantitative analysis via paired samples t-tests on completion time, and thematic analysis on qualitative data.",
      insights: "Four key insights emerged from the evaluative research that directly shaped the final design. Revamped pack cards with price-first hierarchy performed significantly better on both task completion time and usability — the price, data, and validity columns fit users' existing mental model. The CTA label 'login' created significant detestation — users, especially those with lower app-savviness in tier-2 and tier-3 cities, didn't understand what it did and ignored it entirely. Reconfiguring it to 'tap to view' past recharges with a paper-unwrapping reveal experience changed everything — over 30% of ongoing traffic began tapping this ingress and accessing their past recharges. Smoother auto-redirection from number entry to pack listing reduced cognitive load while matching users' mental models. And the quick filter rail, while found useful by 87.5% of participants, worked better as a filter button than floating chips — users preferred scrolling over filtering.",
      solution: "The before state had 3 clicks/taps, scattered information, improper visual hierarchy, lack of affordance to view plan details, and no ability to view past recharges. The after state reduced this to 2 clicks/taps with a primary-secondary-tertiary mental model for information, scannable plan cards, clear affordance to view details/get pack, and an external trigger to access past recharges at the beginning of the journey. Research revealed 3 behavioural archetypes: The habitual repeat-recharger (arrives via SMS link knowing their pack — 62.5% triggered by SMS reminders, recharges on day of expiry, data/day is the only filter they care about), The value hunter (actively seeks 84-day validity packs, higher tech-savviness, weighs talktime 75% and validity 62.5%), and The proxy-recharger (recharges for someone else, expects 'save this number' feature, arrives via internal triggers). Design responses were tailored: better access to last recharge for repeat-rechargers, scannable pack cards with immersive browsing for value hunters, and a 'save numbers as contact' roadmap item for proxy-rechargers.",
      impact: "Meaningful impact across UX and business conversion. Drop-off rate reduced to 12.75% — down from 27.5% post redesign. CSAT uplift of 12% — measured through priori-coding. The paired samples t-test showed very strong statistical significance (p<0.001, t(7) = 6.4932, p = 0.0003), confirming that the improved version had meaningfully lower completion time. The redesign is still live on airtel.in. Won the Airtel design award for 4 consecutive months.",
      learnings: "The 'immersive browsing' insight was the most dominant theme — 100% of users showed complete immersion in action-oriented taps, focused on browsing through packs rather than searching or filtering. Only 12.5% used the search bar for pack hunting. 0% of users scrolled any other interfaces — 100% preferred scrolling over typing for searching, sorting, or filtering. Quick filters were found useful by 87.5% of participants but weren't noticed on first interaction, with users preferring filter behaviour as a filter button. Smoother redirection helps conversion as long as it depicts the user's mental model. Revamped pack cards with price-first hierarchy had statistically significant better performance.",
    },
    decisions: [
      "Proxy research protocol (think-alouds) to replace missing analytics instrumentation",
      "Parallel ideation + evaluation to meet compressed GTM timeline",
      "Stratified samples by tech-savviness for mWeb's tier-2/tier-3 audience",
      "2-click journey with auto-direction to packs over the original 3-click flow",
      "Price-first plan card hierarchy based on mental model fit and t-test results",
      "Login trigger via 'past recharges' CTA instead of top-right account ingress",
      "Quick filters as a button (not inline chips) based on 87.5% discoverability finding",
    ],
    media: {
      hero: "Airtel Recharges — Hero banner / final design",
      heroImage: "/images/airtel-recharges/Airtel-recharges-hero.jpg",
      afterOverview: [
        { label: "Context & sales metrics ($107M+, 27.5% drop-off, 12-14% login)", image: "/images/airtel-recharges/airtel-recharges-context.jpg" },
        { label: "Funnel visualisation and problem statement", image: "/images/airtel-recharges/airtel-recharges-problem-funnel.jpg" },
      ],
      afterProblem: [
        { label: "Heuristic lens — what users struggled with", image: "/images/airtel-recharges/airtel-recharges-user-pain-points.jpg" },
      ],
      afterConstraints: [
        { label: "Three constraints and how I navigated each", image: "/images/airtel-recharges/airtel-recharges-constraints.jpg" },
      ],
      afterApproach: [
        { label: "Process framework: Hypothesise → Evaluate → Iterate", image: "/images/airtel-recharges/airtel-recharges-processes.jpg" },
        { label: "Hypotheses & assumptions with pack card variants", image: "/images/airtel-recharges/airtel-recharges-hypotheses.jpg" },
        { label: "Behavioural archetypes and user research findings", image: "/images/airtel-recharges/airtel-recharge-user-behaviours.jpg" },
        { label: "Thematic analysis of qualitative data", image: "/images/airtel-recharges/airtel-recharges-thematic-analysis.jpg" },
      ],
      afterInsights: [
        { label: "Revamped pack cards — better mental model fit & information hierarchy", image: "/images/airtel-recharges/airtel-recharges-primary-insight.jpg" },
        { label: "Ingresses to LOBs — Login as a functionality on web", image: "/images/airtel-recharges/airtel-recharges-insights-secondary.jpg" },
        { label: "Smoother redirection helps conversion when it matches mental models", image: "/images/airtel-recharges/airtel-recharges-insights-tertiary.jpg" },
        { label: "Quick filter rail — does floating it upfront help?", image: "/images/airtel-recharges/airtel-recharges-insights-alternate.jpg" },
      ],
      afterSolution: [
        { label: "Before — existing recharge UI issues", image: "/images/airtel-recharges/airtel-recharges-before.jpg" },
        { label: "After — redesigned recharge experience", image: "/images/airtel-recharges/airtel-recharges-after.jpg" },
        { label: "Iterations — deferring from login, making it simple", image: "/images/airtel-recharges/airtel-recharges-iterations.jpg" },
        { label: "Iterations — clean cards, filter button, scrolling behaviours", image: "/images/airtel-recharges/airtel-recharges-decisions.jpg" },
      ],
      afterImpact: [
        { label: "Impact metrics (12.75% drop-off, 12% CSAT uplift, >30% past recharges)", image: "/images/airtel-recharges/airtel-recharges-impact.jpg" },
        { label: "Paired samples t-test — statistical significance (p<0.001)", image: "/images/airtel-recharges/airtel-recharges-t-test-result.jpg" },
      ],
    },
  },
  {
    slug: "simpplr-workplace-search",
    title: "Simpplr Workplace Search — 40% faster task completion across enterprise information retrieval",
    context: "Simpplr — Redesigned workplace search for the branded mobile app, reducing objective completion time by 40% across enterprise information-finding tasks.",
    role: "Senior Product Designer",
    platform: "Mobile (branded app)",
    scale: "Enterprise intranet · Multi-source search",
    year: "2024",
    company: "Simpplr",
    companyLogo: {
      light: "/images/simpplr-workplace-search/simpplr-logo-onLight.svg",
      dark: "/images/simpplr-workplace-search/simpplr-logo-onDark.svg",
    },
    team: "2 designers, 1 researcher, 6 engineers",
    summary: "Redesigned workplace search for Simpplr's branded mobile app to help employees find policies, communications, people, and enterprise information faster — across intranet and connected tools like Google Drive, Confluence, ServiceNow, and SharePoint.",
    nda: false,
    sections: {
      overview: "Finding information at work should not feel like a scavenger hunt — but in most enterprise environments, it still does. Employees jump across the intranet, cloud drives, ticketing systems, and collaboration tools, often guessing where the right information might live. At Simpplr, the problem was especially visible in high-intent tasks: finding a holiday policy, a leave policy, internal updates, or workplace resources spread across connected systems. The challenge was not just about retrieval — it was about objective completion time.",
      challenge: "__custom__",
      approach: "Instead of forcing employees to search system by system, we brought everything into one place through Workplace Search inside Simpplr's branded mobile app. The idea was not to create just another search bar — it was to create a search experience that helped users move from search → scan → act with as little friction as possible. That meant supporting mixed result types across sites, pages, people, events, and enterprise connectors, while preserving enough context for fast recognition and confident action.",
      "experience model": "__custom__",
      "card anatomy": "One of the strongest ideas in the system was the card anatomy. Search results were not all the same, and they should not be treated that way. A page, a person, a ticket, and an event each carried different context, but they still needed to feel part of one visual language. The design system accounted for different thumbnail patterns — 16:9 content previews, 1:1 site thumbnails, and circular avatars for people. It also clarified primary, secondary, and tertiary layers of information through title hierarchy, metadata, and modular tags. In workplace search, people rarely read every result in detail — they scan for cues. The job of the interface was to make the right cue obvious, quickly.",
      filtering: "Search is not only about what people type — it is also about how easily they can narrow down what they mean. The filter system was designed to stay simple and lucid while still supporting deeper exploration across both intranet content and enterprise sources. Instead of overwhelming users with heavy controls, the interaction model focused on lightweight refinement — users could move closer to the right result without losing momentum.",
      "smart answers": "__custom__",
      "flow polish": "__custom__",
      solution: "__custom__",
      impact: "__custom__",
      learnings: "Source citation was the trust breakthrough — showing exactly where the answer came from, and letting users verify, was non-negotiable for adoption. The card anatomy investment paid off because workplace search is fundamentally a scanning task, not a reading task. And the mobile-first conversational pattern proved that enterprise AI can feel native on small screens when you design for the constraint instead of shrinking a desktop pattern.",
    },
    decisions: [
      "Unified search across intranet + enterprise connectors instead of siloed search per system",
      "Card anatomy with distinct thumbnail patterns (16:9, 1:1, avatar) per result type",
      "Lightweight filter refinement over heavy filter controls to maintain scanning momentum",
      "Smart Answer card above results with visible source citations for trust",
      "Conversational follow-up pattern on mobile for multi-turn refinement",
      "Permission-aware AI responses as a hard constraint from day one",
      "Feedback loops (thumbs up/down + report) to improve answer quality over time",
    ],
    media: {
      hero: "Simpplr Workplace Search — Hero banner",
      heroImage: "/images/simpplr-workplace-search/workplace-search-hero-image.jpg",
      "afterCard anatomy": [{ label: "Card anatomy — thumbnail patterns, title hierarchy, metadata layers", image: "/images/simpplr-workplace-search/cards-anatomy.png" }],
      afterFiltering: [{ label: "Filter system — lightweight refinement across intranet and enterprise sources", image: "/images/simpplr-workplace-search/filter-image.jpg" }],
    },
  },
  {
    slug: "nova-food-ordering",
    title: "NOVA Food Ordering — $1.3M ARR from a 0→1 white-label mobile product",
    context: "NOVA — Designed and shipped a white-label food ordering app from scratch, unlocking $1.3M ARR and 2,000+ locations in pipeline.",
    role: "Lead Product Designer",
    platform: "iOS + Android",
    scale: "Multi-brand white-label",
    year: "2025",
    company: "NOVA",
    team: "5 designers (my team), 2 PMs, 8 engineers",
    summary: "Led the 0→1 design of NOVA's first third-party white-label food ordering app — from strategic framing through to GA. Built the design team from scratch, defined the product architecture for multi-brand configurability, and shipped a platform that signed $1.3M ARR in its first enterprise contract with 2,000+ locations entering the pipeline.",
    nda: false,
    sections: {
      overview: "__custom__",
      "strategic context": "__custom__",
      "product framing": "__custom__",
      constraints: "__custom__",
      "design philosophy": "__custom__",
      "design decisions": "__custom__",
      "shipped solution": "__custom__",
      impact: "__custom__",
      learnings: "__custom__",
    },
    decisions: [
      "Theme-token architecture separating brand identity from structural components",
      "Hardest-use-case-first approach (complex menus) to ensure simpler cases work automatically",
      "Multi-mode ordering (dine-in / takeaway / delivery) as a first-class pattern",
      "Component library built for white-label configurability from day one",
    ],
    media: {
      hero: "NOVA Food Ordering App — Hero video",
      heroVideo: "https://player.vimeo.com/video/1162980664?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0",
    },
  },
  {
    slug: "nova-ai-campaigns",
    title: "NOVA AI Campaigns — 62.5% faster creation, 92 SUS score, and >200% campaign generation from existing users",
    context: "NOVA — Designed and shipped an AI-powered marketing studio for restaurants, cutting campaign creation by 62.5% and scoring 92 SUS in beta.",
    role: "Lead Product Designer (IC)",
    platform: "Mobile (NOVA Edge Pro)",
    scale: "Multi-tenant RMS + AI",
    year: "2025",
    company: "NOVA",
    team: "IC designer, 1 PM, 4 engineers",
    summary: "Led the 0→1 design of NOVA AI Campaigns — an AI-powered creative studio built into the NOVA Edge Pro mobile app. Restaurant operators generate on-brand images, videos, and campaigns with a single prompt, edit with circle-to-edit, and launch directly to Instagram, Facebook, email, and SMS. Shipped dark mode via full token architecture single-handedly within 6 weeks.",
    nda: false,
    sections: {
      overview: "__custom__",
      "strategic context": "__custom__",
      constraints: "__custom__",
      "design decisions": "__custom__",
      "shipped solution": "__custom__",
      "dark mode": "__custom__",
      impact: "__custom__",
      learnings: "__custom__",
    },
    decisions: [
      "Circle-to-edit for localized AI image adjustments — avoiding full regeneration",
      "Brand configuration as first-class primitive — palettes, logos, ratios persist across every campaign",
      "RMS-connected prompt intelligence — AI pulls live menu data, item performance, and sales history",
      "Dark mode via complete design token architecture — shipped in 6 weeks as sole IC designer",
      "Multi-channel preview before launch — Instagram, Facebook, email, SMS — all from one screen",
    ],
    media: {
      hero: "NOVA AI Campaigns — Hero banner",
      heroImage: "/images/nova-ai-campaigns/nova-ai-campaigns-cover-image.png",
    },
  },
];

// Additional case studies (shown on Work Index page)
const ADDITIONAL_PROJECTS = [
  {
    slug: "airtel-rewards",
    title: "Airtel Rewards — a behavioural engine that drove ~25% revenue uplift for 350M+ subscribers",
    context: "Airtel — Designed and researched the end-to-end rewards experience grounded in the Octalysis behavioural framework.",
    role: "Senior Product Designer",
    platform: "Mobile (iOS + Android)",
    scale: "350M+ subscribers",
    year: "2022",
    company: "Bharti Airtel",
    team: "1 designer (sole), 1 PM, 1 research lead, 4 engineers",
    summary: "Designed and researched the end-to-end rewards experience for India's largest telecom app. Grounded the architecture in the Octalysis behavioural framework, ran evaluative research with 6 participants across 3 task scenarios, and shipped a rewards system that converted passive users into repeat transactors — driving ~25% uplift in recharge and bill payment revenue.",
    nda: false,
    sections: {
      overview: "__custom__",
      "design philosophy": "__custom__",
      "information architecture": "__custom__",
      "ideation & moment of win": "__custom__",
      hypotheses: "__custom__",
      "evaluative research": "__custom__",
      "research findings": "__custom__",
      "working with constraints": "__custom__",
      "shipped solution": "__custom__",
      impact: "__custom__",
      learnings: "__custom__",
    },
    decisions: [
      "Grounded the entire rewards architecture in the Octalysis behavioural framework — balancing left-brain accomplishment with right-brain curiosity — before drawing a single screen",
      "Separated 'rewards earned' from 'ways to earn' at the architectural level, validated by 100% of research participants who naturally segregated these mental models",
      "Designed three distinct 'moment of win' patterns (Redemption, Activated Redemption, Accomplished) — each with intent-specific CTAs and navigation that drove users back to the rewards ecosystem",
      "Used graduated uncertainty as the vertical scroll architecture — moving from low uncertainty (earned rewards) through medium (locked tasks) to high (gamified elements) — creating a curiosity pull that encouraged deeper exploration",
      "Shifted from grid to list view for detailed reward browsing — matching the cognitive shift from comparative to sequential information processing",
      "Introduced loss-aversion locking as a behavioural trigger when backend constraints eliminated scratch-cards — preserving the intrinsic motivation loop within a simpler reward model",
    ],
    media: {
      hero: "Airtel Rewards — a behavioural engine that drove ~25% revenue uplift",
      heroImage: "/images/airtel-rewards/airtel-rewards-home-mvp.png",
      "afterDesign philosophy": [
        { label: "Octalysis framework mapping — left-brain vs right-brain reward triggers", image: "/images/airtel-rewards/airtel-rewards-philosophy.png" },
      ],
      "afterIdeation & moment of win": [
        { label: "Rewards home first draft — ideation", image: "/images/airtel-rewards/airtel-rewards-initial-ideation.png" },
        { label: "Moment of win — Redemption, Activated Redemption, Accomplished Rewards", image: "/images/airtel-rewards/airtel-rewards-moment-of-win.png" },
      ],
      "afterShipped solution": [
        { label: "Shipped rewards home — earned, claimed, locked rewards", image: "/images/airtel-rewards/airtel-rewards-home-mvp.png" },
        { label: "Mini rewards home — compact view", image: "/images/airtel-rewards/airtel-rewards-mini-rewards-home.png" },
        { label: "Rewards earned — claimed and unclaimed states", image: "/images/airtel-rewards/rewards-earned.png" },
      ],
    },
  },
  {
    slug: "simpplr-events",
    title: "Simpplr Events Calendar — 28.85% increase in event engagement through research-driven design",
    context: "Simpplr — Designed a calendar experience that drove users to connect external calendars and RSVP to intranet events, lifting event clicks by 28.85% post-GA.",
    role: "Senior Product Designer",
    platform: "Web App",
    scale: "Enterprise intranet",
    year: "2023",
    company: "Simpplr",
    companyLogo: {
      light: "/images/simpplr-workplace-search/simpplr-logo-onLight.svg",
      dark: "/images/simpplr-workplace-search/simpplr-logo-onDark.svg",
    },
    team: "1 designer, 1 PM, 4 engineers",
    summary: "Replaced a flat event list with a calendar-based RSVP experience on Simpplr's enterprise intranet. Ran think-aloud evaluations with 5 Internal Comms specialists, iterated on 4 key usability issues, and shipped to GA — driving 28.85% increase in event clicks, 13.58% lift in external calendar activation, and 37.5% CSAT uplift.",
    nda: false,
    sections: {
      overview: "__custom__",
      ideation: "__custom__",
      hypotheses: "__custom__",
      "evaluative research": "__custom__",
      "research findings": "__custom__",
      iterations: "__custom__",
      "shipped solution": "__custom__",
      impact: "__custom__",
      learnings: "__custom__",
    },
    decisions: [
      "Hypothesis-driven evaluation structure — every design decision tied to a measurable outcome, not aesthetic preference",
      "Calendar Settings replacing Calendar Hints — pivoted from assumed-useful legends to research-validated user controls",
      "Icon-only view selector over ambiguous toggle — eliminated expectancy errors caught in think-aloud evaluation",
      "Visual source distinction via fill/outline colors — validated by 80% user preference for color control",
      "Accessibility-first event elements — borders, underflow titles, and design-system alignment for inclusive experience",
      "EAP-first launch strategy — gathered validated feedback before GA rollout to de-risk at enterprise scale",
    ],
    media: {
      hero: "Simpplr Events Calendar — Hero banner",
      heroImage: "/images/simpplr-events/simmplr-events-calendar-hero.jpg",
      afterOverview: [
        { label: "Intranet architecture and personas around events", image: "/images/simpplr-events/simmplr-events-calendar-context.jpg" },
      ],
      afterIdeation: [
        { label: "Initial concepts — calendar view with event sources and RSVP", image: "/images/simpplr-events/simmplr-events-calendar-initial-concepts.jpg" },
      ],
      "afterEvaluative research": [
        { label: "Research methodology — think-aloud task-based evaluation", image: "/images/simpplr-events/simmplr-events-calendar-user-testing-process.jpg" },
      ],
      "afterShipped solution": [
        { label: "Shipped — Events Calendar at General Availability", image: "/images/simpplr-events/simmplr-events-calendar-launch-GA.jpg" },
      ],
    },
  },
];

const PROJECTS = [...FEATURED_PROJECTS, ...ADDITIONAL_PROJECTS];

const UI_SHOWCASE_VIDEOS = [
  {
    id: 1,
    title: "CEO Dashboard",
    subtitle: "Enterprise Command Centre — NOVA",
    year: "2025",
    platform: "TV Display + Mobile",
    role: "Lead Product Designer",
    tags: ["Enterprise", "Data Viz", "Interactive Map"],
    videoSrc: "https://player.vimeo.com/video/1180154074?background=1&autoplay=1&loop=1&muted=1",
    description: "A real-time executive dashboard built for CEO/CTO/COO personas across enterprise restaurant chains. The interface surfaces live sales data plotted on an interactive US map, allowing executives to monitor the health of their entire operation at a glance. Users navigate between states via the NOVA Edge Pro companion mobile app — a remote-style UI lets them tap into any state to zoom in and drill down. The zoomed state view highlights above-average and below-average performers, with a ranked list sorted by sales. Directional arrows on the mobile app allow fluid state-to-state navigation without leaving the zoomed context.",
    highlights: [
      "Live sales data rendered on interactive US map",
      "Companion mobile remote for hands-free navigation",
      "State-level drill-down with performance benchmarking",
      "Above/below average flagging with ranked store list",
    ],
  },
  {
    id: 2,
    title: "Voice AI Drive-Thru Analytics",
    subtitle: "NOVA Echo — AI Performance Dashboard",
    year: "2025",
    platform: "Web",
    role: "Lead Product Designer",
    tags: ["Voice AI", "Analytics", "Dashboard"],
    videoSrc: "https://player.vimeo.com/video/1180153304?background=1&autoplay=1&loop=1&muted=1",
    description: "An advanced analytics dashboard for NOVA Echo — the voice AI system deployed in drive-thru POS terminals. The dashboard gives restaurant managers end-to-end visibility into AI-driven ordering performance: revenue, order volume, upsell conversion rate, and CSAT scores. Managers can track the AI system's efficiency hour-by-hour across the day, access individual order transcripts, and flag moments where an agent handover occurred. The design balances information density with clarity, making complex AI performance data actionable for non-technical operators.",
    highlights: [
      "Revenue, orders, upsell rate & CSAT at a glance",
      "Hour-by-hour AI efficiency tracking",
      "Individual transcript access with handover flags",
      "Designed for non-technical restaurant managers",
    ],
  },
  {
    id: 3,
    title: "Swipe-to-Discover Menu Browsing",
    subtitle: "NOVA Food Ordering App — White-label Mobile",
    year: "2025",
    platform: "iOS + Android",
    role: "Lead Product Designer",
    tags: ["Mobile", "Food Tech", "White-label", "Interaction Design"],
    videoSrc: "https://player.vimeo.com/video/1180168536?background=1&autoplay=1&loop=1&muted=1",
    description: "A swipe-to-discover interaction pattern designed for NOVA's white-label food ordering app. Instead of presenting unfamiliar restaurant menus as static lists, this interaction lets users swipe through menu items in a discovery-first browsing mode — reducing decision fatigue for first-time visitors and surfacing underperforming items for restaurant operators. Built on a hardest-use-case-first philosophy: the system was designed to handle complex multi-category menus with nested modifiers, combos, and add-ons, ensuring simpler QSR menus work automatically with zero re-design. The interaction became a key differentiator in enterprise sales demos.",
    highlights: [
      "Discovery-first browsing for unfamiliar menus",
      "Reduced decision fatigue for first-time visitors",
      "Handled complex nested modifiers & combos",
      "Became a sales-demo differentiator for enterprise deals",
    ],
  },
  {
    id: 4,
    title: "AI Campaign Studio",
    subtitle: "NOVA Edge Pro — AI-Powered Marketing for Restaurants",
    year: "2025",
    platform: "iOS + Android",
    role: "Lead Product Designer",
    tags: ["AI", "Generative", "Marketing", "Mobile"],
    videoSrc: "https://player.vimeo.com/video/1180168549?background=1&autoplay=1&loop=1&muted=1",
    description: "An AI-powered creative studio built into NOVA Edge Pro that lets restaurant operators generate on-brand marketing campaigns with a single prompt. The system pulls live menu data, item performance, and sales history from the RMS to generate contextually relevant posters, videos, and copy. Operators can use circle-to-edit for localized AI adjustments without full regeneration, swap brand palettes for instant visual variations, and preview across Instagram, Facebook, email, and SMS before launching — all from one screen. Shipped with a complete dark mode token architecture in 6 weeks as the sole IC designer. The feature drove a 200% increase in campaign generation and scored 92 SUS in beta, while addressing a market gap where restaurants spend upwards of $80K/year on freelance designers.",
    highlights: [
      "62.5% faster campaign creation with circle-to-edit",
      "RMS-connected prompts pulling live menu & sales data",
      "Multi-channel preview: Instagram, Facebook, email, SMS",
      "92 SUS score in beta, 200% increase in campaign generation",
    ],
  },
];

const CAREER = [
  { year: "Apr 2026–Present", title: "Principal Product Designer", org: "NOVA", note: "Promoted to Principal to own design strategy across NOVA's full product suite — POS, Handheld, and front-of-house lines. Driving conversion rate optimisation and task-completion efficiency across enterprise workflows. Leading 0→1 product design for Inventory Nova Edge, Horizontal Kiosk, and Employee Management modules — unlocking new revenue streams and strengthening the platform's enterprise value proposition." },
  { year: "Feb 2025–Mar 2026", title: "Lead Product Designer", org: "NOVA", note: "Scaled team from 2 → 7 designers while directly driving $47K ARR + $1.3M ARR in first enterprise wins across 2,000+ locations. Led 0→1 white-label food ordering app, AI Campaigns (200% increase in campaign generation, 92 SUS, 62.5% faster creation), and Voice AI — contributing to ~40% of $900K seasonal ARR. Established design foundations across a complex multi-product ecosystem." },
  { year: "2023–2025", title: "Senior Product Designer", org: "Simpplr", note: "Drove 40% faster objective completion across Android & iOS by shipping Workplace Search + Smart Answers (AI). Lifted event clicks 28.85%, external calendar activation 13.58%, and CSAT 37.5% with a calendar-based RSVP experience. Built video analytics that increased native video creation ~38%. Won 1 team award and 4 individual awards." },
  { year: "2022–2023", title: "Senior Product Designer", org: "Khatabook", note: "Owned design and user research for transaction-heavy POS workflows across web and mobile, leading the discovery and launch of Khatabook Web's paid transactional features while scaling a cross-platform design system." },
  { year: "2021–2022", title: "Senior Product Designer", org: "Bharti Airtel", note: "Decreased recharge drop-offs from 27.5% → 12.75% in a $107M/mo revenue pipeline, lifting CSAT 12%. Designed Airtel Rewards driving ~25% revenue uplift in recharge and bill payments. Built Airtel Digital's Theseus design system for cross-platform consistency. Won 3 consecutive Digital Citizen Awards." },
  { year: "2020–2021", title: "Associate Director, Growth", org: "Stylework", note: "Led growth and product design across 8-member team, managing multiple product launches. Played a key role in securing INR 4Cr pre-Series A funding through product strategy and execution during critical growth phase." },
  { year: "2019–2020", title: "UX Design Consultant", org: "PayU", note: "Reduced merchant dashboard drop-off from 55% → 15% across core payout and neo-banking experiences. Created COIN design system, cutting feature delivery time from ~2 weeks to ~2 hours. Won ThankU Award — Website Champion." },
  { year: "2019", title: "UX Research Intern", org: "University of York, UK", note: "Reduced staff training time by 80% and improved user satisfaction by 75% through redesigned service workflows for the university library system. Won Campus Intern of the Year Award." },
  { year: "2015–2018", title: "Digital Design Consultant", org: "Independent", note: "Collaborated with 15+ early-stage startups across UX/UI, branding, and front-end web design, delivering end-to-end design solutions across multiple industries." },
];

const BLOG_POSTS = [
  {
    slug: "designing-voice-first-food-ordering",
    title: "Designing a Voice-First Food Ordering Experience",
    excerpt: "A deep dive into designing conversational AI for food ordering — covering voice-first UX, real-time confirmation, smart reordering, loyalty redemption, and hands-free checkout experiences.",
    date: "Mar 7, 2026",
    readTime: "4 min read",
    tags: ["Voice AI", "Conversational UX", "Food Tech", "Interaction Design"],
    coverImage: "/images/voice-ai-blog-cover.webp",
    coverHue: 35,
    content: [
      { type: "paragraph", text: "Voice AI is everywhere. But most voice experiences still feel like experiments. We wanted to build one that felt invisible." },
      { type: "paragraph", text: "This is the story of how we designed and launched a voice-first food ordering system inside Nova's restaurant apps — built for real multitasking, real customers, and real checkout flows." },
      { type: "heading", text: "The Problem: Ordering Food Still Demands Too Much Attention" },
      { type: "paragraph", text: "It's 6:40 PM. You're driving home from work. Or cooking while helping your kids with homework. You're hungry — but your hands are busy." },
      { type: "paragraph", text: "You open your favorite restaurant's NOVA-branded app. Normally, that means browsing categories, adding items, editing modifiers, reviewing cart, and checking out. Multiple taps. Multiple screens. Cognitive load." },
      { type: "paragraph", text: "We asked a simple question: What if ordering food required one tap — and then no more?" },
      { type: "paragraph", text: "At the centre of our bottom navigation sits the Voice AI icon. Tap once. Speak naturally. The rest unfolds." },
      { type: "video", src: "https://player.vimeo.com/video/1170991360?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" },
      { type: "heading", text: "Our Core UX Decision: Voice First. Not Hybrid." },
      { type: "paragraph", text: "Most conversational commerce products layer voice on top of traditional flows. We didn't. From day one, we committed to voice-first ordering. Not a chatbot. Not a command-driven interface. Not a secondary input." },
      { type: "paragraph", text: "You speak. The AI listens. The UI confirms. Just like ordering from a waiter." },
      { type: "quote", text: "\"Large pepperoni pizza, no olives, extra cheese.\" \"Actually remove the soda.\" \"Make that two.\"" },
      { type: "paragraph", text: "In real time — items appear in the cart, modifiers update instantly, removals reflect visually, and the AI confirms verbally. Voice handles intent. UI builds trust. That balance defines the experience." },
      { type: "video", src: "https://player.vimeo.com/video/1170991405?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" },
      { type: "heading", text: "Designing Conversational AI for Real Humans" },
      { type: "paragraph", text: "People don't speak in structured commands. They pause, interrupt, correct themselves, and speak in fragments. So we designed for natural speech — not perfect syntax." },
      { type: "paragraph", text: "Users can add items, remove items, modify ingredients, change quantities, and ask what's inside something — without learning commands. In voice UX, complexity must stay invisible. Simplicity must feel obvious." },
      { type: "heading", text: "No Dead Ends: Handling Unavailable Items Intelligently" },
      { type: "paragraph", text: "In traditional food ordering apps, unavailable items create friction. In voice AI, they can destroy flow." },
      { type: "paragraph", text: "If something is unavailable, our AI informs the user conversationally, suggests relevant alternatives, displays those alternatives clearly, and allows instant voice selection. No restart. No back navigation. No frustration." },
      { type: "paragraph", text: "One key learning: Error recovery matters more than recognition accuracy. Perceived intelligence comes from graceful recovery — not perfection." },
      { type: "video", src: "https://player.vimeo.com/video/1170991443?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" },
      { type: "heading", text: "Memory as a Feature: Reordering Without Thinking" },
      { type: "paragraph", text: "Food ordering is habitual behavior. So we built memory directly into the system." },
      { type: "quote", text: "\"Get me what I ordered last Friday.\"" },
      { type: "paragraph", text: "If multiple orders exist, the AI presents them. If only one exists, it confirms and adds it instantly. No browsing order history. No manual rebuild." },
      { type: "paragraph", text: "This is where conversational AI becomes powerful: it recognises patterns, reduces effort, and removes decision fatigue. Ordering feels automatic." },
      { type: "video", src: "https://player.vimeo.com/video/1170991472?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" },
      { type: "heading", text: "Extending Voice Into Checkout — Where It Actually Matters" },
      { type: "paragraph", text: "Most voice ordering systems stop at cart creation. We didn't. The AI remains active inside the cart and checkout flow. Users can review items, remove products, change quantities, ask for totals, and apply offers." },
      { type: "quote", text: "\"Would you like to pay with your card ending in 4521?\"" },
      { type: "paragraph", text: "But we didn't stop there. The AI can also redeem loyalty points, apply available rewards, use e-gift card balances, suggest using Nova Wallet, and switch between saved payment methods — all via voice." },
      { type: "paragraph", text: "For Apple Pay or card payments, biometric verification remains necessary. But if paying through wallet balance, loyalty credits, or e-gift balance — the experience becomes fully hands-free. Voice. Confirmation. Order placed." },
      { type: "video", src: "https://player.vimeo.com/video/1170991513?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" },
      { type: "heading", text: "UI Philosophy: Designing Certainty Into an Invisible Interface" },
      { type: "paragraph", text: "Voice introduces uncertainty: \"Is it listening?\" \"Did it add that correctly?\" So our UI system had one responsibility: remove doubt." },
      { type: "paragraph", text: "We implemented fluidic neumorphic visuals, clear listening indicators, instant visual confirmation of every voice action, strong AI activity states, and an Always Listening mode for uninterrupted flow." },
      { type: "paragraph", text: "In voice UX, confirmation must happen twice: you hear it, and you see it. That dual reassurance builds trust quickly." },
      { type: "heading", text: "What We Learned About Voice AI in Commerce" },
      { type: "paragraph", text: "Visual and auditory confirmation both matter. Alternatives prevent frustration. Error recovery defines perceived intelligence. Loyalty and wallet integration makes voice checkout meaningful. And simplicity scales better than complexity." },
      { type: "heading", text: "The Bigger Vision Behind Nova's Voice AI" },
      { type: "paragraph", text: "This isn't about replacing traditional ordering. It's about matching the pace of modern life. For drivers. For parents. For multitaskers. For fast-paced individuals." },
      { type: "quote", text: "NOVA's voice AI ordering is built not to replace traditional ordering, but to match the fast-paced life for fast-paced individuals. It's an integrable system that recognises patterns and makes you feel ordering food isn't a chore — but rather something not to think or stress about." },
      { type: "paragraph", text: "When ordering food stops competing for your attention, when it becomes something you don't have to think about — that's when conversational AI becomes truly useful. And that's what we set out to design." },
    ],
  },
  {
    slug: "privacy-hoax-usable-privacy-settings",
    title: "A Step Away from Privacy Hoax — Usable Privacy Settings and Their Relation with Trust",
    excerpt: "When approximately 100 controls are distributed across a 6-inch screen, users must navigate multiple layers to locate specific features — or remain unaware they exist. We studied how reducing privacy settings impacts usability and trust.",
    date: "Mar 19, 2019",
    readTime: "13 min read",
    tags: ["UX Research", "Privacy", "Trust", "Mobile App Design"],
    coverImage: "/images/blog-privacy-settings/Privacy-settings-background-cover.png",
    coverHue: 210,
    content: [
      { type: "paragraph", text: "In contemporary digital environments, privacy concerns significantly impact user trust in organizations. The design of privacy settings — specifically how controls are presented, communicated, and perceived — plays a critical role in establishing this trust relationship." },
      { type: "quote", text: "This research project is carried out by four master's students (yes, yes, it includes me), so from now on by 'we' I mean the group, and by 'I', I mean myself." },
      { type: "heading", text: "What Led Us to the Research?" },
      { type: "paragraph", text: "Smartphone usage comprises 52% of web traffic. Despite larger screen sizes becoming common, mobile displays remain constrained compared to desktop environments. When approximately 100 controls are distributed across a 6-inch screen, users must navigate multiple layers to locate specific features — or remain unaware they exist. I describe this phenomenon as the privacy hoax." },
      { type: "quote", text: "Reduction in the number of privacy settings in a mobile application increases the trust in users and usability of the settings." },
      { type: "paragraph", text: "The research focused on mobile users, as desktop interfaces can accommodate more options through proper layout. Previous studies demonstrated that customization options correlate positively with perceived trust." },
      { type: "heading", text: "Phase 1: The Literature Review" },
      { type: "paragraph", text: "The literature review examined human-computer interaction research, identifying key themes around privacy. Trust was conceptualized through three components: Benevolence (the trustee's demonstrated care for the trustor), Competence (the trustee's ability to accomplish assigned tasks), and Integrity (the trustee's honesty and truthfulness)." },
      { type: "heading", text: "Phase 2: Going with Mobile App" },
      { type: "paragraph", text: "The research analyzed Facebook's mobile application, which had the lowest App Store rating (2.6/5) and contained 85+ settings. Content analysis of the top 50 helpful and 50 recent user reviews identified trust as the primary emerging theme, followed by usability and bugs." },
      { type: "image", src: "/images/blog-privacy-settings/privacy-settings-persona.png", caption: "Privacy personas generated from content analysis of user reviews" },
      { type: "paragraph", text: "This analysis generated privacy personas reflecting user privacy concerns." },
      { type: "heading", text: "Phase 3: The Design Workshop" },
      { type: "image", src: "/images/blog-privacy-settings/privacy-settings-design-workshop.png", caption: "Card sorting exercise with participants" },
      { type: "paragraph", text: "Six volunteers participated in card-sorting exercises. Participants initially performed open card sorting, grouping privacy settings without predetermined categories. Subsequently, they performed closed card sorting using six researcher-defined categories." },
      { type: "paragraph", text: "Six final categories emerged: Ads, Security, Newsfeed, Profile, and Notifications. Participants provided one-to-two line descriptions for each category." },
      { type: "image", src: "/images/blog-privacy-settings/privacy-settings-design-workshop-2.png", caption: "Final categories from the card sorting workshop" },
      { type: "heading", text: "Phase 4: Mapping Settings Using Users' Mental Model" },
      { type: "image", src: "/images/blog-privacy-settings/privacy-settings-map-settings.png", caption: "Settings mapped to redesigned categories using users' mental models" },
      { type: "paragraph", text: "Each setting was mapped to the redesigned version using users' mental models derived from prior research. When Ads was disabled, all related settings were hidden or deactivated. When enabled, settings were visible and active." },
      { type: "paragraph", text: "Wireframes were developed using Sketch, maintaining Facebook's existing design system to isolate the independent variable (number of settings) from confounding design factors." },
      { type: "image", src: "/images/blog-privacy-settings/privacy-settings-redesign.gif", caption: "The redesigned privacy settings walkthrough" },
      { type: "heading", text: "Phase 5: User Study" },
      { type: "paragraph", text: "Eighty participants (20 per researcher) completed usability testing sessions. The protocol included context briefing and consent, a questionnaire measuring Facebook perception and demographics, five task-based scenarios, task completion with both the original and redesigned versions in randomized order, and finally a trust questionnaire (7-point Likert scale) and System Usability Scale (SUS)." },
      { type: "paragraph", text: "The five tasks tested: preventing beer advertisements from appearing, enabling multi-factor authentication, preventing profile visibility in search results, displaying only friend posts in the newsfeed, and disabling nearby event alerts." },
      { type: "heading", text: "Analysis of Data Collected" },
      { type: "paragraph", text: "Data was recorded using paper surveys and transferred to Google Sheets, then analyzed using SPSS. Due to non-parametric distributions, researchers employed the Wilcoxon Matched Pair Signed Rank Test and Spearman's correlation factor." },
      { type: "heading", text: "Fewer Settings Leads to Greater Benevolence" },
      { type: "paragraph", text: "The study revealed significant differences in benevolence between conditions. The redesigned version with fewer options fostered stronger perceptions of benevolence. Simplified layouts and clear communication enable users to accomplish privacy goals more easily and understand available controls." },
      { type: "quote", text: "You might think now, why wasn't there improvement in honesty and integrity components?" },
      { type: "paragraph", text: "We speculated that competence concerns arise when applications lack specific settings, preventing achievement of user goals. Integrity may suffer when settings are buried or poorly communicated, preventing informed decision-making." },
      { type: "heading", text: "Fewer Settings Leads to Increased Usability" },
      { type: "paragraph", text: "The redesigned version demonstrated superior usability. Participants noted it was easier and more straightforward. Task success rates improved with the simplified interface. Reduced complexity created clearer mapping between user intent and system behavior." },
      { type: "heading", text: "Increased Usability Leads to Greater Trust" },
      { type: "paragraph", text: "A notable finding: usability correlated significantly with all three trust dimensions in both conditions. Simpler interfaces enhance perceptions of benevolence, competence, and integrity by demonstrating organizational care through thoughtful design and transparent control mechanisms." },
      { type: "quote", text: "This finding of our study discerns that with proper communication of navigational mapping, reduction in the number of privacy settings enlarges usability which in turn correlates to substantial increment in trust." },
      { type: "heading", text: "What Can We Take Away from This Study?" },
      { type: "image", src: "/images/blog-privacy-settings/privacy-settings-before-after.png", caption: "Before and after — the impact of simplified privacy settings" },
      { type: "paragraph", text: "Design clear, concise privacy settings limiting options to 11\u201315, with simplified written communication explaining available controls. Smartphone screens have limited space. Excessive options force users into multiple navigation layers, reducing both usability and trust." },
      { type: "paragraph", text: "The study demonstrated that limiting options while maintaining clarity simultaneously increases usability and user trust in applications." },
      { type: "quote", text: "In simple terms, in this current fast-paced world, users love when they can take out their smartphone and achieve something in a single tap of the screen rather than scampering through piles of screens and yet unable to do what they wanted to do." },
      { type: "paragraph", text: "While acknowledging research limitations, this work establishes foundational understanding for privacy and security settings design, potentially influencing future research in this domain." },
    ],
  },
  {
    slug: "colours-trust-digital-technologies-cross-cultural",
    title: "Colours and Trust in Digital Technologies: A Cross-Cultural Viewpoint",
    excerpt: "The internet is scattered with posts about colour psychology in design. But something a majority of digital designers miss is the consideration of cultural groups you are designing for. This article explores how colour influences trust across cultures.",
    date: "Jun 28, 2020",
    readTime: "11 min read",
    tags: ["UX Research", "Psychology", "Trust", "Web Design"],
    coverImage: "/images/blog-colour-trust/color-trust-cover-image.png",
    coverHue: 240,
    content: [
      { type: "paragraph", text: "The internet is scattered with posts and knowledge about colour psychology in the design of digital products. You must've seen or read somewhere about how red correlates to energy, excitement, stimulation, strength; how yellow imbibes vibes of optimism, self-esteem, friendliness, creativity. While there's nothing wrong with these pieces of information, something a majority of digital designers miss out is the consideration of cultural groups you are designing for in the context of digital product design." },
      { type: "paragraph", text: "Although the world of product design is evolving to incorporate globalisation as one of the driving design principles, the effects of localisation can't be ignored, because after all, not all products are global yet. There are digital designers building products for a population that encompasses a single cultural group, and hence I feel this article will provide value to these creatives in crafting meaningful experiences." },
      { type: "heading", text: "Colour and Culture" },
      { type: "paragraph", text: "Several studies have dealt with the preference of colour across different cultures. Based on the colour\u2014culture chart (Boor & Russo, 1993), Barber and Badre (1998) suggested that colour may impact the user's expectations about navigation, links, and content, as well as overall satisfaction." },
      { type: "image", src: "/images/blog-colour-trust/color-trust-culture-color-chart.png", caption: "Colour\u2014culture chart (Boor & Russo, 1993)" },
      { type: "paragraph", text: "Cyr & Trevor-Smith (2004) compared websites from Germany, Japan, and the U.S. to investigate how language, symbols, content, structure, navigation, and colour varied between them. They found considerable variations in the use of colour. While Japanese sites used red twice as much as German or American websites, blue was the most popular colour used by German and American websites, showing an inclination towards grey. Notably, white was used as the background colour across the majority of websites, notwithstanding the fact that white represents death in Japan according to the colour\u2014culture chart." },
      { type: "quote", text: "Studies have revealed the use of cooler colours such as blue and green is favoured more as compared to warmer colours like yellow or red. To specify, blue is amalgamated with wealth, trust and security and hence used in corporate entities such as websites of corporate banks." },
      { type: "paragraph", text: "The propensity to choose blue as a website colour by web designers as well as users was also confirmed by Bonnardel et al. (2011). Eye-tracking and interview methods were implemented in studying proclivity for specific colours across different cultural groups (Cyr et al., 2010), confirming the dislike towards the yellow colour scheme among Canadian, German and Japanese audiences." },
      { type: "paragraph", text: "The study also highlights the concept of colour appeal \u2014 defined as the degree to which colours used in websites are perceived as appealing and appropriate. Hence, colour is an intrinsic part of visual design as well as interface design, and also one of the constitutional cultural markers in website design. Not only do there exist differences between the emotional and behavioural responses elicited by various colours, but literature also upholds cultural preferences of colour and their substantial effect on trust and satisfaction." },
      { type: "heading", text: "Concepts of Trust and Culture in Digital Technologies" },
      { type: "paragraph", text: "Despite the extensive research on the concept of trust and the endeavours to disentangle its complexities, this field of research still remains very complicated. Some researchers have classified trust as a multidimensional entity, whereas others consider trust to be a single dimension. Across these studies, four common themes emerge:" },
      { type: "paragraph", text: "Benevolence: the degree by which the trustee (organisation designing the product) cares for the trustor (the users). Competence: the degree of achieving tasks by the trustee. Integrity: the truthfulness of the trustee towards the trustor. Predictability: the ability of the trustor to predict the actions of the trustee." },
      { type: "paragraph", text: "Several studies have explored the relationship between web design and trust. Website design characteristics are found to be antecedents to trust, including satisfaction and loyalty. In a multi-phased study, Cyr (2008) investigated the effect of three different dimensions of website design on trust, satisfaction and e-loyalty \u2014 information design, visual design and navigational design \u2014 using a mixed cultural sample of German, Canadian and Chinese participants. A strong relationship between visual design and trust was found overall." },
      { type: "paragraph", text: "This relationship between website design properties and trust indicates the use of cultural markers can result in differences of trust towards a particular product or service among different cultural groups." },
      { type: "heading", text: "Colour and Trust: How Can You Leverage Colours to Influence Trust?" },
      { type: "paragraph", text: "A study I conducted in 2019, under the supervision of Helen Petrie, a prominent researcher in this field, revealed some interesting results in this domain of colour and trust. While the study was principally conducted to examine the effects of localisation of mobile apps on trust, satisfaction and loyalty, a repeated measures ANOVA on the data collected revealed that colour had a significant interaction with trust." },
      { type: "paragraph", text: "The study was conducted among two cultural groups: The United Kingdom and The Chinese cultural groups. The total trust scores were compared for the UK colour (blue, rgb #3864CD) and Chinese colour (red-orange linear gradient, #FF2120 to #FF7338). The results depict that the colour blue instills more trust in users as compared to the red-orange gradient (Mean trust score for blue: 2.91, for red-orange gradient: 2.76)." },
      { type: "paragraph", text: "This finding is similar to the conclusions of previous studies where cooler colours like blue and green were preferred to brighter colours like yellow and red. Noteworthy is the work of Lichte (2007) who analysed the impact of advertisement colour in eliciting emotions, associating blue with wealth, trust and security \u2014 which is reconfirmed by our findings." },
      { type: "quote", text: "Especially in the field of m-commerce, blue elicits trust in users as opposed to brighter colours like red or orange. This can be used by designers involved in designing m-commerce apps to better understand the preferences of online customers in this competitive market." },
      { type: "paragraph", text: "While the results show strong significance overall, distinctions between cultures weren't extrapolated. This isn't the first time that cultural differences in colour didn't see a confirming end. Cyr, Head & Larios (2009) while examining colour appeal in websites expected the Japanese to favour yellow as it symbolises grace and dignity in their culture, only to deduce that yellow received adverse reactions from all cultural groups including the Japanese." },
      { type: "paragraph", text: "Similarly, though we expected the red-orange colour being favoured and inculcating trust for the Chinese users \u2014 as red signifies happiness in China and is the flag colour \u2014 that's not what the findings unearthed. As an argument, it can be said that existing commonalities among cultural groups triumph socio-cultural meaning in certain cases; one prime source of commonality in colour preferences is that human beings are exposed to the same colours in the environment \u2014 blue skies, yellow sun, green trees." },
      { type: "quote", text: "The theory of cultural differences in colour, though proved several times in the website design domain, isn't as strong when it comes to mobile apps. This might be because of smaller screen sizes and the extensive usage of many global apps like Facebook, Twitter, Instagram by billions across the globe on a daily basis." },
      { type: "paragraph", text: "That being said, the correlation between use of certain colours and the sense of trust it inflicts on users can be used by digital designers and developers to significantly influence the emotional and behavioural responses of their users." },
    ],
  },
  {
    slug: "design-sprint-ux-university-libraries",
    title: "How I Conducted a Design Sprint in the Context of UX in University Libraries",
    excerpt: "A 24/7 library makes it almost impossible to bring the entire team together for a week. Here's how I modified a design sprint into two days to identify training gaps and develop an improved framework for the customer service team.",
    date: "Sep 16, 2019",
    readTime: "9 min read",
    tags: ["Design Sprint", "UX Research", "Problem Solving", "Service Design"],
    coverImage: "/images/blog-design-sprint/design-sprint-blog-cover.png",
    coverHue: 160,
    content: [
      { type: "paragraph", text: "I recently finished a 10-week long internship for the Information Services at the University of York. I worked on an extensive project that looks into identifying the difficulties associated with the training of the customer service team at the University Library and developing an improved training framework for the same." },
      { type: "paragraph", text: "As I started the internship, I realised the complexities involved in different aspects of UX in Libraries, and how different it is from the UX of digital products. The library runs 24/7, with the customer service team divided into Information Assistants (IA) and Customer Service Assistants (CSA), further segregated into different shift patterns including overnight and weekend shifts. Understanding each shift and the corresponding difficulties and pain-points was the main challenge." },
      { type: "paragraph", text: "The first phase of the internship marked contextual inquiry sessions with each of the divisions, followed by the generation of mindmaps. The purpose was to better understand each role and identify the area which needs further inspection. Qualitative analysis (thematic analysis) was performed on the interview data to identify the key issues faced by the IAs and CSAs, leading to the problem statements used in the design sprint session." },
      { type: "heading", text: "What is a Design Sprint?" },
      { type: "paragraph", text: "A Design Sprint is a 4-day process for the expeditious solution of big challenges, in crafting new products or even improving existing products. In simple terms, it is used to identify a problem worth the effort of solving it and rapidly generating possible solutions for the particular problem." },
      { type: "quote", text: "In the context of a 24/7 library, it's almost impossible to bring in the entire team together for a week to facilitate the sprint. Hence, some modifications were incorporated to achieve the agile development of solution in just two days." },
      { type: "heading", text: "Day 1: Introduction to the Sprint" },
      { type: "paragraph", text: "All the participants of the session (the sprint members) are briefed about the session and what it aims for. This is followed by giving out handouts which included the results of the qualitative analysis \u2014 semi-structured interviews using thematic analysis method, to uncover existing themes as gaps in the current training process. All members are asked to give a rough glance to the handout." },
      { type: "heading", text: "HMW Notes" },
      { type: "paragraph", text: "The qualitative report handed out to all participants stated the different themes from the thematic analysis of the interview data, along with quotations from the interviews to explain the context. The facilitator explained how to phrase a 'how might we' statement from an example problem picked at random from the report." },
      { type: "paragraph", text: "The sprint members were given 15 minutes to form as many HMWs as they could formulate from the problems defined by the report. The HMWs were collected and put up on the whiteboard, then grouped according to the categories/themes they are based on. The ones that didn't form any group were placed separately as miscellaneous. Two members were then asked to walk up to the board and verify the affinity mapping, and the expert evaluation completed the first stage of the sprint." },
      { type: "image", src: "/images/blog-design-sprint/design-sprint-blog-hmw-post.png", caption: "The HMW board after voting" },
      { type: "heading", text: "Vote on the HMW Statements" },
      { type: "paragraph", text: "All members are given two votes, which they can cast on any two HMWs. However, members also have the option to vote for a particular group, in which case they exhaust both votes in that single selection. After the members are done casting their votes, the Decider walks up to the whiteboard." },
      { type: "paragraph", text: "The Decider has only one vote (the Supervote) and has the liberty to select a particular group or a single HMW. The group/single HMW chosen by the Decider will be the one analyzed further. Note that for digital products, we focus on a single HMW for a Sprint session. But for libraries, we can select a group as the focus, largely due to the nature of services offered." },
      { type: "image", src: "/images/blog-design-sprint/design-sprint-blog-hmw.png", caption: "The HMW board" },
      { type: "heading", text: "The Three-Step Sketch" },
      { type: "paragraph", text: "Idea-generation Phase (15 mins): Everyone on the team is asked to privately jot down some rough ideas. You can write down as many ideas as you want, look up the internet, or use your ideations. Circle the ideas you think are important." },
      { type: "paragraph", text: "Crazy 8s (15 mins): Each member is given a piece of A4 paper folded into 8 segments and asked to draw a rough sketch of one idea in each frame, taking 1\u20132 minutes per sketch. Each sketch can vary in a single or multiple aspects, or might be entirely different from one another. The main principle is to generate as many ideas as possible." },
      { type: "paragraph", text: "Sketch (15 mins): Members create a final storyboard on a sheet of paper \u2014 take your best ideation or mix up from the variations, make it anonymous and self-explanatory. Ugly is okay. Give it a catchy title and proper wordings. After this phase, the sketches are collected and put up on the whiteboard." },
      { type: "heading", text: "Sticky Decision" },
      { type: "paragraph", text: "Speed Critique (15 mins): The facilitator discusses each solution sketch, calling out standout ideas. Concerns and questions were reviewed by the creator. The standout ideas were written down on sticky notes and put up beside each sketch." },
      { type: "paragraph", text: "Heat Map (10 mins): Members were asked not to discuss among themselves, to look at a solution sketch and put dot stickers beside the parts they like. Each member was given three dot stickers to cast their votes. More dots means its more exciting or innovative. If they voted for an entire sketch, they'd exhaust all three votes in that single selection." },
      { type: "quote", text: "This marked the end of Day 1. All the Sprint members are acknowledged for their participation." },
      { type: "heading", text: "Day 2: Supervote" },
      { type: "paragraph", text: "The Decider walks up and reviews the board. Since the decision of the team is up front, it's easier for the decider to decide. He can go with the one with most votes, or choose according to his own will. The decider has three special votes, so the winner might be more than one sketch or idea. The Decider's votes have 'N' written on top of the dots to segregate them from the rest." },
      { type: "heading", text: "Storyboarding" },
      { type: "paragraph", text: "Session 1 (45 mins): On a whiteboard, a grid with 15 boxes is drawn. The winning sketches/ideas are drawn and reflected as a story on the storyboard. This is probably the most time-consuming part of the entire sprint session." },
      { type: "paragraph", text: "The storyboard consists of storylines, each representing a particular phase of the training/induction process. The winning idea consisted of a dedicated trainer approach, which needed a pre-induction phase exploring possible frameworks for electing the dedicated trainer. The facilitator along with the decider discussed how to formulate each storyline. Some ideas can be taken from runner-up sketches, but all winning ideas must be incorporated." },
      { type: "image", src: "/images/blog-design-sprint/design-sprint-blog-induction-story-board.png", caption: "The induction storyboard" },
      { type: "paragraph", text: "Session 2 (15 mins): The election of the dedicated trainer required a distinct storyboard fabricated over another session with the Decider. It was named as the pre-induction storyboard and consisted of the remaining 6 storylines. This storyboard is more towards a conceptual approach and further explorations are needed to determine the exact method of implementation." },
      { type: "image", src: "/images/blog-design-sprint/design-sprint-blog-pre-induction-storyboard.png", caption: "The pre-induction storyboard" },
      { type: "heading", text: "But That's Not the End" },
      { type: "paragraph", text: "Note that the design sprint is incomplete without testing the prototype/framework, which leads to further identification of areas of improvement. Owing to time constraints and the fact that this training framework involves a considerable amount of time to put into place, the sprint was limited to the stage of formulating the storyboard." },
      { type: "paragraph", text: "Nonetheless, it should be recalled that a sprint is an agile process of identification of the most important problem and developing a solution idea, which usually takes weeks to achieve if done using other techniques." },
      { type: "paragraph", text: "The principle of 'working alone, together' is the key to a design sprint. Usually, team meetings are marked by dominant individuals who are expert in pitching their ideas, and it's those ideas which customarily get executed. The idea of a sprint is to eliminate that issue and involve the dexterous as well as agile product design ideas to formulate a working prototype in a short period with contributions from all the stakeholders." },
      { type: "quote", text: "A huge thanks to all of the Customer Service Coordinators, the member of the Information Assistants Team, the member of the Customer Service Assistants team, and the Decider to take part in this Sprint." },
    ],
  },
  {
    slug: "defining-culture-exploring-cultural-considerations-design",
    title: "Defining Culture and Exploring Cultural Considerations in Design",
    excerpt: "Every person carries patterns of thinking, feeling and potential acting learned throughout their lifetime. This article explores Hofstede's cultural dimensions and how they translate into cultural markers in user interface design.",
    date: "Apr 29, 2020",
    readTime: "7 min read",
    tags: ["UX Research", "Cross-Cultural", "Product Design", "Psychology"],
    coverImage: "/images/blog-culture-design/culture-design-cover.png",
    coverHue: 230,
    content: [
      { type: "quote", text: "Every person within him or herself carries patterns of thinking, feeling and potential acting which is learned throughout their lifetime." },
      { type: "paragraph", text: "The term 'culture' is complicated and difficult to unwind. Several endeavours have been made to untangle this complex web in the literature. The purpose of understanding different cultures in relation to experience design is to strengthen the thought processes behind designing an interface localised to a particular cultural group as per your user base or population." },
      { type: "paragraph", text: "Culture is a collective phenomenon shared by people inhabiting the same social environment. In the domain of cross-cultural study, the most notable contribution is by cultural anthropologist Geert Hofstede. During the 1980s, he conducted detailed interviews with IBM employees across 53 countries. The IBM interviews underwent statistical analysis to extract patterns of thoughts, feelings, and actions that he termed as mental programs." },
      { type: "paragraph", text: "Later in the 1990s, he collaborated with Michael Bond, a Canadian living and working in the Far East since 1971, and produced a Chinese Value Survey that replicated the dimensions found earlier in the IBM survey apart from the evolution of a separate fifth dimension. These five dimensions stand out in the field of cross-cultural research as a crucial viewpoint which is later imbibed by hundreds of researchers to conduct further studies." },
      { type: "heading", text: "Power Distance Index" },
      { type: "paragraph", text: "The first of the patterns identified was termed as power-distance (PD) index which relates to the dependency relationships in a cultural group. It is defined as the extent to which the less powerful members of institutions and organizations within a country expect and accept that power is distributed unequally." },
      { type: "paragraph", text: "Countries with lower power distance index exhibit emotional comfort in interdependence among people of different power levels, lower hierarchy and democratic leaders in organizations, and privileges and status symbols being deprecated. On the other hand, countries with higher power-distance reveal inequalities among people, organizations reflecting deep hierarchies, and people's acceptance of privileges and status symbols in the society." },
      { type: "heading", text: "Individualism vs Collectivism" },
      { type: "paragraph", text: "An extensive number of people reside in societies where the interest of group triumphs individual interests \u2014 these cultural groups are referred to as collectivists. Collectivism pertains to societies in which people from birth onward are integrated into strong, cohesive in-groups, which throughout people's lifetime continue to protect them in exchange for unquestioning loyalty. As its opposite, individualistic societies are marked by individuals being brought up to look after only their individual interests or that of their immediate families." },
      { type: "heading", text: "Masculinity vs Femininity" },
      { type: "paragraph", text: "Hofstede's third cultural dimension largely deals with differences existing in different cultures based on gender roles. Hofstede associated assertiveness, toughness and focus on material success to the characteristic traits of men, and tenderness, modesty and concern for the quality of life to the women's mannerism in a masculine society. Whereas in feminine cultures, there exist overlapping gender roles and negligible distinctions between men and women." },
      { type: "heading", text: "Uncertainty Avoidance" },
      { type: "paragraph", text: "Some people feel more anxious about uncertain things as opposed to some who find comfort and accept the unexpected. Countries with higher uncertainty avoidance index tend to show worries among health and money, people have higher hesitancy for trying out new technological products, innovations are sparse, and a display of more ethnic prejudice is pronounced. By contrast, in low UA countries, businesses tend to be more informal, strategic matters are aligned with business goals, and the presence of more ethnic tolerance is noticed." },
      { type: "heading", text: "Long-Term vs Short-Term Orientation" },
      { type: "paragraph", text: "The fifth and final dimension Hofstede proposed is long-term vs short-term orientation, where long-term orientation stands for fostering of virtues oriented towards future rewards \u2014 in particular, perseverance and thrift. Its opposite pole, short-term orientation, stands for the fostering of virtues related to the past and present. Long-term oriented cultural groups show concern with personal adaptiveness and an overall appeal of knowledge and education. On the opposite end, countries with short-term orientation lay concern with personal stability and show the presence of a sense of wisdom." },
      { type: "paragraph", text: "Website design had been the central point of a number of cross-cultural investigations using Hofstede's cultural dimensions. The study by Robbins and Stylianou (2002) showed that websites of countries with high power distance indices displayed organizational charts, voices of executives and sketches of top leaders. Security provisions and privacy policy statements were indicative of individualism/collectivism." },
      { type: "paragraph", text: "An evaluation of Indian and U.S. university websites showed significant differences in certain aspects of website design properties, in relation to the cultural dimensions of individualism/collectivism, long-term/short-term orientation, and uncertainty avoidance. The U.S. being rated higher on individualism index, their university websites showed the use of pictures of individuals, addressing methods as 'you' instead of 'we', success stories of individuals, and personalized features. On the contrary, Indian university websites displayed a mission statement impacting a large group, images of groups of students, use of formal speech and stated opinions of the group instead of an individual." },
      { type: "paragraph", text: "Hence research suggests that Hofstede's dimensions of culture are indeed a notable tool in user interface design which gives rise to the concept of cultural markers in user interfaces." },
      { type: "heading", text: "Cultural Markers" },
      { type: "paragraph", text: "The elements of user interfaces that have significance for a certain cultural group are termed cultural markers. These might include particular colours, icons in particular styles, national flags and other features \u2014 denoting a cultural integration that often has a conventional use in the design of web or mobile applications among that cultural group." },
      { type: "paragraph", text: "Various studies have identified different interface design elements as notable cultural markers including icons, colours, the orientation of text, typography, use of various shapes and architectural elements like the use of state-building, house, church, office and landscape." },
      { type: "paragraph", text: "For your upcoming project, you might want to keep in mind the different cultural markers and alter them to localise any web or mobile interfaces you're designing to a particular culture. Specifically for colour, here is a reference colour-culture chart illustrating the different emotional associations to the same colour across different cultural groups." },
      { type: "image", src: "/images/blog-culture-design/cultural-blog-chart.png", caption: "Colour-culture chart (Boor & Russo, 1993) \u2014 emotional associations across cultural groups" },
      { type: "paragraph", text: "However, with the evolution of this world and globalisation, designers are building products which have a large population base spreading all across the globe. In that case, using neutral markers and adopting a global interface is much preferred as compared to localisation." },
    ],
  },
];

// ─── Styles Helper ───────────────────────────────────────────
const css = (obj) => obj;

// ─── Animated Section Wrapper ────────────────────────────────
function Reveal({ children, delay = 0, style = {}, threshold }) {
  const [ref, visible] = useReveal(threshold);
  const { reduced } = useMotion();
  const t = reduced ? "none" : `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`;
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: t,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Reusable Components ─────────────────────────────────────
function Chip({ children, style = {} }) {
  const t = useTheme();
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "100px",
        fontSize: "12px",
        letterSpacing: "0.03em",
        fontWeight: 500,
        background: t.chipBg,
        color: t.chipText,
        border: `1px solid ${t.border}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", onClick, style = {} }) {
  const t = useTheme();
  const [hovered, setHovered] = useState(false);
  const { reduced } = useMotion();

  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: variant === "text" ? "0" : "12px 28px",
    borderRadius: "100px",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
    letterSpacing: "0.01em",
    cursor: "pointer",
    border: "none",
    transition: reduced ? "none" : "all 0.25s ease",
  };

  const variants = {
    primary: {
      background: hovered ? t.accentHover : t.accent,
      color: "#FFFFFF",
    },
    secondary: {
      background: "transparent",
      color: t.text,
      border: `1px solid ${t.border}`,
      ...(hovered && { borderColor: t.textMuted }),
    },
    text: {
      background: "transparent",
      color: hovered ? t.accent : t.text,
      padding: 0,
    },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

function PrimaryCTA({ onClick, label = "View case studies" }) {
  const t = useTheme();
  const { reduced } = useMotion();
  const isDark = t === themes.dark;
  const [hovered, setHovered] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const isMobileCTA = window.innerWidth <= 768;

  const accent = isDark ? "#E87A4F" : "#D0603A";
  const accentRgb = isDark ? "232,122,79" : "208,96,58";
  // Warm gradient used for the rotating border ring
  const gradient = isDark
    ? `linear-gradient(112deg, #E87A4F 3%, rgba(232,160,100,0.82) 44%, rgba(200,120,70,0.63) 86%)`
    : `linear-gradient(112deg, #D0603A 3%, rgba(200,120,80,0.82) 44%, rgba(170,90,50,0.63) 86%)`;

  const handleEnter = useCallback(() => {
    setHovered(true);
    setAnimKey((k) => k + 1);
  }, []);
  const handleLeave = useCallback(() => {
    setHovered(false);
  }, []);

  // Colors: default bg = accent, hover bg = white/dark (inverted)
  const bgDefault = accent;
  const bgHover = isDark ? "#FFFFFF" : "#1A1A1A";
  const textDefault = "#FFFFFF";
  const textHover = isDark ? "#1A1A1A" : "#FFFFFF";

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
        zIndex: 1,
        userSelect: "none",
      }}
    >
      {/* Glow layer behind (visible on hover / breathing on mobile) */}
      <span
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "100px",
          background: gradient,
          filter: "blur(8px)",
          opacity: isMobileCTA ? 0.6 : (hovered ? 1 : 0),
          transition: reduced ? "none" : "opacity 0.6s ease",
          zIndex: -1,
          pointerEvents: "none",
          animation: isMobileCTA && !reduced ? "ctaMobileBreathing 3s ease-in-out infinite" : "none",
        }}
      />

      {/* Inner container — clips the rotating gradient */}
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "180px",
          padding: "13px 28px",
          borderRadius: "100px",
          overflow: "hidden",
          transition: reduced ? "none" : "transform 0.15s ease",
        }}
      >
        {/* Solid background layer */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            backgroundColor: hovered ? bgHover : bgDefault,
            backgroundClip: "padding-box",
            border: "2px solid transparent",
            transition: reduced ? "none" : "background-color 0.3s ease",
          }}
        >
          {/* Rotating gradient pseudo — sits behind the solid bg, peeks through as border */}
          <span
            style={{
              content: '""',
              position: "absolute",
              top: "50%",
              left: "-10px",
              right: "-10px",
              paddingBottom: "110%",
              zIndex: -1,
              background: gradient,
              borderRadius: "inherit",
              transformOrigin: "center center",
              transform: hovered ? "translateY(-50%) rotate(605deg)" : "translateY(-50%)",
              transition: reduced ? "none" : "transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
              animation: reduced ? "none" : "ctaGradientRotate 4s cubic-bezier(0.17, 0, 0.36, 1) infinite",
            }}
          />
        </span>

        {/* Label container — holds main + clone for the text roll effect */}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            overflow: "hidden",
            height: "1.2em",
            lineHeight: "1.2em",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
            letterSpacing: "0.01em",
            color: hovered ? textHover : textDefault,
            transition: reduced ? "none" : (hovered ? "color 0s" : "color 0.3s ease"),
          }}
        >
          {/* Main label — slides out on hover */}
          <span
            key={`main-${animKey}`}
            style={{
              display: "block",
              animation: hovered && !reduced
                ? "ctaTextSlideOut 0.5s cubic-bezier(0.33, 0, 0.67, 1) forwards"
                : "none",
            }}
          >
            {label}
          </span>
          {/* Clone label — slides in on hover */}
          <span
            key={`clone-${animKey}`}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              display: "block",
              opacity: 0,
              animation: hovered && !reduced
                ? "ctaTextSlideIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards"
                : "none",
            }}
          >
            {label}
          </span>
        </span>
      </span>
    </button>
  );
}

function ResumeCTA({ onClick }) {
  const t = useTheme();
  const { reduced } = useMotion();
  const isDark = t === themes.dark;
  const [hovered, setHovered] = useState(false);

  /* Dora-style inner glow CTA
     Default: subtle inset white/accent shadow (2px)
     Hover: blooming inset glow (20px) with slow 0.8s transition */
  const glowColor = isDark ? "rgba(255,255,255,0.9)" : `${t.accent}`;
  const subtleGlow = isDark
    ? "rgba(255,255,255,0.45) 0px 0px 2px 0px inset"
    : `${t.accent}66 0px 0px 2px 0px inset`;
  const bloomGlow = isDark
    ? "rgba(255,255,255,0.5) 0px 0px 20px 0px inset, rgba(255,255,255,0.15) 0px 0px 40px 0px inset"
    : `${t.accent}40 0px 0px 20px 0px inset, ${t.accent}18 0px 0px 40px 0px inset`;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 28px",
        borderRadius: "100px",
        fontSize: "14px",
        fontWeight: 500,
        fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
        letterSpacing: "0.01em",
        cursor: "pointer",
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
        color: hovered
          ? (isDark ? "#fff" : t.accent)
          : t.text,
        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
        boxShadow: hovered ? bloomGlow : subtleGlow,
        transition: reduced ? "none" : "box-shadow 0.8s ease, color 0.5s ease, border-color 0.5s ease",
        borderColor: hovered
          ? (isDark ? "rgba(255,255,255,0.25)" : `${t.accent}44`)
          : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"),
      }}
    >
      Open résumé
    </button>
  );
}

function HighFiveBadge({ mousePos, isMobile, reduced }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  // Theme-aware palette
  const bg = isDark ? "rgba(30,30,30,0.92)" : "rgba(245,243,240,0.94)";
  const border = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const textFill = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.45)";
  const dashStroke = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
  const innerDash = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)";
  const glowColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

  const badgeRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [fistBump, setFistBump] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [hovered, setHovered] = useState(false);
  const clickTimeout = useRef(null);
  const fistTimeout = useRef(null);
  const flashTimeout = useRef(null);
  const audioCtxRef = useRef(null);

  // Fade out when user scrolls past the hero
  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight;
      setVisible(window.scrollY < heroHeight * 0.65);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Play a short, cheerful "high five" pop sound via Web Audio API
  const playHighFiveSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Quick ascending pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);

      // Short bright click on top
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1800, now + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.06);
      gain2.gain.setValueAtTime(0.08, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.15);
    } catch (_) { /* audio not supported — silent fail */ }
  }, []);

  // Click shake + flash + sound
  const handleClick = useCallback(() => {
    setClicked(true);
    setShowFlash(true);
    playHighFiveSound();
    clearTimeout(clickTimeout.current);
    clearTimeout(flashTimeout.current);
    // After high-five slap (0.5s) + bounce (0.6s × 2 = 1.2s), show fist bump for 1.5s, then back to wave
    clickTimeout.current = setTimeout(() => {
      setClicked(false);
      setFistBump(true);
      clearTimeout(fistTimeout.current);
      fistTimeout.current = setTimeout(() => setFistBump(false), 1500);
    }, 1700);
    flashTimeout.current = setTimeout(() => setShowFlash(false), 2000);
  }, [playHighFiveSound]);

  useEffect(() => () => {
    clearTimeout(clickTimeout.current);
    clearTimeout(fistTimeout.current);
    clearTimeout(flashTimeout.current);
  }, []);

  // Scroll parallax offset
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Responsive sizing
  const SIZE = isMobile ? 96 : 120;
  const emojiSize = isMobile ? "26px" : "32px";
  const textSize = isMobile ? "7" : "6.5";
  const textPath = isMobile
    ? "M9,50a41,41 0 1,0 82,0a41,41 0 1,0 -82,0"
    : "M8,50a42,42 0 1,0 84,0a42,42 0 1,0 -84,0";
  const innerR = isMobile ? 26 : 28;

  // Movement (no mouse follow on mobile, just scroll parallax)
  const followX = isMobile ? 0 : (mousePos?.x || 0) * 80;
  const followY = isMobile ? 0 : (mousePos?.y || 0) * 60;
  const scrollOffset = scrollY * (isMobile ? 0.08 : 0.18);

  // Chrome DevTools element highlight colors
  const flashBg = "rgba(111, 168, 220, 0.35)";
  const flashBorder = "rgba(111, 168, 220, 0.7)";
  const flashOuter = "rgba(255, 155, 0, 0.25)";

  return (
    <div
      ref={badgeRef}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: isMobile ? "88px" : "260px",
        bottom: "auto",
        right: isMobile ? "44px" : "clamp(120px, 12vw, 260px)",
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        borderRadius: "50%",
        cursor: "pointer",
        zIndex: 10,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: `translate(${followX}px, ${followY + scrollOffset}px)`,
        transition: reduced ? "opacity 0.3s" : "opacity 0.5s ease",
        userSelect: "none",
      }}
    >
      {/* Chrome DevTools-style gradient leak flash on click */}
      {showFlash && !reduced && (
        <>
          {/* Outer margin highlight (orange tint — like DevTools margin) */}
          <div style={{
            position: "absolute",
            inset: "-16px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${flashOuter} 40%, transparent 80%)`,
            animation: "badgeFlashIn 0.3s ease-out forwards, badgeFlashOut 0.6s ease-in 1.4s forwards",
            pointerEvents: "none",
            zIndex: -2,
          }} />
          {/* Inner content highlight (blue tint — like DevTools content area) */}
          <div style={{
            position: "absolute",
            inset: "-4px",
            borderRadius: "50%",
            background: flashBg,
            border: `2px solid ${flashBorder}`,
            animation: "badgeFlashIn 0.2s ease-out forwards, badgeFlashOut 0.6s ease-in 1.4s forwards",
            pointerEvents: "none",
            zIndex: -1,
          }} />
          {/* Edge glow streaks — leaking from all sides */}
          <div style={{
            position: "absolute",
            inset: "-30px",
            borderRadius: "50%",
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(111, 168, 220, 0.3) 20deg,
              transparent 40deg,
              transparent 80deg,
              rgba(255, 155, 0, 0.2) 100deg,
              transparent 120deg,
              transparent 170deg,
              rgba(111, 168, 220, 0.25) 190deg,
              transparent 210deg,
              transparent 260deg,
              rgba(255, 155, 0, 0.2) 280deg,
              transparent 300deg,
              transparent 350deg,
              rgba(111, 168, 220, 0.15) 360deg
            )`,
            animation: "badgeFlashIn 0.3s ease-out forwards, badgeFlashSpin 2s linear, badgeFlashOut 0.6s ease-in 1.4s forwards",
            pointerEvents: "none",
            zIndex: -2,
          }} />
        </>
      )}

      {/* Inner — handles the shake on click */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          animation: clicked && !reduced ? "badgeShake 0.5s ease" : "none",
          transform: hovered && !reduced ? "scale(1.08)" : "scale(1)",
          transition: reduced ? "none" : "transform 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)",
        }}
      >
        {/* Background circle */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: bg,
            border: `1px solid ${border}`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            transition: reduced ? "none" : "background 0.3s ease, border-color 0.3s ease",
          }}
        />

        {/* Rotating SVG text on circular path */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: 0,
            animation: reduced ? "none" : `badgeTextSpin ${isMobile ? 35 : 45}s linear infinite`,
          }}
        >
          <defs>
            <path
              id={isMobile ? "badgeCirclePathM" : "badgeCirclePath"}
              d={textPath}
              fill="none"
            />
          </defs>

          {/* Inner decorative dashed circle */}
          <circle
            cx="50"
            cy="50"
            r={innerR}
            fill="none"
            stroke={innerDash}
            strokeWidth="0.5"
            strokeDasharray="1 3"
          />

          {/* Outer dashed track */}
          <path
            d={textPath}
            fill="none"
            stroke={dashStroke}
            strokeWidth="0.4"
            strokeDasharray="1 5"
          />

          <text
            fill={textFill}
            fontSize={textSize}
            fontWeight="600"
            letterSpacing={isMobile ? "1.5" : "1.8"}
            fontFamily="'TTCommonsPro', 'Inter', system-ui, sans-serif"
            style={{ textTransform: "uppercase" }}
          >
            <textPath href={isMobile ? "#badgeCirclePathM" : "#badgeCirclePath"}>
              {isMobile
                ? "HIGH FIVE \u00B7 HIGH FIVE \u00B7 HIGH FIVE \u00B7 "
                : "HIGH FIVE \u00B7 HIGH FIVE \u00B7 HIGH FIVE \u00B7 HIGH FIVE \u00B7 "}
            </textPath>
          </text>
        </svg>

        {/* Center emoji — scales in on hover/tap */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: hovered
              ? "translate(-50%, -50%) scale(1.15) rotate(-8deg)"
              : "translate(-50%, -50%) scale(1)",
            fontSize: emojiSize,
            lineHeight: 1,
            transition: reduced ? "none" : "transform 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)",
            pointerEvents: "none",
          }}
        >
          <span style={{
            display: "inline-block",
            animation: reduced ? "none"
              : clicked ? "highFiveSlap 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards, highFiveBounce 0.6s ease-in-out 0.5s 2"
              : fistBump ? "fistBumpIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards"
              : "handWave 2.5s ease-in-out infinite",
            transformOrigin: clicked ? "50% 100%" : fistBump ? "50% 50%" : "70% 70%",
          }}>{clicked ? "🙌" : fistBump ? "👊" : "👋"}</span>
        </div>
      </div>

      {/* Glow ring on hover */}
      <div
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: reduced ? "none" : "opacity 0.4s ease",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </div>
  );
}

function HeroVideo({ src, isMobile, hideAudio }) {
  const t = useTheme();
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Viewport-aware auto-pause/play (50% threshold)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        if (entry.isIntersecting) {
          iframe.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
          setIsPlaying(true);
        } else {
          iframe.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "*");
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleMute = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const newMuted = !muted;
    iframe.contentWindow.postMessage(JSON.stringify({ method: "setVolume", value: newMuted ? 0 : 1 }), "*");
    setMuted(newMuted);
  }, [muted]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", borderRadius: isMobile ? "0px" : "32px", overflow: "hidden", aspectRatio: "16/9", background: "#000" }}>
      <iframe
        ref={iframeRef}
        src={src}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        allow="autoplay; fullscreen"
        title="Hero video"
      />
      {!hideAudio && (
        <button
          onClick={toggleMute}
          style={{
            position: "absolute",
            top: "32px",
            right: "32px",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 3,
            color: "#fff",
            padding: 0,
          }}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          )}
        </button>
      )}
    </div>
  );
}

function SectionVideo({ src, isMobile }) {
  const t = useTheme();
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", borderRadius: isMobile ? "16px" : "24px", overflow: "hidden", background: "#000" }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: "100%", display: "block" }}
      />
    </div>
  );
}

/* ─── ShowcaseCardStack — animated card stack for UI Showcase teaser ─── */
function ShowcaseCardStack() {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { reduced } = useMotion();
  const { navigate } = useRoute();
  const [activeIdx, setActiveIdx] = useState(0);
  const isMobile = window.innerWidth <= 768;

  const cards = [
    { src: "/images/ai-campaigns-cover.webp", title: "AI Campaign Studio", platform: "iOS + Android" },
    { src: "/images/voice-ai-drive-thru-dashboard.webp", title: "Voice AI Drive-Thru Analytics", platform: "Web Dashboard" },
    { src: "/images/ceo-dashboard.webp", title: "CEO Dashboard", platform: "TV Display + Mobile" },
    { src: "/images/menu-swiping.webp", title: "Swipe-to-Discover Menu", platform: "iOS + Android" },
  ];

  const total = cards.length;

  const [transitioning, setTransitioning] = useState(false);

  // Auto-rotate cards
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setActiveIdx((prev) => (prev + 1) % total);
        setTimeout(() => setTransitioning(false), 50);
      }, 200);
    }, 3500);
    return () => clearInterval(timer);
  }, [total, reduced]);

  const accentRgb = isDark ? "232,122,79" : "208,96,58";

  // Alternating tilt — like a shuffled stack, slight left/right rotations
  const tiltAngles = [0, -2.5, 2, -1.5];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "340px" : "380px",
        perspective: "1200px",
        cursor: "pointer",
      }}
      onClick={() => navigate("/ui")}
    >
      {cards.map((card, i) => {
        const offset = ((i - activeIdx) % total + total) % total;
        const isActive = offset === 0;
        const depth = offset;

        // Stacked on top of each other with alternating slight tilts
        const rotate = tiltAngles[depth] || 0;
        const translateY = depth * (isMobile ? 8 : 8);
        const scale = 1 - depth * 0.03;
        const opacity = depth > 2 ? 0 : 1 - depth * 0.15;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: isMobile ? "92%" : "88%",
              maxWidth: isMobile ? "420px" : "480px",
              aspectRatio: "16 / 10",
              borderRadius: "16px",
              overflow: "hidden",
              transformOrigin: "center center",
              transform: `translate(-50%, -50%) rotate(${rotate}deg) translateY(${translateY}px) scale(${scale})`,
              transition: reduced ? "none" : "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
              zIndex: total - depth,
              opacity,
              boxShadow: isActive
                ? isDark
                  ? `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), 0 0 40px rgba(${accentRgb},0.1)`
                  : `0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)`
                : isDark
                  ? "0 8px 24px rgba(0,0,0,0.5)"
                  : "0 8px 24px rgba(0,0,0,0.08)",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={card.src}
              alt={card.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
            {/* Gradient overlay for readability */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
            {/* Title + platform */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: isMobile ? "16px 16px 14px" : "24px 24px 20px",
                opacity: isActive ? (transitioning ? 0 : 1) : 0,
                transform: isActive && !transitioning ? "translateY(0)" : "translateY(8px)",
                transition: reduced ? "none" : "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div style={{
                fontSize: isMobile ? "15px" : "17px",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "6px",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                letterSpacing: "-0.01em",
              }}>
                {card.title}
              </div>
              <div style={{
                fontSize: isMobile ? "11px" : "12px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
                letterSpacing: "0.02em",
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}>
                {card.platform}
              </div>
            </div>
          </div>
        );
      })}

    </div>
  );
}

function MediaPlaceholder({ label = "Image placeholder", aspect = "16/9", span = false }) {
  const t = useTheme();
  return (
    <div
      style={{
        aspectRatio: aspect,
        background: `linear-gradient(135deg, ${t.bgCard} 0%, ${t.bgAlt} 100%)`,
        borderRadius: "12px",
        border: `1px dashed ${t.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        margin: span ? "40px 0" : "0",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={t.textDim} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>
      <span style={{ fontSize: "12px", color: t.textDim, textAlign: "center", padding: "0 16px" }}>{label}</span>
    </div>
  );
}

// ─── Image Lightbox Overlay ─────────────────────────────────
function ImageLightbox({ src, alt, onClose }) {
  const { reduced } = useMotion();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!src) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "16px 12px" : "48px",
        cursor: "zoom-out",
        animation: reduced ? "none" : "imgOverlayIn 0.2s ease",
      }}
    >
      {/* Glass close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: isMobile ? "12px" : "24px",
          right: isMobile ? "12px" : "24px",
          width: isMobile ? "40px" : "44px",
          height: isMobile ? "40px" : "44px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: isMobile ? "16px" : "20px",
          transition: "background 0.2s ease",
          zIndex: 3001,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
      >
        <svg width={isMobile ? "14" : "18"} height={isMobile ? "14" : "18"} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <img
        src={src}
        alt={alt || ""}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          borderRadius: isMobile ? "8px" : "16px",
          cursor: "default",
          animation: reduced ? "none" : "imgScaleIn 0.25s ease",
        }}
      />
    </div>,
    document.body
  );
}

function MediaGrid({ items, stacked }) {
  const t = useTheme();
  const imgBorder = t === themes.dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.2)";
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return (
    <>
    <div style={{
      display: "grid",
      gridTemplateColumns: (isMobile || stacked) ? "1fr" : "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
      gap: isMobile ? "12px" : "16px",
      margin: isMobile ? "24px -16px" : "40px 0",
    }}>
      {items.map((item, i) => {
        const isObj = typeof item === "object" && item !== null;
        const label = isObj ? item.label : item;
        const image = isObj ? item.image : null;
        return image ? (
          <div
            key={i}
            onClick={() => { setLightboxSrc(image); setLightboxAlt(label); }}
            style={{
              borderRadius: isMobile ? "0px" : "32px",
              overflow: "hidden",
              border: isMobile ? "none" : imgBorder,
              borderTop: isMobile ? imgBorder : undefined,
              borderBottom: isMobile ? imgBorder : undefined,
              cursor: "zoom-in",
            }}
          >
            <img src={image} alt={label} style={{ width: "100%", display: "block" }} loading="lazy" />
          </div>
        ) : (
          <MediaPlaceholder key={i} label={label} aspect="4/3" />
        );
      })}
    </div>
    {lightboxSrc && <ImageLightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc(null)} />}
    </>
  );
}

function SectionTitle({ children, sub }) {
  const t = useTheme();
  const mobile = window.innerWidth <= 768;
  return (
    <div style={{ marginBottom: mobile ? "36px" : "48px" }}>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500, color: t.text, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.25 }}>{children}</h2>
      {sub && <p style={{ fontSize: mobile ? "15px" : "16px", color: t.textMuted, marginTop: "12px", maxWidth: "540px", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

function Section({ children, id, style = {} }) {
  const t = useTheme();
  return (
    <section
      id={id}
      style={{
        padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 80px)",
        maxWidth: "1200px",
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function BackBar({ label = "Back", to }) {
  const t = useTheme();
  const { navigate } = useRoute();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "100px clamp(20px, 5vw, 80px) 0",
      }}
    >
      <button
        onClick={() => to ? navigate(to) : window.history.back()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          borderRadius: "100px",
          border: `1px solid ${hovered ? t.border : t.borderLight}`,
          background: hovered ? t.chipBg : "transparent",
          color: hovered ? t.text : t.textMuted,
          fontSize: "13px",
          fontWeight: 500,
          fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
          cursor: "pointer",
          transition: "all 0.2s ease",
          letterSpacing: "0.01em",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15,18 9,12 15,6" />
        </svg>
        {label}
      </button>
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────
function Nav({ onToggleTheme, isDark, onToggleMotion, motionReduced }) {
  const t = useTheme();
  const { navigate, path } = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const menuCloseTimer = useRef(null);
  const { reduced } = useMotion();

  // Handle open/close with closing animation state
  const toggleMenu = useCallback(() => {
    if (mobileOpen) {
      // Start closing
      setMenuClosing(true);
      clearTimeout(menuCloseTimer.current);
      menuCloseTimer.current = setTimeout(() => {
        setMobileOpen(false);
        setMenuVisible(false);
        setMenuClosing(false);
      }, 450);
    } else {
      setMobileOpen(true);
      setMenuVisible(true);
      setMenuClosing(false);
    }
  }, [mobileOpen]);

  useEffect(() => () => clearTimeout(menuCloseTimer.current), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const [logoHovered, setLogoHovered] = useState(false);

  const links = [
    { label: "Work", to: "/work" },
    { label: "UI Showcase", to: "/ui" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
    { label: "Resume", to: "/resume" },
    { label: "Contact", to: "/contact" },
  ];

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: scrolled ? "12px clamp(20px, 5vw, 80px)" : "20px clamp(20px, 5vw, 80px)",
    background: scrolled ? t.navBg : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled ? `1px solid ${t.borderLight}` : "1px solid transparent",
    transition: reduced ? "none" : "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <>
      <nav style={navStyle}>
        <button
          onClick={() => navigate("/")}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "4px",
            margin: "-4px",
          }}
        >
          <div style={{
              width: "44px",
              height: "44px",
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              background: isDark
                ? "linear-gradient(145deg, rgba(26,26,26,0.95) 0%, rgba(232,122,79,0.2) 100%)"
                : "linear-gradient(145deg, rgba(247,247,245,0.97) 0%, rgba(208,96,58,0.2) 100%)",
              transform: logoHovered ? "scale(1.08) translateY(-1px)" : "scale(1) translateY(0)",
              boxShadow: logoHovered
                ? isDark
                  ? "0 4px 16px rgba(232,122,79,0.25)"
                  : "0 4px 16px rgba(208,96,58,0.18)"
                : "none",
              transition: reduced ? "none" : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
            }}>
              <img
                src={isDark ? "/images/logoTypeDark.svg" : "/images/logotypeLight.svg"}
                alt="RG"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: logoHovered ? "translate(-50%, -50%) rotate(-6deg)" : "translate(-50%, -50%) rotate(0deg)",
                  width: "18px",
                  height: "18px",
                  objectFit: "contain",
                  transition: reduced ? "none" : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </div>
          <span style={{
            fontSize: "15px",
            fontWeight: 600,
            color: logoHovered ? t.accent : t.text,
            letterSpacing: "0.02em",
            fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
            transition: reduced ? "none" : "color 0.25s ease",
          }}>
            Ron
          </span>
        </button>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div className="nav-links-desktop" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {links.map((l) => (
              <NavLink key={l.to} label={l.label} to={l.to} active={path === l.to || (l.to === "/work" && path.startsWith("/work/")) || (l.to === "/blog" && path.startsWith("/blog/"))} />
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "8px" }}>
            <ToggleButton onClick={onToggleTheme} title={isDark ? "Light mode" : "Dark mode"}>
              {isDark ? "☀" : "☾"}
            </ToggleButton>
            <ToggleButton onClick={onToggleMotion} title={motionReduced ? "Enable motion" : "Reduce motion"}>
              {motionReduced ? "▸" : "◼"}
            </ToggleButton>
          </div>

          {/* Mobile hamburger — animated bars */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px",
              minWidth: "44px",
              minHeight: "44px",
              position: "relative",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <div style={{ width: "20px", height: "14px", position: "relative" }}>
              {/* Top bar */}
              <span style={{
                position: "absolute",
                left: 0,
                width: "20px",
                height: "2px",
                borderRadius: "1px",
                background: t.text,
                transition: reduced ? "none" : "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease",
                top: 0,
                transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "translateY(0) rotate(0deg)",
              }} />
              {/* Middle bar */}
              <span style={{
                position: "absolute",
                left: 0,
                width: "20px",
                height: "2px",
                borderRadius: "1px",
                background: t.text,
                transition: reduced ? "none" : "opacity 0.2s ease",
                top: "6px",
                opacity: mobileOpen ? 0 : 1,
              }} />
              {/* Bottom bar */}
              <span style={{
                position: "absolute",
                left: 0,
                width: "20px",
                height: "2px",
                borderRadius: "1px",
                background: t.text,
                transition: reduced ? "none" : "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease",
                top: "12px",
                transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
              }} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu — liquid glass + staggered reveal/reverse */}
      {menuVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            overflow: "hidden",
            opacity: menuClosing ? 0 : 1,
            transition: reduced ? "none" : `opacity ${menuClosing ? "0.35s" : "0.4s"} cubic-bezier(0.23, 1, 0.32, 1)`,
            pointerEvents: menuClosing ? "none" : "auto",
          }}
        >
          {/* Frosted backdrop */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? "rgba(10, 10, 10, 0.72)"
              : "rgba(250, 248, 246, 0.75)",
            backdropFilter: `blur(${isDark ? "32px" : "26px"}) saturate(1.6)`,
            WebkitBackdropFilter: `blur(${isDark ? "32px" : "26px"}) saturate(1.6)`,
          }} />

          {/* Liquid glass gradient orbs */}
          <div style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "70vw",
            height: "70vw",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle, rgba(232,122,79,0.12) 0%, rgba(232,122,79,0.03) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(208,96,58,0.1) 0%, rgba(208,96,58,0.03) 50%, transparent 70%)",
            animation: reduced ? "none" : "menuOrbFloat 6s ease-in-out infinite alternate",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-15%",
            left: "-15%",
            width: "60vw",
            height: "60vw",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle, rgba(91,141,239,0.1) 0%, rgba(91,141,239,0.02) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(91,141,239,0.08) 0%, rgba(91,141,239,0.02) 50%, transparent 70%)",
            animation: reduced ? "none" : "menuOrbFloat 7s ease-in-out 1s infinite alternate-reverse",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle, rgba(69,184,143,0.08) 0%, transparent 60%)"
              : "radial-gradient(circle, rgba(69,184,143,0.06) 0%, transparent 60%)",
            animation: reduced ? "none" : "menuOrbFloat 8s ease-in-out 2s infinite alternate",
            pointerEvents: "none",
          }} />

          {/* Menu content */}
          <div style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "8px",
          }}>
            {links.map((l, i) => {
              const isActive = path === l.to || (l.to === "/work" && path.startsWith("/work/")) || (l.to === "/blog" && path.startsWith("/blog/"));
              const openDelay = 0.08 + i * 0.05;
              const closeDelay = (links.length - 1 - i) * 0.03;
              return (
                <button
                  key={l.to}
                  onClick={() => { navigate(l.to); toggleMenu(); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: isActive ? t.accent : t.text,
                    fontSize: "28px",
                    fontWeight: 400,
                    cursor: "pointer",
                    fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
                    letterSpacing: "0.01em",
                    padding: "10px 24px",
                    borderRadius: "12px",
                    opacity: menuClosing ? 0 : 1,
                    transform: menuClosing ? "translateY(-12px)" : "translateY(0)",
                    transition: reduced ? "none" : (menuClosing
                      ? `opacity 0.25s ease ${closeDelay}s, transform 0.3s cubic-bezier(0.55, 0, 1, 0.45) ${closeDelay}s`
                      : `opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${openDelay}s, transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${openDelay}s`),
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {l.label}
                </button>
              );
            })}
            <div style={{
              display: "flex",
              gap: "16px",
              marginTop: "24px",
              opacity: menuClosing ? 0 : 1,
              transform: menuClosing ? "translateY(-10px)" : "translateY(0)",
              transition: reduced ? "none" : (menuClosing
                ? `opacity 0.2s ease ${links.length * 0.03}s, transform 0.25s ease ${links.length * 0.03}s`
                : `opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${0.08 + links.length * 0.05}s, transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${0.08 + links.length * 0.05}s`),
            }}>
              <ToggleButton onClick={onToggleTheme}>{isDark ? "☀" : "☾"}</ToggleButton>
              <ToggleButton onClick={onToggleMotion}>{motionReduced ? "▸" : "◼"}</ToggleButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ label, to, active }) {
  const t = useTheme();
  const { navigate } = useRoute();
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => navigate(to)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 400,
        fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
        color: active ? t.accent : hovered ? t.text : t.textMuted,
        transition: "color 0.2s ease",
        padding: "4px 0",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </button>
  );
}

function ToggleButton({ children, onClick, title }) {
  const t = useTheme();
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        border: `1px solid ${h ? t.border : "transparent"}`,
        background: h ? t.chipBg : "transparent",
        color: t.textMuted,
        cursor: "pointer",
        fontSize: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

// ─── Project Card ────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { navigate } = useRoute();
  const [hovered, setHovered] = useState(false);
  const { reduced } = useMotion();
  const isMobile = window.innerWidth <= 768;

  const colors = ["#E87A4F", "#5B8DEF", "#45B88F", "#D4A843"];
  const accentColor = colors[index % colors.length];
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };
  const accentRgb = hexToRgb(accentColor);

  // Conic gradient for the rotating border — bright at one spot, transparent elsewhere
  const conicGradient = `conic-gradient(${accentColor} 0deg, transparent 60deg, transparent 300deg, ${accentColor} 360deg)`;

  return (
    <Reveal delay={index * 0.1} style={{ height: "100%" }}>
      {/* Outer wrapper — clips the rotating gradient, IS the border */}
      <div
        onClick={() => navigate(`/work/${project.slug}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "pointer",
          height: "100%",
          padding: "1px",
          background: hovered ? "transparent" : (isDark ? t.borderLight : t.borderLight),
          transition: reduced ? "none" : "transform 0.35s ease, box-shadow 0.35s ease",
          transform: hovered && !reduced && !isMobile ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered && !isMobile
            ? `0 8px 32px rgba(${accentRgb},0.15), 0 0 20px rgba(${accentRgb},0.08)`
            : "none",
        }}
      >
        {/* Rotating conic gradient — always on mobile, hover on desktop */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "150%",
            paddingBottom: "150%",
            background: conicGradient,
            opacity: isMobile
              ? (isDark ? 0.45 : 0.35)
              : (hovered ? (isDark ? 0.7 : 0.5) : 0),
            animation: (isMobile || hovered) && !reduced ? "cardBorderSpin 2.5s linear infinite" : "none",
            transform: "translate(-50%, -50%)",
            transition: reduced ? "none" : "opacity 0.4s ease",
            pointerEvents: "none",
          }}
        />

        {/* Glow layer — blurred version of the conic gradient */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "150%",
            paddingBottom: "150%",
            background: conicGradient,
            opacity: isMobile
              ? (isDark ? 0.06 : 0.04)
              : (hovered ? (isDark ? 0.12 : 0.08) : 0),
            animation: (isMobile || hovered) && !reduced ? "cardBorderSpin 2.5s linear infinite" : "none",
            transform: "translate(-50%, -50%)",
            filter: "blur(12px)",
            transition: reduced ? "none" : "opacity 0.4s ease",
            pointerEvents: "none",
          }}
        />

        {/* Inner card — solid background that masks the center, leaving only the border glowing */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: t.bgCard,
            borderRadius: "15px",
            padding: isMobile ? "24px" : "36px",
            border: "none",
            minHeight: isMobile ? "auto" : "280px",
            height: isMobile ? "100%" : "calc(100% - 2px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: reduced ? "none" : "background 0.35s ease",
          }}
        >
          {/* Mobile: Subtle corner glow */}
          {isMobile && (
            <div style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${accentRgb},${isDark ? 0.08 : 0.06}) 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />
          )}
          <div>
            <h3 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 500, color: t.text, lineHeight: isMobile ? 1.45 : 1.35, margin: "0 0 10px 0", letterSpacing: "-0.01em" }}>
              {project.title}
            </h3>
            <p style={{ fontSize: "14px", color: t.textMuted, lineHeight: 1.6, margin: "0 0 16px 0" }}>
              {project.context}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <Chip>{project.role}</Chip>
              <Chip>{project.platform}</Chip>
              <Chip>{project.scale}</Chip>
            </div>
          </div>
          <div style={{ marginTop: isMobile ? "36px" : "28px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: isMobile ? t.accent : (hovered ? t.accent : t.textMuted),
                transition: reduced ? "none" : "color 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Read case study
              <span style={{ transition: reduced ? "none" : "transform 0.25s ease", transform: hovered ? "translateX(4px)" : "translateX(0)", display: "inline-block" }}>→</span>
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ─── UI Thumbnail Card ───────────────────────────────────────
function UICard({ item, onClick }) {
  const t = useTheme();
  const [hovered, setHovered] = useState(false);
  const { reduced } = useMotion();
  const hues = [210, 25, 150, 280, 45, 190, 340, 100, 60, 240];
  const hue = hues[item.id % hues.length];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.bgCard,
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        border: `1px solid ${hovered ? t.border : t.borderLight}`,
        transition: reduced ? "none" : "all 0.3s ease",
        transform: hovered && !reduced ? "translateY(-3px)" : "none",
      }}
    >
      <div
        style={{
          height: "160px",
          background: `linear-gradient(135deg, hsl(${hue}, 40%, ${t === themes.dark ? '18' : '88'}%) 0%, hsl(${hue + 30}, 35%, ${t === themes.dark ? '12' : '82'}%) 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div style={{ width: "60%", height: "60%", borderRadius: "8px", background: `hsl(${hue}, 30%, ${t === themes.dark ? '25' : '75'}%)`, opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: "12px", right: "12px", fontSize: "10px", color: t.textDim, background: t.bgCard, padding: "3px 8px", borderRadius: "4px" }}>
          {item.artefact}
        </div>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ fontSize: "14px", fontWeight: 500, color: t.text, marginBottom: "4px" }}>{item.label}</div>
        <div style={{ fontSize: "12px", color: t.textMuted }}>{item.platform} · {item.year}</div>
      </div>
    </div>
  );
}

// ─── Lightbox ────────────────────────────────────────────────
function Lightbox({ item, onClose }) {
  const t = useTheme();
  const { navigate } = useRoute();
  if (!item) return null;

  const relatedProject = PROJECTS.find((p) => p.year === item.year);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: t.overlay,
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: t.bgCard,
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "560px",
          width: "100%",
          border: `1px solid ${t.border}`,
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: t.textMuted,
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: t.accent, fontWeight: 600, marginBottom: "12px" }}>
          {item.artefact} · {item.platform}
        </div>
        <h3 style={{ fontSize: "22px", fontWeight: 500, color: t.text, margin: "0 0 12px 0", lineHeight: 1.3 }}>{item.label}</h3>
        <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.6, margin: "0 0 16px 0" }}>{item.context}</p>
        <div style={{ fontSize: "13px", color: t.textDim, marginBottom: "16px" }}>Role: {item.role}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
          {item.tags.map((tag) => (
            <Chip key={tag} style={{ fontSize: "11px" }}>{tag}</Chip>
          ))}
        </div>
        {relatedProject && (
          <Button
            variant="text"
            onClick={() => { onClose(); navigate(`/work/${relatedProject.slug}`); }}
          >
            View related case study →
          </Button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════

// ─── TESTIMONIALS ────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Manu Bhardwaj",
    role: "Senior Product Manager",
    company: "Simpplr",
    quote: "Working with Ron has been a game-changer for our product team. His ability to take complex product challenges and translate them into intuitive, elegant designs is truly impressive. Ron brings a unique blend of analytical thinking and creativity to every project. His designs don't just look great — they drive real results. His contribution to our analytics product increased event clicks by 28% and calendar activation by 13%, metrics that directly impacted our product's value proposition.",
  },
  {
    name: "Aman Sharma",
    role: "Product Leader",
    company: "Simpplr",
    quote: "Ron is one of those rare designers who truly understands the business side of product development. He doesn't just design interfaces — he thinks deeply about user behavior, business metrics, and technical feasibility. His work on our video creation feature was particularly outstanding, bringing a complex workflow down to something any HR professional could use in minutes.",
  },
  {
    name: "Ankit Saroha",
    role: "Micro-Interaction Designer II",
    company: "NOVA",
    quote: "I've worked with many designers, but Ron stands out for his systems-level thinking. He doesn't just solve individual design problems — he creates scalable design frameworks that elevate the entire team's output. At NOVA, he built our design system from scratch while simultaneously shipping product features. His mentorship helped me grow from a junior animator to leading interaction design for our entire product suite.",
  },
  {
    name: "Kriti Singh",
    role: "UI/UX Designer",
    company: "Stylework",
    quote: "Ron's design leadership was instrumental in our pre-Series A journey. He transformed our product experience from a basic MVP into a polished platform that investors could immediately see the potential in. His strategic thinking about design's role in business outcomes, combined with pixel-perfect execution, helped us secure INR 4Cr in funding. He's not just a designer — he's a product strategist who happens to design beautifully.",
  },
  {
    name: "Srishti Rana",
    role: "Senior UX Designer",
    company: "Ixigo",
    quote: "What sets Ron apart is his relentless pursuit of design excellence paired with deep empathy for users. Having known him through the design community, I've always been impressed by how he approaches problems — with rigorous research, creative exploration, and a keen eye for detail. He pushes the craft forward while keeping real human needs at the center of every decision.",
  },
  {
    name: "Palak Rathor",
    role: "Software Engineer",
    company: "Simpplr",
    quote: "As an engineer who worked closely with Ron, I can say he's the best designer I've collaborated with from a dev-handoff perspective. His designs are thorough, well-documented, and always account for edge cases that most designers miss. He understands technical constraints without letting them limit his creativity. Working with Ron means fewer back-and-forth cycles and higher-quality shipped products.",
  },
  {
    name: "Rob Morell",
    role: "Product Leader",
    company: "Nowthatisadeal",
    quote: "Rounak and myself worked very closely at Simpplr. We collaborated almost daily on various projects that touched many parts of the overall platform. Rounak's vision of what the UI/UX should be for users was great, and really solved many customer complaints that we were working on improving. Rounak was very flexible when needing a Figma updated or a new icon for a feature we were working on. His insights and listening abilities on customer calls were great. Always asking the right questions and listening to what customers were saying. Thanks for the great memories Rounak, stay awesome!",
  },
  {
    name: "Sushree Nayak",
    role: "Senior Product Manager",
    company: "Simpplr",
    quote: "Rounak is a very level headed product designer with immense experience around designing customer centric products. We collaborated very closely while working in Simpplr and Rounak has been an excellent UX partner. What stands out to me during our collaboration is Rounak not only gives priority to data analysis but also suggests solutions based on experience and user empathy. His attention to details keeping in mind every possible user persona and then deriving the best possible solution is praiseworthy. Thank you Rounak for being the best UX partner and I know you would shine in any role you take in.",
  },
];

function Testimonials() {
  const t = useTheme();
  const isDark = t === themes.dark;
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const autoTimer = useRef(null);
  const total = TESTIMONIALS.length;
  const activeIdxRef = useRef(0);
  const isPlayingRef = useRef(true);
  const maxIdxRef = useRef(total - 1);

  // Card width + gap
  const cardUnit = isMobile ? "85vw + 14px" : "400px + 20px";
  const cardPx = isMobile ? window.innerWidth * 0.85 + 14 : 420;

  // Compute max carousel index so the last position never shows empty space
  const computeMaxIdx = () => {
    const cw = containerRef.current?.clientWidth || (isMobile ? window.innerWidth : 1040);
    // How many full cards fit in view
    const visible = Math.floor(cw / cardPx) || 1;
    return Math.max(0, total - visible);
  };

  const [maxIdx, setMaxIdx] = useState(() => {
    const cw = isMobile ? window.innerWidth : 1040;
    const visible = Math.floor(cw / cardPx) || 1;
    return Math.max(0, total - visible);
  });

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      const newMax = computeMaxIdx();
      maxIdxRef.current = newMax;
      setMaxIdx(newMax);
      // Clamp active index if it exceeds new max
      if (activeIdxRef.current > newMax) {
        activeIdxRef.current = newMax;
        setActiveIdx(newMax);
      }
    };
    window.addEventListener("resize", onResize);
    // Also compute once after mount when containerRef is populated
    const t0 = setTimeout(onResize, 50);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(t0); };
  }, []);

  // Keep refs in sync with state for use inside intervals
  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { maxIdxRef.current = maxIdx; }, [maxIdx]);

  // Navigate to a specific card (clamped to maxIdx)
  const goToCard = (idx) => {
    const clamped = Math.max(0, Math.min(idx, maxIdxRef.current));
    activeIdxRef.current = clamped;
    setActiveIdx(clamped);
  };

  // Auto-scroll logic — loops from maxIdx back to 0
  const startAutoScroll = () => {
    clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      const cur = activeIdxRef.current;
      const max = maxIdxRef.current;
      const next = cur >= max ? 0 : cur + 1;
      activeIdxRef.current = next;
      setActiveIdx(next);
    }, 4000);
  };

  const stopAutoScroll = () => {
    clearInterval(autoTimer.current);
    autoTimer.current = null;
  };

  const togglePlayPause = () => {
    if (isPlayingRef.current) {
      stopAutoScroll();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startAutoScroll();
    }
  };

  // Start auto-scroll on mount
  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(autoTimer.current);
  }, []);

  // Swipe support for mobile
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    touchStart.current = null;
    if (Math.abs(diff) < 40) return;
    if (diff > 0 && activeIdx < maxIdx) goToCard(activeIdx + 1);
    else if (diff < 0 && activeIdx > 0) goToCard(activeIdx - 1);
    // Reset auto-scroll timer after manual swipe
    if (isPlayingRef.current) { stopAutoScroll(); startAutoScroll(); }
  };

  const gradients = isDark ? [
    ["rgba(91,141,239,0.45)", "rgba(167,139,250,0.35)"],
    ["rgba(167,139,250,0.45)", "rgba(232,122,79,0.3)"],
    ["rgba(69,184,143,0.4)", "rgba(91,141,239,0.35)"],
    ["rgba(232,122,79,0.4)", "rgba(212,168,67,0.35)"],
    ["rgba(167,139,250,0.4)", "rgba(69,184,143,0.35)"],
    ["rgba(91,141,239,0.4)", "rgba(69,184,143,0.35)"],
    ["rgba(212,168,67,0.4)", "rgba(167,139,250,0.35)"],
    ["rgba(69,184,143,0.45)", "rgba(232,122,79,0.3)"],
  ] : [
    ["rgba(91,141,239,0.3)", "rgba(167,139,250,0.2)"],
    ["rgba(167,139,250,0.3)", "rgba(232,122,79,0.18)"],
    ["rgba(69,184,143,0.25)", "rgba(91,141,239,0.2)"],
    ["rgba(232,122,79,0.25)", "rgba(212,168,67,0.2)"],
    ["rgba(167,139,250,0.25)", "rgba(69,184,143,0.2)"],
    ["rgba(91,141,239,0.25)", "rgba(69,184,143,0.2)"],
    ["rgba(212,168,67,0.25)", "rgba(167,139,250,0.2)"],
    ["rgba(69,184,143,0.3)", "rgba(232,122,79,0.18)"],
  ];
  const accentColors = ["#5B8DEF", "#A78BFA", "#45B88F", "#E87A4F", "#A78BFA", "#5B8DEF", "#D4A843", "#45B88F"];

  // Light bg is #F7F7F5 = rgb(247,247,245), dark bg is #0D0D0D = rgb(13,13,13)
  const fadeBg = isDark ? "13,13,13" : "247,247,245";

  return (
    <Section id="testimonials">
      <Reveal>
        <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500, color: t.text, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.25 }}>Testimonials</h2>
          <p style={{ fontSize: isMobile ? "15px" : "16px", color: t.textMuted, marginTop: "12px", maxWidth: "540px", lineHeight: 1.6 }}>
            What colleagues and collaborators say about working with me.
          </p>
        </div>
      </Reveal>

      <div
        ref={containerRef}
        style={{ position: "relative", overflow: "hidden" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gradient fade edges */}
        <div style={{
          position: "absolute", top: 0, left: 0, bottom: 0, width: isMobile ? "32px" : "60px",
          background: `linear-gradient(to right, rgba(${fadeBg},1) 0%, rgba(${fadeBg},0) 100%)`,
          zIndex: 3, pointerEvents: "none",
          opacity: activeIdx > 0 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: isMobile ? "32px" : "60px",
          background: `linear-gradient(to left, rgba(${fadeBg},1) 0%, rgba(${fadeBg},0) 100%)`,
          zIndex: 3, pointerEvents: "none",
          opacity: activeIdx < maxIdx ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />

        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: isMobile ? "14px" : "20px",
            transform: `translateX(calc(-${activeIdx} * (${isMobile ? "85vw + 14px" : "400px + 20px"})))`,
            transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
            willChange: "transform",
          }}
        >
          {TESTIMONIALS.map((item, i) => {
            const [g1, g2] = gradients[i % gradients.length];
            const accent = accentColors[i % accentColors.length];
            const initials = item.name.split(" ").map((n) => n[0]).join("");
            return (
              <div key={i} style={{ flex: "0 0 auto", width: isMobile ? "85vw" : "400px" }}>
                {/* Outer wrapper: gradient border via background + padding trick */}
                <div style={{
                  borderRadius: "18px",
                  padding: "1px",
                  background: `linear-gradient(135deg, ${g1}, transparent 50%, ${g2})`,
                  boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.3s ease",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = isDark
                      ? `0 8px 40px rgba(0,0,0,0.35), 0 0 24px rgba(${accent === "#5B8DEF" ? "91,141,239" : accent === "#A78BFA" ? "167,139,250" : accent === "#45B88F" ? "69,184,143" : accent === "#E87A4F" ? "232,122,79" : "212,168,67"},0.1)`
                      : `0 8px 32px rgba(0,0,0,0.05), 0 0 20px rgba(${accent === "#5B8DEF" ? "91,141,239" : accent === "#A78BFA" ? "167,139,250" : accent === "#45B88F" ? "69,184,143" : accent === "#E87A4F" ? "232,122,79" : "212,168,67"},0.08)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Inner card */}
                  <div
                    style={{
                      background: isDark ? t.bg : "#FFFFFF",
                      borderRadius: "17px",
                      padding: isMobile ? "24px 20px" : "32px 28px",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: isMobile ? "280px" : "320px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Gradient leak — soft glow in top-right corner */}
                    <div style={{
                      position: "absolute",
                      top: "-40px",
                      right: "-40px",
                      width: "160px",
                      height: "160px",
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${accent}${isDark ? "14" : "0D"}, transparent 70%)`,
                      pointerEvents: "none",
                    }} />
                    {/* Gradient leak — soft glow in bottom-left */}
                    <div style={{
                      position: "absolute",
                      bottom: "-30px",
                      left: "-30px",
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${accent}${isDark ? "10" : "0A"}, transparent 70%)`,
                      pointerEvents: "none",
                    }} />

                    {/* Quote icon */}
                    <div style={{ marginBottom: "16px", position: "relative" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2 }}>
                        <path d="M10 8C10 5.79 8.21 4 6 4C3.79 4 2 5.79 2 8C2 10.21 3.79 12 6 12C6.34 12 6.67 11.96 6.99 11.89C6.94 14.55 5.56 15.98 3 16V18C7 18 10 15 10 8ZM22 8C22 5.79 20.21 4 18 4C15.79 4 14 5.79 14 8C14 10.21 15.79 12 18 12C18.34 12 18.67 11.96 18.99 11.89C18.94 14.55 17.56 15.98 15 16V18C19 18 22 15 22 8Z" fill={accent}/>
                      </svg>
                    </div>

                    {/* Quote text */}
                    <p style={{
                      fontSize: "14px",
                      lineHeight: 1.75,
                      color: t.textMuted,
                      fontWeight: 300,
                      margin: 0,
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 8,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      position: "relative",
                    }}>
                      {item.quote}
                    </p>

                    {/* Separator line with bilinear gradient */}
                    <div style={{
                      width: "60px",
                      height: "1.5px",
                      borderRadius: "1px",
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                      margin: "28px 0 20px 0",
                      opacity: 0.35,
                    }} />

                    {/* Author */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
                      <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${g1}, ${g2})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#fff",
                        flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: t.text, lineHeight: 1.3 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.4, marginTop: "2px" }}>
                          {item.role}, {item.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel indicators + play/pause */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        marginTop: "28px",
      }}>
        {/* Dot indicators */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {Array.from({ length: maxIdx + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => { goToCard(i); if (isPlayingRef.current) { stopAutoScroll(); startAutoScroll(); } }}
              style={{
                width: activeIdx === i ? "24px" : "8px",
                height: "8px",
                borderRadius: "100px",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: activeIdx === i
                  ? t.accent
                  : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
                opacity: activeIdx === i ? 1 : 0.7,
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause toggle */}
        <button
          onClick={togglePlayPause}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transition: "background 0.2s ease, transform 0.15s ease",
            color: t.textMuted,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
        >
          {isPlaying ? (
            /* Pause icon — two bars */
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="1" width="2.5" height="10" rx="0.75" fill="currentColor" />
              <rect x="7.5" y="1" width="2.5" height="10" rx="0.75" fill="currentColor" />
            </svg>
          ) : (
            /* Play icon — triangle */
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 1.5V10.5L10.5 6L3 1.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </Section>
  );
}

// ─── HOME ────────────────────────────────────────────────────
function Home() {
  const t = useTheme();
  const { navigate } = useRoute();
  const { reduced } = useMotion();
  const [lightboxItem, setLightboxItem] = useState(null);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const proofChips = [
    "10+ years in product design",
    "0→1 product specialist",
    "Shipped to 350M+ users",
    "Telecom · Fintech · AI · Food Tech",
  ];

  const pillars = [
    { title: "Problem framing & alignment", desc: "I start by making sure we're solving the right problem. Stakeholder alignment, user research, and sharp problem statements before pixels." },
    { title: "Systems & scalability", desc: "I think in systems — tokens, components, and patterns that scale across products, teams, and platforms. From Airtel's Theseus to NOVA's white-label architecture." },
    { title: "Craft & quality bar", desc: "Details matter at scale. Every interaction state, edge case, and micro-interaction is intentional. I've won design awards 4 months running for this reason." },
  ];

  // Smooth mouse-follow with lerp (requestAnimationFrame)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (reduced || isMobile) return;
    const onMove = (e) => {
      targetMouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      currentMouse.current = {
        x: lerp(currentMouse.current.x, targetMouse.current.x, 0.08),
        y: lerp(currentMouse.current.y, targetMouse.current.y, 0.08),
      };
      setMousePos({ ...currentMouse.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, isMobile]);

  // Parallax offsets — prominent movement with depth separation
  const orbShift1 = { x: mousePos.x * 90, y: mousePos.y * 70 };
  const orbShift2 = { x: mousePos.x * -70, y: mousePos.y * 100 };
  const orbShift3 = { x: mousePos.x * 120, y: mousePos.y * -60 };
  const orbShift4 = { x: mousePos.x * -50, y: mousePos.y * 80 };

  const isDark = t === themes.dark;

  // Dark mode: original subtle palette + extra violet layer
  // Light mode: soft pastel watercolor aurora
  const orbLayers = isDark ? [
    { w: "130%", h: "115%", t: "-20%", l: "-15%", blur: 110, mBlur: 70,
      bg: "#E87A4F", at: "60% 25%", spread: "70%", anim: "orbFloat1 8s", shift: orbShift1, rad: "55% 45% 50% 50% / 45% 55% 45% 55%" },
    { w: "105%", h: "95%", t: "-5%", l: "5%", blur: 95, mBlur: 62,
      bg: "#5B8DEF", at: "70% 30%", spread: "62%", anim: "orbFloat2 10s", shift: orbShift2, rad: "50% 50% 45% 55% / 55% 45% 50% 50%" },
    { w: "85%", h: "80%", t: "5%", l: "10%", blur: 85, mBlur: 58,
      bg: "#A855F7", at: "55% 35%", spread: "56%", anim: "orbFloat3 12s", shift: orbShift3, rad: "45% 55% 55% 45% / 50% 50% 45% 55%" },
    { w: "65%", h: "60%", t: "10%", l: "25%", blur: 75, mBlur: 52,
      bg: "#E87A4F", at: "65% 28%", spread: "50%", anim: "orbFloat2 14s reverse", shift: orbShift4, rad: "50% 50% 42% 58% / 55% 45% 55% 45%" },
  ] : [
    { w: "140%", h: "125%", t: "-25%", l: "-20%", blur: 120, mBlur: 80,
      bg: "#FDE68A", at: "58% 22%", spread: "68%", anim: "orbFloat1 8s", shift: orbShift1, rad: "55% 45% 48% 52% / 45% 55% 50% 50%" },
    { w: "110%", h: "100%", t: "-10%", l: "0%", blur: 105, mBlur: 68,
      bg: "#C4B5FD", at: "68% 28%", spread: "60%", anim: "orbFloat2 10s", shift: orbShift2, rad: "48% 52% 55% 45% / 52% 48% 45% 55%" },
    { w: "90%", h: "85%", t: "2%", l: "10%", blur: 95, mBlur: 62,
      bg: "#FBCFE8", at: "55% 30%", spread: "56%", anim: "orbFloat3 12s", shift: orbShift3, rad: "52% 48% 45% 55% / 48% 52% 55% 45%" },
    { w: "70%", h: "68%", t: "12%", l: "22%", blur: 85, mBlur: 58,
      bg: "#99F6E4", at: "62% 32%", spread: "52%", anim: "orbFloat2 14s reverse", shift: orbShift4, rad: "45% 55% 52% 48% / 55% 45% 48% 52%" },
  ];

  return (
    <>
      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Gradient Orb — viewport-edge positioned */}
        {!reduced && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? "-60px" : "-180px",
              right: isMobile ? "-60px" : "-120px",
              width: isMobile ? "400px" : "min(70vw, 1000px)",
              height: isMobile ? "500px" : "min(70vw, 1000px)",
              pointerEvents: "none",
              zIndex: 0,
              opacity: isDark ? 0.35 : 0.55,
              transition: "opacity 0.4s ease",
            }}
          >
            {orbLayers.map((orb, i) => (
              <div key={i} style={{
                position: "absolute",
                width: orb.w,
                height: orb.h,
                top: orb.t,
                left: orb.l,
                borderRadius: orb.rad || "50%",
                background: `radial-gradient(circle at ${orb.at}, ${orb.bg} 0%, transparent ${orb.spread})`,
                filter: `blur(${isMobile ? orb.mBlur : orb.blur}px)`,
                animation: isMobile ? `${orb.anim} ease-in-out infinite` : undefined,
                transform: isMobile ? undefined : `translate(${orb.shift.x}px, ${orb.shift.y}px)`,
              }} />
            ))}
          </div>
        )}

      <section
        ref={heroRef}
        style={{
          minHeight: isMobile ? "auto" : "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile
            ? "164px 20px 48px"
            : "120px clamp(20px, 5vw, 80px) 80px",
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Hero content — above the orb */}
        <div style={{ position: "relative", zIndex: 1 }}>
        {/* Greeting — small, understated */}
        <Reveal>
          <p
            style={{
              fontSize: isMobile ? "13px" : "14px",
              color: t.textDim,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 500,
              margin: isMobile ? "0 0 16px 0" : "0 0 20px 0",
            }}
          >
            <span style={{
              display: "inline-block",
              marginRight: "2px",
              animation: reduced ? "none" : "handWave 2.5s ease-in-out 2",
              transformOrigin: "70% 70%",
            }}>👋</span> Hi, I'm Ron
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1
            style={{
              fontSize: isMobile ? "clamp(28px, 7vw, 36px)" : "clamp(30px, 5vw, 56px)",
              fontWeight: 500,
              lineHeight: isMobile ? 1.3 : 1.12,
              letterSpacing: "-0.025em",
              color: t.text,
              margin: isMobile ? "0 0 20px 0" : "0 0 24px 0",
              paddingRight: isMobile ? "32px" : 0,
              maxWidth: "900px",
            }}
          >
            Designing scalable product systems for enterprise and mobile—without losing clarity
            <span style={{ color: t.accent }}>.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p
            style={{
              fontSize: isMobile ? "14px" : "clamp(16px, 2vw, 20px)",
              lineHeight: 1.6,
              color: t.textMuted,
              maxWidth: "600px",
              margin: isMobile ? "0 0 64px 0" : "0 0 80px 0",
              paddingRight: isMobile ? "32px" : 0,
            }}
          >
            I'm a Staff/Principal-level Product Designer specialising in mobile UX,
            design systems, and enterprise + AI products—leading from discovery to
            shipped outcomes across complex, multi-product ecosystems.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div style={{
            display: "flex",
            gap: isMobile ? "12px" : "16px",
            flexWrap: "wrap",
            marginBottom: isMobile ? "32px" : "48px",
          }}>
            <PrimaryCTA onClick={() => navigate("/work")} />
            <ResumeCTA onClick={() => navigate("/resume")} />
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div style={{ display: "flex", gap: isMobile ? "8px" : "10px", flexWrap: "wrap" }}>
            {proofChips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>
        </Reveal>
        </div>{/* end hero content wrapper */}
      </section>
        {/* Floating high-five badge */}
        <HighFiveBadge mousePos={mousePos} isMobile={isMobile} reduced={reduced} />
      </div>{/* end hero + orb wrapper */}

      {/* SELECTED WORK */}
      <Section id="work">
        <Reveal>
          <SectionTitle sub="Outcome-led case studies from telecom, enterprise AI, and food tech.">
            Selected Work
          </SectionTitle>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "24px",
          }}
        >
          {FEATURED_PROJECTS.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </Section>

      {/* UI LIBRARY TEASER */}
      <Section id="ui-teaser" style={{ background: t.bgAlt, maxWidth: "none", padding: "clamp(64px, 10vw, 120px) 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 80px)" }}>
          <Reveal>
            <div style={{ display: "flex", gap: isMobile ? "28px" : "120px", alignItems: "center", flexDirection: isMobile ? "column-reverse" : "row", flexWrap: isMobile ? "nowrap" : "wrap" }}>
              <div style={{ flex: isMobile ? "none" : "1 1 340px", minWidth: isMobile ? "100%" : "280px", width: isMobile ? "100%" : undefined }}>
                <div style={{ marginBottom: "8px" }}>
                  <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500, color: t.text, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.25 }}>UI Showcase</h2>
                </div>
                <p style={{ fontSize: "16px", color: t.textMuted, lineHeight: 1.7, margin: "0 0 48px 0" }}>
                  A curated collection of production UI — components, flows, and systems
                  I've designed and shipped. Each piece includes context on constraints,
                  decisions, and outcomes.
                </p>
                <PrimaryCTA onClick={() => navigate("/ui")} label="Explore UI Showcase →" />
              </div>
              <div style={{ flex: isMobile ? "none" : "1 1 400px", minWidth: "0", width: isMobile ? "100%" : undefined, marginTop: isMobile ? "-64px" : undefined }}>
                <ShowcaseCardStack />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* HOW I WORK */}
      <Section id="how">
        <Reveal>
          <SectionTitle>How I Work</SectionTitle>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: isMobile ? "20px" : "32px" }}>
          {pillars.map((p, i) => (
            <Reveal key={i} delay={i * 0.1} style={{ height: "100%" }}>
              <div
                style={{
                  padding: "32px",
                  borderRadius: "12px",
                  border: `1px solid ${t.borderLight}`,
                  background: t.bgCard,
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: t.accent,
                    fontWeight: 600,
                    marginBottom: "16px",
                  }}
                >
                  0{i + 1}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 500, color: t.text, margin: "0 0 12px 0" }}>{p.title}</h3>
                <p style={{ fontSize: "14px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ABOUT TEASER */}
      <Section id="about-teaser">
        <Reveal>
          <div style={{ maxWidth: "640px" }}>
            <SectionTitle>About</SectionTitle>
            <p style={{ fontSize: "16px", color: t.textMuted, lineHeight: 1.7, margin: "0 0 24px 0" }}>
              From running a design agency at 20 to leading design team at NOVA — I've spent a decade
              shipping products across telecom, fintech, enterprise AI, and food tech. I build teams,
              systems, and products that move real business metrics.
            </p>
            <Button variant="text" onClick={() => navigate("/about")}>
              View full background →
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CONTACT */}
      <Section id="contact" style={{ background: t.bgAlt, maxWidth: "none", padding: "clamp(64px, 10vw, 100px) 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 80px)" }}>
          <Reveal>
            <SectionTitle sub="Open to conversations about product design, systems, and collaboration.">
              Get in Touch
            </SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
              <a href="https://www.linkedin.com/in/rounak-ghosh-53a21b136/" target="_blank" rel="noopener" style={{ color: t.text, fontSize: "16px", textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: t.accent, fontWeight: 700, fontSize: "16px", width: "16px", textAlign: "center", flexShrink: 0, display: "flex", justifyContent: "center" }}>in</span> LinkedIn
              </a>
              <a href="mailto:ronuxdnr@gmail.com" style={{ color: t.text, fontSize: "16px", textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: t.accent, display: "flex", width: "16px", flexShrink: 0, justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 6L8.91 9.92C11.46 11.36 12.54 11.36 15.08 9.92L21.99 6" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/><path d="M2.01988 13.48C2.08988 16.55 2.11988 18.08 3.24988 19.21C4.37988 20.35 5.95988 20.38 9.09988 20.46C11.0399 20.51 12.9599 20.51 14.8999 20.46C18.0499 20.38 19.6199 20.34 20.7499 19.21C21.8799 18.07 21.9099 16.54 21.9799 13.48C21.9999 12.49 21.9999 11.51 21.9799 10.53C21.9099 7.46001 21.8799 5.93001 20.7499 4.80001C19.6199 3.66001 18.0399 3.63001 14.8999 3.55001C12.9599 3.50001 11.0399 3.50001 9.09988 3.55001C5.94988 3.63001 4.37988 3.67001 3.24988 4.80001C2.11988 5.94001 2.08988 7.47001 2.01988 10.53C1.99988 11.52 1.99988 12.5 2.01988 13.48Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/></svg></span> ronuxdnr@gmail.com
              </a>
              <a href="tel:+918017697352" style={{ color: t.text, fontSize: "16px", textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: t.accent, display: "flex", width: "16px", flexShrink: 0, justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8.83993 5.00999L8.38993 3.99999C8.09993 3.33999 7.94993 3.00999 7.72993 2.75999C7.45993 2.43999 7.09993 2.20999 6.69993 2.08999C6.37993 1.98999 6.01993 1.98999 5.29993 1.98999C4.24993 1.98999 3.71993 1.98999 3.27993 2.18999C2.75993 2.42999 2.28993 2.94999 2.09993 3.48999C1.93993 3.94999 1.98993 4.41999 2.07993 5.36999C3.04993 15.43 8.55993 20.94 18.6199 21.91C19.5599 22 20.0399 22.05 20.4999 21.89C21.0399 21.7 21.5599 21.23 21.7999 20.71C21.9999 20.27 21.9999 19.74 21.9999 18.69C21.9999 17.97 21.9999 17.61 21.8999 17.29C21.7799 16.89 21.5499 16.53 21.2299 16.26C20.9799 16.04 20.6499 15.89 19.9899 15.6L18.9799 15.15C18.2699 14.83 17.9099 14.67 17.5499 14.64C17.1999 14.61 16.8499 14.66 16.5299 14.78C16.1899 14.91 15.8899 15.16 15.2899 15.66C14.6899 16.16 14.3999 16.41 14.0299 16.54C13.7099 16.66 13.2799 16.7 12.9399 16.65C12.5599 16.59 12.2599 16.44 11.6699 16.12C9.83993 15.14 8.82993 14.13 7.85993 12.31C7.54993 11.72 7.38993 11.43 7.32993 11.04C7.27993 10.7 7.32993 10.27 7.43993 9.94999C7.56993 9.58999 7.81993 9.28999 8.31993 8.68999C8.81993 8.08999 9.06993 7.78999 9.19993 7.44999C9.32993 7.12999 9.36993 6.77999 9.33993 6.42999C9.30993 6.06999 9.14993 5.70999 8.82993 4.99999L8.83993 5.00999Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg></span> +91-8017697352
              </a>
            </div>
            <p style={{ fontSize: "13px", color: t.textDim, fontStyle: "italic" }}>
              Happy to share deeper NDA walkthroughs live.
            </p>
          </Reveal>
        </div>
      </Section>

      {lightboxItem && <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
    </>
  );
}

// ─── WORK INDEX ──────────────────────────────────────────────
function WorkIndex() {
  const t = useTheme();
  const highlights = [
    "Built NOVA's design team from 0 → 5 designers (2025)",
    "Shipped NOVA's white-label food ordering app (2025)",
    "Designed enterprise-readiness for NOVA RMS (2025)",
    "Led Voice AI integration for NOVA mobile app (2025)",
    "Shipped NOVA's best-selling kiosk + POS redesign (2025)",
    "Led Kirana POS research at Khatabook — new product vertical (2023)",
    "Contributed to Airtel's Theseus Design System (2022)",
    "Key contributor to Stylework's ₹5Cr pre-Series A fundraise (2021)",
    "Designed PayU's neo-banking dashboard and payouts (2020–21)",
    "Ran a design agency serving 15+ startups including Meetup (2015–18)",
  ];

  return (
    <>
    <BackBar label="Home" to="/" />
    <Section style={{ paddingTop: "20px" }}>
      <Reveal>
        <SectionTitle sub="Case studies from products I've designed and shipped.">All Work</SectionTitle>
      </Reveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
          gap: "24px",
          marginBottom: "80px",
        }}
      >
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      <Reveal>
        <h3 style={{ fontSize: "22px", fontWeight: 500, color: t.text, marginBottom: "32px" }}>Other Highlights</h3>
        <div style={{ borderLeft: `2px solid ${t.border}`, paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {highlights.map((h, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.5 }}>{h}</div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </Section>
    </>
  );
}

// ─── SIMPPLR CUSTOM COMPONENTS ──────────────────────────────
function SimpplrChallenge({ isMobile }) {
  const t = useTheme();

  const insightChips = [
    "Holiday policy",
    "Leave policy",
    "Weekly updates",
    "People",
    "Tickets"
  ];

  const problems = [
    {
      icon: "⏱️",
      title: "High objective completion time",
      desc: "Even simple tasks like finding a holiday or leave policy took too long."
    },
    {
      icon: "🧩",
      title: "Information spread across tools",
      desc: "Employees had to guess whether content lived in the intranet, cloud storage, or enterprise systems."
    },
    {
      icon: "👀",
      title: "Weak scan-ability",
      desc: "Different result types lacked a strong, unified visual language for fast recognition."
    },
    {
      icon: "🤖",
      title: "Need for direct answers",
      desc: "Sometimes users did not need ten links — they needed one trustworthy summary with sources."
    }
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "32px" : "40px",
        }}>
          {/* TOP: Challenge intro */}
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: t.accent,
              fontWeight: 600,
              marginBottom: "20px",
            }}>
              THE CHALLENGE
            </h3>
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 600,
              color: t.text,
              lineHeight: 1.25,
              marginBottom: "16px",
            }}>
              Search at work was not one problem. It was many small frictions stacked together.
            </h2>
            <p style={{
              fontSize: "15px",
              color: t.textMuted,
              lineHeight: 1.7,
              marginBottom: "24px",
            }}>
              Employees were taking too long to complete simple information-finding tasks, and the experience created unnecessary cognitive load along the way. The challenge wasn't just retrieval—it was objective completion time.
            </p>

            {/* Insight chips */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}>
              {insightChips.map((chip, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 16px",
                    background: t.chipBg,
                    color: t.chipText,
                    borderRadius: "24px",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>

          {/* BELOW: Problem cards 2x2 grid (1 col on mobile) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "16px" : "20px",
          }}>
            {problems.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: isMobile ? "20px" : "24px",
                  background: t.bgCard,
                  border: `1px solid ${t.border}`,
                  borderRadius: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: t.bgAlt,
                  borderRadius: "12px",
                  fontSize: "24px",
                }}>
                  {p.icon}
                </div>
                <h4 style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: t.text,
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {p.title}
                </h4>
                <p style={{
                  fontSize: "14px",
                  color: t.textMuted,
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrExperienceModel({ isMobile }) {
  const t = useTheme();

  const steps = [
    {
      icon: "🔍",
      title: "Search",
      desc: "Enter a single intent once, across intranet and connected enterprise sources."
    },
    {
      icon: "👁️",
      title: "Scan",
      desc: "Use card hierarchy, thumbnails, metadata, and labels to recognise the right result faster."
    },
    {
      icon: "⚡",
      title: "Act",
      desc: "Open the exact source or use Smart Answers to complete the task with less friction."
    }
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: t.accent,
            fontWeight: 600,
            marginBottom: "16px",
          }}>
            EXPERIENCE MODEL
          </h3>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: "24px",
          }}>
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 600,
              color: t.text,
              lineHeight: 1.25,
              margin: 0,
              flex: isMobile ? "1 0 100%" : "0 0 auto",
            }}>
              Search → Scan → Act
            </h2>
            <p style={{
              fontSize: "14px",
              color: t.textMuted,
              lineHeight: 1.6,
              margin: 0,
              flex: isMobile ? "1 0 100%" : "1 1 auto",
            }}>
              A three-step mental model that moves users from intent through recognition to action.
            </p>
          </div>
        </div>

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "16px" : "0",
          alignItems: "stretch",
        }}>
          {steps.map((step, i) => (
            <Fragment key={i}>
              <div style={{
                flex: 1,
                padding: "24px",
                background: t.bgAlt,
                borderRadius: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: t.bgCard,
                  borderRadius: "12px",
                  fontSize: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                  {step.icon}
                </div>
                <div>
                  <h4 style={{
                    fontSize: "17px",
                    fontWeight: 600,
                    color: t.text,
                    margin: "0 0 8px 0",
                  }}>
                    {step.title}
                  </h4>
                  <p style={{
                    fontSize: "14px",
                    color: t.textMuted,
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && !isMobile && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  fontSize: "20px",
                  color: t.textDim,
                  flexShrink: 0,
                }}>
                  →
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrSmartAnswers({ isMobile }) {
  const t = useTheme();
  const [phase, setPhase] = useState(0); // 0=light, 1=transitioning-to-dark, 2=dark, 3=transitioning-to-light
  const reducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  useEffect(() => {
    if (reducedMotion) return;
    const durations = [3000, 800, 3000, 800];
    const timer = setTimeout(() => {
      setPhase((p) => (p + 1) % 4);
    }, durations[phase]);
    return () => clearTimeout(timer);
  }, [phase, reducedMotion]);

  const isLight = phase === 0 || phase === 3;
  const transitioning = phase === 1 || phase === 3;

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: t.accent,
            fontWeight: 600,
            marginBottom: "16px",
          }}>
            SMART ANSWERS
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 600,
              color: t.text,
              lineHeight: 1.25,
              margin: 0,
            }}>
              From search results to direct understanding.
            </h2>
            <p style={{
              fontSize: "15px",
              color: t.textMuted,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "640px",
            }}>
              Smart Answers moved the experience beyond retrieval — giving users direct, source-backed answers they could trust. Combined with conversational follow-ups on mobile, enterprise AI finally felt native on small screens.
            </p>
          </div>
        </div>

        {/* Light/Dark mode showcase */}
        <div style={{
          position: "relative",
          borderRadius: isMobile ? "20px" : "32px",
          overflow: "hidden",
          background: isLight ? "#F5F5F7" : "#1A1A1E",
          transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: isMobile ? "32px 16px" : "48px 40px",
          border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)"}`,
        }}>
          {/* Top bar with mode label */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: isMobile ? "24px" : "32px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isLight ? "#34C759" : "#5E5CE6",
                transition: "background 0.8s ease",
                boxShadow: isLight ? "0 0 8px rgba(52,199,89,0.4)" : "0 0 8px rgba(94,92,230,0.4)",
              }} />
              <span style={{
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: isLight ? "#86868B" : "#98989D",
                transition: "color 0.8s ease",
              }}>
                {isLight ? "Light mode" : "Dark mode"}
              </span>
            </div>
            <div style={{
              display: "flex",
              gap: "6px",
            }}>
              <div style={{
                width: "28px",
                height: "4px",
                borderRadius: "2px",
                background: isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.3)",
                transition: "background 0.8s ease",
              }} />
              <div style={{
                width: "28px",
                height: "4px",
                borderRadius: "2px",
                background: !isLight ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
                transition: "background 0.8s ease",
              }} />
            </div>
          </div>

          {/* Phone mockup container */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            minHeight: isMobile ? "360px" : "480px",
          }}>
            {/* Light image */}
            <img
              src="/images/simpplr-workplace-search/smart-answers-ui.png"
              alt="Smart Answers — Light mode"
              style={{
                position: "absolute",
                maxHeight: isMobile ? "360px" : "480px",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                opacity: isLight ? 1 : 0,
                transform: isLight ? "translateX(0) scale(1)" : "translateX(-30px) scale(0.95)",
                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: isLight ? "drop-shadow(0 20px 60px rgba(0,0,0,0.12))" : "drop-shadow(0 20px 60px rgba(0,0,0,0.3))",
              }}
              loading="lazy"
            />
            {/* Dark image */}
            <img
              src="/images/simpplr-workplace-search/smart-answer-dark-mode-ui.png"
              alt="Smart Answers — Dark mode"
              style={{
                position: "absolute",
                maxHeight: isMobile ? "360px" : "480px",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                opacity: !isLight ? 1 : 0,
                transform: !isLight ? "translateX(0) scale(1)" : "translateX(30px) scale(0.95)",
                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.4))",
              }}
              loading="lazy"
            />
          </div>

          {/* Bottom caption */}
          <div style={{
            textAlign: "center",
            marginTop: isMobile ? "24px" : "32px",
          }}>
            <p style={{
              fontSize: "13px",
              color: isLight ? "#86868B" : "#98989D",
              transition: "color 0.8s ease",
              margin: 0,
              fontWeight: 500,
            }}>
              AI-generated answers with source citations — adapting seamlessly to user preference
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrSolution({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const metrics = [
    {
      icon: "⚡",
      accentColor: "#34C759",
      title: "Smart Answers drove faster task completion",
      stat: "~40%",
      statLabel: "reduction in completion time",
      details: [
        { value: "72%", label: "of searchers interacted with Smart Answers" },
        { value: "50%", label: "asked follow-ups or tapped cited sources" },
      ],
    },
    {
      icon: "✦",
      accentColor: "#5E5CE6",
      title: "Card system improved scan-ability across the board",
      stat: "100%",
      statLabel: "reported better information hierarchy",
      details: [
        { value: "Scan-ability", label: "distinct visual patterns per result type" },
        { value: "Consistency", label: "unified design system across all cards" },
      ],
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: t.accent,
            fontWeight: 600,
            marginBottom: "16px",
          }}>
            SOLUTION
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 600,
              color: t.text,
              lineHeight: 1.25,
              margin: 0,
            }}>
              Measurable improvements where it matters.
            </h2>
            <p style={{
              fontSize: "15px",
              color: t.textMuted,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "640px",
            }}>
              Every design decision was validated against real user behaviour — from AI trust signals to card anatomy.
            </p>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "20px",
        }}>
          {metrics.map((m, i) => (
            <div
              key={i}
              style={{
                padding: isMobile ? "28px 24px" : "36px 32px",
                background: isDark ? t.bgAlt : "#FFFFFF",
                borderRadius: "28px",
                border: `1px solid ${isDark ? t.border : "rgba(0,0,0,0.08)"}`,
                boxShadow: isDark ? "none" : "0 2px 16px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle gradient glow */}
              <div style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${m.accentColor}${isDark ? "12" : "18"} 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              {/* Icon + Title */}
              <div>
                <div style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark ? `${m.accentColor}18` : `${m.accentColor}14`,
                  borderRadius: "14px",
                  fontSize: "22px",
                  marginBottom: "16px",
                  border: isDark ? "none" : `1px solid ${m.accentColor}20`,
                }}>
                  {m.icon}
                </div>
                <h4 style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: t.text,
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  {m.title}
                </h4>
              </div>

              {/* Big stat */}
              <div>
                <div style={{
                  fontSize: "clamp(40px, 6vw, 56px)",
                  fontWeight: 700,
                  color: m.accentColor,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  marginBottom: "8px",
                }}>
                  {m.stat}
                </div>
                <div style={{
                  fontSize: "13px",
                  color: t.textMuted,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {m.statLabel}
                </div>
              </div>

              {/* Detail pills */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                borderTop: `1px solid ${isDark ? t.border : "rgba(0,0,0,0.08)"}`,
                paddingTop: "20px",
              }}>
                {m.details.map((d, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "10px",
                    }}
                  >
                    <span style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: t.text,
                      minWidth: "fit-content",
                    }}>
                      {d.value}
                    </span>
                    <span style={{
                      fontSize: "13px",
                      color: t.textDim,
                      lineHeight: 1.4,
                    }}>
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrFlowPolish({ isMobile }) {
  const t = useTheme();

  const polishes = [
    {
      icon: "⬇️",
      title: "Adaptive filter rail",
      desc: "Hides on consecutive downward scroll and returns on upward movement to protect scanning space."
    },
    {
      icon: "💡",
      title: "Smart answer entry point",
      desc: "A contextual floating pill keeps intelligent assistance close without dominating the results list."
    },
    {
      icon: "✨",
      title: "Auto-suggestions",
      desc: "Faster query formulation and lower typing effort for high-intent workplace searches."
    }
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: t.accent,
            fontWeight: 600,
            marginBottom: "16px",
          }}>
            FLOW POLISH
          </h3>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 600,
              color: t.text,
              lineHeight: 1.25,
              margin: 0,
            }}>
              Small interaction decisions that protect focus.
            </h2>
            <p style={{
              fontSize: "14px",
              color: t.textMuted,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "640px",
            }}>
              Micro-interactions that reduce friction without overwhelming the core task.
            </p>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "24px",
        }}>
          {polishes.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "24px",
                background: t.bgAlt,
                borderRadius: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: t.bgCard,
                borderRadius: "12px",
                fontSize: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                {p.icon}
              </div>
              <div>
                <h4 style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: t.text,
                  margin: "0 0 8px 0",
                }}>
                  {p.title}
                </h4>
                <p style={{
                  fontSize: "14px",
                  color: t.textMuted,
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrImpact({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const metrics = [
    {
      icon: "↓",
      title: "Completion time",
      desc: "Reduced time to find workplace information."
    },
    {
      icon: "↑",
      title: "Objective conversion",
      desc: "Increased successful task completion."
    },
    {
      icon: "↑",
      title: "Search success",
      desc: "Improved discovery across connected systems."
    }
  ];

  const bgColor = isDark ? "#1A1A1A" : "#1A1A1A";

  return (
    <div style={{
      marginBottom: isMobile ? "36px" : "48px",
      background: bgColor,
      color: "white",
      borderRadius: isMobile ? "20px" : "28px",
      padding: isMobile ? "28px 20px" : "48px",
    }}>
      <Reveal>
        <div>
          <h3 style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#FFFFFF",
            fontWeight: 600,
            marginBottom: "16px",
          }}>
            IMPACT
          </h3>
          <h2 style={{
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 600,
            color: "#FFFFFF",
            lineHeight: 1.25,
            margin: "0 0 16px 0",
          }}>
            From "Where do I even look?" to "I have what I need."
          </h2>
          <p style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
            margin: "0 0 32px 0",
          }}>
            The outcome was a search experience that reduced objective completion time and increased successful task completion across high-intent workplace journeys. More importantly, it reframed enterprise search from something employees tolerate into something they can actually rely on. Smart Answers became Simpplr's most-used AI feature and a key differentiator in enterprise sales conversations.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "24px",
          }}>
            {metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}>
                  {m.icon}
                </div>
                <h4 style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  margin: 0,
                }}>
                  {m.title}
                </h4>
                <p style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ─── AIRTEL REWARDS — CUSTOM SECTIONS ────────────────────────

function AirtelOverview({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const stats = [
    {
      value: "350M+",
      label: "Subscribers",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ),
    },
    {
      value: "Senior PD",
      label: "Design + Research",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      ),
    },
    {
      value: "iOS + Android",
      label: "Platform",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>OVERVIEW</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Turning a transactional app into a habit-forming rewards engine.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Airtel Thanks App served 350M+ subscribers but had a purely transactional relationship — people opened it to recharge or pay bills, then left. The business needed a rewards layer that would transform single-session utility into habitual engagement.
            </p>
          </div>

          {/* Stat strip */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "12px" : "16px",
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: isMobile ? "16px 20px" : "20px 24px",
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${t.accent}12`,
                  borderRadius: "10px",
                  flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: t.textDim, fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Scope cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "12px" : "16px",
          }}>
            <div style={{
              padding: isMobile ? "20px" : "24px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
              borderRadius: "20px",
            }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: t.accent, marginBottom: "8px" }}>The Problem</div>
              <p style={{ fontSize: "14px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>Users opened the app for a single task and left. No reason to return, no emotional hook, no stickiness beyond utility.</p>
            </div>
            <div style={{
              padding: isMobile ? "20px" : "24px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
              borderRadius: "20px",
            }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: t.accent, marginBottom: "8px" }}>My Role</div>
              <p style={{ fontSize: "14px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>Senior Product Designer driving both design and research — responsible end-to-end from behavioural framework and information architecture through evaluative research to shipped product.</p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelDesignPhilosophy({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const leftBrain = [
    { drive: "Accomplishment", example: "Visible cashback totals, earned-reward counts" },
    { drive: "Ownership", example: "Personal trophy room of collected rewards" },
    { drive: "Logic", example: "Clear earn/claim paths, transparent rules" },
  ];

  const rightBrain = [
    { drive: "Curiosity", example: "Locked rewards with partial reveals" },
    { drive: "Uncertainty", example: "Gamified scratch-cards, spin-the-wheel" },
    { drive: "Creativity", example: "Multiple paths to earn and discover" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>DESIGN PHILOSOPHY</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Architecture grounded in the Octalysis behavioural framework.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Rather than a standard points-based loyalty program, I used the Octalysis framework — balancing left-brain and right-brain drives. This wasn't decoration — it was the structural DNA that informed every layout decision.
            </p>
          </div>

          {/* Brain split */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "0",
            borderRadius: "28px",
            overflow: "hidden",
            border: `1px solid ${t.border}`,
          }}>
            {/* Left brain */}
            <div style={{
              padding: isMobile ? "24px" : "32px",
              background: isDark ? "linear-gradient(180deg, rgba(99,162,255,0.08) 0%, rgba(99,162,255,0.02) 100%)" : "linear-gradient(180deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.01) 100%)",
              borderRight: isMobile ? "none" : `1px solid ${t.border}`,
              borderBottom: isMobile ? `1px solid ${t.border}` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#63A2FF" : "#3B82F6"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a9 9 0 0 0 0 18h0V2z"/><path d="M12 8h4"/><path d="M12 12h6"/><path d="M12 16h4"/></svg>
                <span style={{ fontSize: "14px", fontWeight: 700, color: isDark ? "#63A2FF" : "#3B82F6", textTransform: "uppercase", letterSpacing: "0.06em" }}>Left Brain</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {leftBrain.map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: t.text, marginBottom: "4px" }}>{item.drive}</div>
                    <div style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.5 }}>{item.example}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right brain */}
            <div style={{
              padding: isMobile ? "24px" : "32px",
              background: isDark ? "linear-gradient(180deg, rgba(232,122,79,0.08) 0%, rgba(232,122,79,0.02) 100%)" : "linear-gradient(180deg, rgba(232,122,79,0.06) 0%, rgba(232,122,79,0.01) 100%)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a9 9 0 0 1 0 18h0V2z"/><path d="M12 8h-4"/><path d="M12 12H6"/><path d="M12 16h-4"/></svg>
                <span style={{ fontSize: "14px", fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "0.06em" }}>Right Brain</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {rightBrain.map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: t.text, marginBottom: "4px" }}>{item.drive}</div>
                    <div style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.5 }}>{item.example}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelInfoArchitecture({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const levels = [
    { label: "Earned Rewards", uncertainty: "Low", icon: "🏆", desc: "Top section — accomplishment zone. Summarises rewards already collected, instilling pride.", color: isDark ? "#4ADE80" : "#16A34A" },
    { label: "Locked Rewards", uncertainty: "Medium", icon: "🔒", desc: "Task-based unlocks. Single actions that reveal hidden rewards — building anticipation.", color: isDark ? "#FBBF24" : "#E5A63B" },
    { label: "Gamified Elements", uncertainty: "High", icon: "🎰", desc: "Spin-the-wheel, trivia, scratch-cards. Peak curiosity and dopamine at the scroll bottom.", color: isDark ? "#F87171" : "#E07A6E" },
    { label: "Discovery Feed", uncertainty: "Browse", icon: "📜", desc: "Category-segregated feed of uncollected rewards. Scroll-based exploration for completionists.", color: isDark ? "#A78BFA" : "#9B8ACE" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>INFORMATION ARCHITECTURE</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              A graduated uncertainty model — from certainty at top to curiosity at bottom.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              The architecture separated 'rewards earned' from 'ways to earn' on distinct vertical levels — later validated when 100% of research participants naturally distinguished between the two.
            </p>
          </div>

          {/* Vertical flow */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative" }}>
            {levels.map((level, i) => {
              const cardMb = i < levels.length - 1 ? 12 : 0;
              return (
              <div key={i} style={{ display: "flex", gap: isMobile ? "16px" : "24px", alignItems: "stretch", marginBottom: `${cardMb}px` }}>
                {/* Timeline spine */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "44px",
                  flexShrink: 0,
                  position: "relative",
                }}>
                  {/* Connector line behind the dot */}
                  {i < levels.length - 1 && (
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      bottom: `-${cardMb}px`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "2px",
                      background: `linear-gradient(to bottom, ${level.color}30, transparent)`,
                    }} />
                  )}
                  {/* Dot — vertically centred, gradient border via wrapper */}
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${level.color}33, ${level.color}00)`,
                    padding: "2px",
                    zIndex: 1,
                  }}>
                    <div style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: `${level.color}1A`,
                      backdropFilter: "blur(44px)",
                      WebkitBackdropFilter: "blur(44px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}>
                      {level.icon}
                    </div>
                  </div>
                </div>

                {/* Content card */}
                <div style={{
                  flex: 1,
                  padding: isMobile ? "16px" : "20px 24px",
                  background: t.bgCard,
                  border: `1px solid ${t.border}`,
                  borderRadius: "16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: t.text }}>{level.label}</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: level.color,
                      background: `${level.color}14`,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}>
                      {level.uncertainty} uncertainty
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.5, margin: 0 }}>{level.desc}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelIdeation({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const moments = [
    {
      type: "Redemption",
      trigger: "Winning a partner voucher",
      response: "Navigation aids help the user redeem at the partner store or platform",
      icon: "🎁",
      accent: isDark ? "#4ADE80" : "#16A34A",
    },
    {
      type: "Activated Redemption",
      trigger: "Winning a discount on next bill",
      response: "Contextual prompts drive immediate conversion on the next transaction",
      icon: "⚡",
      accent: isDark ? "#FBBF24" : "#D97706",
    },
    {
      type: "Accomplished Rewards",
      trigger: "Cashback credited to account",
      response: "The interface celebrates the achievement, reinforcing habitual return",
      icon: "🏅",
      accent: isDark ? "#63A2FF" : "#3B82F6",
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>IDEATION & MOMENT OF WIN</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Three distinct emotional peaks — one for each reward intent.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Each moment of win used full-screen overlays with contextual motion to create emotional peaks at the exact point of reward delivery. A 'back to rewards' CTA drove return visits to the trophy room.
            </p>
          </div>

          {/* Moment cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "16px" : "20px",
          }}>
            {moments.map((m, i) => (
              <div key={i} style={{
                padding: isMobile ? "24px" : "28px",
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Gradient glow at left */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "3px",
                  borderRadius: "3px 0 0 3px",
                  background: `linear-gradient(to bottom, ${m.accent}, ${m.accent}00)`,
                }} />

                <div style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${m.accent}14`,
                  borderRadius: "12px",
                  fontSize: "22px",
                }}>
                  {m.icon}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: t.text }}>{m.type}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: `1px solid ${t.borderLight}`, paddingTop: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: t.textDim, marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Trigger</div>
                    <div style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.5 }}>{m.trigger}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: t.textDim, marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Design Response</div>
                    <div style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.5 }}>{m.response}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelEvaluativeResearch({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const quantMeasures = ["Completion time", "Rage taps", "Confused gazes", "Dissatisfaction moments"];
  const qualProbes = ["Transactional reward patterns", "Gamified engagement", "Reward categorisation"];

  const scenarios = [
    { id: "01", title: "Post-transaction discovery", context: "You just paid ₹455 via Airtel UPI for groceries and noticed some rewards..." },
    { id: "02", title: "Action-based reward earning", context: "You want to earn a reward by subscribing to Netflix through the app..." },
    { id: "03", title: "Offline coupon redemption", context: "You have a partner coupon code and want to redeem it at a store..." },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>EVALUATIVE RESEARCH</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Moderated think-aloud study with real-world scenarios.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              <span style={{ fontWeight: 600, color: t.text }}>6 participants</span> · <span style={{ fontWeight: 600, color: t.text }}>3 task scenarios</span> · Moderated think-aloud protocol with contextualised prompts to simulate real-world cognitive states.
            </p>
          </div>

          {/* Unified method card */}
          <div style={{
            padding: isMobile ? "20px" : "28px",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            {/* Measures row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "20px",
            }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Quantitative</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {quantMeasures.map((m, i) => (
                    <span key={i} style={{ padding: "5px 12px", background: t.bgAlt, borderRadius: "8px", fontSize: "12px", color: t.textMuted, fontWeight: 500 }}>{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Qualitative</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {qualProbes.map((m, i) => (
                    <span key={i} style={{ padding: "5px 12px", background: t.bgAlt, borderRadius: "8px", fontSize: "12px", color: t.textMuted, fontWeight: 500 }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: t.borderLight }} />

            {/* Scenarios */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>Task Scenarios</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {scenarios.map((s, i) => (
                  <div key={i} style={{
                    padding: "14px 16px",
                    background: t.bgAlt,
                    borderRadius: "12px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: t.accent, flexShrink: 0, fontVariantNumeric: "tabular-nums", marginTop: "1px" }}>{s.id}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, marginBottom: "3px" }}>{s.title}</div>
                      <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.5, fontStyle: "italic" }}>{s.context}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelResearchFindings({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const findings = [
    {
      stat: "100%",
      title: "Motion noticeability",
      detail: "All participants noticed the motion-induced reward display on the transaction success screen. Blue dot signifier and sparkle tags communicated 'something new.'",
      verdict: "validated",
    },
    {
      stat: "100%",
      title: "Trophy room routing",
      detail: "Routing users to the trophy room post-transaction increases discoverability of previously earned rewards.",
      verdict: "validated",
      sub: "83.3% expressed specific interest in expiring-soon rewards.",
    },
    {
      stat: "83.3%",
      title: "Locked reward discoverability failure",
      detail: "Struggled to locate locked rewards in Task 2 — top widgets consumed too much real estate.",
      verdict: "issue",
      sub: "Mean discoverability time: 13.43s. Success rate without probing: 33.3%.",
    },
    {
      stat: "66.7%",
      title: "Cognitive overload from widget density",
      detail: "The rewards-won widget was confusing to decipher. Too many data points competed for attention simultaneously.",
      verdict: "issue",
    },
    {
      stat: "New",
      title: "Recall hook problem",
      detail: "Participants across sessions expressed they forget about earned vouchers between sessions — opening a new problem space around external recall mechanisms.",
      verdict: "discovery",
    },
  ];

  const verdictStyles = {
    validated: { bg: isDark ? "rgba(74,222,128,0.1)" : "rgba(22,163,74,0.08)", color: isDark ? "#4ADE80" : "#16A34A", label: "Validated" },
    issue: { bg: isDark ? "rgba(251,176,124,0.12)" : "rgba(194,120,70,0.1)", color: isDark ? "#FBB07C" : "#C27846", label: "Needs Iteration" },
    discovery: { bg: isDark ? "rgba(167,139,250,0.1)" : "rgba(124,58,237,0.08)", color: isDark ? "#A78BFA" : "#7C3AED", label: "New Discovery" },
  };

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>RESEARCH FINDINGS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Five key insights from 6 participants, 3 scenarios.
            </h2>
          </div>

          {/* Finding cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
            {findings.map((f, i) => {
              const v = verdictStyles[f.verdict];
              return (
                <div key={i} style={{
                  padding: isMobile ? "20px" : "24px 28px",
                  background: t.bgCard,
                  border: `1px solid ${t.border}`,
                  borderRadius: "20px",
                  display: "flex",
                  gap: isMobile ? "16px" : "24px",
                  alignItems: "flex-start",
                  flexDirection: isMobile ? "column" : "row",
                }}>
                  {/* Big stat */}
                  <div style={{
                    minWidth: isMobile ? "auto" : "80px",
                    textAlign: isMobile ? "left" : "center",
                    flexShrink: 0,
                  }}>
                    <div style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, color: v.color, lineHeight: 1 }}>{f.stat}</div>
                    <div style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: v.color,
                      background: v.bg,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      marginTop: "8px",
                      display: "inline-block",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}>
                      {v.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: t.text, marginBottom: "6px", lineHeight: 1.3 }}>{f.title}</div>
                    <p style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>{f.detail}</p>
                    {f.sub && (
                      <p style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.5, margin: "8px 0 0", fontStyle: "italic" }}>{f.sub}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelConstraints({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const planned = [
    "Scratch-cards",
    "Spin-the-wheel",
    "Trivia games",
    "Task-based rewards",
  ];

  const shipped = [
    "Data coupons (e.g., 1.5GB free data)",
    "Discount coupons (e.g., ₹40 off next bill)",
  ];

  const preserved = [
    { label: "Information hierarchy", icon: "📐" },
    { label: "Graduated uncertainty", icon: "📊" },
    { label: "Moment-of-win patterns", icon: "🎯" },
    { label: "Loss-aversion locking", icon: "🔒" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>WORKING WITH CONSTRAINTS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Backend limitations forced a strategic pivot — without losing the architecture.
            </h2>
          </div>

          {/* Planned vs Shipped */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "0",
            borderRadius: "24px",
            overflow: "hidden",
            border: `1px solid ${t.border}`,
          }}>
            {/* Planned - struck through */}
            <div style={{
              padding: isMobile ? "24px" : "28px",
              background: isDark ? "rgba(248,113,113,0.04)" : "rgba(220,38,38,0.03)",
              borderRight: isMobile ? "none" : `1px solid ${t.border}`,
              borderBottom: isMobile ? `1px solid ${t.border}` : "none",
            }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: isDark ? "#F87171" : "#DC2626", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Planned (Descoped)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {planned.map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    color: t.textDim,
                    textDecoration: "line-through",
                    opacity: 0.6,
                  }}>
                    <span style={{ color: isDark ? "#F87171" : "#DC2626", fontSize: "14px" }}>✕</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Shipped */}
            <div style={{
              padding: isMobile ? "24px" : "28px",
              background: isDark ? "rgba(74,222,128,0.04)" : "rgba(22,163,74,0.03)",
            }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: isDark ? "#4ADE80" : "#16A34A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Shipped in V1</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {shipped.map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    color: t.textMuted,
                  }}>
                    <span style={{ color: isDark ? "#4ADE80" : "#16A34A", fontSize: "14px" }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preserved principles */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>Architecture Preserved</div>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: "12px",
            }}>
              {preserved.map((p, i) => (
                <div key={i} style={{
                  padding: "16px",
                  background: t.bgCard,
                  border: `1px solid ${t.border}`,
                  borderRadius: "16px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{p.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelShippedSolution({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const features = [
    {
      icon: "🎯",
      title: "Intent-driven widgets",
      desc: "Earned data rewards surface when you're running low — creating both utility and accomplishment.",
    },
    {
      icon: "📂",
      title: "Earned vs. claimed separation",
      desc: "Limited-choice displays leveraging the paradox of choice for faster decision-making.",
    },
    {
      icon: "⏰",
      title: "Urgency signals",
      desc: "'New' and 'expiring soon' tags with 'view all' overflow — time-pressure as a conversion lever.",
    },
    {
      icon: "🔒",
      title: "Loss-aversion locking",
      desc: "Locked rewards as intrinsic motivation triggers — replacing scratch-cards without losing the behavioural loop.",
    },
    {
      icon: "↕️",
      title: "Grid → List cognitive shift",
      desc: "Grid for browsing (side-by-side comparison), list for consumption (sequential processing).",
    },
    {
      icon: "💰",
      title: "Cashback ecosystem widget",
      desc: "Comprehensive view spanning transactions managed by separate backend teams, unified in one surface.",
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>SHIPPED SOLUTION</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Core principles preserved — adapted to real-world constraints.
            </h2>
          </div>

          {/* Feature cards 2x3 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "14px" : "16px",
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: isMobile ? "20px" : "24px",
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: "20px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: t.bgAlt,
                  borderRadius: "10px",
                  fontSize: "20px",
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: t.text, marginBottom: "4px" }}>{f.title}</div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelImpact({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const metrics = [
    { stat: "100%", label: "Motion noticeability", desc: "Transactional nudge noticed by all tested users", accent: isDark ? "#4ADE80" : "#16A34A" },
    { stat: "83.3%", label: "Expiry engagement", desc: "Users engaged with previously unclaimed rewards", accent: isDark ? "#63A2FF" : "#3B82F6" },
    { stat: "~25%", label: "Revenue uplift", desc: "Reward-driven recharges and bill payments increased total transaction revenue", accent: t.accent },
  ];

  const outcomes = [
    "Users who saw rewards reachable via recharge went for it — converting rewards into repeat transactions",
    "Shipped to 350M+ subscribers across iOS and Android — still live today",
    "Stickiness hypothesis validated by evaluative research",
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>IMPACT</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Revenue uplift, validated hypotheses, and lasting engagement.
            </h2>
          </div>

          {/* Big metric cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "12px" : "16px",
          }}>
            {metrics.map((m, i) => (
              <div key={i} style={{
                padding: isMobile ? "20px" : "24px",
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: m.accent, lineHeight: 1 }}>{m.stat}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{m.label}</div>
                <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.4 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          {/* Outcomes strip */}
          <div style={{
            padding: isMobile ? "20px" : "24px 28px",
            background: isDark ? "linear-gradient(135deg, rgba(232,122,79,0.08) 0%, rgba(232,122,79,0.02) 100%)" : "linear-gradient(135deg, rgba(232,122,79,0.06) 0%, rgba(232,122,79,0.01) 100%)",
            border: `1px solid ${isDark ? "rgba(232,122,79,0.15)" : "rgba(232,122,79,0.12)"}`,
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            {outcomes.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ color: t.accent, fontSize: "14px", flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "14px", color: t.text, fontWeight: 500 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelLearnings({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const lessons = [
    {
      number: "01",
      title: "Behavioural architecture before pixels",
      desc: "The Octalysis-grounded information hierarchy was more impactful than any visual treatment. Without the philosophical framework, the UI would have been a feature list instead of a behavioural engine.",
      tag: "Process",
    },
    {
      number: "02",
      title: "Constraints sharpen design",
      desc: "Losing scratch-cards forced us to make the core earn/claim loop so clear that the reduced variety became invisible. Fewer mechanics meant each one had to work harder.",
      tag: "Mindset",
    },
    {
      number: "03",
      title: "The unsolved recall problem",
      desc: "Users consistently forgot about earned rewards between sessions. This opened a product opportunity around push-notification timing and contextual re-engagement beyond my project scope.",
      tag: "Opportunity",
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>LEARNINGS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Three lessons that shaped how I design today.
            </h2>
          </div>

          {/* Lesson cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
            {lessons.map((l, i) => (
              <div key={i} style={{
                padding: isMobile ? "20px" : "24px 28px",
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: "20px",
                display: "flex",
                gap: isMobile ? "16px" : "20px",
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${t.accent}14`,
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: t.accent,
                  flexShrink: 0,
                }}>
                  {l.number}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: t.text }}>{l.title}</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: t.textDim,
                      background: t.bgAlt,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}>
                      {l.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ─── SIMPPLR EVENTS — CUSTOM SECTIONS ────────────────────────

function SimpplrEventsOverview({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const stats = [
    { value: "Enterprise", label: "Scale", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>) },
    { value: "Web App", label: "Platform", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>) },
    { value: "Senior PD", label: "Design + Research", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>) },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>OVERVIEW</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              From scattered schedules to a centralised calendar — built on research, shipped with impact.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Enterprise clients used Simpplr as their intranet but had no native way to manage company events. Employees relied on fragmented tools — Google Calendar, Outlook invites, Slack reminders — and missed events because there was no central discovery surface.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "16px" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: isMobile ? "16px 20px" : "20px 24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}12`, borderRadius: "10px", flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: t.textDim, fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "12px" : "16px" }}>
            <div style={{ padding: isMobile ? "20px" : "24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: t.accent, marginBottom: "8px" }}>The Problem</div>
              <p style={{ fontSize: "14px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>Users could only view a flat list of events — not conducive to scheduling decisions, especially when comparing with external calendars. No RSVP visibility, no source distinction, no holistic view.</p>
            </div>
            <div style={{ padding: isMobile ? "20px" : "24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: t.accent, marginBottom: "8px" }}>The HMW</div>
              <p style={{ fontSize: "14px", color: t.textMuted, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>How might we offer a comprehensive overview of events across users' schedules to facilitate quicker decision-making and provide a centralised platform for connecting and attending?</p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrEventsIdeation({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const parameters = [
    { icon: "📐", title: "Central layout constraint", desc: "Content-heavy intranet design emphasises a central layout for restricted eye movement. No full-width luxury — the calendar had to fit the existing architecture." },
    { icon: "🔀", title: "View switching header", desc: "Header element focused on switching between calendar and list view. Later iterated into icon-only tabular selector based on evaluation data." },
    { icon: "🔍", title: "Filtering & connected calendars", desc: "Subsequent control level with search, filters, and a dropdown for connected external calendars (Google, Outlook)." },
    { icon: "📅", title: "Calendar patterns", desc: "Single-day events, multi-day events, month navigation, and a 'Today' CTA — synchronised with established interface design patterns." },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>IDEATION</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Fitting a calendar into a content-heavy intranet — four design parameters.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Existing generative data from the CX team formed the foundation. The primary challenge was seamlessly fitting the calendar into Simpplr's existing design system while solving real scheduling problems.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "14px" : "16px" }}>
            {parameters.map((p, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: t.bgAlt, borderRadius: "10px", fontSize: "20px", flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: t.text, marginBottom: "4px" }}>{p.title}</div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrEventsHypotheses({ isMobile }) {
  const t = useTheme();

  const hypotheses = [
    { number: "01", title: "Calendar view drives RSVP conversion", desc: "Presenting events holistically in a calendar view will increase the conversion rate on event-RSVP responses compared to the existing list view of events.", tag: "Hypothesis A" },
    { number: "02", title: "Visual indicators distinguish event sources", desc: "Use of fill and outline colours will help users decipher between events from different sources — Google, Outlook, and internal intranet events.", tag: "Assumption A" },
    { number: "03", title: "Stroke/fill increases RSVP discoverability", desc: "Use of visual indicators like strokes and fill will increase discoverability of RSVP response status on events.", tag: "Assumption B" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>HYPOTHESES</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              One hypothesis and two assumptions to validate through evaluation.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
            {hypotheses.map((h, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px 28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: t.accent, fontVariantNumeric: "tabular-nums" }}>{h.number}</span>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: t.textDim, background: t.bgAlt, padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h.tag}</span>
                </div>
                <h4 style={{ fontSize: "16px", fontWeight: 600, color: t.text, margin: 0, lineHeight: 1.3 }}>{h.title}</h4>
                <p style={{ fontSize: "13px", color: t.textMuted, margin: 0, lineHeight: 1.6 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrEventsResearch({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const quantMeasures = ["Task accuracy", "Ease of use (Likert)", "Expectancy meet (Likert)", "Frequency of usage (Likert)"];
  const qualProbes = ["Source distinction patterns", "RSVP discoverability", "Navigation mental models"];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>EVALUATIVE RESEARCH</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Task-based think-aloud evaluation with Internal Comms specialists.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              <span style={{ fontWeight: 600, color: t.text }}>5 participants</span> · <span style={{ fontWeight: 600, color: t.text }}>30–40 min sessions</span> · Virtual (Zoom/GMeet) · Qualitative perception analysis with task-based protocol.
            </p>
          </div>

          <div style={{ padding: isMobile ? "20px" : "28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "24px", display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "16px" : "20px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Quantitative</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {quantMeasures.map((m, i) => (
                    <span key={i} style={{ padding: "5px 12px", background: t.bgAlt, borderRadius: "8px", fontSize: "12px", color: t.textMuted, fontWeight: 500 }}>{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Qualitative</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {qualProbes.map((m, i) => (
                    <span key={i} style={{ padding: "5px 12px", background: t.bgAlt, borderRadius: "8px", fontSize: "12px", color: t.textMuted, fontWeight: 500 }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ height: "1px", background: t.borderLight }} />

            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Persona</div>
              <div style={{ fontSize: "14px", color: t.text, fontWeight: 500 }}>Internal Communications Manager / Specialist</div>
              <div style={{ fontSize: "12px", color: t.textDim, marginTop: "4px" }}>Primary creators and managers of intranet events — from weekly coffee meets to company town halls.</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrEventsFindings({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const metrics = [
    { stat: "100%", title: "Task accuracy", detail: "All participants completed all tasks accurately.", verdict: "validated" },
    { stat: "4.5/5", title: "Ease of use", detail: "Mean Likert score for ease of use of the calendar experience.", verdict: "validated" },
    { stat: "4/5", title: "Expectancy meet", detail: "Participants rated the feature as meeting their expectations for an intranet calendar.", verdict: "validated" },
    { stat: "80%", title: "Color control preference", detail: "Users preferred having the ability to control color for external calendars — supporting Assumption A.", verdict: "validated" },
  ];

  const issues = [
    { title: "Month navigation friction", detail: "Different months have varying text widths, forcing users to move their mouse to click arrows — increasing completion time." },
    { title: "Past vs. future event confusion", detail: "Users had difficulty differentiating between past and present/future events at a glance." },
    { title: "Calendar View toggle confusion", detail: "Users were unsure what would happen if they turned off the 'Calendar View' switch — expectancy error." },
    { title: "Missing event creation", detail: "Inability to create an event directly from the calendar didn't meet user expectations set by Google/Outlook." },
  ];

  const verdictStyles = {
    validated: { bg: isDark ? "rgba(74,222,128,0.1)" : "rgba(22,163,74,0.08)", color: isDark ? "#4ADE80" : "#16A34A", label: "Validated" },
  };

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>RESEARCH FINDINGS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Strong usability signals — and four clear areas to iterate on.
            </h2>
          </div>

          {/* Validated metrics */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? "12px" : "16px" }}>
            {metrics.map((m, i) => {
              const v = verdictStyles[m.verdict];
              return (
                <div key={i} style={{ padding: isMobile ? "16px" : "20px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, color: v.color, lineHeight: 1 }}>{m.stat}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{m.title}</div>
                  <div style={{ fontSize: "11px", color: t.textDim, lineHeight: 1.4 }}>{m.detail}</div>
                </div>
              );
            })}
          </div>

          {/* Issues found */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>Usability Issues Identified</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "12px" : "14px" }}>
              {issues.map((issue, i) => (
                <div key={i} style={{ padding: isMobile ? "16px" : "18px 20px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: isDark ? "#FBB07C" : "#C27846", flexShrink: 0, marginTop: "1px" }}>0{i + 1}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, marginBottom: "3px" }}>{issue.title}</div>
                    <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.5 }}>{issue.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrEventsIterations({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const iterations = [
    {
      number: "01",
      title: "Calendar Hints → Calendar Settings",
      desc: "Evaluation revealed 'Calendar Hints' (legend explanations) were universal and unhelpful. Replaced with 'Calendar Settings' — controls for past-event brightness and custom colors for connected external calendars.",
      tag: "Data-driven pivot",
      image: "/images/simpplr-events/simmplr-events-calendar-iteration-01.jpg",
    },
    {
      number: "02",
      title: "Navigation trigger redesign",
      desc: "Month navigation arrows were repositioned to reduce completion time for sequential navigation. Fixed the varying-text-width problem that forced unnecessary mouse movement.",
      tag: "Completion time",
      image: "/images/simpplr-events/simmplr-events-calendar-iteration-02.jpg",
    },
    {
      number: "03",
      title: "Calendar View toggle → Icon selector",
      desc: "The ambiguous 'Calendar View' switch caused expectancy errors. Replaced with an icon-only tabular selector — qualitative data confirmed these icons were universally understood.",
      tag: "Expectancy fix",
      image: "/images/simpplr-events/simmplr-events-calendar-iteration-03.jpg",
    },
    {
      number: "04",
      title: "UI improvements & accessibility",
      desc: "Added borders to event list elements for accessibility. Event titles moved to underflow instead of truncation — matching existing mental models. Visual patterns aligned with the design system.",
      tag: "System fit",
      image: "/images/simpplr-events/simmplr-events-calendar-ui-improvements.jpg",
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>ITERATIONS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Four research-driven iterations — every change backed by evaluation data.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {iterations.map((it, i) => (
              <div key={i}>
                {i > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: isMobile ? "28px 0" : "36px 0" }}>
                    <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${t.border}, transparent)` }} />
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: t.accent, opacity: 0.3 }} />
                    <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, ${t.border}, transparent)` }} />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
                  <div style={{ padding: isMobile ? "20px" : "24px 28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: isMobile ? "16px" : "20px", alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", borderRadius: "3px 0 0 3px", background: `linear-gradient(to bottom, ${t.accent}, ${t.accent}00)` }} />
                    <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}14`, borderRadius: "12px", fontSize: "16px", fontWeight: 700, color: t.accent, flexShrink: 0 }}>{it.number}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600, color: t.text }}>{it.title}</span>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: t.textDim, background: t.bgAlt, padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{it.tag}</span>
                      </div>
                      <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{it.desc}</p>
                    </div>
                  </div>
                  {it.image && (
                    <div style={{ borderRadius: "16px", overflow: "hidden", border: `1px solid ${t.border}` }}>
                      <img src={it.image} alt={it.title} style={{ width: "100%", display: "block" }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrEventsShipped({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const features = [
    { icon: "📅", title: "Unified calendar view", desc: "Intranet events alongside Google/Outlook calendars in one surface — holistic schedule at a glance." },
    { icon: "🎨", title: "Color-coded event sources", desc: "Fill and outline colors distinguish internal vs. external events. Users can customise colors per calendar." },
    { icon: "⚡", title: "Inline RSVP", desc: "Yes / No / Maybe responses directly from the event popover — no navigation required." },
    { icon: "⚙️", title: "Calendar Settings", desc: "Brightness controls for past events, custom color selection for connected calendars — research-driven feature." },
    { icon: "🔀", title: "Icon-only view selector", desc: "Calendar, list, and settings views via universally understood icon tabs — eliminating toggle confusion." },
    { icon: "♿", title: "Accessible event elements", desc: "Bordered event items, underflow titles, and design-system alignment for inclusive experience." },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>SHIPPED SOLUTION</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              A research-validated calendar that shipped through Early Adopters to GA.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Launched via Early Adopters Program (EAP) for initial feedback, then released to General Availability. Every shipped element was shaped by the evaluation study.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "14px" : "16px" }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: t.bgAlt, borderRadius: "10px", fontSize: "20px", flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: t.text, marginBottom: "4px" }}>{f.title}</div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrEventsImpact({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const metrics = [
    { stat: "28.85%", label: "Event click increase", desc: "Increase in clicks on events across all connected calendars post-GA", accent: isDark ? "#63A2FF" : "#3B82F6" },
    { stat: "37.5%", label: "CSAT improvement", desc: "Customer satisfaction uplift during Early Adopters Program", accent: isDark ? "#4ADE80" : "#16A34A" },
    { stat: "13.58%", label: "Calendar activation", desc: "Increase in enabling external calendars (Google/Outlook)", accent: t.accent },
  ];

  const outcomes = [
    "Null hypothesis for calendar-view RSVP conversion qualitatively rejected — validated by evaluation and GA metrics",
    "Became a selling point in enterprise demos and EAP client conversations",
    "No major pain points identified during GA phase — continuous monitoring ongoing",
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>IMPACT</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              28.85% increase in event engagement — users connecting calendars and clicking to RSVP at scale.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "16px" }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: m.accent, lineHeight: 1 }}>{m.stat}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{m.label}</div>
                <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.4 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: isMobile ? "20px" : "24px 28px", background: isDark ? "linear-gradient(135deg, rgba(232,122,79,0.08) 0%, rgba(232,122,79,0.02) 100%)" : "linear-gradient(135deg, rgba(232,122,79,0.06) 0%, rgba(232,122,79,0.01) 100%)", border: `1px solid ${isDark ? "rgba(232,122,79,0.15)" : "rgba(232,122,79,0.12)"}`, borderRadius: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {outcomes.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ color: t.accent, fontSize: "14px", flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "14px", color: t.text, fontWeight: 500 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SimpplrEventsLearnings({ isMobile }) {
  const t = useTheme();

  const lessons = [
    { number: "01", title: "Evaluate assumptions, not just interfaces", desc: "The hypothesis-driven evaluation structure meant every design decision had a measurable outcome — not just aesthetic preference. This made stakeholder buy-in straightforward.", tag: "Process" },
    { number: "02", title: "Design system constraints breed clarity", desc: "Fitting a complex calendar into an existing central-layout architecture forced ruthless prioritisation of information. The constraint produced a cleaner result than full creative freedom would have.", tag: "Mindset" },
    { number: "03", title: "Small expectancy errors compound", desc: "The 'Calendar View' toggle confusion was a tiny detail — but it created hesitation across multiple tasks. Catching these in evaluation prevented compounding usability debt at scale.", tag: "Quality" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>LEARNINGS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Three takeaways from shipping research-driven enterprise features.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
            {lessons.map((l, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px 28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: isMobile ? "16px" : "20px", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}14`, borderRadius: "12px", fontSize: "16px", fontWeight: 700, color: t.accent, flexShrink: 0 }}>{l.number}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: t.text }}>{l.title}</span>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: t.textDim, background: t.bgAlt, padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l.tag}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ============ NOVA FOOD ORDERING COMPONENTS ============

function NovaOverview({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const stats = [
    { value: "0 → 1", label: "Ground-up build", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>) },
    { value: "iOS + Android", label: "Platform", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>) },
    { value: "Lead PD", label: "Built everything from scratch", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>) },
  ];

  const problemDimensions = [
    { label: "Enterprise brands", desc: "Outdated, poorly designed apps with clunky UI/UX — no loyalty, wallets, gift cards, or modern menu experiences.", color: isDark ? "#63A2FF" : "#3B82F6", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>) },
    { label: "QSRs & small brands", desc: "No budget to build or maintain a mobile app. Zero digital presence beyond aggregators where they own nothing.", color: isDark ? "#FBBF24" : "#E5A63B", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>) },
    { label: "NOVA's position", desc: "Had web-online ordering but no mobile product. Missing the fastest-growing channel for direct-to-consumer engagement.", color: isDark ? "#4ADE80" : "#16A34A", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>) },
  ];

  const whatThisSolved = [
    "Enterprises get a modern, advanced mobile app alongside NOVA's web-online ordering",
    "QSRs who can't build or maintain apps now get an advanced digital presence",
    "Restaurants own their customer relationships, data, and brand experience directly",
    "Advanced features out of the box — gift cards, wallets, loyalty, intuitive menus, referrals",
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>OVERVIEW</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              A white-label food ordering app built from zero — designed for multi-brand scale from day one.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              NOVA had no mobile product. I led the 0→1 design as Lead Product Designer — defining the product architecture, building the design system, and shipping a white-label app that any QSR or enterprise could deploy under their own brand identity.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "16px" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: isMobile ? "16px 20px" : "20px 24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}12`, borderRadius: "10px", flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: t.textDim, fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Problem statement — multi-dimensional */}
          <div style={{ padding: isMobile ? "20px" : "28px 32px", background: isDark ? "linear-gradient(135deg, rgba(99,162,255,0.06) 0%, rgba(99,162,255,0.01) 100%)" : "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(59,130,246,0.01) 100%)", border: `1px solid ${isDark ? "rgba(99,162,255,0.12)" : "rgba(59,130,246,0.1)"}`, borderRadius: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>The Problem — Three Dimensions</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? "16px" : "24px" }}>
              {problemDimensions.map((d, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: `${d.color}18`, borderRadius: "8px", color: d.color, flexShrink: 0 }}>{d.icon}</div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: d.color }}>{d.label}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What this solved */}
          <div style={{ padding: isMobile ? "20px" : "24px 28px", background: isDark ? "linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(74,222,128,0.01) 100%)" : "linear-gradient(135deg, rgba(22,163,74,0.05) 0%, rgba(22,163,74,0.01) 100%)", border: `1px solid ${isDark ? "rgba(74,222,128,0.12)" : "rgba(22,163,74,0.1)"}`, borderRadius: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: isDark ? "#4ADE80" : "#16A34A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>What This Product Solved</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {whatThisSolved.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ color: isDark ? "#4ADE80" : "#16A34A", fontSize: "14px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "14px", color: t.text, fontWeight: 500 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function NovaStrategicContext({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const iconSize = isMobile ? 36 : 40;
  const challenges = [
    { icon: "/images/nova-food-ordering/icons/digital-identity-gap.svg", title: "No digital storefront", desc: "Most enterprises had outdated, poorly designed apps with clunky interfaces — no modern menu experience, no gift cards, no wallet integration." },
    { icon: "/images/nova-food-ordering/icons/tech-complexity.svg", title: "Tech complexity overwhelms ops", desc: "Building and maintaining a tech solution is a burden for restaurants focused on food, not software. They needed a turnkey product." },
    { icon: "/images/nova-food-ordering/icons/engagement.svg", title: "Engagement & retention gap", desc: "Without loyalty rewards, intuitive menus, or a dedicated app, restaurants had no mechanism to drive repeat visits or build habits." },
    { icon: "/images/nova-food-ordering/icons/advancedFeatures.svg", title: "Missing monetisation levers", desc: "No gift cards, wallet, referral programs — restaurants were leaving revenue and loyalty-building opportunities on the table." },
  ];

  const opportunities = [
    { icon: "/images/nova-food-ordering/icons/digital-first.svg", title: "Mobile-first acquisition", desc: "A branded app becomes the entry point into NOVA's ecosystem — once onboarded for mobile, restaurants adopt POS, kiosks, and RMS." },
    { icon: "/images/nova-food-ordering/icons/unlocking-growth.svg", title: "Enterprise unlock", desc: "Multi-location mobile app lets NOVA scale with enterprise clients — expanding footprint and ARR across large restaurant groups." },
    { icon: "/images/nova-food-ordering/icons/AI-innovation.svg", title: "AI-first differentiation", desc: "Voice ordering, AI personalisation, and smart recommendations set NOVA apart for tech-forward brands." },
    { icon: "/images/nova-food-ordering/icons/monetisation.svg", title: "Diverse monetisation", desc: "Transaction fees on digital wallets, premium AI features, gift card commissions — the app opens multiple revenue channels." },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>STRATEGIC CONTEXT</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Why build this now — the market gap and NOVA's strategic position.
            </h2>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: isDark ? "#FBB07C" : "#C27846", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>Challenges Facing Restaurants</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "12px" : "14px" }}>
              {challenges.map((c, i) => (
                <div key={i} style={{ padding: isMobile ? "16px" : "18px 20px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "16px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <img src={c.icon} alt="" style={{ width: iconSize, height: iconSize, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, marginBottom: "5px" }}>{c.title}</div>
                    <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.5 }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: isDark ? "#4ADE80" : "#16A34A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>Opportunities for NOVA</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "12px" : "14px" }}>
              {opportunities.map((o, i) => (
                <div key={i} style={{ padding: isMobile ? "16px" : "18px 20px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "16px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <img src={o.icon} alt="" style={{ width: iconSize, height: iconSize, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, marginBottom: "5px" }}>{o.title}</div>
                    <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.5 }}>{o.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function NovaProductFraming({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const principles = [
    { number: "01", title: "White-label first, not white-label later", desc: "Every design decision assumed multi-brand deployment. Theme tokens were separated from structural components from the start — colours, typography, logos, and content all configurable without code changes.", tag: "Architecture" },
    { number: "02", title: "Hardest use case first", desc: "Designed for the most complex scenario — a multi-category menu with nested modifiers, combos, and add-ons. If the complex case works, simpler QSR menus work automatically with zero re-design.", tag: "Scalability" },
    { number: "03", title: "Multi-mode as a first-class pattern", desc: "Dine-in, takeaway, and delivery aren't modes bolted onto an ordering flow. They're distinct experience paths with shared components — each with their own contextual logic for menus, pricing, and fulfillment.", tag: "Flexibility" },
    { number: "04", title: "Ecosystem entry point, not a standalone app", desc: "The mobile app was designed as the top of NOVA's product funnel. Loyalty hooks, wallet integration, and gift cards create stickiness that feeds adoption of POS, kiosks, and the RMS platform.", tag: "Strategy" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>PRODUCT FRAMING</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Four architectural bets that shaped every downstream decision.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Before any screen was designed, I defined the product principles that would constrain and guide the team. These weren't abstract values — they were concrete architectural choices with real trade-offs.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
            {principles.map((p, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px 28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: isMobile ? "16px" : "20px", alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", borderRadius: "3px 0 0 3px", background: `linear-gradient(to bottom, ${t.accent}, ${t.accent}00)` }} />
                <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}14`, borderRadius: "12px", fontSize: "16px", fontWeight: 700, color: t.accent, flexShrink: 0 }}>{p.number}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: t.text }}>{p.title}</span>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: t.textDim, background: t.bgAlt, padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.tag}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function NovaConstraints({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const constraints = [
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
      title: "Tight timeline",
      desc: "No runway for multi-month discovery. Designs had to be validated and shipped in parallel — decision speed was a core design constraint.",
      tags: ["MVP-first thinking", "Parallel dev & design", "Rapid decision-making"],
    },
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 13l3-3 2 2 5-5"/></svg>),
      title: "Limited testing",
      desc: "Real user testing was constrained to internal stakeholders and select pilots. Design had to lean on established mental models to compensate.",
      tags: ["Heuristic-led decisions", "Stakeholder validation", "Familiar UX patterns"],
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>REAL WORLD CONSTRAINTS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Shipping under pressure
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Two hard real-world constraints shaped the design decisions from day one.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "16px" : "20px" }}>
            {constraints.map((c, i) => (
              <div key={i} style={{
                padding: isMobile ? "24px" : "32px",
                background: isDark
                  ? `linear-gradient(160deg, ${t.accent}0A 0%, transparent 50%)`
                  : `linear-gradient(160deg, ${t.accent}08 0%, ${t.bgCard} 50%)`,
                border: `1px solid ${t.border}`,
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}>
                <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}0D`, borderRadius: "14px", border: `1px solid ${t.accent}15` }}>
                  {c.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 700, color: t.text, margin: "0 0 10px 0", lineHeight: 1.3 }}>{c.title}</h3>
                  <p style={{ fontSize: "14px", color: t.textMuted, lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
                  {c.tags.map((tag, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: t.textDim, flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: t.textDim, fontWeight: 500 }}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function NovaDesignPhilosophy({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const principles = [
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>),
      title: "Immersive browsing",
      desc: "Food discovery should feel like browsing — not form-filling. Rich visuals, intuitive categories, and zero friction between curiosity and action.",
      mantra: "SEE IT  ||  WANT IT  ||  ORDER IT",
    },
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
      title: "Behaviour diversity",
      desc: "Some users know what they want. Others explore. The system adapts to both — surfacing recommendations for explorers while staying fast for habitual orderers.",
      mantra: "ONE PLATFORM, EVERY TYPE OF GUEST",
    },
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M2 8h20"/></svg>),
      title: "Engagement vs Exploration",
      desc: "Loyalty, upsells, and combos live alongside discovery. The interface balances business goals with guest autonomy — never feeling pushy.",
      mantra: "DELIGHT, DON'T DETRACT",
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>DESIGN PHILOSOPHY</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25 }}>
              The principles behind every screen
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "16px" : "20px" }}>
            {principles.map((p, i) => (
              <div key={i} style={{
                padding: isMobile ? "24px" : "28px",
                background: isDark
                  ? `linear-gradient(160deg, ${t.accent}0A 0%, transparent 50%)`
                  : `linear-gradient(160deg, ${t.accent}08 0%, ${t.bgCard} 50%)`,
                border: `1px solid ${t.border}`,
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}>
                <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}0D`, borderRadius: "14px", border: `1px solid ${t.accent}15` }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "clamp(16px, 2.5vw, 20px)", fontWeight: 700, color: t.text, margin: "0 0 10px 0", lineHeight: 1.25 }}>{p.title}</h3>
                  <p style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function NovaDesignDecisions({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const decisions = [
    {
      title: "Home screen as a behavioural engine",
      hypothesis: "A personalised, action-oriented home screen will drive higher session depth than a flat menu landing.",
      decision: "Designed a home screen with personalised greeting, loyalty progress, quick actions (favourites, QR), promotional shelves, and gifting hooks — layering cognitive triggers (familiarity, instant gratification) to nudge users from browsing to ordering.",
      outcome: "First enterprise client specifically cited the home experience as a differentiator in their signing decision.",
      color: isDark ? "#63A2FF" : "#3B82F6",
    },
    {
      title: "Swipe-to-discover menu browsing",
      hypothesis: "Users visiting unfamiliar restaurant menus need a discovery mechanism, not just a list to order from.",
      decision: "Introduced a swipe-to-discover interaction for menu items alongside traditional grid/list browsing. This reduces decision fatigue for new menus and builds preference profiles over time.",
      outcome: "The interaction became a feature differentiator in sales demos — restaurants saw it as a way to surface underperforming menu items.",
      color: isDark ? "#FBBF24" : "#E5A63B",
    },
    {
      title: "Nova Wallet as a cross-channel payment layer",
      hypothesis: "A preloaded wallet removes payment friction at every touchpoint and increases order completion rates.",
      decision: "Designed Nova Wallet with preloaded funds, auto-top-up, QR code for in-restaurant pay, and PIN-based drive-thru payments. One wallet works across mobile, dine-in, and drive-thru.",
      outcome: "Wallet became a retention lever — preloaded funds create switching costs and incentivise repeat ordering.",
      color: isDark ? "#4ADE80" : "#16A34A",
    },
    {
      title: "Gift cards as a growth loop",
      hypothesis: "Digital gifting extends the app's reach beyond the ordering user — every gift card is a potential new customer acquisition.",
      decision: "Built scheduled e-gifting (send at midnight for a birthday surprise), custom amounts, and recipient onboarding flows. Positioned gifting as a relationship feature, not a transaction.",
      outcome: "Gift cards created organic acquisition — recipients who redeemed a gift card had to download and onboard, expanding the user base without paid marketing.",
      color: isDark ? "#A78BFA" : "#9B8ACE",
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>DESIGN DECISIONS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Hypothesis-driven decisions — each feature tied to a strategic bet.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "20px" }}>
            {decisions.map((d, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", background: d.color }} />
                <div style={{ fontSize: "15px", fontWeight: 700, color: t.text, marginBottom: "16px" }}>{d.title}</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? "14px" : "20px" }}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: d.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Hypothesis</div>
                    <p style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>{d.hypothesis}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: d.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Decision</div>
                    <p style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>{d.decision}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: d.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Outcome</div>
                    <p style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.6, margin: 0 }}>{d.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function NovaShippedSolution({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const modules = [
    {
      id: "home",
      title: "A new home",
      desc: "Our home screen reimagines what a food ordering app can be. The moment you open it, you\u2019re greeted with a warm, personalized message\u2014like \u201cGood morning, Ron!\u201d\u2014alongside your loyalty progress, instantly connecting you to your rewards. This isn\u2019t just about convenience; it\u2019s about sparking immersion through cognitive triggers\u2014familiarity, instant gratification, and ease. Just below, quick action buttons let you dive straight into your favourites or display your QR code to the restaurant staff\u2014making each step feel intuitive and purposeful. As you scroll, we balance discovery with clear categorisation: a shelf showcasing promotions taps into external triggers\u2014what\u2019s trending, what\u2019s recommended\u2014while maintaining structure. Immersive visuals inspire action, while gifting and raffles add delightful hooks. We\u2019ve designed a journey that gently nudges you\u2014through emotional and intent-driven cues\u2014from browsing to ordering seamlessly.",
      media: { type: "image", src: "/images/nova-food-ordering/nova-food-ordering-home.jpg" },
    },
    {
      id: "swipe-to-discover",
      title: "Swipe to discover",
      desc: "Most food apps assume you know exactly what you want. But what about new restaurants with unfamiliar menus? What about those moments when you\u2019re craving something different but don\u2019t know what? We turned menu browsing into discovery. This single interaction reduces decision fatigue, builds personalized preference profiles, creates memorable engagement for new restaurants, and maintains efficiency by coexisting with traditional menu browsing. The result? A feature that doesn\u2019t feel like work. Users explore menus even when they\u2019re not ordering, discovering dishes that become new favorites. Sometimes the best innovation comes from making routine moments feel like entertainment.",
      media: { type: "vimeo", src: "https://player.vimeo.com/video/1165139397?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0", hideAudio: true },
    },
    {
      id: "payments",
      title: "Payment that never interrupts",
      desc: "Nothing kills a great ordering experience faster than a failed payment. Nova Wallets eliminate the friction\u2014preload funds, checkout instantly, and let smart auto-add top up your balance automatically when it runs low. But the real magic happens at physical touch-points. Show your QR code to the waiter for instant payment, or at the drive-thru, simply tell your PIN. No fumbling for cards, no delays. One wallet. Every channel. Zero friction. Whether ordering from your couch or paying at the table, your Nova Wallet works seamlessly across every touchpoint the restaurant operates.",
      media: { type: "image", src: "/images/nova-food-ordering/nova-food-ordering-wallet.png" },
    },
    {
      id: "menu",
      title: "Browsing, perfected from grid to detail",
      desc: "A restaurant partner once told us they\u2019d been trying to solve their menu experience for years. We took that as both a compliment and a mandate. NOVA\u2019s menu adapts to how people actually browse \u2014 grid view for visual scanners, list view for methodical decision-makers \u2014 because no two diners think alike. Operators configure exactly what guests see from the RMS: allergens, calorie counts, dietary labels, all surfaced precisely where they matter without touching a line of code. Tap any item and a rich detail view unfolds with everything needed to order with confidence. A floating menu toggle and top-mounted category rail work in tandem, keeping navigation effortless no matter how deep someone explores. The result is a menu that finally feels solved \u2014 not just functional, but elegant.",
      media: { type: "vimeo", src: "https://player.vimeo.com/video/1165149833?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0", hideAudio: true },
    },
    {
      id: "gift-cards",
      title: "Thoughtfulness, delivered digitally",
      desc: "While physical gift cards remain popular at restaurants, the digital experience opens new possibilities. Send an e-gift to a friend\u2019s birthday at the exact moment you want\u2014schedule it for 11:59 PM and let the surprise unfold at midnight. No more forgetting occasions or scrambling for last-minute presents. For restaurant brands, this feature deepens customer relationships beyond orders. Users think of the app when celebrating others, not just feeding themselves. Gift cards prove that technology can amplify human connection\u2014not replace it.",
      media: { type: "vimeo", src: "https://player.vimeo.com/video/1165149790?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0", hideAudio: true },
    },
    {
      id: "referrals",
      title: "Bring your friends, get rewarded",
      desc: "Restaurants have always grown through recommendations \u2014 a friend telling a friend where to eat. NOVA turns that organic impulse into a structured programme. Enterprises configure referral campaigns directly from the RMS: set the reward \u2014 points, free items, discounts \u2014 define the triggers, and let customers do what they already do naturally, except now every referral is tracked, rewarded, and measurable. For users, sharing feels effortless. Refer a friend, a colleague, a family member \u2014 and watch the rewards come back. For restaurant brands, it\u2019s growth that compounds. Each new customer arrives pre-sold by someone they trust, and the cost of acquisition drops with every share. Referrals aren\u2019t a marketing gimmick in NOVA \u2014 they\u2019re infrastructure.",
      media: { type: "image", src: "/images/nova-food-ordering/nova-referrals.png" },
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>SHIPPED SOLUTION</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              A configurable platform — not just an app. Deployable for a new brand within days.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {modules.map((m, i) => (
              <div key={i} id={m.id ? `cs-sub-${m.id}` : undefined} style={{ scrollMarginTop: "100px" }}>
                {i > 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: isMobile ? "36px 0" : "56px 0" }}>
                    <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, opacity: 0.5 }} />
                    <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, opacity: 0.5 }} />
                    <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, opacity: 0.5 }} />
                  </div>
                )}
                <Reveal>
                  <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "20px" : "28px" }}>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: t.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>0{i + 1}</div>
                      <h3 style={{ fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 700, color: t.text, margin: "0 0 14px 0", lineHeight: 1.3 }}>{m.title}</h3>
                      <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
                    </div>
                    {m.media.type === "image" ? (
                      <div style={{ borderRadius: isMobile ? "16px" : "24px", overflow: "hidden", border: `1px solid ${t.border}` }}>
                        <img src={m.media.src} alt={m.title} style={{ width: "100%", display: "block" }} />
                      </div>
                    ) : m.media.type === "vimeo" ? (
                      <HeroVideo src={m.media.src} isMobile={isMobile} hideAudio={m.media.hideAudio} />
                    ) : (
                      <SectionVideo src={m.media.src} isMobile={isMobile} />
                    )}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function NovaImpact({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const metrics = [
    { stat: "$1.3M", label: "ARR added", desc: "Major enterprise signing contract for branded mobile app + web ordering", accent: isDark ? "#63A2FF" : "#3B82F6" },
    { stat: "$47K", label: "First enterprise ARR", desc: "First enterprise customer launched with branded mobile app", accent: isDark ? "#4ADE80" : "#16A34A" },
    { stat: "2,000+", label: "Locations in pipeline", desc: "Multi-location restaurant groups entering the pipeline because of the mobile + web offering", accent: t.accent },
  ];

  const outcomes = [
    "Established NOVA's mobile design language and component library from scratch",
    "Built the design team from 0 to 5 members during the process",
    "Created a reusable white-label architecture deployable for new brands in days",
    "Positioned NOVA as a full-ecosystem platform — mobile became the entry point for POS, kiosk, and RMS adoption",
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>IMPACT</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              $1.3M ARR from one enterprise deal — and 2,000+ locations entering the pipeline.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "16px" }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: m.accent, lineHeight: 1 }}>{m.stat}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{m.label}</div>
                <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.4 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: isMobile ? "20px" : "24px 28px", background: isDark ? "linear-gradient(135deg, rgba(232,122,79,0.08) 0%, rgba(232,122,79,0.02) 100%)" : "linear-gradient(135deg, rgba(232,122,79,0.06) 0%, rgba(232,122,79,0.01) 100%)", border: `1px solid ${isDark ? "rgba(232,122,79,0.15)" : "rgba(232,122,79,0.12)"}`, borderRadius: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {outcomes.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ color: t.accent, fontSize: "14px", flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "14px", color: t.text, fontWeight: 500 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function NovaLearnings({ isMobile }) {
  const t = useTheme();

  const lessons = [
    { number: "01", title: "White-label is a system design problem, not a visual one", desc: "The instinct is to think about theming as colour swaps. In reality, it's about separating brand identity from structural logic at every layer — layout, content hierarchy, interaction patterns, and component APIs. Getting this wrong means re-designing for every new brand.", tag: "Architecture" },
    { number: "02", title: "Design the hardest case first", desc: "A complex multi-category menu with nested modifiers is the hardest ordering interface to get right. Designing for this first meant that simpler QSR menus, cafes, and single-category restaurants worked automatically — zero re-design required.", tag: "Scalability" },
    { number: "03", title: "Building the team while shipping the product", desc: "I built the design team from 0 to 5 while simultaneously shipping the first version. This meant being ruthless about which decisions I made vs. delegated, and creating frameworks that let new hires contribute from week one.", tag: "Leadership" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>LEARNINGS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              What I'd carry forward — and what I'd do differently.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
            {lessons.map((l, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px 28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: isMobile ? "16px" : "20px", alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", borderRadius: "3px 0 0 3px", background: `linear-gradient(to bottom, ${t.accent}, ${t.accent}00)` }} />
                <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}14`, borderRadius: "12px", fontSize: "16px", fontWeight: 700, color: t.accent, flexShrink: 0 }}>{l.number}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: t.text }}>{l.title}</span>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: t.textDim, background: t.bgAlt, padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l.tag}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   NOVA AI CAMPAIGNS — Custom Section Components
   ───────────────────────────────────────────────── */

function AICampaignsOverview({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const stats = [
    { value: "0 → 1", label: "Built from scratch", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>) },
    { value: "Mobile", label: "NOVA Edge Pro (iOS + Android)", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>) },
    { value: "Sole IC", label: "Lead designer, end-to-end", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>) },
  ];

  const problemParagraphs = [
    "Restaurant owners and managers spend upwards of $80,000 a year hiring freelance designers just to keep their social media alive. Creating on-brand marketing content — posters, stories, promotional offers — requires tools most operators don't have time to learn, and agencies they can't always afford.",
    "NOVA AI Campaigns changes that equation entirely. Built into NOVA Edge, it gives QSRs, smaller FSRs, and emerging enterprises an AI-powered creative studio that understands their menu, their brand, and their business.",
    "From generating on-brand images and videos with a single prompt, to launching campaigns directly on Instagram, Facebook, email, and SMS — AI Campaigns turns marketing from a cost center into a competitive advantage. No design skills required. No external tools. Just results.",
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>OVERVIEW</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              An AI-powered creative studio for restaurants — built into the product they already use.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              I led the 0→1 design of AI Campaigns as the sole IC designer — from concept to shipped product inside NOVA Edge Pro. The goal: give restaurant operators the ability to create, customise, and launch marketing campaigns without ever leaving NOVA.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "16px" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: isMobile ? "16px 20px" : "20px 24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}12`, borderRadius: "10px", flexShrink: 0, marginTop: "2px" }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: t.text, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: t.textDim, fontWeight: 500, marginTop: "4px" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual problem statement */}
          <div style={{ padding: isMobile ? "24px" : "32px", background: isDark ? "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.01) 100%)" : "linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(239,68,68,0.01) 100%)", border: `1px solid ${isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)"}`, borderRadius: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#F87171" : "#DC2626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div style={{ fontSize: "11px", fontWeight: 600, color: isDark ? "#F87171" : "#DC2626", textTransform: "uppercase", letterSpacing: "0.08em" }}>The Problem</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {problemParagraphs.map((p, i) => (
                <p key={i} style={{ fontSize: "15px", color: t.text, lineHeight: 1.7, margin: 0, fontWeight: i === 0 ? 600 : 400, opacity: i === 0 ? 1 : 0.85 }}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AICampaignsStrategicContext({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const marketGaps = [
    { label: "$80K+ / year", desc: "Average spend on freelance designers just for social media content", color: isDark ? "#F87171" : "#DC2626", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>) },
    { label: "Zero tools fit", desc: "Canva, Photoshop, Figma — none understand restaurant menus, items, or brands", color: isDark ? "#FBBF24" : "#D97706", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>) },
    { label: "Multi-channel gap", desc: "Even with content, distribution across Instagram, Facebook, email, SMS is fragmented", color: isDark ? "#63A2FF" : "#3B82F6", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>) },
  ];

  const designOpportunities = [
    { label: "RMS-connected intelligence", desc: "NOVA already has the restaurant's menu, sales data, and item performance — the AI can use all of it", color: isDark ? "#4ADE80" : "#16A34A", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>) },
    { label: "Brand as a primitive", desc: "Restaurants configure their brand once — every campaign inherits it automatically", color: isDark ? "#A78BFA" : "#7C3AED", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>) },
    { label: "Built-in distribution", desc: "Campaign goes from creation to Instagram, Facebook, email, SMS — all without leaving NOVA Edge", color: t.accent, icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>) },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>STRATEGIC CONTEXT</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Restaurants need marketing — but every existing tool ignores how restaurants actually work.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              The market gap wasn't just about cost — it was about context. Generic design tools don't understand restaurant menus, seasonal offers, or multi-location brand consistency. NOVA's position inside the restaurant's operating system created a unique design opportunity.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "20px" : "24px" }}>
            {/* Market gaps */}
            <div style={{ padding: isMobile ? "20px" : "28px", background: isDark ? "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.01) 100%)" : "linear-gradient(135deg, rgba(239,68,68,0.04) 0%, rgba(239,68,68,0.01) 100%)", border: `1px solid ${isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)"}`, borderRadius: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: isDark ? "#F87171" : "#DC2626", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>Market Gaps</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {marketGaps.map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: `${g.color}18`, borderRadius: "8px", color: g.color, flexShrink: 0 }}>{g.icon}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: g.color, marginBottom: "4px" }}>{g.label}</div>
                      <div style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.55 }}>{g.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Design opportunities */}
            <div style={{ padding: isMobile ? "20px" : "28px", background: isDark ? "linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(74,222,128,0.01) 100%)" : "linear-gradient(135deg, rgba(22,163,74,0.04) 0%, rgba(22,163,74,0.01) 100%)", border: `1px solid ${isDark ? "rgba(74,222,128,0.12)" : "rgba(22,163,74,0.08)"}`, borderRadius: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: isDark ? "#4ADE80" : "#16A34A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>Design Opportunities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {designOpportunities.map((o, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: `${o.color}18`, borderRadius: "8px", color: o.color, flexShrink: 0 }}>{o.icon}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: o.color, marginBottom: "4px" }}>{o.label}</div>
                      <div style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.55 }}>{o.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AICampaignsConstraints({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const constraints = [
    { title: "Brand fidelity at scale", desc: "AI-generated content had to feel unmistakably on-brand for each restaurant — not generic. Every logo, palette, and visual style had to persist across campaigns without manual intervention.", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>) },
    { title: "Operator skill range", desc: "Users ranged from tech-savvy managers of multi-location chains to single-store owners barely comfortable with smartphones. The UI had to feel obvious to both — no learning curve.", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>) },
    { title: "Embedded, not bolted-on", desc: "AI Campaigns had to work within NOVA Edge's existing mobile app architecture — not as a standalone tool. Navigation, settings, and flows had to feel like a natural extension of the product.", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>) },
    { title: "Dark mode as first-class", desc: "NOVA Edge Pro shipped in dark mode as the primary experience. Every surface, token, and interaction had to work flawlessly on dark backgrounds — not as an afterthought.", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>) },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>CONSTRAINTS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              AI that generates — but within tight brand, usability, and platform boundaries.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "14px" : "16px" }}>
            {constraints.map((c, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}12`, borderRadius: "12px", flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: t.text, marginBottom: "6px" }}>{c.title}</div>
                  <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AICampaignsDesignDecisions({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const decisions = [
    { number: "01", title: "Brand configuration as a primitive", desc: "Before a single campaign is generated, NOVA learns who you are. Logos, up to five named color palettes, preferred video ratios, durations, and visual styles — all configured once and cascaded into every piece of content the AI generates. This made every output unmistakably the restaurant's own.", tag: "Architecture" },
    { number: "02", title: "RMS-connected prompt intelligence", desc: "Because NOVA's AI is connected to the restaurant's RMS — menus, sales data, item performance — generating a campaign is as simple as typing 'Promote my best-selling item from last week with 10% off on Wednesdays.' The system pulls the data, builds the poster, and gets out of the way.", tag: "AI + Data" },
    { number: "03", title: "Circle-to-edit for precision control", desc: "AI-generated content is a starting point. With circle-to-edit, operators draw a circle around any part of the image and prompt a localised change — swap the background, adjust text, change a product shot — without touching the rest. This reduced the full regeneration cycle by over 62.5%.", tag: "Interaction" },
    { number: "04", title: "Palette swap for visual variation", desc: "Social feeds that look the same every week stop getting attention. Operators select any saved palette and the AI regenerates with an entirely different visual treatment — same content, fresh look. One campaign concept, multiple executions, all on-brand.", tag: "Engagement" },
    { number: "05", title: "Multi-channel preview and launch", desc: "The live preview shows exactly how a campaign will appear on Instagram, Facebook, email, or SMS — complete with auto-generated captions. Choose channels, set a schedule, and launch. The entire journey from idea to published campaign happens without leaving NOVA Edge.", tag: "Distribution" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>DESIGN DECISIONS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Five decisions that shaped how AI Campaigns works — and why.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
            {decisions.map((d, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{ padding: isMobile ? "20px" : "24px 28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: isMobile ? "16px" : "20px", alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", borderRadius: "3px 0 0 3px", background: `linear-gradient(to bottom, ${t.accent}, ${t.accent}00)` }} />
                  <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}14`, borderRadius: "12px", fontSize: "16px", fontWeight: 700, color: t.accent, flexShrink: 0 }}>{d.number}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: t.text }}>{d.title}</span>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: t.textDim, background: t.bgAlt, padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.tag}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AICampaignsShippedSolution({ isMobile }) {
  const t = useTheme();

  const modules = [
    { id: "brand-config", title: "Your brand, baked into every pixel", desc: "Upload logos, define up to five colour palettes with custom names, set video aspect ratios and visual styles. These preferences cascade into every campaign the AI generates — configure once, create endlessly.", media: { src: "https://player.vimeo.com/video/1166981757?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" } },
    { id: "ai-generation", title: "Designed to delight, built to simplify", desc: "AI Campaigns doesn't just work well — it feels premium. The midnight navy dark mode, fluid animations, and polished micro-interactions make it a product restaurant operators actually enjoy using.\n\nBut delight without utility is just decoration. Because NOVA's AI is connected to the restaurant's RMS — menus, sales data, item performance — generating a campaign is as simple as typing: \"Promote my best-selling item from last week with 10% off on Wednesdays and Fridays.\" The system pulls the data, builds the poster, and gets out of the way.", media: { src: "https://player.vimeo.com/video/1166981823?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" } },
    { id: "circle-to-edit", title: "Fine-tune with a circle, launch with a tap", desc: "Draw a circle around any part of the image and prompt a localised change — swap the background, adjust text placement, change a product shot — without regenerating the rest. Once dialled in, preview across Instagram, Facebook, email, and SMS with auto-generated captions.", media: { src: "https://player.vimeo.com/video/1166981780?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" } },
    { id: "palette-swap", title: "Same campaign, entirely new energy", desc: "Select any saved palette and the AI regenerates the campaign with a completely different visual treatment — same content, fresh look. Swap from a bold primary palette to something softer, or try a seasonal variation. One concept, multiple executions, all on-brand.", media: { src: "https://player.vimeo.com/video/1166981803?background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0" } },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>SHIPPED SOLUTION</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              From blank canvas to live campaign — the five modules that make it work.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              Each module below represents a shipped, production feature. Visuals and video walkthroughs to follow.
            </p>
          </div>

          {modules.map((m, i) => (
            <div key={i} id={m.id ? `cs-sub-${m.id}` : undefined} style={{ scrollMarginTop: "100px" }}>
              {i > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: isMobile ? "36px 0" : "56px 0" }}>
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, opacity: 0.5 }} />
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, opacity: 0.5 }} />
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, opacity: 0.5 }} />
                </div>
              )}
              <Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "20px" : "28px" }}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 600, color: t.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>0{i + 1}</div>
                    <h3 style={{ fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 700, color: t.text, margin: "0 0 14px 0", lineHeight: 1.3 }}>{m.title}</h3>
                    <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{m.desc}</p>
                  </div>
                  {/* Media — Vimeo video or placeholder */}
                  {m.media ? (
                    <HeroVideo src={m.media.src} isMobile={isMobile} hideAudio={true} />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "16/9", background: t.bgAlt, borderRadius: isMobile ? "16px" : "24px", border: `1px dashed ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "13px", color: t.textDim, opacity: 0.5 }}>Media placeholder</span>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function AICampaignsDarkMode({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const [phase, setPhase] = useState(0); // 0=dark, 1=transitioning-to-light, 2=light, 3=transitioning-to-dark
  const reducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  useEffect(() => {
    if (reducedMotion) return;
    const durations = [3000, 800, 3000, 800];
    const timer = setTimeout(() => {
      setPhase((p) => (p + 1) % 4);
    }, durations[phase]);
    return () => clearTimeout(timer);
  }, [phase, reducedMotion]);

  const showDark = phase === 0 || phase === 3;

  const pillars = [
    { label: "Complete tokenisation", desc: "Every colour, surface, elevation, and opacity mapped to semantic tokens — not hardcoded values. Light-to-dark was a token swap, not a redesign." },
    { label: "6-week delivery", desc: "Scoped, designed, and shipped dark mode single-handedly as the lead designer, working directly with engineering partners." },
    { label: "Zero regressions", desc: "Systematic audit of every screen, component, and state ensured dark mode launched without visual defects across the entire NOVA Edge Pro app." },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>DARK MODE</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              Dark mode for NOVA Edge Pro — shipped in 6 weeks via full token architecture.
            </h2>
            <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
              NOVA Edge Pro launched with dark mode as its primary visual experience. I handled the complete design token architecture, systematic component audit, and engineering handoff single-handedly — delivering across every screen in the app within a 6-week sprint.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? "12px" : "16px" }}>
            {pillars.map((p, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px", background: isDark ? "rgba(255,255,255,0.03)" : t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: t.text, marginBottom: "8px" }}>{p.label}</div>
                <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Light/Dark mode animated showcase */}
          <div style={{
            position: "relative",
            borderRadius: isMobile ? "20px" : "32px",
            overflow: "hidden",
            background: showDark ? "#1A1A1E" : "#F5F5F7",
            transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: isMobile ? "32px 16px" : "48px 40px",
            border: `1px solid ${showDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          }}>
            {/* Top bar with mode label */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: isMobile ? "24px" : "32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: showDark ? "#5E5CE6" : "#34C759",
                  transition: "background 0.8s ease",
                  boxShadow: showDark ? "0 0 8px rgba(94,92,230,0.4)" : "0 0 8px rgba(52,199,89,0.4)",
                }} />
                <span style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: showDark ? "#98989D" : "#86868B",
                  transition: "color 0.8s ease",
                }}>
                  {showDark ? "Dark mode" : "Light mode"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{
                  width: "28px",
                  height: "4px",
                  borderRadius: "2px",
                  background: showDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.08)",
                  transition: "background 0.8s ease",
                }} />
                <div style={{
                  width: "28px",
                  height: "4px",
                  borderRadius: "2px",
                  background: !showDark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)",
                  transition: "background 0.8s ease",
                }} />
              </div>
            </div>

            {/* Image container */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              minHeight: isMobile ? "360px" : "480px",
            }}>
              {/* Dark mode image */}
              <img
                src="/images/nova-ai-campaigns/nova-ai-campaigns-dark-mode.png"
                alt="NOVA Edge Pro — Dark mode"
                style={{
                  position: "absolute",
                  maxHeight: isMobile ? "360px" : "480px",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                  opacity: showDark ? 1 : 0,
                  transform: showDark ? "translateX(0) scale(1)" : "translateX(-30px) scale(0.95)",
                  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.4))",
                }}
                loading="lazy"
              />
              {/* Light mode image */}
              <img
                src="/images/nova-ai-campaigns/nova-ai-campaigns-light-mode.png"
                alt="NOVA Edge Pro — Light mode"
                style={{
                  position: "absolute",
                  maxHeight: isMobile ? "360px" : "480px",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                  opacity: !showDark ? 1 : 0,
                  transform: !showDark ? "translateX(0) scale(1)" : "translateX(30px) scale(0.95)",
                  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: showDark ? "drop-shadow(0 20px 60px rgba(0,0,0,0.3))" : "drop-shadow(0 20px 60px rgba(0,0,0,0.12))",
                }}
                loading="lazy"
              />
            </div>

            {/* Bottom caption */}
            <div style={{ textAlign: "center", marginTop: isMobile ? "24px" : "32px" }}>
              <p style={{
                fontSize: "13px",
                color: showDark ? "#98989D" : "#86868B",
                transition: "color 0.8s ease",
                margin: 0,
                fontWeight: 500,
              }}>
                Complete token architecture — every surface, elevation, and colour adapts seamlessly
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AICampaignsImpact({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const metrics = [
    { stat: "62.5%", label: "Faster campaign creation", desc: "Circle-to-edit and palette swap reduced full creation time compared to older manual edit flows", accent: isDark ? "#63A2FF" : "#3B82F6" },
    { stat: "92", label: "SUS Score (Grade A)", desc: "System Usability Scale across 20 early-stage customers in beta — tested in uncontrolled environments", accent: isDark ? "#4ADE80" : "#16A34A" },
    { stat: ">200%", label: "Campaign generation", desc: "Existing users generated over 200% more campaigns compared to previous manual flows — adoption accelerated from first week of beta", accent: t.accent },
  ];

  const susBreakdown = [
    { question: "Q3 — Easy to use", result: "Mostly rated 5 (strongly agree)", color: isDark ? "#4ADE80" : "#16A34A" },
    { question: "Q2 — Unnecessarily complex", result: "Mostly rated 1 (strongly disagree)", color: isDark ? "#63A2FF" : "#3B82F6" },
    { question: "Q8 — Cumbersome", result: "Strongly disagree", color: isDark ? "#A78BFA" : "#7C3AED" },
    { question: "Learnability", result: "Quick to learn — minimal onboarding needed", color: isDark ? "#FBBF24" : "#D97706" },
    { question: "Consistency", result: "Rated highly — system feels predictable", color: t.accent },
  ];

  const outcomes = [
    "Dark mode launched for entire NOVA Edge Pro app via complete token architecture in 6 weeks",
    "Advanced visuals and modern design system drove early access to market",
    "Contracts rolled out primarily citing the product 'feeling premium'",
    "Beta cohort of 100+ active users on the feature during early testing",
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>IMPACT</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              62.5% faster creation, Grade A usability, and {">"} 200% campaign generation from existing users.
            </h2>
          </div>

          {/* Top-line metrics */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "16px" }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ padding: isMobile ? "20px" : "24px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: m.accent, lineHeight: 1 }}>{m.stat}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{m.label}</div>
                <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.4 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          {/* SUS Breakdown */}
          <div style={{ padding: isMobile ? "20px" : "28px 32px", background: isDark ? "linear-gradient(135deg, rgba(99,162,255,0.06) 0%, rgba(99,162,255,0.01) 100%)" : "linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(59,130,246,0.01) 100%)", border: `1px solid ${isDark ? "rgba(99,162,255,0.12)" : "rgba(59,130,246,0.1)"}`, borderRadius: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: isDark ? "#63A2FF" : "#3B82F6", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>SUS Breakdown — What Users Told Us</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "12px" : "14px" }}>
              {susBreakdown.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color, marginTop: "7px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: t.text, marginBottom: "2px" }}>{s.question}</div>
                    <div style={{ fontSize: "12px", color: t.textDim, lineHeight: 1.5 }}>{s.result}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Broader outcomes */}
          <div style={{ padding: isMobile ? "20px" : "24px 28px", background: isDark ? "linear-gradient(135deg, rgba(232,122,79,0.08) 0%, rgba(232,122,79,0.02) 100%)" : "linear-gradient(135deg, rgba(232,122,79,0.06) 0%, rgba(232,122,79,0.01) 100%)", border: `1px solid ${isDark ? "rgba(232,122,79,0.15)" : "rgba(232,122,79,0.12)"}`, borderRadius: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {outcomes.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ color: t.accent, fontSize: "14px", flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "14px", color: t.text, fontWeight: 500 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AICampaignsLearnings({ isMobile }) {
  const t = useTheme();

  const lessons = [
    { number: "01", title: "Brand configuration is the foundation, not a feature", desc: "When the AI knows logos, palettes, and visual styles upfront, every output feels owned. Skipping this step means every campaign needs manual correction — defeating the purpose of AI generation entirely.", tag: "Architecture" },
    { number: "02", title: "Circle-to-edit changes the editing mental model", desc: "Full regeneration feels like losing control. Localised editing — draw a circle, describe the change — preserves the user's sense of ownership over the output. This was the single biggest usability win.", tag: "Interaction" },
    { number: "03", title: "Dark mode is a token architecture problem", desc: "Shipping dark mode in 6 weeks was only possible because every design decision was expressed as semantic tokens from the start. Colour isn't decoration — it's infrastructure. Teams that treat it as an afterthought pay the cost in months, not weeks.", tag: "Systems" },
    { number: "04", title: "'Feeling premium' is a business outcome", desc: "Contracts were signed partly because the product felt premium. Visual polish, fluid interactions, and a midnight navy dark mode weren't aesthetic choices — they were revenue drivers. Design quality influenced deal velocity.", tag: "Business" },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "28px" : "36px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>LEARNINGS</h3>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: t.text, lineHeight: 1.25, marginBottom: "16px" }}>
              What I'd carry forward — design quality as a revenue lever.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
            {lessons.map((l, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{ padding: isMobile ? "20px" : "24px 28px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", display: "flex", gap: isMobile ? "16px" : "20px", alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", borderRadius: "3px 0 0 3px", background: `linear-gradient(to bottom, ${t.accent}, ${t.accent}00)` }} />
                  <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: `${t.accent}14`, borderRadius: "12px", fontSize: "16px", fontWeight: 700, color: t.accent, flexShrink: 0 }}>{l.number}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: t.text }}>{l.title}</span>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: t.textDim, background: t.bgAlt, padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l.tag}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: t.textDim, lineHeight: 1.6, margin: 0 }}>{l.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function AirtelHypotheses({ isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;

  const hypotheses = [
    {
      number: "01",
      title: "Mental-model separation",
      desc: "Keeping ways to earn rewards architecturally separate from rewards already earned would align with users' existing mental models — and enhance conversion in both domains.",
      tag: "Information Architecture",
    },
    {
      number: "02",
      title: "Transactional reward surfacing",
      desc: "Transactional rewards (earned during recharges or bill payments) would be surfaced through motion-induced nudges on the success screen, directing users to the trophy room where all rewards live.",
      tag: "Behavioural Nudge",
      outcomes: [
        "Increase visibility for previously won but unclaimed rewards",
        "Cultivate a habit of exploring the trophy room after every transaction",
        "Drive conversion of expiring rewards through heightened urgency",
      ],
    },
    {
      number: "03",
      title: "Moment-of-win emotional drivers",
      desc: "Achievement and redemption would serve as the two key emotional drivers in designing the moment of win — the full-screen interface displayed at the exact point of earning a reward.",
      tag: "Emotional Design",
    },
  ];

  return (
    <div style={{ marginBottom: isMobile ? "36px" : "48px" }}>
      <Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "32px" : "40px" }}>
          {/* Intro */}
          <div style={{ maxWidth: isMobile ? "100%" : "640px" }}>
            <h3 style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: t.accent,
              fontWeight: 600,
              marginBottom: "20px",
            }}>
              HYPOTHESES
            </h3>
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 600,
              color: t.text,
              lineHeight: 1.25,
              marginBottom: "16px",
            }}>
              Three assumptions to validate — no generative study to draw from.
            </h2>
            <p style={{
              fontSize: "15px",
              color: t.textMuted,
              lineHeight: 1.7,
              margin: 0,
            }}>
              Without prior generative research, we formulated a set of assumptions to be validated qualitatively and quantitatively as the project progressed. These hypotheses became the evaluative backbone of the research study that followed.
            </p>
          </div>

          {/* Hypothesis cards */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "16px" : "20px",
          }}>
            {hypotheses.map((h, i) => (
              <div
                key={i}
                style={{
                  padding: isMobile ? "20px" : "28px 32px",
                  background: t.bgCard,
                  border: `1px solid ${t.border}`,
                  borderRadius: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Top row: number + tag */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: t.accent,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {h.number}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: t.textDim,
                    background: t.bgAlt,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}>
                    {h.tag}
                  </span>
                </div>

                {/* Title */}
                <h4 style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: t.text,
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {h.title}
                </h4>

                {/* Description */}
                <p style={{
                  fontSize: "14px",
                  color: t.textMuted,
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  {h.desc}
                </p>

                {/* Expected outcomes (hypothesis 2 only) */}
                {h.outcomes && (
                  <div style={{
                    borderTop: `1px solid ${t.borderLight}`,
                    paddingTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Expected outcomes
                    </span>
                    {h.outcomes.map((o, j) => (
                      <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: t.accent,
                          flexShrink: 0,
                          marginTop: "6px",
                        }} />
                        <span style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.5 }}>{o}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ─── MORE WORK (bottom of case study) ────────────────────────
function MoreWork({ currentSlug, isMobile }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { navigate } = useRoute();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const otherProjects = PROJECTS.filter((p) => p.slug !== currentSlug);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = isMobile ? el.clientWidth * 0.84 : 360;
    el.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  useEffect(() => { checkScroll(); }, []);

  if (!otherProjects.length) return null;

  const colors = ["#E87A4F", "#5B8DEF", "#45B88F", "#D4A843", "#A78BFA"];

  const GlassArrow = ({ dir, enabled, onClick }) => (
    <button
      onClick={(e) => { e.stopPropagation(); if (enabled) onClick(); }}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [dir < 0 ? "left" : "right"]: "-20px",
        width: "40px", height: "40px", borderRadius: "50%",
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
        cursor: enabled ? "pointer" : "default",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: enabled ? 1 : 0,
        pointerEvents: enabled ? "auto" : "none",
        transition: "opacity 0.25s ease, transform 0.15s ease",
        color: t.text, fontSize: "16px", fontWeight: 500, padding: 0, zIndex: 2,
      }}
      onMouseEnter={(e) => { if (enabled) e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
      aria-label={dir < 0 ? "Scroll left" : "Scroll right"}
    >
      {dir < 0 ? "←" : "→"}
    </button>
  );

  return (
    <Reveal>
      <div style={{ marginTop: "64px", paddingTop: "40px", borderTop: `1px solid ${t.border}` }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>More work</h3>
          <span onClick={() => navigate("/work")} style={{ fontSize: "13px", fontWeight: 500, color: t.accent, cursor: "pointer" }}>View all →</span>
        </div>

        {/* Scroll container with glass arrows + edge fades */}
        <div style={{ position: "relative" }}>
          {/* Edge fade — left */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: "8px", width: isMobile ? "32px" : "48px",
            background: `linear-gradient(to right, ${t.bg}, ${t.bg}00)`,
            zIndex: 1, pointerEvents: "none",
            opacity: canScrollLeft ? 1 : 0, transition: "opacity 0.3s ease",
          }} />
          {/* Edge fade — right */}
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: "8px", width: isMobile ? "32px" : "48px",
            background: `linear-gradient(to left, ${t.bg}, ${t.bg}00)`,
            zIndex: 1, pointerEvents: "none",
            opacity: canScrollRight ? 1 : 0, transition: "opacity 0.3s ease",
          }} />

          {/* Glass arrows — desktop only */}
          {!isMobile && (
            <>
              <GlassArrow dir={-1} enabled={canScrollLeft} onClick={() => scroll(-1)} />
              <GlassArrow dir={1} enabled={canScrollRight} onClick={() => scroll(1)} />
            </>
          )}

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            style={{
              display: "flex", gap: isMobile ? "14px" : "16px", overflowX: "auto", paddingBottom: "8px",
              scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none",
            }}
          >
            {otherProjects.map((op, idx) => {
              const acc = colors[idx % colors.length];
              return (
                <div
                  key={op.slug}
                  onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); navigate(`/work/${op.slug}`); }}
                  style={{
                    flex: `0 0 ${isMobile ? "84%" : "340px"}`, scrollSnapAlign: "start", cursor: "pointer",
                    background: t.bgCard, border: `1px solid ${t.borderLight}`, borderRadius: "16px",
                    padding: isMobile ? "20px" : "24px", position: "relative", overflow: "hidden",
                    transition: "border-color 0.25s ease, transform 0.25s ease",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    minHeight: isMobile ? "220px" : "250px",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.borderLight; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Accent top bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: acc }} />
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: acc, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>{op.company} · {op.year}</div>
                    <div style={{
                      fontSize: isMobile ? "15px" : "16px", fontWeight: 500, color: t.text, lineHeight: 1.45,
                      marginBottom: "14px",
                    }}>{op.title}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: `${acc}12`, color: acc, border: `1px solid ${acc}20` }}>{op.role}</span>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: t.bgAlt, color: t.textDim, border: `1px solid ${t.borderLight}` }}>{op.platform}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: "16px", fontSize: "12px", fontWeight: 500, color: t.accent }}>Read case study →</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ─── CASE STUDY ──────────────────────────────────────────────
function CaseStudy({ slug }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { navigate } = useRoute();
  const project = PROJECTS.find((p) => p.slug === slug);
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSubModule, setActiveSubModule] = useState(null);
  const [heroLightbox, setHeroLightbox] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!project) return (
    <Section style={{ paddingTop: "160px", textAlign: "center" }}>
      <h2 style={{ color: t.text, fontSize: "24px", fontWeight: 500 }}>Case study not found</h2>
      <Button variant="text" onClick={() => navigate("/work")} style={{ marginTop: "16px" }}>← Back to work</Button>
    </Section>
  );

  const sectionKeys = Object.keys(project.sections || {});
  const tocItems = sectionKeys.length > 0 ? sectionKeys : ["overview", "problem", "constraints", "approach", "solution", "impact", "learnings"];

  const shippedSubModules = project.slug === "nova-food-ordering" ? [
    { id: "home", label: "Home" },
    { id: "swipe-to-discover", label: "Swipe to discover" },
    { id: "payments", label: "Payments" },
    { id: "menu", label: "Menu" },
    { id: "gift-cards", label: "Gift cards" },
    { id: "referrals", label: "Referrals" },
  ] : project.slug === "nova-ai-campaigns" ? [
    { id: "brand-config", label: "Brand config" },
    { id: "ai-generation", label: "AI generation" },
    { id: "circle-to-edit", label: "Circle-to-edit" },
    { id: "palette-swap", label: "Palette swap" },
  ] : null;

  // Auto-track active section on scroll
  useEffect(() => {
    const sectionEls = tocItems.map((key) => document.getElementById(`cs-${key}`)).filter(Boolean);
    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("cs-", "");
            setActiveSection(id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slug]);

  // Auto-track active sub-module on scroll (nova-food-ordering only)
  useEffect(() => {
    if (!shippedSubModules) return;
    const subEls = shippedSubModules.map((s) => document.getElementById(`cs-sub-${s.id}`)).filter(Boolean);
    if (!subEls.length) return;

    const subObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("cs-sub-", "");
            setActiveSubModule(id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    subEls.forEach((el) => subObserver.observe(el));
    return () => subObserver.disconnect();
  }, [slug, shippedSubModules]);

  // Clear active sub-module when leaving shipped solution
  useEffect(() => {
    if (activeSection !== "shipped solution") {
      setActiveSubModule(null);
    }
  }, [activeSection]);

  return (
    <>
    <BackBar label="All work" to="/work" />
    <Section style={{ paddingTop: "20px" }}>
      {/* Header */}
      <Reveal>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 500, color: t.text, lineHeight: 1.3, letterSpacing: "-0.025em", margin: "0 0 16px 0", maxWidth: "800px" }}>
          {project.title}
        </h1>
        <p style={{ fontSize: "17px", color: t.textMuted, lineHeight: 1.6, maxWidth: "680px", margin: "0 0 28px 0" }}>
          {project.summary}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "12px 20px" : "24px", marginBottom: "16px", fontSize: isMobile ? "12px" : "13px", color: t.textDim }}>
          <span><strong style={{ color: t.textMuted }}>Company:</strong> {project.company}</span>
          <span><strong style={{ color: t.textMuted }}>Year:</strong> {project.year}</span>
          <span><strong style={{ color: t.textMuted }}>Role:</strong> {project.role}</span>
          <span><strong style={{ color: t.textMuted }}>Team:</strong> {project.team}</span>
          <span><strong style={{ color: t.textMuted }}>Platform:</strong> {project.platform}</span>
        </div>
        {project.nda && (
          <div style={{ fontSize: "12px", color: t.accent, background: `${t.accent}15`, padding: "8px 16px", borderRadius: "8px", display: "inline-block", marginBottom: "40px" }}>
            Some details modified under NDA. Happy to share more in conversation.
          </div>
        )}
      </Reveal>

      {/* Hero Media */}
      {project.media?.hero && (
        <Reveal>
          <div style={{ marginTop: "32px", position: "relative", ...(isMobile ? { marginLeft: "-16px", marginRight: "-16px" } : {}) }}>
          {project.media.heroVideo ? (
            <HeroVideo src={project.media.heroVideo} isMobile={isMobile} />
          ) : project.media.heroImage ? (
            <img
              src={project.media.heroImage}
              alt={project.media.hero}
              onClick={() => setHeroLightbox(true)}
              style={{
                width: "100%",
                borderRadius: isMobile ? "0px" : "32px",
                display: "block",
                border: isMobile ? "none" : (t === themes.dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.2)"),
                cursor: "zoom-in",
              }}
              loading="lazy"
            />
          ) : (
            <MediaPlaceholder label={project.media.hero} aspect="21/9" span />
          )}
          {project.companyLogo && !project.media.heroVideo && (
            <div style={{
              position: "absolute",
              top: isMobile ? "20px" : "32px",
              right: isMobile ? "20px" : "32px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: isMobile ? "6px 12px" : "8px 16px",
              borderRadius: "10px",
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              zIndex: 2,
            }}>
              <img
                src={project.companyLogo.dark}
                alt={project.company}
                style={{ height: isMobile ? "12px" : "14px", width: "auto" }}
              />
            </div>
          )}
          </div>
        </Reveal>
      )}
      {heroLightbox && project.media?.heroImage && (
        <ImageLightbox src={project.media.heroImage} alt={project.media.hero} onClose={() => setHeroLightbox(false)} />
      )}

      {/* Content with TOC */}
      <div style={{ display: "flex", gap: "64px", marginTop: "40px" }}>
        {/* Sticky TOC (desktop) */}
        <nav
          className="case-study-toc"
          style={{
            position: "sticky",
            top: "100px",
            alignSelf: "flex-start",
            minWidth: "160px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {tocItems.map((item) => (
            <div key={item}>
              <button
                onClick={() => {
                  setActiveSection(item);
                  document.getElementById(`cs-${item}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  background: activeSection === item ? `${t.accent}10` : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
                  color: activeSection === item ? t.accent : t.textDim,
                  fontWeight: activeSection === item ? 500 : 400,
                  textTransform: "capitalize",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
              >
                {item}
              </button>
              {item === "shipped solution" && shippedSubModules && activeSection === "shipped solution" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginLeft: "12px", marginTop: "4px", marginBottom: "4px", borderLeft: `1px solid ${t.border}`, paddingLeft: "10px" }}>
                  {shippedSubModules.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveSubModule(sub.id);
                        document.getElementById(`cs-sub-${sub.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      style={{
                        background: activeSubModule === sub.id ? `${t.accent}10` : "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
                        color: activeSubModule === sub.id ? t.accent : t.textDim,
                        fontWeight: activeSubModule === sub.id ? 500 : 400,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => { if (activeSubModule !== sub.id) e.target.style.color = t.accent; }}
                      onMouseLeave={(e) => { if (activeSubModule !== sub.id) e.target.style.color = t.textDim; }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {tocItems.map((key) => {
            const mediaKey = `after${key.charAt(0).toUpperCase() + key.slice(1)}`;
            const mediaItems = project.media?.[mediaKey];
            const sectionContent = project.sections[key];

            // Check if this is a custom component
            const isCustomSection = sectionContent === "__custom__";

            let customComponent = null;
            if (isCustomSection && project.slug === "simpplr-workplace-search") {
              if (key === "challenge") {
                customComponent = <SimpplrChallenge isMobile={isMobile} />;
              } else if (key === "experience model") {
                customComponent = <SimpplrExperienceModel isMobile={isMobile} />;
              } else if (key === "smart answers") {
                customComponent = <SimpplrSmartAnswers isMobile={isMobile} />;
              } else if (key === "flow polish") {
                customComponent = <SimpplrFlowPolish isMobile={isMobile} />;
              } else if (key === "solution") {
                customComponent = <SimpplrSolution isMobile={isMobile} />;
              } else if (key === "impact") {
                customComponent = <SimpplrImpact isMobile={isMobile} />;
              }
            } else if (isCustomSection && project.slug === "simpplr-events") {
              if (key === "overview") {
                customComponent = <SimpplrEventsOverview isMobile={isMobile} />;
              } else if (key === "ideation") {
                customComponent = <SimpplrEventsIdeation isMobile={isMobile} />;
              } else if (key === "hypotheses") {
                customComponent = <SimpplrEventsHypotheses isMobile={isMobile} />;
              } else if (key === "evaluative research") {
                customComponent = <SimpplrEventsResearch isMobile={isMobile} />;
              } else if (key === "research findings") {
                customComponent = <SimpplrEventsFindings isMobile={isMobile} />;
              } else if (key === "iterations") {
                customComponent = <SimpplrEventsIterations isMobile={isMobile} />;
              } else if (key === "shipped solution") {
                customComponent = <SimpplrEventsShipped isMobile={isMobile} />;
              } else if (key === "impact") {
                customComponent = <SimpplrEventsImpact isMobile={isMobile} />;
              } else if (key === "learnings") {
                customComponent = <SimpplrEventsLearnings isMobile={isMobile} />;
              }
            } else if (isCustomSection && project.slug === "nova-food-ordering") {
              if (key === "overview") customComponent = <NovaOverview isMobile={isMobile} />;
              else if (key === "strategic context") customComponent = <NovaStrategicContext isMobile={isMobile} />;
              else if (key === "product framing") customComponent = <NovaProductFraming isMobile={isMobile} />;
              else if (key === "constraints") customComponent = <NovaConstraints isMobile={isMobile} />;
              else if (key === "design philosophy") customComponent = <NovaDesignPhilosophy isMobile={isMobile} />;
              else if (key === "design decisions") customComponent = <NovaDesignDecisions isMobile={isMobile} />;
              else if (key === "shipped solution") customComponent = <NovaShippedSolution isMobile={isMobile} />;
              else if (key === "impact") customComponent = <NovaImpact isMobile={isMobile} />;
              else if (key === "learnings") customComponent = <NovaLearnings isMobile={isMobile} />;
            } else if (isCustomSection && project.slug === "nova-ai-campaigns") {
              if (key === "overview") customComponent = <AICampaignsOverview isMobile={isMobile} />;
              else if (key === "strategic context") customComponent = <AICampaignsStrategicContext isMobile={isMobile} />;
              else if (key === "constraints") customComponent = <AICampaignsConstraints isMobile={isMobile} />;
              else if (key === "design decisions") customComponent = <AICampaignsDesignDecisions isMobile={isMobile} />;
              else if (key === "shipped solution") customComponent = <AICampaignsShippedSolution isMobile={isMobile} />;
              else if (key === "dark mode") customComponent = <AICampaignsDarkMode isMobile={isMobile} />;
              else if (key === "impact") customComponent = <AICampaignsImpact isMobile={isMobile} />;
              else if (key === "learnings") customComponent = <AICampaignsLearnings isMobile={isMobile} />;
            } else if (isCustomSection && project.slug === "airtel-rewards") {
              if (key === "overview") {
                customComponent = <AirtelOverview isMobile={isMobile} />;
              } else if (key === "design philosophy") {
                customComponent = <AirtelDesignPhilosophy isMobile={isMobile} />;
              } else if (key === "information architecture") {
                customComponent = <AirtelInfoArchitecture isMobile={isMobile} />;
              } else if (key === "ideation & moment of win") {
                customComponent = <AirtelIdeation isMobile={isMobile} />;
              } else if (key === "hypotheses") {
                customComponent = <AirtelHypotheses isMobile={isMobile} />;
              } else if (key === "evaluative research") {
                customComponent = <AirtelEvaluativeResearch isMobile={isMobile} />;
              } else if (key === "research findings") {
                customComponent = <AirtelResearchFindings isMobile={isMobile} />;
              } else if (key === "working with constraints") {
                customComponent = <AirtelConstraints isMobile={isMobile} />;
              } else if (key === "shipped solution") {
                customComponent = <AirtelShippedSolution isMobile={isMobile} />;
              } else if (key === "impact") {
                customComponent = <AirtelImpact isMobile={isMobile} />;
              } else if (key === "learnings") {
                customComponent = <AirtelLearnings isMobile={isMobile} />;
              }
            }

            return (
              <div key={key} id={`cs-${key}`} style={{ scrollMarginTop: "100px" }}>
                {customComponent ? (
                  <>
                    {customComponent}
                  </>
                ) : (
                  <Reveal>
                    <div style={{ marginBottom: mediaItems ? "24px" : "56px" }}>
                      <h3 style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: t.accent,
                        fontWeight: 600,
                        marginBottom: "16px",
                      }}>
                        {key}
                      </h3>
                      <p style={{ fontSize: "16px", color: t.textMuted, lineHeight: 1.7, margin: 0 }}>
                        {sectionContent}
                      </p>
                    </div>
                  </Reveal>
                )}
                {mediaItems && (
                  <Reveal>
                    <MediaGrid items={mediaItems} stacked={(project.slug === "airtel-rewards" && (key === "ideation & moment of win" || key === "shipped solution")) || (project.slug === "airtel-recharges" && (key === "overview" || key === "approach" || key === "insights" || key === "solution" || key === "impact")) || (project.slug === "simpplr-events" && (key === "shipped solution" || key === "impact"))} />
                  </Reveal>
                )}
              </div>
            );
          })}

          {/* Key Decisions */}
          <Reveal>
            <div style={{ marginBottom: "56px" }}>
              <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>
                Key Decisions
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {project.decisions.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      background: t.bgCard,
                      borderRadius: "10px",
                      border: `1px solid ${t.borderLight}`,
                      fontSize: "15px",
                      color: t.text,
                      lineHeight: 1.5,
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ color: t.accent, fontWeight: 600, fontSize: "13px", flexShrink: 0, marginTop: "2px" }}>0{i + 1}</span>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Footer CTA */}
          <Reveal>
            <div
              style={{
                padding: "40px",
                background: t.bgCard,
                borderRadius: "16px",
                border: `1px solid ${t.borderLight}`,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "18px", color: t.text, fontWeight: 500, margin: "0 0 16px 0" }}>
                Want the full walkthrough?
              </p>
              <Button onClick={() => navigate("/contact")}>Let's talk →</Button>
            </div>
          </Reveal>

          {/* ─── More Work ─── */}
          <MoreWork currentSlug={project.slug} isMobile={isMobile} />
        </div>
      </div>
    </Section>
    </>
  );
}

// ─── UI SHOWCASE (Dribbble-style) ────────────────────────────

function ShotCard({ item, index, onClick, loves, onLove }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { reduced } = useMotion();
  const hues = [210, 25, 150, 280, 45, 190, 340, 100, 60, 240];
  const hue = hues[item.id % hues.length];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail — 4:3 */}
      <div
        onClick={onClick}
        style={{
          aspectRatio: "4/3",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          background: `linear-gradient(135deg, hsl(${hue}, 40%, ${isDark ? '16' : '90'}%) 0%, hsl(${hue + 40}, 35%, ${isDark ? '10' : '84'}%) 100%)`,
          border: `1px solid ${hovered
            ? isDark ? `hsla(${hue}, 60%, 50%, 0.35)` : `hsla(${hue}, 60%, 50%, 0.25)`
            : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
          }`,
          boxShadow: hovered
            ? isDark
              ? `0 8px 32px hsla(${hue}, 50%, 40%, 0.2), 0 2px 8px rgba(0,0,0,0.3)`
              : `0 8px 32px hsla(${hue}, 50%, 50%, 0.12), 0 2px 8px rgba(0,0,0,0.06)`
            : "none",
          transition: reduced ? "none" : "border 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Decorative gradient layer */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 30% 40%, hsla(${hue}, 45%, ${isDark ? '25' : '80'}%, 0.5) 0%, transparent 50%),
                       radial-gradient(circle at 70% 60%, hsla(${hue + 60}, 40%, ${isDark ? '20' : '75'}%, 0.4) 0%, transparent 40%)`,
        }} />
        {/* Play icon placeholder */}
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0.6,
          transition: reduced ? "none" : "opacity 0.25s ease",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "2px" }}>
              <polygon points="6,3 20,12 6,21" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} />
            </svg>
          </div>
        </div>
        {/* Artefact badge */}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em",
          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.45)",
          background: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: "6px",
        }}>
          {item.artefact}
        </div>
      </div>

      {/* Footer: Title + Love */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 2px 0",
      }}>
        <span
          onClick={onClick}
          style={{
            fontSize: "14px", fontWeight: 500, color: t.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            flex: 1, marginRight: "12px",
            transition: reduced ? "none" : "color 0.2s ease",
            ...(hovered ? { color: t.accent } : {}),
          }}
        >
          {item.label}
        </span>
        <button
          onClick={onLove}
          style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: "none", border: "none", padding: "8px 4px",
            cursor: "pointer", fontSize: "12px", fontWeight: 500,
            color: t.textDim, fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
            transition: reduced ? "none" : "color 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#e74c6f"}
          onMouseLeave={(e) => e.currentTarget.style.color = t.textDim}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={loves > 0 ? "#e74c6f" : "none"} stroke={loves > 0 ? "#e74c6f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {loves}
        </button>
      </div>
    </div>
  );
}

// ── Dribbble-style Shot Modal ──
function ShotModal({ item, onClose, loves, onLove }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { reduced } = useMotion();
  const hues = [210, 25, 150, 280, 45, 190, 340, 100, 60, 240];
  const hue = hues[item.id % hues.length];

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.6)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px 12px",
      }}
    >
      {/* Modal card — fills viewport minus margins, no scroll */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "1060px",
          height: "calc(100vh - 32px)",
          background: isDark ? "#1A1A1A" : "#FFFFFF",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: isDark
            ? "0 24px 80px rgba(0,0,0,0.6)"
            : "0 24px 80px rgba(0,0,0,0.15)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Close button — fixed height row */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 20px 12px", flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: t.textMuted, fontSize: "16px",
              transition: reduced ? "none" : "background 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}
            onMouseLeave={(e) => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Media area — flexes to fill remaining space */}
        <div style={{
          flex: 1, minHeight: 0,
          padding: "0 28px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            aspectRatio: "1/1",
            maxHeight: "100%", maxWidth: "100%",
            width: "100%",
            borderRadius: "10px", overflow: "hidden", position: "relative",
            background: `linear-gradient(135deg, hsl(${hue}, 40%, ${isDark ? '16' : '90'}%) 0%, hsl(${hue + 40}, 35%, ${isDark ? '10' : '84'}%) 100%)`,
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(circle at 30% 40%, hsla(${hue}, 45%, ${isDark ? '25' : '80'}%, 0.5) 0%, transparent 50%),
                           radial-gradient(circle at 70% 60%, hsla(${hue + 60}, 40%, ${isDark ? '20' : '75'}%, 0.4) 0%, transparent 40%)`,
            }} />
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "2px" }}>
                  <polygon points="6,3 20,12 6,21" fill={isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)"} />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Info section — fixed at bottom, compact */}
        <div style={{ padding: "16px 28px 20px", flexShrink: 0 }}>
          {/* Title row + Love */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontSize: "18px", fontWeight: 600, color: t.text,
                margin: 0, lineHeight: 1.3, letterSpacing: "-0.01em",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {item.label}
              </h3>
              <div style={{
                display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px",
                marginTop: "4px",
              }}>
                <span style={{ fontSize: "12px", color: t.textMuted }}>{item.platform}</span>
                <span style={{ fontSize: "12px", color: t.textDim }}>·</span>
                <span style={{ fontSize: "12px", color: t.textMuted }}>{item.domain}</span>
                <span style={{ fontSize: "12px", color: t.textDim }}>·</span>
                <span style={{ fontSize: "12px", color: t.textMuted }}>{item.year}</span>
                {item.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: "11px", fontWeight: 500, letterSpacing: "0.02em",
                    padding: "2px 10px", borderRadius: "100px",
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    color: t.textDim,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onLove}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "8px 18px", borderRadius: "100px", flexShrink: 0,
                fontSize: "14px", fontWeight: 500, cursor: "pointer",
                fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
                border: loves > 0
                  ? "1px solid rgba(231,76,111,0.3)"
                  : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                background: loves > 0
                  ? "rgba(231,76,111,0.08)"
                  : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                color: loves > 0 ? "#e74c6f" : t.textMuted,
                transition: reduced ? "none" : "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(231,76,111,0.12)";
                e.currentTarget.style.borderColor = "rgba(231,76,111,0.4)";
                e.currentTarget.style.color = "#e74c6f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = loves > 0 ? "rgba(231,76,111,0.08)" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)");
                e.currentTarget.style.borderColor = loves > 0 ? "rgba(231,76,111,0.3)" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)");
                e.currentTarget.style.color = loves > 0 ? "#e74c6f" : t.textMuted;
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={loves > 0 ? "#e74c6f" : "none"} stroke={loves > 0 ? "#e74c6f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {loves}
            </button>
          </div>

          {/* Description */}
          <p style={{
            fontSize: "13px", color: t.textMuted, lineHeight: 1.6,
            marginTop: "8px", marginBottom: 0,
          }}>
            {item.context}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ShowcaseVideoEmbed({ src, aspectRatio = "16/9" }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        if (entry.isIntersecting) {
          iframe.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
        } else {
          iframe.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "*");
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleMute = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const newMuted = !muted;
    iframe.contentWindow.postMessage(JSON.stringify({ method: "setVolume", value: newMuted ? 0 : 1 }), "*");
    setMuted(newMuted);
  }, [muted]);

  return (
    <div ref={containerRef} style={{
      position: "relative",
      width: "100%",
      aspectRatio,
      borderRadius: isMobile ? "12px" : "16px",
      overflow: "hidden",
      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
      background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
    }}>
      <iframe
        ref={iframeRef}
        src={src}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
        allow="autoplay; fullscreen"
        title="Showcase video"
      />
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <button
        onClick={toggleMute}
        style={{
          position: "absolute",
          bottom: isMobile ? "12px" : "16px",
          right: isMobile ? "12px" : "16px",
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 3,
          padding: 0,
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        )}
      </button>
    </div>
  );
}

function ShowcaseVideoModal({ item, onClose }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { reduced } = useMotion();
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Auto-play on mount
  useEffect(() => {
    const t = setTimeout(() => {
      const iframe = iframeRef.current;
      if (iframe) iframe.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const toggleMute = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const newMuted = !muted;
    iframe.contentWindow.postMessage(JSON.stringify({ method: "setVolume", value: newMuted ? 0 : 1 }), "*");
    setMuted(newMuted);
  }, [muted]);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: isDark ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.75)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px 12px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1200px",
          maxHeight: "calc(100vh - 32px)",
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >
        {/* Close button row */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <button
            onClick={onClose}
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "16px",
              transition: reduced ? "none" : "background 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Video container — full width, 16:9, max height fills screen */}
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}>
          <iframe
            ref={iframeRef}
            src={item.videoSrc}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
            allow="autoplay; fullscreen"
            title={item.title}
          />
          <div style={{ position: "absolute", inset: 0, zIndex: 1 }} />
          {/* Mute/unmute */}
          <button
            onClick={toggleMute}
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 3,
              padding: 0,
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            )}
          </button>
        </div>

        {/* Title bar below video */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "16px",
          flexWrap: "wrap",
          gap: "8px",
        }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.3 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "4px 0 0 0" }}>
              {item.subtitle}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {item.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: "11px",
                padding: "4px 10px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function UIShowcase() {
  const t = useTheme();
  const isDark = t === themes.dark;
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const [modalItem, setModalItem] = useState(null);

  return (
    <>
    <BackBar label="Home" to="/" />
    <Section style={{ paddingTop: "20px" }}>
      <Reveal>
        <SectionTitle sub="Product interfaces I've designed — interactive walkthroughs with full context.">
          UI Showcase
        </SectionTitle>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "64px" : "96px" }}>
        {UI_SHOWCASE_VIDEOS.map((item, i) => {
          const accentColors = ["#5B8DEF", "#A78BFA", "#45B88F", "#E87A4F"];
          const accent = accentColors[i % accentColors.length];
          return (
            <Reveal key={item.id}>
              <article>
                {/* Clickable video embed */}
                <div
                  onClick={() => setModalItem(item)}
                  style={{ cursor: "pointer", position: "relative" }}
                  onMouseEnter={(e) => { const hint = e.currentTarget.querySelector(".expand-hint"); if (hint) hint.style.opacity = "1"; }}
                  onMouseLeave={(e) => { const hint = e.currentTarget.querySelector(".expand-hint"); if (hint) hint.style.opacity = "0"; }}
                >
                  <ShowcaseVideoEmbed src={item.videoSrc} aspectRatio="16/9" />
                  {/* Expand hint overlay */}
                  <div style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "11px",
                    fontWeight: 500,
                    opacity: isMobile ? 0.85 : 0,
                    transition: "opacity 0.25s ease",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                    className="expand-hint"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    View fullscreen
                  </div>
                </div>

                {/* Content below video */}
                <div style={{ marginTop: isMobile ? "24px" : "32px", maxWidth: "800px" }}>
                  {/* Overline: year + platform + role */}
                  <div style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: t.textDim,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}>
                    <span>{item.year}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span>{item.platform}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span style={{ color: t.accent }}>{item.role}</span>
                  </div>

                  {/* Title + subtitle */}
                  <h2 style={{
                    fontSize: isMobile ? "24px" : "30px",
                    fontWeight: 600,
                    color: t.text,
                    margin: "0 0 6px 0",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.25,
                  }}>
                    {item.title}
                  </h2>
                  <p style={{
                    fontSize: isMobile ? "15px" : "16px",
                    color: t.textMuted,
                    margin: "0 0 20px 0",
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}>
                    {item.subtitle}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
                    {item.tags.map((tag) => (
                      <Chip key={tag} style={{ fontSize: "11px" }}>{tag}</Chip>
                    ))}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: t.textMuted,
                    fontWeight: 300,
                    margin: "0 0 28px 0",
                  }}>
                    {item.description}
                  </p>

                  {/* Highlights */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? "10px" : "12px 24px",
                  }}>
                    {item.highlights.map((h, hi) => (
                      <div key={hi} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontSize: "13px",
                        color: t.textMuted,
                        lineHeight: 1.55,
                      }}>
                        <span style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: accent,
                          flexShrink: 0,
                          marginTop: "6px",
                          opacity: 0.6,
                        }} />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Separator between items (not after last) */}
                {i < UI_SHOWCASE_VIDEOS.length - 1 && (
                  <div style={{
                    marginTop: isMobile ? "64px" : "96px",
                    height: "1px",
                    background: `linear-gradient(90deg, transparent, ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}, transparent)`,
                  }} />
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>

    {/* Fullscreen video modal */}
    {modalItem && <ShowcaseVideoModal item={modalItem} onClose={() => setModalItem(null)} />}
    </>
  );
}

// ─── ABOUT PHOTO STACK ───────────────────────────────────────
const ABOUT_PHOTOS = [
  { src: "/images/about/about-01.jpg", backTitle: "At track, I meditate", backNote: "Knee down, brain off." },
  { src: "/images/about/about-02.jpg", backTitle: "Time-check", backNote: "I think about design, like 24/7" },
  { src: "/images/about/about-03.jpg", backTitle: "When I'm happiest", backNote: "Pushups >>> Meetings" },
  { src: "/images/about/about-04.jpg", backTitle: "Me with my Lazarus", backNote: "Weekend therapy with the ZX10R" },
];

function PhotoStack() {
  const t = useTheme();
  const isDark = t === themes.dark;
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const isMobile = window.innerWidth <= 768;

  // Desktop card layout: leftmost card on top (highest zBase), stack fans left-to-right
  const layouts = [
    { rotate: -6, left: "2%", width: 280, height: 200, zBase: 4 },
    { rotate: 4, left: "22%", width: 220, height: 290, zBase: 3 },
    { rotate: -3, left: "40%", width: 260, height: 230, zBase: 2 },
    { rotate: 5, left: "62%", width: 200, height: 300, zBase: 1 },
  ];

  // Mobile rotations for grid cards
  const mobileRotations = [-2, 1.5, -1, 2];

  if (isMobile) {
    return (
      <div style={{
        width: "100%",
        marginBottom: "56px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}>
          {ABOUT_PHOTOS.map((photo, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
                onClick={() => setHoveredIdx(hoveredIdx === i ? -1 : i)}
                style={{
                  perspective: "1000px",
                  cursor: "pointer",
                }}
              >
                {/* Inner flipper */}
                <div style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/5",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isHovered ? "rotateY(180deg)" : "rotateY(0deg)",
                }}>
                  {/* Front — photo */}
                  <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: isDark
                      ? "0 8px 32px rgba(0,0,0,0.5)"
                      : "0 8px 32px rgba(0,0,0,0.12)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                    transform: `rotate(${mobileRotations[i]}deg)`,
                  }}>
                    <img
                      src={photo.src}
                      alt={photo.backText}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Back — metadata card */}
                  <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: isDark ? "#1E1E1E" : "#FFFAF2",
                    boxShadow: isDark
                      ? "0 8px 32px rgba(0,0,0,0.5)"
                      : "0 8px 32px rgba(0,0,0,0.12)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                  }}>
                    <span style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                      textAlign: "center",
                      lineHeight: 1.3,
                      marginBottom: "8px",
                    }}>
                      {photo.backTitle}
                    </span>
                    <span style={{
                      fontSize: "11px",
                      color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
                      fontStyle: "italic",
                      textAlign: "center",
                      lineHeight: 1.4,
                    }}>
                      {photo.backNote}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop layout (unchanged)
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "340px",
      marginBottom: "56px",
    }}>
      {ABOUT_PHOTOS.map((photo, i) => {
        const layout = layouts[i];
        const isHovered = hoveredIdx === i;
        return (
          <div
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(-1)}
            style={{
              position: "absolute",
              left: layout.left,
              top: "50%",
              width: layout.width + "px",
              height: layout.height + "px",
              perspective: "1000px",
              cursor: "pointer",
              transform: `translateY(-50%) rotate(${layout.rotate}deg)`,
              zIndex: isHovered ? 10 : layout.zBase,
              transition: "z-index 0s",
            }}
          >
            {/* Inner flipper */}
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isHovered ? "scale(1.08) rotateY(180deg)" : "scale(1) rotateY(0deg)",
            }}>
              {/* Front — photo */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.5)"
                  : "0 8px 32px rgba(0,0,0,0.12)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
              }}>
                <img
                  src={photo.src}
                  alt={photo.backText}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                />
              </div>

              {/* Back — metadata card */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: "14px",
                overflow: "hidden",
                background: isDark ? "#1E1E1E" : "#FFFAF2",
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.5)"
                  : "0 8px 32px rgba(0,0,0,0.12)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
              }}>
                <span style={{
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: 500,
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                  textAlign: "center",
                  lineHeight: 1.3,
                  marginBottom: "8px",
                }}>
                  {photo.backTitle}
                </span>
                <span style={{
                  fontSize: isMobile ? "11px" : "13px",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
                  fontStyle: "italic",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}>
                  {photo.backNote}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CAREER TIMELINE (immersive scroll-locked) ──────────────
const TIMELINE_ENTRIES = [
  { year: "2015", label: "2015", title: "Digital Design Consultant", org: "Independent", desc: "Collaborated with 15+ early-stage startups across UX/UI, branding, and front-end web design, delivering end-to-end design solutions across multiple industries.", tags: ["15+ Startups", "Branding", "Front-end"] },
  { year: "2018", label: "2018", title: "UX Researcher", org: "University of York, UK", desc: "Reduced staff training time by 80% and improved user satisfaction by 75% through redesigned service workflows. Won Campus Intern of the Year.", tags: ["Masters", "HCI", "Service Design"] },
  { year: "2019", label: "2019", title: "UX Design Consultant", org: "PayU", desc: "Reduced merchant dashboard drop-off from 55% → 15%. Created COIN design system, cutting feature delivery from ~2 weeks to ~2 hours.", tags: ["Design System", "Neobanking", "Payouts"] },
  { year: "2020", label: "2020", title: "Associate Director, Growth", org: "Stylework", desc: "Led growth and product design across 8-member team. Played a key role in securing INR 4Cr pre-Series A funding through product strategy.", tags: ["Growth", "Pre-Series A", "Team Lead"] },
  { year: "2021", label: "2021", title: "Senior Product Designer", org: "Bharti Airtel", desc: "Decreased recharge drop-offs from 27.5% → 12.75% in a $107M/mo pipeline, lifting CSAT 12%. Designed Airtel Rewards driving ~25% revenue uplift. Won 3 consecutive Digital Citizen Awards.", tags: ["350M+ Users", "Recharges & Rewards", "3x Award Winner"] },
  { year: "2022", label: "2022", title: "Senior Product Designer", org: "Khatabook", desc: "Owned design and research for transaction-heavy POS workflows, leading the launch of Khatabook Web's paid transactional features while scaling a cross-platform design system.", tags: ["Fintech", "POS Design", "Design System"] },
  { year: "2023", label: "2023", title: "Senior Product Designer", org: "Simpplr", desc: "Drove 40% faster objective completion by shipping AI-powered Workplace Search + Smart Answers. Lifted event clicks 28.85% and CSAT 37.5%. Won 5 awards.", tags: ["AI Search", "Mobile UX", "Video Analytics", "5 Awards"] },
  { year: "2025", label: "2025", title: "Lead Product Designer", org: "NOVA", desc: "Scaled team from 2 → 7 designers. Led 0→1 white-label food ordering app, AI Campaigns (200% increase, 92 SUS), and Voice AI — contributing to ~40% of $900K seasonal ARR.", tags: ["Team Building", "AI Campaigns", "Voice AI", "White-label App"] },
  { year: "2026", label: "Now", title: "Principal Product Designer", org: "NOVA", desc: "Promoted to Principal to own design strategy across NOVA's full product suite. Driving conversion rate optimisation and 0→1 products — Inventory Nova Edge, Horizontal Kiosk, and Employee Management.", tags: ["Design Strategy", "0→1 Products", "Enterprise POS"], accent: true },
];

function CareerTimeline() {
  const t = useTheme();
  const isDark = t === themes.dark;
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const { navigate } = useRoute();
  const { reduced } = useMotion();
  const stickyRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const total = TIMELINE_ENTRIES.length;

  const accentRgb = isDark ? "232,122,79" : "208,96,58";

  // Inject keyframe animations
  useEffect(() => {
    const id = "tl-immersive-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes tlPulseNow {
        0%, 100% { box-shadow: 0 0 8px 3px rgba(${accentRgb},0.35), 0 0 24px 8px rgba(${accentRgb},0.1); }
        50% { box-shadow: 0 0 14px 5px rgba(${accentRgb},0.5), 0 0 36px 12px rgba(${accentRgb},0.15); }
      }
      @keyframes tlRingPulse {
        0% { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, [accentRgb]);

  // Scroll-progress: map scroll position within the tall container to activeIdx
  useEffect(() => {
    const area = scrollAreaRef.current;
    if (!area) return;

    function onScroll() {
      const rect = area.getBoundingClientRect();
      const viewH = window.innerHeight;
      // How far we've scrolled into the section (0 = just entering, 1 = leaving)
      const scrolled = -rect.top;
      const scrollRange = rect.height - viewH;
      const pct = scrollRange > 0 ? Math.min(Math.max(scrolled / scrollRange, 0), 1) : 0;
      setProgress(pct);

      // Map progress to activeIdx
      const idx = Math.min(Math.floor(pct * total), total - 1);
      setActiveIdx(Math.max(idx, 0));

      // Check if section is in view
      setIsInView(rect.top < viewH && rect.bottom > 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [total]);

  // Jump to a specific entry when year is clicked
  function scrollToEntry(idx) {
    const area = scrollAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const viewH = window.innerHeight;
    const scrollRange = rect.height - viewH;
    const targetScroll = (idx / total) * scrollRange;
    const areaTop = area.offsetTop;
    window.scrollTo({ top: areaTop + targetScroll, behavior: "smooth" });
  }

  const item = TIMELINE_ENTRIES[activeIdx] || TIMELINE_ENTRIES[0];
  const isLast = activeIdx === total - 1;

  // Year nav left offset for mobile vs desktop
  const yearNavWidth = isMobile ? 48 : 72;

  return (
    <div
      ref={scrollAreaRef}
      style={{
        // Scroll runway: ~20vh per entry for snappy scroll transitions
        height: `${total * 20 + 100}vh`,
        position: "relative",
        // Break out of the Section's max-width + padding
        marginLeft: "calc(-1 * clamp(20px, 5vw, 80px))",
        marginRight: "calc(-1 * clamp(20px, 5vw, 80px))",
        marginBottom: "-40px",
      }}
    >
      {/* Sticky viewport that stays in view while scrolling */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* ── Background: subtle radial glow behind the card ── */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "300px" : "500px",
          height: isMobile ? "300px" : "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${accentRgb},${isDark ? 0.06 : 0.03}) 0%, transparent 70%)`,
          pointerEvents: "none",
          opacity: isInView ? 1 : 0,
          transition: "opacity 0.8s ease",
        }} />

        {/* ── Desktop: Left year navigation ── */}
        {!isMobile && (
        <div style={{
          position: "absolute",
          left: "clamp(24px, 4vw, 64px)",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
          zIndex: 5,
        }}>
          {TIMELINE_ENTRIES.map((entry, i) => {
            const isActive = i === activeIdx;
            const isPast = i < activeIdx;
            return (
              <button
                key={i}
                onClick={() => scrollToEntry(i)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "7px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  zIndex: 2,
                  outline: "none",
                  flexDirection: "row",
                }}
              >
                <div style={{
                  width: isActive ? "10px" : "6px",
                  height: isActive ? "10px" : "6px",
                  borderRadius: "50%",
                  background: isActive
                    ? `rgba(${accentRgb},1)`
                    : isPast
                      ? `rgba(${accentRgb},0.5)`
                      : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
                  boxShadow: isActive
                    ? `0 0 10px rgba(${accentRgb},0.5), 0 0 20px rgba(${accentRgb},0.2)`
                    : "none",
                  transition: reduced ? "none" : "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: isActive ? "14px" : "12px",
                  fontWeight: isActive ? 700 : 400,
                  color: isActive
                    ? t.accent
                    : isPast
                      ? (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)")
                      : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"),
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: isActive ? "0.02em" : "0.01em",
                  transition: reduced ? "none" : "all 0.4s ease",
                  textShadow: isActive
                    ? `0 0 12px rgba(${accentRgb},${isDark ? 0.3 : 0.15})`
                    : "none",
                  whiteSpace: "nowrap",
                }}>
                  {entry.label}
                </span>
              </button>
            );
          })}
        </div>
        )}

        {/* ── Card + mobile year nav layout ── */}
        <div style={{
          position: "absolute",
          left: isMobile ? "50%" : "calc(50% + 52px)",
          top: isMobile ? "46%" : "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "calc(100% - 40px)" : "min(560px, 50vw)",
          maxWidth: "600px",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Card */}
          <div
            key={activeIdx}
            style={{
              position: "relative",
              width: "100%",
              padding: isMobile ? "24px 20px" : "36px 40px",
              borderRadius: "20px",
              background: isDark
                ? (isLast ? `rgba(${accentRgb},0.06)` : "rgba(255,255,255,0.025)")
                : (isLast ? `rgba(${accentRgb},0.04)` : "rgba(255,255,255,0.8)"),
              border: `1px solid ${isDark
                ? (isLast ? `rgba(${accentRgb},0.2)` : "rgba(255,255,255,0.06)")
                : (isLast ? `rgba(${accentRgb},0.15)` : "rgba(0,0,0,0.06)")}`,
              boxShadow: isDark
                ? (isLast
                  ? `0 0 40px rgba(${accentRgb},0.1), 0 8px 32px rgba(0,0,0,0.3)`
                  : "0 8px 32px rgba(0,0,0,0.2)")
                : (isLast
                  ? `0 0 40px rgba(${accentRgb},0.06), 0 8px 32px rgba(0,0,0,0.06)`
                  : "0 4px 24px rgba(0,0,0,0.05)"),
              backdropFilter: isDark ? "blur(16px)" : "blur(12px)",
              WebkitBackdropFilter: isDark ? "blur(16px)" : "blur(12px)",
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            {/* Year + indicator */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: isMobile ? "16px" : "20px",
            }}>
              <span style={{
                fontSize: isMobile ? "40px" : "56px",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                color: isLast ? t.accent : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"),
                textShadow: isLast
                  ? `0 0 24px rgba(${accentRgb},${isDark ? 0.4 : 0.2})`
                  : "none",
              }}>
                {item.year}
              </span>
              {isLast && !reduced && (
                <div style={{
                  position: "relative",
                  width: "10px",
                  height: "10px",
                }}>
                  <div style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: t.accent,
                    animation: "tlPulseNow 2.5s ease-in-out infinite",
                  }} />
                  <div style={{
                    position: "absolute",
                    inset: "-3px",
                    borderRadius: "50%",
                    border: `1.5px solid rgba(${accentRgb},0.4)`,
                    animation: "tlRingPulse 2.5s ease-out infinite",
                  }} />
                </div>
              )}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: isMobile ? "20px" : "26px",
              fontWeight: 600,
              color: t.text,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 6px 0",
            }}>
              {item.title}
            </h3>

            {/* Org */}
            <p style={{
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: 500,
              color: isLast ? t.accent : t.textMuted,
              margin: "0 0 16px 0",
              letterSpacing: "0.01em",
            }}>
              {item.org}
            </p>

            {/* Description */}
            <p style={{
              fontSize: isMobile ? "13px" : "15px",
              color: t.textMuted,
              lineHeight: 1.7,
              margin: "0 0 20px 0",
            }}>
              {item.desc}
            </p>

            {/* Tags */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}>
              {item.tags.map((tag, j) => (
                <span
                  key={j}
                  style={{
                    display: "inline-block",
                    padding: isMobile ? "3px 8px" : "4px 12px",
                    borderRadius: "100px",
                    fontSize: isMobile ? "10px" : "11px",
                    letterSpacing: "0.03em",
                    fontWeight: 500,
                    background: isLast
                      ? `rgba(${accentRgb},${isDark ? 0.12 : 0.07})`
                      : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
                    color: isLast ? t.accent : t.textMuted,
                    border: `1px solid ${isLast
                      ? `rgba(${accentRgb},${isDark ? 0.2 : 0.12})`
                      : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)")}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Mobile: Horizontal year navigation below card ── */}
          {isMobile && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              marginTop: "20px",
              overflowX: "auto",
              width: "100%",
              paddingBottom: "4px",
            }}>
              {TIMELINE_ENTRIES.map((entry, i) => {
                const isActive = i === activeIdx;
                const isPast = i < activeIdx;
                return (
                  <button
                    key={i}
                    onClick={() => scrollToEntry(i)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 6px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      width: isActive ? "8px" : "5px",
                      height: isActive ? "8px" : "5px",
                      borderRadius: "50%",
                      background: isActive
                        ? `rgba(${accentRgb},1)`
                        : isPast
                          ? `rgba(${accentRgb},0.5)`
                          : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
                      boxShadow: isActive
                        ? `0 0 8px rgba(${accentRgb},0.5)`
                        : "none",
                      transition: reduced ? "none" : "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                    }} />
                    <span style={{
                      fontSize: isActive ? "11px" : "9px",
                      fontWeight: isActive ? 700 : 400,
                      color: isActive
                        ? t.accent
                        : isPast
                          ? (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)")
                          : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"),
                      fontVariantNumeric: "tabular-nums",
                      transition: reduced ? "none" : "all 0.4s ease",
                      textShadow: isActive
                        ? `0 0 12px rgba(${accentRgb},${isDark ? 0.3 : 0.15})`
                        : "none",
                      whiteSpace: "nowrap",
                    }}>
                      {entry.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Desktop: Progress indicator below card */}
          {!isMobile && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "28px",
          }}>
            {TIMELINE_ENTRIES.map((_, i) => (
              <div
                key={i}
                onClick={() => scrollToEntry(i)}
                style={{
                  width: i === activeIdx ? "24px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === activeIdx
                    ? `rgba(${accentRgb},0.8)`
                    : i < activeIdx
                      ? `rgba(${accentRgb},0.25)`
                      : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"),
                  boxShadow: i === activeIdx
                    ? `0 0 8px rgba(${accentRgb},0.3)`
                    : "none",
                  cursor: "pointer",
                  transition: reduced ? "none" : "all 0.3s ease",
                }}
              />
            ))}
          </div>
          )}

          {/* Scroll hint — shown at first entry */}
          {activeIdx === 0 && (
            <div style={{
              textAlign: "center",
              marginTop: "16px",
              opacity: 0.4,
              fontSize: "12px",
              color: t.textDim,
              letterSpacing: "0.05em",
            }}>
              scroll to explore
            </div>
          )}

          {/* View resume link — shown at last entry */}
          {isLast && (
            <div style={{
              textAlign: "center",
              marginTop: "16px",
            }}>
              <Button variant="text" onClick={() => navigate("/resume")}>
                View full résumé →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────
function About() {
  const t = useTheme();
  const { navigate } = useRoute();

  return (
    <>
    <BackBar label="Home" to="/" />
    <Section style={{ paddingTop: "20px" }}>
      {/* Photo stack at top */}
      <Reveal>
        <PhotoStack />
      </Reveal>

      <Reveal>
        <div style={window.innerWidth <= 768 ? { marginBottom: "-26px" } : {}}>
          <SectionTitle>About</SectionTitle>
        </div>
        <div style={{ maxWidth: "680px" }}>
          <p style={{ fontSize: window.innerWidth <= 768 ? "15px" : "17px", color: t.textMuted, lineHeight: 1.7, marginBottom: window.innerWidth <= 768 ? "28px" : "40px" }}>
            I'm a Principal Product Designer with 10+ years of experience shipping products that
            people actually use — at Airtel (350M+ subscribers), Simpplr (enterprise AI), PayU (fintech),
            and now NOVA (restaurant tech). I started as a visual designer, ran my own agency at 20,
            studied UX research at the University of York, and evolved into a full-stack product designer
            who builds teams and systems alongside products.
          </p>
        </div>
      </Reveal>

      {/* Operating model */}
      <Reveal delay={0.1}>
        <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>
          How I Lead & Collaborate
        </h3>
        <div style={{ maxWidth: "680px", marginBottom: window.innerWidth <= 768 ? "32px" : "56px" }}>
          <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7, marginBottom: "12px" }}>
            At NOVA, I built the design team from scratch — 3 product designers, a visual designer,
            and a micro-interaction designer report to me. I balance IC work on high-stakes projects
            (AI campaigns, POS redesign) with team leadership, design ops, and cross-functional alignment.
          </p>
          <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7 }}>
            I lead through clarity: sharp problem framing, structured decision-making, and design
            reviews that raise the bar without blocking velocity. I care as much about building team
            culture and mentoring designers as I do about shipping great products.
          </p>
        </div>
      </Reveal>

      {/* Career Timeline — scroll-triggered animated */}
      <CareerTimeline />

      {/* Human section */}
      <Reveal delay={0.2}>
        <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: "20px" }}>
          Outside Work
        </h3>
        <div style={{ maxWidth: "680px", marginBottom: window.innerWidth <= 768 ? "24px" : "40px" }}>
          <p style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7 }}>
            When I'm not designing, you'll find me on a motorcycle exploring new roads,
            playing sports, or diving into music. I'm a regular at design community events and
            enjoy mentoring early-career designers when I can.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <Button onClick={() => navigate("/contact")}>Get in touch →</Button>
      </Reveal>
    </Section>
    </>
  );
}

// ─── RESUME ──────────────────────────────────────────────────
function Resume() {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { reduced } = useMotion();
  const isMobile = window.innerWidth <= 768;
  const accentRgb = isDark ? "232,122,79" : "208,96,58";

  // Sticky strip: hide on scroll down, show on scroll up
  const [stripVisible, setStripVisible] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    if (!isMobile) return;
    function onScroll() {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 120) {
        setStripVisible(false);
      } else {
        setStripVisible(true);
      }
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const skills = [
    "End-to-End Product Design", "Design Systems", "Mobile Design", "Prototyping",
    "UX Research & Testing", "Design Team Leadership", "Figma", "Design Ops",
    "AI/ML Product Design", "White-label Architecture", "Accessibility (WCAG)",
    "Statistical Analysis", "Cross-platform Design", "Kiosk & POS Design",
  ];

  return (
    <>
    <BackBar label="Home" to="/" />

    {/* Mobile: Sticky download CV strip */}
    {isMobile && (
      <div style={{
        position: "fixed",
        bottom: stripVisible ? "0px" : "-60px",
        left: 0,
        right: 0,
        zIndex: 900,
        padding: "12px 20px",
        paddingBottom: "max(32px, env(safe-area-inset-bottom))",
        background: isDark
          ? `linear-gradient(135deg, rgba(${accentRgb},0.15) 0%, rgba(${accentRgb},0.05) 100%)`
          : `linear-gradient(135deg, rgba(${accentRgb},0.1) 0%, rgba(${accentRgb},0.03) 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid rgba(${accentRgb},${isDark ? 0.2 : 0.12})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: reduced ? "none" : "bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: t.text }}>
          Rounak Ghosh — CV/Resume
        </span>
        <a
          href="/Rounak-Ghosh-Resume.pdf"
          download="Rounak-Ghosh-Resume.pdf"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "100px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#fff",
            background: t.accent,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </a>
      </div>
    )}

    <Section style={{ paddingTop: "20px" }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <SectionTitle sub="10+ years — from crafting meaningful solutions to leading product design at scale.">Résumé</SectionTitle>
          {!isMobile && (
          <a
            href="/Rounak-Ghosh-Resume.pdf"
            download="Rounak-Ghosh-Resume.pdf"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "100px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#fff",
              background: t.accent,
              textDecoration: "none",
              letterSpacing: "0.01em",
              marginTop: "8px",
              flexShrink: 0,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download CV
          </a>
          )}
        </div>
      </Reveal>

      <div style={{ maxWidth: "720px" }}>
        <Reveal delay={0.1}>
          <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, marginBottom: window.innerWidth <= 768 ? "12px" : "24px" }}>
            Experience
          </h3>
          {CAREER.map((entry, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "20px 0",
                borderBottom: `1px solid ${t.borderLight}`,
              }}
            >
              <span style={{ fontSize: "13px", color: t.textDim, fontVariantNumeric: "tabular-nums" }}>{entry.year}</span>
              <div>
                <span style={{ fontSize: "15px", color: t.text, fontWeight: 500 }}>{entry.title}</span>
                <span style={{ fontSize: "14px", color: t.textDim }}> — {entry.org}</span>
                <p style={{ fontSize: "13px", color: t.textMuted, margin: "6px 0 0", lineHeight: 1.6 }}>{entry.note}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.15}>
          <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, margin: "48px 0 20px" }}>
            Skills & Tools
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {skills.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h3 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: t.accent, fontWeight: 600, margin: "48px 0 20px" }}>
            Education
          </h3>
          <div style={{ fontSize: "15px", color: t.textMuted, lineHeight: 1.7 }}>
            <p style={{ margin: "0 0 8px" }}><span style={{ color: t.text, fontWeight: 500 }}>University of York, UK</span> — Masters of Science in Human-centred Interactive Technologies (2018–19)</p>
            <p style={{ margin: "0 0 8px" }}><span style={{ color: t.text, fontWeight: 500 }}>NIT Durgapur, India</span> — B.Tech in Electronics and Communication Engineering (2014–18)</p>
          </div>
        </Reveal>
      </div>
    </Section>
    </>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────
function Contact() {
  const t = useTheme();

  return (
    <>
    <BackBar label="Home" to="/" />
    <Section style={{ paddingTop: "20px" }}>
      <Reveal>
        <SectionTitle sub="Open to conversations about product design, systems, and collaboration.">
          Get in Touch
        </SectionTitle>
      </Reveal>

      <Reveal delay={0.1}>
        <div style={{ maxWidth: "480px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
            <a href="https://www.linkedin.com/in/rounak-ghosh-53a21b136/" target="_blank" rel="noopener" style={{ color: t.text, fontSize: "17px", textDecoration: "none", display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "12px", border: `1px solid ${t.borderLight}`, background: t.bgCard }}>
              <span style={{ color: t.accent, fontWeight: 700, fontSize: "16px", width: "16px", textAlign: "center", flexShrink: 0, display: "flex", justifyContent: "center" }}>in</span>
              <div>
                <div style={{ fontSize: "12px", color: t.textDim, marginBottom: "6px" }}>LinkedIn</div>
                Connect on LinkedIn
              </div>
            </a>
            <a href="mailto:ronuxdnr@gmail.com" style={{ color: t.text, fontSize: "17px", textDecoration: "none", display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "12px", border: `1px solid ${t.borderLight}`, background: t.bgCard }}>
              <span style={{ color: t.accent, display: "flex", width: "16px", flexShrink: 0, justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 6L8.91 9.92C11.46 11.36 12.54 11.36 15.08 9.92L21.99 6" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/><path d="M2.01988 13.48C2.08988 16.55 2.11988 18.08 3.24988 19.21C4.37988 20.35 5.95988 20.38 9.09988 20.46C11.0399 20.51 12.9599 20.51 14.8999 20.46C18.0499 20.38 19.6199 20.34 20.7499 19.21C21.8799 18.07 21.9099 16.54 21.9799 13.48C21.9999 12.49 21.9999 11.51 21.9799 10.53C21.9099 7.46001 21.8799 5.93001 20.7499 4.80001C19.6199 3.66001 18.0399 3.63001 14.8999 3.55001C12.9599 3.50001 11.0399 3.50001 9.09988 3.55001C5.94988 3.63001 4.37988 3.67001 3.24988 4.80001C2.11988 5.94001 2.08988 7.47001 2.01988 10.53C1.99988 11.52 1.99988 12.5 2.01988 13.48Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/></svg></span>
              <div>
                <div style={{ fontSize: "12px", color: t.textDim, marginBottom: "6px" }}>Email</div>
                ronuxdnr@gmail.com
              </div>
            </a>
            <a href="tel:+918017697352" style={{ color: t.text, fontSize: "17px", textDecoration: "none", display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "12px", border: `1px solid ${t.borderLight}`, background: t.bgCard }}>
              <span style={{ color: t.accent, display: "flex", width: "16px", flexShrink: 0, justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8.83993 5.00999L8.38993 3.99999C8.09993 3.33999 7.94993 3.00999 7.72993 2.75999C7.45993 2.43999 7.09993 2.20999 6.69993 2.08999C6.37993 1.98999 6.01993 1.98999 5.29993 1.98999C4.24993 1.98999 3.71993 1.98999 3.27993 2.18999C2.75993 2.42999 2.28993 2.94999 2.09993 3.48999C1.93993 3.94999 1.98993 4.41999 2.07993 5.36999C3.04993 15.43 8.55993 20.94 18.6199 21.91C19.5599 22 20.0399 22.05 20.4999 21.89C21.0399 21.7 21.5599 21.23 21.7999 20.71C21.9999 20.27 21.9999 19.74 21.9999 18.69C21.9999 17.97 21.9999 17.61 21.8999 17.29C21.7799 16.89 21.5499 16.53 21.2299 16.26C20.9799 16.04 20.6499 15.89 19.9899 15.6L18.9799 15.15C18.2699 14.83 17.9099 14.67 17.5499 14.64C17.1999 14.61 16.8499 14.66 16.5299 14.78C16.1899 14.91 15.8899 15.16 15.2899 15.66C14.6899 16.16 14.3999 16.41 14.0299 16.54C13.7099 16.66 13.2799 16.7 12.9399 16.65C12.5599 16.59 12.2599 16.44 11.6699 16.12C9.83993 15.14 8.82993 14.13 7.85993 12.31C7.54993 11.72 7.38993 11.43 7.32993 11.04C7.27993 10.7 7.32993 10.27 7.43993 9.94999C7.56993 9.58999 7.81993 9.28999 8.31993 8.68999C8.81993 8.08999 9.06993 7.78999 9.19993 7.44999C9.32993 7.12999 9.36993 6.77999 9.33993 6.42999C9.30993 6.06999 9.14993 5.70999 8.82993 4.99999L8.83993 5.00999Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg></span>
              <div>
                <div style={{ fontSize: "12px", color: t.textDim, marginBottom: "6px" }}>Call</div>
                +91-8017697352
              </div>
            </a>
          </div>

          <p style={{ fontSize: "14px", color: t.textDim, fontStyle: "italic", lineHeight: 1.6 }}>
            Happy to share deeper NDA walkthroughs live. I'm most responsive via email.
          </p>
        </div>
      </Reveal>
    </Section>
    </>
  );
}

// ─── Blog Video Embed (1:1, with mute/unmute) ───────────────
function BlogVideoEmbed({ src }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        if (entry.isIntersecting) {
          iframe.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
        } else {
          iframe.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "*");
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleMute = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const newMuted = !muted;
    iframe.contentWindow.postMessage(JSON.stringify({ method: "setVolume", value: newMuted ? 0 : 1 }), "*");
    setMuted(newMuted);
  }, [muted]);

  return (
    <div ref={containerRef} style={{
      margin: "40px 0",
      position: "relative",
      width: "100%",
      aspectRatio: "1/1",
      borderRadius: isMobile ? "12px" : "16px",
      overflow: "hidden",
      border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
    }}>
      <iframe
        ref={iframeRef}
        src={src}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
        allow="autoplay; fullscreen"
        title="Blog video"
      />
      {/* Invisible overlay to block any residual Vimeo controls */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <button
        onClick={toggleMute}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 3,
          color: "#fff",
          padding: 0,
        }}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── BLOG INDEX ──────────────────────────────────────────────
function BlogCard({ post }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { navigate } = useRoute();
  const [hovered, setHovered] = useState(false);
  const { reduced } = useMotion();

  return (
    <div
      onClick={() => navigate(`/blog/${post.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: "20px",
        overflow: "hidden",
        background: t.bgCard,
        border: `1px solid ${hovered ? t.border : t.borderLight}`,
        transition: reduced ? "none" : "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: hovered && !reduced ? "translateY(-6px)" : "none",
        boxShadow: hovered && !reduced
          ? (isDark ? "0 16px 48px rgba(0,0,0,0.4)" : "0 16px 48px rgba(0,0,0,0.08)")
          : "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Cover image */}
      <div
        style={{
          height: "220px",
          background: post.coverImage
            ? `url(${post.coverImage}) center/cover no-repeat`
            : `linear-gradient(135deg, hsl(${post.coverHue}, 35%, ${isDark ? '16' : '88'}%) 0%, hsl(${post.coverHue + 40}, 30%, ${isDark ? '10' : '80'}%) 100%)`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!post.coverImage && (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={`hsl(${post.coverHue}, 25%, ${isDark ? '35' : '65'}%)`} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
        )}
        {/* Read time badge */}
        <span style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          padding: "4px 10px",
          borderRadius: "100px",
          fontSize: "11px",
          fontWeight: 500,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "#fff",
          letterSpacing: "0.02em",
        }}>
          {post.readTime}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontSize: "17px",
          fontWeight: 600,
          color: t.text,
          lineHeight: 1.4,
          margin: "0 0 10px 0",
          letterSpacing: "-0.015em",
        }}>
          {post.title}
        </h3>

        <p style={{
          fontSize: "14px",
          color: t.textMuted,
          lineHeight: 1.55,
          margin: "0",
          fontWeight: 300,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          flex: 1,
        }}>
          {post.excerpt}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: t.textDim,
          marginTop: "16px",
          paddingTop: "14px",
          borderTop: `1px solid ${t.borderLight}`,
        }}>
          <div style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: t.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            fontSize: "9px",
            fontWeight: 700,
            flexShrink: 0,
          }}>RG</div>
          <span style={{ fontWeight: 500, color: t.textMuted }}>Ron</span>
          <span style={{ color: t.textDim }}>·</span>
          <span>{post.date}</span>
        </div>
      </div>
    </div>
  );
}

function BlogIndex() {
  const t = useTheme();

  return (
    <>
    <BackBar label="Home" to="/" />
    <Section style={{ paddingTop: "20px" }}>
      <Reveal>
        <SectionTitle sub="Thoughts on product design, research methods, team building, and systems thinking.">
          Blog
        </SectionTitle>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {BLOG_POSTS.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.08} style={{ height: "100%" }}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </Section>
    </>
  );
}

// ─── BLOG POST (Medium-style) ────────────────────────────────
function BlogPost({ slug }) {
  const t = useTheme();
  const { navigate } = useRoute();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const { reduced } = useMotion();

  if (!post) return (
    <Section style={{ paddingTop: "160px", textAlign: "center" }}>
      <h2 style={{ color: t.text, fontSize: "24px", fontWeight: 500 }}>Post not found</h2>
      <Button variant="text" onClick={() => navigate("/blog")} style={{ marginTop: "16px" }}>← Back to blog</Button>
    </Section>
  );

  const isMobile = window.innerWidth <= 768;
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  // Find related posts (exclude current)
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  // Reading progress bar
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    {/* Reading progress bar */}
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: `${progress}%`,
      height: "3px",
      background: t.accent,
      zIndex: 1001,
      transition: reduced ? "none" : "width 0.1s linear",
    }} />

    <BackBar label="All posts" to="/blog" />

    {/* Article header */}
    <article style={{ maxWidth: "720px", margin: "0 auto", padding: "20px clamp(20px, 5vw, 40px) 0" }}>
      <Reveal>
        {/* Tags */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {post.tags.map((tag) => {
            const isAIChip = /\bAI\b|Voice AI|Conversational/i.test(tag);
            const isDark = t === themes.dark;
            return isAIChip && post.slug === "designing-voice-first-food-ordering" ? (
              <span key={tag} style={{
                position: "relative",
                display: "inline-block",
                borderRadius: "100px",
                background: isDark
                  ? "linear-gradient(135deg, rgba(168,130,255,0.5), rgba(100,180,255,0.5))"
                  : "linear-gradient(135deg, rgba(120,80,220,0.45), rgba(60,140,230,0.45))",
                padding: "0.5px",
              }}>
                <span style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: t.bg,
                  color: t.text,
                  letterSpacing: "0.03em",
                }}>{tag}</span>
              </span>
            ) : (
              <Chip key={tag}>{tag}</Chip>
            );
          })}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(26px, 5vw, 36px)",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
          color: t.text,
          margin: "0 0 16px 0",
        }}>
          {post.title}
        </h1>

        {/* Subtitle/excerpt */}
        <p style={{
          fontSize: "clamp(16px, 2.5vw, 18px)",
          lineHeight: 1.6,
          color: t.textMuted,
          margin: "0 0 28px 0",
          fontWeight: 300,
        }}>
          {post.excerpt}
        </p>

        {/* Author row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "28px",
          borderBottom: `1px solid ${t.borderLight}`,
          marginBottom: "40px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: t.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontSize: "14px",
              fontWeight: 700,
              flexShrink: 0,
            }}>
              RG
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: t.text, marginBottom: "6px" }}>Ron</div>
              <div style={{ fontSize: "13px", color: t.textDim }}>
                {post.date} · {post.readTime}
              </div>
            </div>
          </div>
          {/* Top actions: clap + share — right aligned (desktop only, mobile has sticky strip) */}
          {!isMobile && <BlogActions slug={slug} title={post.title} compact />}
        </div>
      </Reveal>

      {/* Cover image */}
      <Reveal delay={0.1}>
        {post.coverImage ? (
          <div
            onClick={() => { setLightboxSrc(post.coverImage); setLightboxAlt(post.title); }}
            style={{
              aspectRatio: "16/9",
              borderRadius: "12px",
              marginBottom: "48px",
              overflow: "hidden",
              border: t === themes.dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              cursor: "zoom-in",
            }}
          >
            <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ) : (
          <div style={{
            aspectRatio: "16/9",
            background: `linear-gradient(135deg, hsl(${post.coverHue}, 35%, ${t === themes.dark ? '16' : '88'}%) 0%, hsl(${post.coverHue + 40}, 30%, ${t === themes.dark ? '10' : '80'}%) 100%)`,
            borderRadius: "12px",
            marginBottom: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px dashed ${t.border}`,
          }}>
            <span style={{ fontSize: "13px", color: t.textDim }}>Cover image placeholder</span>
          </div>
        )}
      </Reveal>

      {/* Article body — Medium-style typography */}
      <Reveal delay={0.15} threshold={0.01}>
        <div style={{ marginBottom: "64px" }}>
          {post.content.map((block, i, arr) => {
            if (block.type === "heading") {
              const isFirst = !arr.slice(0, i).some((b) => b.type === "heading");
              return (
                <div key={i}>
                  {/* Medium-style dot separator between sections */}
                  {!isFirst && (
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "32px 0 36px",
                    }}>
                      <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim }} />
                      <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim }} />
                      <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim }} />
                    </div>
                  )}
                  <h2 style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: t.text,
                    lineHeight: 1.45,
                    letterSpacing: "-0.015em",
                    margin: isFirst ? "40px 0 16px 0" : "0 0 16px 0",
                  }}>
                    {block.text}
                  </h2>
                </div>
              );
            }
            if (block.type === "paragraph") {
              return (
                <p key={i} style={{
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: t.textMuted,
                  margin: "0 0 20px 0",
                  fontWeight: 300,
                  letterSpacing: "0.01em",
                }}>
                  {block.text}
                </p>
              );
            }
            if (block.type === "image") {
              return (
                <div key={i} style={{ margin: "36px 0" }}>
                  {block.src ? (
                    <div
                      onClick={() => { setLightboxSrc(block.src); setLightboxAlt(block.caption || "Blog image"); }}
                      style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: t === themes.dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                        cursor: "zoom-in",
                      }}
                    >
                      <img src={block.src} alt={block.caption || "Blog image"} style={{ width: "100%", display: "block" }} loading="lazy" />
                    </div>
                  ) : (
                    <MediaPlaceholder label={block.caption || "Image"} aspect="16/9" />
                  )}
                  {block.caption && (
                    <p style={{ fontSize: "13px", color: t.textDim, textAlign: "center", marginTop: "10px", fontStyle: "italic" }}>{block.caption}</p>
                  )}
                </div>
              );
            }
            if (block.type === "video") {
              return <BlogVideoEmbed key={i} src={block.src} />;
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} style={{
                  borderLeft: `2px solid ${t.accent}`,
                  paddingLeft: "20px",
                  margin: "28px 0",
                  fontStyle: "italic",
                  fontSize: "16px",
                  lineHeight: 1.7,
                  color: t.text,
                  fontWeight: 400,
                }}>
                  {block.text}
                </blockquote>
              );
            }
            return null;
          })}
        </div>
      </Reveal>

      {/* Article footer: claps/share bar + tags */}
      <div style={{ marginBottom: "64px" }}>
        {/* Claps + Share bar with dividers (desktop only) */}
        {!isMobile && (
          <div style={{
            borderTop: `1px solid ${t.borderLight}`,
            borderBottom: `1px solid ${t.borderLight}`,
            padding: "12px 0",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <ClapButton slug={slug} />
            <ShareButton title={post.title} showLabel />
          </div>
        )}

        {/* Tags */}
        <div style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          ...(isMobile ? { paddingTop: "28px", borderTop: `1px solid ${t.borderLight}` } : {}),
        }}>
          {post.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </div>

      {/* Author card */}
      <Reveal>
        <div style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          padding: "28px",
          borderRadius: "16px",
          background: t.bgCard,
          border: `1px solid ${t.borderLight}`,
          marginBottom: "64px",
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: t.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            fontSize: "18px",
            fontWeight: 700,
            flexShrink: 0,
          }}>
            RG
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: t.text, marginBottom: "4px" }}>Written by Ron</div>
            <div style={{ fontSize: "14px", color: t.textMuted, lineHeight: 1.5 }}>
              Principal Product Designer at NOVA. I write about product design, systems thinking, and building teams.
            </div>
          </div>
        </div>
      </Reveal>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <Reveal>
          <h3 style={{ fontSize: "20px", fontWeight: 500, color: t.text, marginBottom: "24px" }}>More from the blog</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            {relatedPosts.map((rp) => (
              <BlogCard key={rp.slug} post={rp} />
            ))}
          </div>
        </Reveal>
      )}
    </article>

    {/* Mobile sticky strip with claps + share */}
    {isMobile && <BlogStickyStrip slug={slug} title={post.title} />}

    {/* Image lightbox overlay */}
    {lightboxSrc && <ImageLightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc(null)} />}
    </>
  );
}

// ─── CLAP BUTTON (Medium-style with custom icon + Cloudflare KV persistence) ────────────
function ClapButton({ slug, compact = false }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { reduced } = useMotion();
  const accentRgb = isDark ? "232,122,79" : "208,96,58";

  const [count, setCount] = useState(0);
  const [sessionClaps, setSessionClaps] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showTotal, setShowTotal] = useState(false);
  const maxClaps = 50;
  const holdTimerRef = useRef(null);
  const totalTimerRef = useRef(null);
  const particleIdRef = useRef(0);
  const pendingClapsRef = useRef(0);
  const flushTimerRef = useRef(null);

  // Fetch the current clap count from the API on mount
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/claps?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => { if (data.claps != null) setCount(data.claps); })
      .catch(() => {});
  }, [slug]);

  // Flush pending claps to the API (debounced — batches rapid clicks into one request)
  const flushClaps = useCallback(() => {
    const pending = pendingClapsRef.current;
    if (pending <= 0 || !slug) return;
    pendingClapsRef.current = 0;
    fetch("/api/claps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, count: pending }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.claps != null) setCount(data.claps); })
      .catch(() => {});
  }, [slug]);

  const addClap = useCallback(() => {
    if (sessionClaps >= maxClaps) return;
    setCount((c) => c + 1);
    setSessionClaps((s) => s + 1);
    pendingClapsRef.current += 1;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    const id = ++particleIdRef.current;
    const angle = -60 - Math.random() * 60;
    const distance = 40 + Math.random() * 30;
    setParticles((p) => [...p, { id, angle, distance }]);
    setTimeout(() => setParticles((p) => p.filter((pt) => pt.id !== id)), 900);

    setShowTotal(true);
    clearTimeout(totalTimerRef.current);
    totalTimerRef.current = setTimeout(() => setShowTotal(false), 1500);

    // Debounce: flush to API 800ms after the last clap
    clearTimeout(flushTimerRef.current);
    flushTimerRef.current = setTimeout(flushClaps, 800);
  }, [sessionClaps, flushClaps]);

  const startHold = useCallback(() => {
    addClap();
    holdTimerRef.current = setInterval(() => addClap(), 180);
  }, [addClap]);

  const stopHold = useCallback(() => {
    clearInterval(holdTimerRef.current);
    // Flush when user releases hold
    clearTimeout(flushTimerRef.current);
    flushTimerRef.current = setTimeout(flushClaps, 300);
  }, [flushClaps]);

  useEffect(() => {
    return () => {
      clearInterval(holdTimerRef.current);
      clearTimeout(totalTimerRef.current);
      clearTimeout(flushTimerRef.current);
    };
  }, []);

  const iconSize = compact ? 20 : 24;
  const iconColor = count > 0 ? t.accent : t.textDim;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px", position: "relative" }}>
      <div style={{ position: "relative" }}>
        <button
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={(e) => { e.preventDefault(); startHold(); }}
          onTouchEnd={stopHold}
          style={{
            background: isPressed ? `rgba(${accentRgb}, 0.12)` : "transparent",
            border: "none",
            borderRadius: "50%",
            cursor: sessionClaps >= maxClaps ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: reduced ? "none" : "all 0.15s ease",
            transform: isPressed ? "scale(0.88)" : "scale(1)",
            opacity: sessionClaps >= maxClaps ? 0.5 : 1,
            outline: "none",
            padding: compact ? "6px" : "8px",
          }}
        >
          <img
            src={count > 0 ? "/images/claps-filled.svg" : "/images/clap-icon.svg"}
            alt="Clap"
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              filter: count > 0
                ? (isDark
                  ? `invert(62%) sepia(53%) saturate(590%) hue-rotate(338deg) brightness(94%) contrast(91%) drop-shadow(0 0 ${isPressed ? "8px" : "4px"} rgba(232,122,79,${isPressed ? 0.7 : 0.4}))`
                  : `invert(40%) sepia(60%) saturate(600%) hue-rotate(345deg) brightness(85%) contrast(95%) drop-shadow(0 0 ${isPressed ? "8px" : "4px"} rgba(208,96,58,${isPressed ? 0.6 : 0.3}))`)
                : (isDark ? "invert(0.65)" : "invert(0.3)"),
              transition: reduced ? "none" : "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease",
              transform: isPressed ? "scale(1.25) rotate(-12deg)" : "scale(1) rotate(0deg)",
            }}
          />
        </button>

        {/* Floating particles */}
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.distance;
          const ty = Math.sin(rad) * p.distance;
          return (
            <span key={p.id} style={{
              position: "absolute", top: "50%", left: "50%",
              fontSize: "13px", fontWeight: 700, color: t.accent, pointerEvents: "none",
              animation: reduced ? "none" : "clapFloat 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards",
              "--clap-tx": `${tx}px`, "--clap-ty": `${ty}px`,
            }}>+1</span>
          );
        })}

        {/* Total badge */}
        <div style={{
          position: "absolute", top: "-6px", left: "50%",
          transform: `translateX(-50%) translateY(${showTotal ? "-100%" : "-80%"}) scale(${showTotal ? 1 : 0.5})`,
          opacity: showTotal ? 1 : 0,
          transition: reduced ? "none" : "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          background: t.accent, color: "#fff", fontSize: "12px", fontWeight: 600,
          padding: "3px 8px", borderRadius: "100px", whiteSpace: "nowrap", pointerEvents: "none",
        }}>+{sessionClaps}</div>
      </div>

      <span style={{
        fontSize: compact ? "13px" : "14px", fontWeight: 500,
        color: count > 0 ? t.accent : t.textDim,
        minWidth: "12px",
      }}>
        {count > 0 ? count : ""}
      </span>
    </div>
  );
}

// ─── SHARE BUTTON ───────────────────────────────────────────
function ShareButton({ title, url, compact = false, showLabel = false }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { reduced } = useMotion();
  const accentRgb = isDark ? "232,122,79" : "208,96,58";
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    if (isMobile && navigator.share) {
      try { await navigator.share({ title: shareTitle, url: shareUrl }); } catch {}
    } else {
      setShowModal(true);
    }
  };

  const handleCopy = async () => {
    const shareUrl = url || window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <button
        onClick={handleShare}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? `rgba(${accentRgb}, 0.08)` : "transparent",
          border: "none",
          borderRadius: "100px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          outline: "none",
          padding: compact ? "6px 8px" : "8px 10px",
          transition: reduced ? "none" : "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
      >
        <svg
          width={compact ? 18 : 20} height={compact ? 18 : 20}
          viewBox="0 0 24 24" fill="none"
          stroke={hovered ? t.accent : t.textDim}
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: reduced ? "none" : "stroke 0.2s ease, filter 0.2s ease",
            filter: hovered ? `drop-shadow(0 0 4px rgba(${accentRgb}, 0.35))` : "none",
          }}
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        {showLabel && (
          <span style={{
            fontSize: "13px", fontWeight: 500,
            color: hovered ? t.accent : t.textDim,
            transition: reduced ? "none" : "color 0.2s ease",
          }}>Share</span>
        )}
      </button>

      {/* Share modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.35)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: reduced ? "none" : "imgOverlayIn 0.25s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDark ? "rgba(28,28,28,0.95)" : "rgba(255,255,255,0.97)",
              borderRadius: "20px",
              padding: "0",
              width: "min(420px, calc(100% - 48px))",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
              boxShadow: isDark
                ? "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)"
                : "0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03)",
              overflow: "hidden",
              animation: reduced ? "none" : "imgScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "20px 22px 16px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
              display: "flex", alignItems: "center", gap: "14px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: `rgba(${accentRgb}, 0.1)`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: t.text, lineHeight: 1.3 }}>Share this article</div>
                <div style={{ fontSize: "12px", color: t.textDim, marginTop: "6px" }}>Copy the link or share directly</div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  border: "none", cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: t.textDim, fontSize: "16px", lineHeight: 1,
                  transition: reduced ? "none" : "background 0.15s ease",
                }}
                onMouseEnter={(e) => e.target.style.background = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}
                onMouseLeave={(e) => e.target.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}
              >×</button>
            </div>

            {/* Body */}
            <div style={{
              padding: "16px 22px 20px",
              background: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.03)",
            }}>
              {/* URL field + copy */}
              <div style={{
                display: "flex", gap: "10px", alignItems: "center",
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)",
                borderRadius: "12px", padding: "10px 12px 10px 16px",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.textDim} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span style={{
                  flex: 1, fontSize: "13px", color: t.textMuted,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {url || window.location.href}
                </span>
                <button
                  onClick={handleCopy}
                  onMouseEnter={(e) => {
                    if (!copied) {
                      e.currentTarget.style.background = t.accent;
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = t.accent;
                      e.currentTarget.style.transform = "scale(1.06)";
                      e.currentTarget.style.boxShadow = `0 4px 16px rgba(${accentRgb},0.35)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copied) {
                      e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
                      e.currentTarget.style.color = t.text;
                      e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                  style={{
                    background: copied
                      ? t.accent
                      : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"),
                    border: `1px solid ${copied ? t.accent : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)")}`,
                    borderRadius: "8px", padding: "7px 14px",
                    cursor: "pointer", fontSize: "12px", fontWeight: 600,
                    color: copied ? "#fff" : t.text, whiteSpace: "nowrap",
                    transition: reduced ? "none" : "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    display: "flex", alignItems: "center", gap: "5px",
                    transform: "scale(1)",
                  }}
                >
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Copied
                    </>
                  ) : "Copy link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── BLOG ACTIONS BAR (clap + share inline) ─────────────────
function BlogActions({ slug, title, compact = false, showShareLabel = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? "32px" : "36px" }}>
      <ClapButton slug={slug} compact={compact} />
      <ShareButton title={title} compact={compact} showLabel={showShareLabel} />
    </div>
  );
}

// ─── MOBILE BLOG STICKY STRIP ───────────────────────────────
function BlogStickyStrip({ slug, title }) {
  const t = useTheme();
  const isDark = t === themes.dark;
  const { reduced } = useMotion();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nearEnd = y >= maxScroll - 200;

      if (nearEnd) {
        setVisible(true);
      } else if (y > lastScrollY.current + 5) {
        setVisible(false);
      } else if (y < lastScrollY.current - 5) {
        setVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      position: "fixed",
      bottom: visible ? "0px" : "-80px",
      left: 0, right: 0,
      zIndex: 900,
      padding: "10px 20px",
      paddingBottom: "max(32px, env(safe-area-inset-bottom))",
      background: t.bg,
      borderTop: `1px solid ${t.borderLight}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: reduced ? "none" : "bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
    }}>
      <ClapButton slug={slug} compact />
      <ShareButton title={title} compact showLabel />
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer() {
  const t = useTheme();
  const { navigate } = useRoute();

  const links = [
    { label: "Work", to: "/work" },
    { label: "UI Showcase", to: "/ui" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer
      style={{
        background: t.footerBg,
        padding: "48px clamp(20px, 5vw, 80px)",
        borderTop: `1px solid ${t.borderLight}`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <span style={{ fontSize: "13px", color: t.textDim }}>
          © {new Date().getFullYear()} Rounak Ghosh. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: window.innerWidth <= 768 ? "16px" : "24px", flexWrap: "wrap" }}>
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => navigate(l.to)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                color: t.textDim,
                fontFamily: "'TTCommonsPro', 'Inter', system-ui, sans-serif",
                padding: "8px 0",
                margin: "-8px 0",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════
function App() {
  const prefersDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [isDark, setIsDark] = useState(true);
  const [motionReduced, setMotionReduced] = useState(prefersReduced);

  const theme = isDark ? themes.dark : themes.light;

  // Global styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

      * { margin: 0; padding: 0; box-sizing: border-box; }

      html {
        scroll-behavior: ${motionReduced ? "auto" : "smooth"};
      }

      body {
        font-family: 'TTCommonsPro', 'Inter', system-ui, -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
      }

      ::selection {
        background: ${isDark ? "#E87A4F40" : "#D0603A30"};
        color: ${isDark ? "#F2F2F0" : "#1A1A1A"};
      }

      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: ${isDark ? "#333" : "#CCC"};
        border-radius: 3px;
      }

      a { color: inherit; }
      a:hover { opacity: 0.85; }

      @keyframes cardBorderSpin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      @keyframes badgeTextSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes badgeShake {
        0%, 100% { transform: rotate(0deg) scale(1); }
        15% { transform: rotate(-12deg) scale(1.1); }
        30% { transform: rotate(10deg) scale(1.05); }
        45% { transform: rotate(-8deg) scale(1.08); }
        60% { transform: rotate(6deg) scale(1.03); }
        75% { transform: rotate(-3deg) scale(1.01); }
      }

      @keyframes menuOrbFloat {
        0% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(8px, -12px) scale(1.05); }
        100% { transform: translate(-6px, 8px) scale(0.97); }
      }

      @keyframes ctaMobileBreathing {
        0%, 100% { opacity: 0.35; filter: blur(8px); }
        50% { opacity: 0.75; filter: blur(12px); }
      }

      @keyframes fistBumpIn {
        0% { transform: scale(0.6) rotate(-10deg); opacity: 0.4; }
        40% { transform: scale(1.12) rotate(3deg); opacity: 1; }
        60% { transform: scale(0.95) rotate(-1deg); }
        100% { transform: scale(1) rotate(0deg); }
      }

      @keyframes highFiveSlap {
        0% { transform: scale(1) rotate(0deg) translateY(0); }
        30% { transform: scale(1.4) rotate(-10deg) translateY(-8px); }
        50% { transform: scale(0.85) rotate(4deg) translateY(2px); }
        70% { transform: scale(1.15) rotate(-2deg) translateY(-3px); }
        100% { transform: scale(1) rotate(0deg) translateY(0); }
      }

      @keyframes highFiveBounce {
        0%, 100% { transform: scale(1) translateY(0); }
        40% { transform: scale(1.05) translateY(-3px); }
        60% { transform: scale(0.97) translateY(1px); }
      }

      @keyframes handWave {
        0% { transform: rotate(0deg); }
        10% { transform: rotate(14deg); }
        20% { transform: rotate(-8deg); }
        30% { transform: rotate(14deg); }
        40% { transform: rotate(-4deg); }
        50% { transform: rotate(10deg); }
        60% { transform: rotate(0deg); }
        100% { transform: rotate(0deg); }
      }

      @keyframes badgeFlashIn {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes badgeFlashOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes badgeFlashSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes ctaGradientRotate {
        0% { transform: translateY(-50%) rotate(0deg); }
        100% { transform: translateY(-50%) rotate(360deg); }
      }
      @keyframes ctaTextSlideOut {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100%); opacity: 0; }
      }
      @keyframes ctaTextSlideIn {
        0% { transform: translateY(100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }

      @keyframes clapFloat {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--clap-tx)), calc(-50% + var(--clap-ty))) scale(0.6); opacity: 0; }
      }

      @keyframes imgOverlayIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes imgScaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      /* Gradient orb float animations (mobile + fallback) */
      @keyframes orbFloat1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -40px) scale(1.05); }
        66% { transform: translate(-20px, 20px) scale(0.95); }
      }
      @keyframes orbFloat2 {
        0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        25% { transform: translate(-25px, 30px) scale(1.08) rotate(5deg); }
        50% { transform: translate(20px, -15px) scale(0.92) rotate(-3deg); }
        75% { transform: translate(10px, 25px) scale(1.03) rotate(2deg); }
      }
      @keyframes orbFloat3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        40% { transform: translate(35px, 20px) scale(1.1); }
        70% { transform: translate(-15px, -30px) scale(0.9); }
      }

      @media (prefers-reduced-motion: reduce) {
        .gradient-orb-container * {
          animation: none !important;
        }
      }

      @media (max-width: 768px) {
        .nav-links-desktop { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        .case-study-toc { display: none !important; }
      }
      @media (min-width: 769px) {
        .mobile-menu-btn { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [isDark, motionReduced]);

  // Page router
  const { path } = useRoute();

  let page;
  if (path === "/" || path === "") {
    page = <Home />;
  } else if (path === "/work") {
    page = <WorkIndex />;
  } else if (path.startsWith("/work/")) {
    page = <CaseStudy slug={path.replace("/work/", "")} />;
  } else if (path === "/ui") {
    page = <UIShowcase />;
  } else if (path === "/about") {
    page = <About />;
  } else if (path === "/resume") {
    page = <Resume />;
  } else if (path === "/blog") {
    page = <BlogIndex />;
  } else if (path.startsWith("/blog/")) {
    page = <BlogPost slug={path.replace("/blog/", "")} />;
  } else if (path === "/contact") {
    page = <Contact />;
  } else {
    page = <Home />;
  }

  return (
    <ThemeContext.Provider value={theme}>
      <MotionContext.Provider value={{ reduced: motionReduced }}>
        <div style={{ background: theme.bg, minHeight: "100vh", transition: motionReduced ? "none" : "background 0.4s ease", color: theme.text }}>
          <Nav
            onToggleTheme={() => setIsDark(!isDark)}
            isDark={isDark}
            onToggleMotion={() => setMotionReduced(!motionReduced)}
            motionReduced={motionReduced}
          />
          {page}
          <Footer />
        </div>
      </MotionContext.Provider>
    </ThemeContext.Provider>
  );
}

// Wrap default export with Router
const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
