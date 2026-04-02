import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 90;

const RAPIDAPI_KEY = "5c7ce818cfmsh7e1944115367b76p17808fjsn0956139896ed";
const EXA_API_KEY = "c56f0b0f-ac98-4613-9cf9-7366f39bda75";

/* ─── Helper: safe JSON fetch ─── */
async function safeFetch(url: string, opts: RequestInit, label: string, timeoutMs = 15000) {
  try {
    const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return { error: `${label}: HTTP ${res.status}` };
    return await res.json();
  } catch (e: any) {
    return { error: `${label}: ${e.message || "failed"}` };
  }
}

/* ─── Google Search ─── */
async function searchGoogle(query: string) {
  return safeFetch(
    `https://google-search74.p.rapidapi.com/?query=${encodeURIComponent(query)}&limit=10&related_keywords=true`,
    {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "google-search74.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    },
    "Google"
  );
}

/* ─── Facebook Pages ─── */
async function searchFacebook(query: string) {
  return safeFetch(
    `https://facebook-scraper3.p.rapidapi.com/search/pages?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "facebook-scraper3.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    },
    "Facebook"
  );
}

/* ─── Twitter / X Search ─── */
async function searchTwitter(query: string) {
  return safeFetch(
    `https://twitter241.p.rapidapi.com/search-v2?type=Top&count=10&query=${encodeURIComponent(query)}`,
    {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "twitter241.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    },
    "Twitter"
  );
}

/* ─── Exa.ai Deep Search ─── */
async function searchExa(query: string) {
  return safeFetch(
    "https://api.exa.ai/search",
    {
      method: "POST",
      headers: {
        "x-api-key": EXA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        numResults: 8,
        useAutoprompt: true,
        type: "auto",
      }),
    },
    "Exa"
  );
}

/* ─── GPT-4o Analysis ─── */
async function generateReport(businessName: string, data: Record<string, any>) {
  const prompt = `You are a senior business intelligence analyst working for 6POINT Solutions, a full-service web design agency. You are analyzing "${businessName}" for a potential client acquisition pitch.

Produce an extremely thorough business report using the research data below. Format with markdown. Use ## for section headings. Use **bold** for emphasis. Use - for bullet points. Include [Source](url) links when you reference specific URLs from the research data.

SECTIONS (use these exact headings):

## Executive Summary
3-5 sentences. Who they are, what they do, market position, and your overall assessment.

## Digital Footprint Analysis
Deep dive into their Google search presence. How visible are they? What appears when you search them? Are they ranking for the right keywords? Reference specific search results and URLs found, using [link text](url) format. Comment on their website if one was provided.

## Website Assessment
If a website was provided, analyze what could be improved: speed, design, calls-to-action, SEO meta data, mobile optimization, conversion funnels. Give 5-8 specific improvement suggestions with rationale. If no website was provided, note what they're missing by not having a strong web presence.

## Social Media Presence
Analyze Facebook page data (followers, engagement, content quality, posting frequency). Analyze Twitter/X presence (activity, engagement, voice, relevance). Be specific with numbers from the data. Rate each platform.

## Competitive Intelligence
Who are they competing against? What are competitors doing better? Where does this business have an edge? Reference competitor URLs if found.

## How 6POINT Can Increase Their Clientele
This is the most important section. Provide 8-10 hyper-specific, actionable strategies we would implement as their web design agency:
- Exact ad campaign ideas (platforms, targeting, budget ranges)
- Content design strategies (blog layouts, interactive guides, visually engaging campaigns)
- Local SEO tactics if applicable
- Conversion rate optimization (CRO) funnels
- Partnership/referral program ideas
- Conversion rate optimization tactics for their website
- Reputation management strategies
Each recommendation should explain the expected impact on client acquisition.

## Risk Factors
Any red flags, reputation issues, negative press, or market threats found in the research.

## Scoring

- Digital Presence: X/100
- Social Media: X/100
- Brand Strength: X/100
- Growth Potential: X/100
- Overall: X/100

---
RESEARCH DATA:
${JSON.stringify(data, null, 2).slice(0, 14000)}

Write in a professional but direct tone. Be specific — never vague. Reference actual data points and URLs. This report will be shown to the sales team preparing a pitch.`;


  const res = await safeFetch(
    "https://gpt-4o.p.rapidapi.com/chat/completions",
    {
      method: "POST",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "gpt-4o.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    },
    "GPT-4o",
    80000
  );

  return res;
}

/* ═══════ DISAMBIGUATION CHECK ═══════ */
async function checkDisambiguation(businessName: string, data: Record<string, any>) {
  const prompt = `Look at the search results below for "${businessName}". Are there MULTIPLE distinct businesses/locations with this name? For example, one in Denver and one in Lugoff SC would be two different businesses.

If there are multiple distinct businesses with this same name, respond ONLY with valid JSON like:
{"multiple": true, "options": [{"name": "Business Name - Denver, CO", "detail": "Brief description"}, {"name": "Business Name - Lugoff, SC", "detail": "Brief description"}]}

If there is only ONE clear business, respond ONLY with:
{"multiple": false}

SEARCH DATA:
${JSON.stringify(data, null, 2).slice(0, 6000)}

Respond with ONLY the JSON, no other text.`;

  const res = await safeFetch(
    "https://gpt-4o.p.rapidapi.com/chat/completions",
    {
      method: "POST",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "gpt-4o.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    },
    "GPT-4o",
    30000
  );

  try {
    const text = res?.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch { /* fall through */ }
  return { multiple: false };
}

/* ═══════ ROUTE HANDLER ═══════ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, website, facebookUrl, twitterHandle, location, selectedBusiness } = body;

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 });
    }

    // Build search queries — include location if provided
    const locSuffix = location ? ` ${location}` : "";
    const googleQuery = website ? `${businessName}${locSuffix} ${website}` : `${businessName}${locSuffix}`;
    const fbQuery = facebookUrl || `${businessName}${locSuffix}`;
    const twitterQuery = twitterHandle || businessName;
    const exaQuery = `${businessName}${locSuffix} company business reviews information`;

    // Run all searches in parallel
    const [googleData, facebookData, twitterData, exaData] = await Promise.all([
      searchGoogle(googleQuery),
      searchFacebook(fbQuery),
      searchTwitter(twitterQuery),
      searchExa(exaQuery),
    ]);

    const researchData = {
      businessName,
      location: location || "Not specified",
      website: website || "Not provided",
      google: googleData,
      facebook: facebookData,
      twitter: twitterData,
      exa: exaData,
    };

    // Extract thinking snippets for the frontend feed
    const snippets: string[] = [];
    // Google snippets
    if (!googleData.error) {
      const results = googleData.results || googleData.organic || [];
      if (Array.isArray(results)) {
        snippets.push(`Found ${results.length} Google results`);
        results.slice(0, 3).forEach((r: any) => {
          if (r.title) snippets.push(`→ ${r.title}`);
          if (r.url || r.link) snippets.push(`  ${r.url || r.link}`);
        });
      }
    } else { snippets.push("Google search returned no data"); }
    // Facebook snippets
    if (!facebookData.error) {
      const pages = facebookData.results || facebookData.data || facebookData.pages || [];
      if (Array.isArray(pages) && pages.length > 0) {
        snippets.push(`Found ${pages.length} Facebook pages`);
        pages.slice(0, 2).forEach((p: any) => {
          if (p.name) snippets.push(`→ FB: ${p.name}${p.followers ? ` (${p.followers} followers)` : ""}`);
        });
      } else { snippets.push("Scanning Facebook page data..."); }
    } else { snippets.push("Facebook returned no data"); }
    // Twitter snippets
    if (!twitterData.error) {
      snippets.push("Pulled Twitter/X activity data");
      const tweets = twitterData.result?.timeline?.entries || twitterData.tweets || [];
      if (Array.isArray(tweets)) snippets.push(`→ Found ${tweets.length} recent posts`);
    } else { snippets.push("Twitter returned no data"); }
    // Exa snippets
    if (!exaData.error) {
      const exaResults = exaData.results || [];
      if (Array.isArray(exaResults)) {
        snippets.push(`Deep web crawl returned ${exaResults.length} sources`);
        exaResults.slice(0, 2).forEach((r: any) => {
          if (r.title) snippets.push(`→ ${r.title}`);
        });
      }
    } else { snippets.push("Deep web search returned no data"); }

    // If no selectedBusiness yet and no location, check for disambiguation
    if (!selectedBusiness && !location) {
      const disambig = await checkDisambiguation(businessName, researchData);
      if (disambig.multiple && disambig.options?.length > 1) {
        return NextResponse.json({
          success: true,
          disambiguation: true,
          options: disambig.options,
          snippets,
          sources: {
            google: !googleData.error,
            facebook: !facebookData.error,
            twitter: !twitterData.error,
            exa: !exaData.error,
          },
        });
      }
    }

    snippets.push("Sending data to GPT-4o for analysis...");
    snippets.push("Generating comprehensive business report...");

    // Generate AI report — pass selectedBusiness context if user chose one
    const targetBusiness = selectedBusiness || `${businessName}${locSuffix}`;
    const gptResponse = await generateReport(targetBusiness, researchData);

    let report = "";
    if (gptResponse?.choices?.[0]?.message?.content) {
      report = gptResponse.choices[0].message.content;
    } else if (gptResponse?.error) {
      report = `## Analysis Error\nThe AI was unable to generate a full report. Error: ${gptResponse.error}\n\nHowever, raw research data was collected successfully. Please try again.`;
    } else {
      report = "## Analysis Error\nUnexpected response from AI. Please try again.";
    }

    return NextResponse.json({
      success: true,
      report,
      snippets,
      sources: {
        google: !googleData.error,
        facebook: !facebookData.error,
        twitter: !twitterData.error,
        exa: !exaData.error,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}


