import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo/site";
import { INDEXNOW_KEY, allUrls } from "@/lib/seo/indexnow";

export const runtime = "nodejs";

/**
 * Submit every site URL to IndexNow (Bing, Yandex, Seznam) in one call.
 * Trigger it after a deploy:
 *   GET /api/indexnow?key=<INDEXNOW_KEY>
 * The key gate just stops casual abuse — the key is public anyway (it's the
 * verification file on the domain).
 */
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== INDEXNOW_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urlList = allUrls();
  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      submitted: urlList.length,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "submit failed" },
      { status: 502 },
    );
  }
}
