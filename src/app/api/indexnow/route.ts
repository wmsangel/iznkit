import { INDEXNOW_KEY, allUrls } from "@/lib/seo/indexnow";
import { SITE_URL } from "@/lib/seo/site";

// On-demand IndexNow submission. Hit this after a deploy to tell IndexNow
// (Bing, Yandex, Seznam, …) about every live URL at once:
//
//   https://iznkit.com/api/indexnow?key=<INDEXNOW_KEY>
//
// api.indexnow.org fans the submission out to all participating engines, so one
// call is enough. Guarded by the key so the endpoint can't be spammed; the key
// is public (public/<key>.txt) but only ever submits our own real URLs, so this
// is a throttle, not a secret. /api/ is disallowed in robots, so it's never crawled.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("key") !== INDEXNOW_KEY) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const urlList = allUrls();
  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return Response.json({ submitted: urlList.length, indexnowStatus: res.status });
}
