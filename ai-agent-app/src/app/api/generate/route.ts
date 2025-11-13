import { NextResponse } from "next/server";

type RequestPayload = {
  campaignName: string;
  product: string;
  audience: string;
  brandVoice: string;
  goal: string;
  keywords: string;
  offer: string;
  callToAction: string;
  distributionNotes: string;
  knowledgeBase: string[];
  platforms: string[];
};

type PlatformConfig = {
  hooks: string[];
  cadence: string;
  mediaAngles: string[];
  automation: string[];
  hashtagLimit: number;
  charLimit?: number;
  tone: string;
};

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  YouTube: {
    hooks: [
      "🚀 {campaignName}: Watch how {product} rewrites the playbook",
      "Inside the growth lab: {product} in action for {audience}",
      "Before/after breakdown: scaling with {product}",
    ],
    cadence: "Weekly hero drop + micro recaps",
    mediaAngles: [
      "3-minute product walkthrough with live metrics overlay",
      "Founder commentary + punchy loom-style screen capture",
      "Customer spotlight interview cut into chapters",
    ],
    automation: [
      "Trigger clip repurposing tasks when retention >60%",
      "Auto-generate video description chapters",
      "Pipe comment questions into support queue",
    ],
    hashtagLimit: 10,
    tone: "Narrative + educational",
  },
  Facebook: {
    hooks: [
      "Community spotlight: {audience} teams winning with {product}",
      "From manual chaos to automated clarity with {campaignName}",
      "The growth squad playbook powered by {product}",
    ],
    cadence: "3x weekly deep dives + retargeting boosts",
    mediaAngles: [
      "Carousel storytelling with metric overlays",
      "UGC-style clip showcasing workflow",
      "Pinned community poll teeing up next launch",
    ],
    automation: [
      "Auto-boost high-performing posts to saved audiences",
      "Sync lead form completions to CRM",
      "Retarget viewers with offer countdown",
    ],
    hashtagLimit: 8,
    tone: "Community-forward and proof-rich",
  },
  Instagram: {
    hooks: [
      "Swipe to see the {campaignName} pipeline glow-up",
      "POV: your {audience} team after adopting {product}",
      "{product} x {audience}: momentum in motion",
    ],
    cadence: "Daily stories + 3 reels per week",
    mediaAngles: [
      "Vertical reel with kinetic typography spotlighting metrics",
      "Before/after carousel with bold data cards",
      "Story series with quick wins + poll sticker",
    ],
    automation: [
      "Archive top story into highlight automatically",
      "Export reel comments into social CRM",
      "Trigger DM nurture sequence on story reply",
    ],
    hashtagLimit: 12,
    tone: "Visual, energetic, momentum-driven",
  },
  TikTok: {
    hooks: [
      "POV: You're the {audience} hero using {product}",
      "3 red flags your stack is missing {campaignName}",
      "Watch {product} auto-run your launch in 30s",
    ],
    cadence: "Daily short-form loops",
    mediaAngles: [
      "Pattern interrupt skit with on-screen captions",
      "Split screen reacting to traditional workflow vs agent",
      "Countdown hack showcasing new automation",
    ],
    automation: [
      "Surface top comments for quick-response duets",
      "Flag clips hitting 65% watch-through for paid amplification",
      "Log trending sounds used >2x",
    ],
    hashtagLimit: 8,
    tone: "Fast, punchy, culture-tuned",
  },
  Pinterest: {
    hooks: [
      "Blueprint: {campaignName} funnel board",
      "Pin-worthy workflow map for {audience}",
      "{product} launch checklist you can repin instantly",
    ],
    cadence: "5 evergreen pins per week",
    mediaAngles: [
      "Infographic showing automated journey stages",
      "Static quote tiles with metric callouts",
      "Tall carousel guiding through feature stack",
    ],
    automation: [
      "Auto-pin reel poster frames as idea pins",
      "Sync clicks into lifecycle email sequence",
      "Label top saves to fuel blog content",
    ],
    hashtagLimit: 10,
    tone: "Inspiration meets implementation",
  },
  "Twitter / X": {
    hooks: [
      "Thread: how {campaignName} creates unfair velocity for {audience}",
      "If {audience} still launch manually, show them {product}",
      "{goal}? Here's the 4-step automation sprint.",
    ],
    cadence: "Daily thread or hot take + RT automation",
    mediaAngles: [
      "2-min screen recording snippet pinned atop thread",
      "Quote-tweet customer metric screenshots",
      "Poll contrasting old vs new workflow",
    ],
    automation: [
      "Auto-schedule follow-up replies with CTAs",
      "Route DMs containing 'demo' to sales inbox",
      "Bookmark competitive mentions for response",
    ],
    hashtagLimit: 4,
    charLimit: 275,
    tone: "Insightful, concise operator talk",
  },
  LinkedIn: {
    hooks: [
      "Playbook drop: {audience} teams scaling with {product}",
      "Operational excellence memo: {campaignName}",
      "We rebuilt launch orchestration so {audience} can focus on strategy",
    ],
    cadence: "3 narrative posts + 1 carousel weekly",
    mediaAngles: [
      "Slide deck showing leadership metrics",
      "Executive POV video summarising wins",
      "Customer quote artboard with branded gradients",
    ],
    automation: [
      "Auto-notify revenue ops when senior titles engage",
      "Pipe post saves into rerun queue",
      "Surface comment questions for SME responses",
    ],
    hashtagLimit: 6,
    tone: "Operator-grade, leadership-ready",
  },
};

const fallbackConfig: PlatformConfig = {
  hooks: [
    "{campaignName} is live across the stack",
    "See how {product} unlocks compounding growth",
    "Automate toward {goal} faster",
  ],
  cadence: "Steady weekly pulse",
  mediaAngles: [
    "Showcase workflow before/after",
    "Highlight customer quote",
    "Tease offer with countdown",
  ],
  automation: [
    "Log comments with buying signals",
    "Track CTA clicks per surface",
    "Alert team when sentiment dips",
  ],
  hashtagLimit: 6,
  tone: "Confident and clear",
};

const sentenceCase = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const cleanKeywords = (keywords: string) => {
  return keywords
    .split(/[\n,#]/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 1)
    .map((keyword) => keyword.replace(/\s+/g, ""));
};

const unique = <T,>(values: T[]) => Array.from(new Set(values));

const clamp = (value: string, limit?: number) => {
  if (!limit || value.length <= limit) {
    return value;
  }
  return `${value.slice(0, limit - 1).trim()}…`;
};

const buildHashtags = (platform: string, keywords: string, limit: number) => {
  const baseTags = cleanKeywords(keywords);
  const evergreenTags = [
    "AIAgent",
    "GrowthOps",
    "Automation",
    "MarketingPlaybook",
    "LaunchDay",
  ];

  const curated = unique([...baseTags, ...evergreenTags]);
  const finalLimit = platform === "Twitter / X" ? Math.min(limit, 4) : limit;

  return curated.slice(0, finalLimit);
};

const selectFromList = (options: string[], seed: number, replacements: Record<string, string>) => {
  const template = options[seed % options.length];
  return template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? "");
};

const composePrimary = ({
  hook,
  product,
  goal,
  audience,
  brandVoice,
  offer,
  knowledge,
  cta,
  platformTone,
}: {
  hook: string;
  product: string;
  goal: string;
  audience: string;
  brandVoice: string;
  offer: string;
  knowledge: string[];
  cta: string;
  platformTone: string;
}) => {
  const proofLine =
    knowledge.length > 0
      ? `Proof: ${sentenceCase(knowledge[0])}.`
      : `Proof: highlight a real team hitting ${goal}.`;
  const backupProof =
    knowledge.length > 1 ? `Signal boost: ${sentenceCase(knowledge[1])}.` : "";
  const voiceLine = `Voice: ${platformTone}. Anchor tone in ${brandVoice}.`;
  const offerLine = offer ? `Offer: ${sentenceCase(offer)}.` : "";

  return `${hook}

Why it matters: ${sentenceCase(product)} helps ${audience} accelerate ${goal}.
${proofLine}
${backupProof}
${offerLine}
${voiceLine}

CTA → ${sentenceCase(cta)}`;
};

const buildAlternates = (hooks: string[], startIndex: number, replacements: Record<string, string>) => {
  if (hooks.length <= 1) {
    return [];
  }
  const alternates: string[] = [];
  for (let i = 1; i < Math.min(hooks.length, 3); i++) {
    const hook = selectFromList(hooks, startIndex + i, replacements);
    alternates.push(hook);
  }
  return alternates;
};

const craftPlatformPlay = (
  platform: string,
  config: PlatformConfig,
  index: number,
  context: {
    campaignName: string;
    product: string;
    goal: string;
    audience: string;
    brandVoice: string;
    offer: string;
    knowledgeBase: string[];
    callToAction: string;
    distributionNotes: string;
    keywords: string;
  },
) => {
  const replacements = {
    campaignName: context.campaignName,
    product: context.product,
    goal: context.goal,
    audience: context.audience,
  };

  const hook = selectFromList(config.hooks, index, replacements);
  const primary = composePrimary({
    hook,
    product: context.product,
    goal: context.goal,
    audience: context.audience,
    brandVoice: context.brandVoice,
    offer: context.offer,
    knowledge: context.knowledgeBase,
    cta: context.callToAction,
    platformTone: config.tone,
  });

  const alternates = buildAlternates(config.hooks, index, replacements);

  const hashtags = buildHashtags(platform, context.keywords ?? "", config.hashtagLimit);

  const mediaIdeas = config.mediaAngles.map((angle, ideaIndex) =>
    selectFromList([angle], ideaIndex + index, replacements),
  );

  const automationPrompts = config.automation.map((prompt, automationIndex) =>
    `${selectFromList([prompt], automationIndex + index, replacements)} ${context.distributionNotes ? `| Context: ${context.distributionNotes}` : ""}`.trim(),
  );

  return {
    platform,
    primaryPost: clamp(primary, config.charLimit),
    alternates,
    hashtags,
    mediaIdeas,
    callToAction: sentenceCase(context.callToAction),
    recommendedSchedule: config.cadence,
    automationPrompts,
  };
};

const buildStrategyPillars = (payload: RequestPayload) => {
  const topKnowledge = payload.knowledgeBase.slice(0, 3).map(sentenceCase);

  return [
    {
      title: "Momentum narrative",
      bullets: [
        `Translate ${payload.product} into sharp, workflow-specific transformations for ${payload.audience}.`,
        `Lead with the campaign goal: ${payload.goal}.`,
        topKnowledge[0] ?? "Add one concrete stat or testimonial into every hero asset.",
      ],
    },
    {
      title: "Proof > promises",
      bullets: [
        topKnowledge[1] ?? "Capture real metrics before/after the agent intervention.",
        `Show the offer early: ${payload.offer || "reinforce any fast-track incentive."}`,
        "Pair every hero asset with a supporting micro clip or carousel.",
      ],
    },
    {
      title: "Automation feedback loop",
      bullets: [
        "Log intent signals (comments, DMs, saves) into CRM for nurture.",
        topKnowledge[2] ?? "Spin up weekly synthesis thread for learnings across platforms.",
        `Let the agent auto-produce remix prompts informed by ${payload.distributionNotes || "distribution priorities"}.`,
      ],
    },
  ];
};

const buildDistributionPlan = (payload: RequestPayload) => {
  const platformCount = payload.platforms.length;
  const baseFrequency =
    platformCount >= 5 ? "Daily snackable + 2 weekly hero drops" : "3x weekly cross-channel pulses";
  const bestTimes = [
    "Mon 09:00 — awareness spark",
    "Wed 12:00 — proof-focused push",
    "Thu 17:00 — conversion CTA",
  ];

  return {
    frequency: baseFrequency,
    bestTimes,
    cadenceNotes: payload.distributionNotes
      ? sentenceCase(payload.distributionNotes)
      : "Default to morning hero uploads and afternoon remixes, monitor engagement windows to adapt.",
  };
};

const buildMetrics = (payload: RequestPayload) => {
  return {
    northStar: `Qualified ${payload.goal} conversions attributable to social touchpoints.`,
    supporting: [
      "Watch-through rate on hero video assets",
      "Save/share rate for carousel or idea pins",
      "Click-to-demo ratio on CTA surfaces",
    ],
    automationHooks: [
      "Send Slack alert when a post hits 4%+ CTR within first hour.",
      "Trigger nurture email when a prospect watches >70% of YouTube hero video.",
      `Autogenerate competitor response thread when ${payload.product} is mentioned.`,
    ],
  };
};

export async function POST(request: Request) {
  let payload: RequestPayload;

  try {
    payload = (await request.json()) as RequestPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      {
        status: 400,
      },
    );
  }

  if (!payload.platforms || payload.platforms.length === 0) {
    return NextResponse.json(
      { error: "At least one platform must be selected." },
      { status: 422 },
    );
  }

  const context = {
    campaignName: payload.campaignName,
    product: payload.product,
    goal: payload.goal,
    audience: payload.audience,
    brandVoice: payload.brandVoice,
    offer: payload.offer,
    knowledgeBase: payload.knowledgeBase,
    callToAction: payload.callToAction,
    distributionNotes: payload.distributionNotes,
    keywords: payload.keywords,
  };

  const socialCopy = payload.platforms.map((platform, index) => {
    const config = PLATFORM_CONFIGS[platform] ?? fallbackConfig;
    return craftPlatformPlay(platform, config, index, context);
  });

  return NextResponse.json({
    strategyPillars: buildStrategyPillars(payload),
    distributionPlan: buildDistributionPlan(payload),
    socialCopy,
    metrics: buildMetrics(payload),
  });
}
