"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import {
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Network,
  Plus,
  Send,
  Share2,
  Sparkles,
} from "lucide-react";

type PlatformResult = {
  platform: string;
  primaryPost: string;
  alternates: string[];
  hashtags: string[];
  mediaIdeas: string[];
  callToAction: string;
  recommendedSchedule: string;
  automationPrompts: string[];
};

type AgentResponse = {
  strategyPillars: {
    title: string;
    bullets: string[];
  }[];
  distributionPlan: {
    frequency: string;
    bestTimes: string[];
    cadenceNotes: string;
  };
  socialCopy: PlatformResult[];
  metrics: {
    northStar: string;
    supporting: string[];
    automationHooks: string[];
  };
};

const PLATFORMS = [
  { id: "youtube", label: "YouTube" },
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "pinterest", label: "Pinterest" },
  { id: "twitter", label: "Twitter / X" },
  { id: "linkedin", label: "LinkedIn" },
];

export default function Home() {
  const [campaignName, setCampaignName] = useState("Product launch spotlight");
  const [product, setProduct] = useState("AI-powered marketing co-pilot");
  const [audience, setAudience] = useState(
    "growth marketers at venture-backed consumer startups",
  );
  const [brandVoice, setBrandVoice] = useState(
    "confident, data-backed and energetic with crisp CTA",
  );
  const [goal, setGoal] = useState(
    "drive demo sign-ups and build cross-network awareness",
  );
  const [keywords, setKeywords] = useState("marketing automation, omni-channel");
  const [offer, setOffer] = useState("14-day guided activation with strategist");
  const [cta, setCta] = useState("Book a 20-minute strategy session");
  const [distributionNotes, setDistributionNotes] = useState(
    "Prioritize short-form video, remix for Pinterest & Twitter threads.",
  );
  const [knowledgeDraft, setKnowledgeDraft] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>([
    "Brand voice avoids buzzwords like 'synergy' or 'disruption'",
    "Highlight real customer outcomes with specific metrics",
  ]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>(
    () =>
      PLATFORMS.reduce(
        (acc, platform) => {
          acc[platform.id] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
  );
  const [isPending, startTransition] = useTransition();
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platformsToUse = useMemo(
    () =>
      PLATFORMS.filter((platform) => selectedPlatforms[platform.id]).map(
        (platform) => platform.label,
      ),
    [selectedPlatforms],
  );

  const handleKnowledgeAdd = () => {
    if (!knowledgeDraft.trim()) {
      return;
    }
    setKnowledgeBase((prev) => [...prev, knowledgeDraft.trim()]);
    setKnowledgeDraft("");
  };

  const handleKnowledgeRemove = (index: number) => {
    setKnowledgeBase((prev) => prev.filter((_, idx) => idx !== index));
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!platformsToUse.length) {
      setError("Select at least one platform to deploy the agent.");
      return;
    }

    const payload = {
      campaignName,
      product,
      audience,
      brandVoice,
      goal,
      keywords,
      offer,
      callToAction: cta,
      distributionNotes,
      knowledgeBase,
      platforms: platformsToUse,
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Unable to synthesise the campaign blueprint.");
        }

        const data = (await response.json()) as AgentResponse;
        setAgentResponse(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unknown error");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-12 lg:pt-24">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-sky-200 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Omni-channel Social Agent
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Deploy an AI operator that orchestrates campaigns across every major
              social platform.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              Drop in your campaign context and the agent will draft tailored assets,
              cadence recommendations, and automation hooks for YouTube, Facebook,
              Pinterest, Twitter, and beyond.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 lg:max-w-sm">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Brain className="h-5 w-5 text-sky-300" />
              Autonomous strategy generation
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Share2 className="h-5 w-5 text-sky-300" />
              Platform-aware prompts & formats
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Network className="h-5 w-5 text-sky-300" />
              Centralized scheduling blueprint
            </div>
          </div>
        </header>

        <section className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,_500px)_minmax(0,_1fr)]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/20 backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Campaign control tower
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  The agent fuses campaign context, brand guardrails, and platform
                  nuances to craft a unified plan.
                </p>
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">
                Campaign codename
              </span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                value={campaignName}
                onChange={(event) => setCampaignName(event.target.value)}
                placeholder="Summer launch blitz"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">Hero product</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                placeholder="Describe the product or storyline"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">
                Target audience
              </span>
              <textarea
                className="min-h-[80px] rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                placeholder="Tell the agent who we need to win over"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">Brand voice</span>
              <textarea
                className="min-h-[80px] rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                value={brandVoice}
                onChange={(event) => setBrandVoice(event.target.value)}
                placeholder="Friendly, witty, bold, premium..."
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">
                Primary campaign goal
              </span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                placeholder="Convert free trial users, boost retention..."
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-200">
                  Key phrases & proof
                </span>
                <textarea
                  className="min-h-[80px] rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                  value={keywords}
                  onChange={(event) => setKeywords(event.target.value)}
                  placeholder="Add keywords, stats or proof points"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-200">Offer</span>
                <textarea
                  className="min-h-[80px] rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                  value={offer}
                  onChange={(event) => setOffer(event.target.value)}
                  placeholder="Bundles, discounts, free upgrades..."
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">
                Call to action
              </span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                value={cta}
                onChange={(event) => setCta(event.target.value)}
                placeholder="Claim your spot, apply now..."
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">
                Distribution notes
              </span>
              <textarea
                className="min-h-[80px] rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                value={distributionNotes}
                onChange={(event) => setDistributionNotes(event.target.value)}
                placeholder="Platform priorities, cadence expectations, cross-post rules..."
              />
            </label>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-sky-300" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Knowledge base
                    </h3>
                    <p className="text-xs text-slate-400">
                      Give the agent guardrails, raw notes, or proof points.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                    value={knowledgeDraft}
                    onChange={(event) => setKnowledgeDraft(event.target.value)}
                    placeholder="Add competitor insights, legal lines, customer stories..."
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
                    onClick={handleKnowledgeAdd}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {knowledgeBase.map((note, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleKnowledgeRemove(index)}
                      className="group inline-flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-200 transition hover:border-red-400/80 hover:text-red-200"
                    >
                      <span className="mt-[2px] block rounded-full bg-sky-400/80 px-1.5 py-1 text-[10px] font-semibold uppercase text-slate-950">
                        KB
                      </span>
                      <span className="flex-1">{note}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-red-200">
                        Remove
                      </span>
                    </button>
                  ))}
                  {!knowledgeBase.length && (
                    <p className="text-xs text-slate-500">
                      No guardrails yet. Feed the agent with at least two notes for best
                      results.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <span className="text-sm font-semibold text-white">
                Networks to activate
              </span>
              <p className="mt-1 text-xs text-slate-400">
                Toggle the surfaces the agent should plan and script for.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                      selectedPlatforms[platform.id]
                        ? "border-sky-400 bg-sky-500/20 text-sky-100"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-slate-500/50"
                    }`}
                  >
                    {platform.label}
                    {selectedPlatforms[platform.id] && (
                      <CheckCircle2 className="h-4 w-4 text-sky-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/70 bg-red-500/20 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:from-sky-400 hover:via-cyan-300 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Synchronising networks
                </>
              ) : (
                <>
                  Deploy agent
                  <Send className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>
          </form>

          <aside className="flex flex-col gap-6">
            {!agentResponse && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
                <Sparkles className="h-12 w-12 text-sky-400" />
                <p className="mt-4 max-w-sm text-base leading-relaxed">
                  Fill in your campaign inputs and deploy the agent to generate platform
                  scripts, pacing guidance, and automation prompts.
                </p>
              </div>
            )}

            {agentResponse && (
              <div className="flex flex-col gap-6">
                <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-inner shadow-black/30">
                  <h3 className="text-lg font-semibold text-white">
                    Strategic pillars
                  </h3>
                  <div className="mt-4 grid gap-4">
                    {agentResponse.strategyPillars.map((pillar) => (
                      <div
                        key={pillar.title}
                        className="rounded-2xl border border-white/10 bg-black/40 p-4"
                      >
                        <p className="text-sm font-semibold text-sky-200">
                          {pillar.title}
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-slate-300">
                          {pillar.bullets.map((bullet, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-sky-400" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-inner shadow-black/30">
                  <h3 className="text-lg font-semibold text-white">
                    Distribution cadence
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {agentResponse.distributionPlan.cadenceNotes}
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-slate-300">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Frequency
                      </p>
                      <p className="mt-1 font-semibold text-white">
                        {agentResponse.distributionPlan.frequency}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-slate-300">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Best release windows
                      </p>
                      <ul className="mt-1 space-y-1">
                        {agentResponse.distributionPlan.bestTimes.map((slot) => (
                          <li key={slot}>{slot}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-inner shadow-black/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Platform playbooks
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-sky-300" />
                  </div>
                  <div className="mt-6 space-y-6">
                    {agentResponse.socialCopy.map((platform) => (
                      <article
                        key={platform.platform}
                        className="rounded-2xl border border-white/10 bg-black/40 p-5"
                      >
                        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="text-base font-semibold text-sky-200">
                            {platform.platform}
                          </h4>
                          <span className="text-xs text-slate-400">
                            {platform.recommendedSchedule}
                          </span>
                        </header>
                        <p className="mt-3 whitespace-pre-line text-sm text-slate-200">
                          {platform.primaryPost}
                        </p>
                        {platform.alternates.length > 0 && (
                          <div className="mt-4 space-y-2 text-sm text-slate-300">
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                              Backup hooks
                            </p>
                            {platform.alternates.map((alt, index) => (
                              <p key={index} className="rounded-xl bg-white/5 px-3 py-2">
                                {alt}
                              </p>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                          {platform.hashtags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-sky-500/20 px-3 py-1 font-medium text-sky-100"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-2">
                          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">
                              Media ideas
                            </p>
                            <ul className="mt-1 space-y-1">
                              {platform.mediaIdeas.map((idea, index) => (
                                <li key={index} className="flex gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-violet-400" />
                                  <span>{idea}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">
                              Automation prompts
                            </p>
                            <ul className="mt-1 space-y-1">
                              {platform.automationPrompts.map((prompt, index) => (
                                <li key={index}>{prompt}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <p className="mt-3 text-sm font-medium text-white">
                          CTA: {platform.callToAction}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-inner shadow-black/30">
                  <h3 className="text-lg font-semibold text-white">Measurement OS</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    North-star alignment and automation hand-offs the growth team can
                    wire into dashboards.
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        North-star metric
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {agentResponse.metrics.northStar}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Supporting metrics
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-300">
                        {agentResponse.metrics.supporting.map((metric) => (
                          <li key={metric}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Automation hooks
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-300">
                      {agentResponse.metrics.automationHooks.map((hook) => (
                        <li key={hook}>{hook}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
