import type { Article } from "@/content/types";

const ARTICLES_PATH = "src/content/articles.json";

function repoSlug(): { owner: string; repo: string } {
  const value = process.env.GITHUB_REPO ?? "";
  const [owner, repo] = value.split("/");
  if (!owner || !repo) {
    throw new Error("GITHUB_REPO mühit dəyişəni 'sahib/repo' formatında təyin olunmayıb.");
  }
  return { owner, repo };
}

function branch(): string {
  return process.env.GITHUB_CONTENT_BRANCH || "main";
}

function apiUrl(path: string): string {
  const { owner, repo } = repoSlug();
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
}

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN mühit dəyişəni təyin olunmayıb.");
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function readArticlesFile(): Promise<{ articles: Article[]; sha: string }> {
  const res = await fetch(`${apiUrl(ARTICLES_PATH)}?ref=${branch()}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub-dan fayl oxunmadı (${res.status}).`);
  }
  const json = (await res.json()) as { content: string; sha: string };
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { articles: JSON.parse(content) as Article[], sha: json.sha };
}

export async function writeArticlesFile(articles: Article[], sha: string, message: string): Promise<void> {
  const content = Buffer.from(JSON.stringify(articles, null, 2) + "\n", "utf-8").toString("base64");
  const res = await fetch(apiUrl(ARTICLES_PATH), {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content, sha, branch: branch() }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub-a yazıla bilmədi (${res.status}). ${body}`.trim());
  }
}

/** Uploads a new binary file (e.g. an image) at repoPath. repoPath must not already exist. */
export async function uploadBinaryFile(repoPath: string, base64Content: string, message: string): Promise<void> {
  const res = await fetch(apiUrl(repoPath), {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: base64Content, branch: branch() }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Şəkil GitHub-a yüklənmədi (${res.status}). ${body}`.trim());
  }
}
