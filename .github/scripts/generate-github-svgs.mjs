import { mkdir, writeFile } from "node:fs/promises";

const username = process.env.GITHUB_USERNAME || "aashishsarode";
const token = process.env.GITHUB_TOKEN;
const apiHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const escapeXml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const api = async (path) => {
  const response = await fetch(`https://api.github.com${path}`, { headers: apiHeaders });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${path}`);
  }
  return response.json();
};

const text = (value, x, y, options = {}) => {
  const { size = 16, fill = "#d9edf2", weight = 400, anchor = "start", family = "Arial, sans-serif" } = options;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
};

const user = await api(`/users/${encodeURIComponent(username)}`);
const repositories = (await api(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`))
  .filter((repository) => !repository.fork)
  .sort((left, right) => right.stargazers_count - left.stargazers_count || new Date(right.updated_at) - new Date(left.updated_at));

const stars = repositories.reduce((total, repository) => total + repository.stargazers_count, 0);
const forks = repositories.reduce((total, repository) => total + repository.forks_count, 0);
const generatedAt = new Date().toISOString().slice(0, 10);
const outputDirectory = "assets/generated";
await mkdir(outputDirectory, { recursive: true });

const profileSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" role="img" aria-labelledby="title desc">
<title id="title">${escapeXml(username)} GitHub profile</title>
<desc id="desc">GitHub activity summary generated on ${generatedAt}</desc>
<rect width="900" height="240" rx="8" fill="#0b1720"/>
<path d="M0 54H900M0 186H900" stroke="#25404b"/>
<path d="M42 54V186M858 54V186" stroke="#25404b"/>
${text("OPEN-SOURCE TELEMETRY", 42, 34, { size: 12, fill: "#4ed7e8", weight: 700, family: "monospace" })}
${text(`@${username}`, 42, 94, { size: 30, weight: 700 })}
${text("Research software, experiments, and engineering tools", 42, 124, { size: 15, fill: "#9bb5bd" })}
${text("PUBLIC REPOSITORIES", 42, 166, { size: 11, fill: "#6e929c", weight: 700, family: "monospace" })}
${text(user.public_repos, 42, 211, { size: 28, fill: "#4ed7e8", weight: 700 })}
${text("FOLLOWERS", 230, 166, { size: 11, fill: "#6e929c", weight: 700, family: "monospace" })}
${text(user.followers, 230, 211, { size: 28, fill: "#4ed7e8", weight: 700 })}
${text("STARS", 418, 166, { size: 11, fill: "#6e929c", weight: 700, family: "monospace" })}
${text(stars, 418, 211, { size: 28, fill: "#4ed7e8", weight: 700 })}
${text("FORKS", 606, 166, { size: 11, fill: "#6e929c", weight: 700, family: "monospace" })}
${text(forks, 606, 211, { size: 28, fill: "#4ed7e8", weight: 700 })}
</svg>`;

const cards = repositories.slice(0, 6).map((repository, index) => {
  const x = 24 + (index % 2) * 426;
  const y = 78 + Math.floor(index / 2) * 126;
  const description = (repository.description || "No description provided.").slice(0, 68);
  return `<rect x="${x}" y="${y}" width="402" height="102" rx="6" fill="#10232d" stroke="#25404b"/>
${text(String(index + 1).padStart(2, "0"), x + 18, y + 25, { size: 11, fill: "#4ed7e8", weight: 700, family: "monospace" })}
${text(repository.name, x + 56, y + 26, { size: 16, weight: 700 })}
${text(description, x + 18, y + 55, { size: 12, fill: "#9bb5bd" })}
${text(`${repository.language || "Mixed"}   * ${repository.stargazers_count}   fork ${repository.forks_count}`, x + 18, y + 82, { size: 11, fill: "#6e929c", family: "monospace" })}`;
}).join("\n");

const repositoriesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 470" role="img" aria-labelledby="title desc">
<title id="title">${escapeXml(username)} repositories</title>
<desc id="desc">Selected repositories generated on ${generatedAt}</desc>
<rect width="900" height="470" rx="8" fill="#0b1720"/>
${text("ACTIVE RESEARCH SOFTWARE", 24, 38, { size: 12, fill: "#4ed7e8", weight: 700, family: "monospace" })}
${text("Selected repositories", 24, 66, { size: 24, weight: 700 })}
${cards}
</svg>`;

await writeFile(`${outputDirectory}/github-profile.svg`, `${profileSvg}\n`);
await writeFile(`${outputDirectory}/github-repositories.svg`, `${repositoriesSvg}\n`);
console.log(`Generated GitHub SVGs for ${username}: ${repositories.length} repositories, ${stars} stars, ${forks} forks.`);
