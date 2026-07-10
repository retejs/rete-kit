#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command, InvalidArgumentError } from "commander";
import fs from "fs-extra";
import { Octokit } from "@octokit/rest";
import { simpleGit } from "simple-git";
import dotenv from "dotenv";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(SCRIPT_DIR, "..", "..");
const GH_MIRROR_ROOT = path.join(WORKSPACE_ROOT, "gh-mirror");
const DEFAULT_READONLY_REPOS_DIR = path.join(GH_MIRROR_ROOT, "readonly-repositories");
const DEFAULT_ISSUES_ROOT_DIR = path.join(GH_MIRROR_ROOT, "issues");

dotenv.config({ path: path.join(SCRIPT_DIR, ".env") });

type CloneProtocol = "https" | "ssh";

type RepoStats = {
  cloned: number;
  updated: number;
  skipped: number;
  failed: number;
  issuesReposExported: number;
  issuesFilesExported: number;
  issuesFailed: number;
  pullsReposExported: number;
  pullsFilesExported: number;
  pullsFailed: number;
};

const DEFAULT_ORG = "retejs";

function parseProtocol(value: string): CloneProtocol {
  if (value === "https" || value === "ssh") {
    return value;
  }

  throw new InvalidArgumentError("Protocol must be either 'https' or 'ssh'.");
}

function createOctokit(token?: string): Octokit {
  return new Octokit({
    auth: token?.trim() || undefined
  });
}

async function isGitRepository(repoPath: string): Promise<boolean> {
  if (!(await fs.pathExists(repoPath))) {
    return false;
  }

  try {
    return await simpleGit(repoPath).checkIsRepo();
  } catch {
    return false;
  }
}

async function isValidJsonFile(filePath: string): Promise<boolean> {
  try {
    await fs.readJson(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeJsonAtomic(filePath: string, data: unknown): Promise<void> {
  const tmpPath = `${filePath}.tmp`;
  await fs.writeJson(tmpPath, data, { spaces: 2 });
  await fs.move(tmpPath, filePath, { overwrite: true });
}

async function exportRepoIssues(
  octokit: Octokit,
  repoFullName: string,
  issuesDir: string
): Promise<number> {
  const [owner, repo] = repoFullName.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid repository full name: ${repoFullName}`);
  }

  await fs.ensureDir(issuesDir);

  let exportedCount = 0;

  const issueIterator = octokit.paginate.iterator(octokit.issues.listForRepo, {
    owner,
    repo,
    state: "all",
    direction: "asc",
    per_page: 100
  });

  for await (const { data: pageIssues } of issueIterator) {
    for (const issue of pageIssues) {
      if ("pull_request" in issue && issue.pull_request) {
        continue;
      }

      const outputFile = path.join(issuesDir, `issue-${issue.number}.json`);
      if ((await fs.pathExists(outputFile)) && (await isValidJsonFile(outputFile))) {
        continue;
      }

      let commentsData: unknown[] = [];
      if (issue.comments > 0) {
        commentsData = await octokit.paginate(octokit.issues.listComments, {
          owner,
          repo,
          issue_number: issue.number,
          per_page: 100
        });
      }

      await writeJsonAtomic(outputFile, {
        ...issue,
        comments_data: commentsData
      });
      exportedCount += 1;
    }
  }

  return exportedCount;
}

async function exportRepoPullRequests(
  octokit: Octokit,
  repoFullName: string,
  pullsDir: string
): Promise<number> {
  const [owner, repo] = repoFullName.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid repository full name: ${repoFullName}`);
  }

  await fs.ensureDir(pullsDir);

  let exportedCount = 0;

  const pullIterator = octokit.paginate.iterator(octokit.pulls.list, {
    owner,
    repo,
    state: "all",
    sort: "created",
    direction: "asc",
    per_page: 100
  });

  for await (const { data: pagePulls } of pullIterator) {
    for (const pull of pagePulls) {
      const outputFile = path.join(pullsDir, `pull-${pull.number}.json`);
      if ((await fs.pathExists(outputFile)) && (await isValidJsonFile(outputFile))) {
        continue;
      }

      const [issueComments, reviewComments, reviews, commits] = await Promise.all([
        octokit.paginate(octokit.issues.listComments, {
          owner,
          repo,
          issue_number: pull.number,
          per_page: 100
        }),
        octokit.paginate(octokit.pulls.listReviewComments, {
          owner,
          repo,
          pull_number: pull.number,
          per_page: 100
        }),
        octokit.paginate(octokit.pulls.listReviews, {
          owner,
          repo,
          pull_number: pull.number,
          per_page: 100
        }),
        octokit.paginate(octokit.pulls.listCommits, {
          owner,
          repo,
          pull_number: pull.number,
          per_page: 100
        })
      ]);

      const diffResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
        owner,
        repo,
        pull_number: pull.number,
        mediaType: {
          format: "diff"
        }
      });

      const metadata = {
        id: pull.id,
        number: pull.number,
        state: pull.state,
        title: pull.title,
        body: pull.body,
        user: pull.user,
        labels: pull.labels,
        assignees: pull.assignees,
        requested_reviewers: pull.requested_reviewers,
        requested_teams: pull.requested_teams,
        milestone: pull.milestone,
        locked: pull.locked,
        draft: pull.draft,
        created_at: pull.created_at,
        updated_at: pull.updated_at,
        closed_at: pull.closed_at,
        merged_at: pull.merged_at,
        merge_commit_sha: pull.merge_commit_sha,
        head: {
          label: pull.head.label,
          ref: pull.head.ref,
          sha: pull.head.sha
        },
        base: {
          label: pull.base.label,
          ref: pull.base.ref,
          sha: pull.base.sha
        },
        html_url: pull.html_url,
        url: pull.url
      };

      await writeJsonAtomic(outputFile, {
        metadata,
        issue_comments: issueComments,
        review_comments: reviewComments,
        reviews,
        commits,
        diff: typeof diffResponse.data === "string" ? diffResponse.data : null
      });
      exportedCount += 1;
    }
  }

  return exportedCount;
}

function createRepoUrl(
  protocol: CloneProtocol,
  cloneUrl: string | null | undefined,
  sshUrl: string | null | undefined
): string {
  if (protocol === "ssh") {
    if (!sshUrl) {
      throw new Error("Repository does not expose an SSH URL.");
    }
    return sshUrl;
  }

  if (!cloneUrl) {
    throw new Error("Repository does not expose an HTTPS clone URL.");
  }

  return cloneUrl;
}

async function cloneOrUpdateRepository(params: {
  repoName: string;
  repoUrl: string;
  repoPath: string;
}): Promise<"cloned" | "updated" | "skipped" | "failed"> {
  const { repoName, repoUrl, repoPath } = params;
  const cloneInProgressMarker = `${repoPath}.clone-incomplete`;

  await fs.ensureDir(path.dirname(repoPath));
  const repoIsGit = await isGitRepository(repoPath);

  if (await fs.pathExists(cloneInProgressMarker)) {
    if (repoIsGit) {
      await fs.remove(cloneInProgressMarker);
    } else {
      console.log(`Recovering interrupted clone: ${repoName}`);
      await fs.remove(repoPath);
      await fs.remove(cloneInProgressMarker);
    }
  }

  if (repoIsGit) {
    console.log(`Updating: ${repoName}`);
    const git = simpleGit(repoPath);
    try {
      await git.remote(["set-url", "origin", repoUrl]);
      await git.fetch(["--all", "--prune"]);
      const branch = (await git.revparse(["--abbrev-ref", "HEAD"])).trim();
      if (branch && branch !== "HEAD") {
        await git.pull(["--ff-only", "--prune"]);
      }
      return "updated";
    } catch {
      console.error(`Warning: update failed for ${repoName}`);
      return "failed";
    }
  }

  if (await fs.pathExists(repoPath)) {
    console.log(`Skipping (path exists but is not a git repo): ${repoName}`);
    return "skipped";
  }

  console.log(`Cloning: ${repoName}`);
  try {
    await fs.writeFile(cloneInProgressMarker, `${new Date().toISOString()}\n`);
    const git = simpleGit();
    await git.clone(repoUrl, repoPath);
    try {
      await fs.remove(cloneInProgressMarker);
    } catch {
      console.error(`Warning: unable to clean clone marker for ${repoName}`);
    }
    return "cloned";
  } catch {
    console.error(`Warning: clone failed for ${repoName}`);
    return "failed";
  }
}

async function run(): Promise<void> {
  const program = new Command()
    .name("clone-github-org-repos")
    .description("Clone/update GitHub org repositories and export issues/pull requests into gh-mirror")
    .option("--org <name>", "GitHub organization name", DEFAULT_ORG)
    .option(
      "--repos-dir <directory>",
      "Destination directory for readonly repository clones",
      DEFAULT_READONLY_REPOS_DIR
    )
    .option(
      "--issues-dir <directory>",
      "Root directory for exported issues and pull requests",
      DEFAULT_ISSUES_ROOT_DIR
    )
    .option("--protocol <type>", "Clone protocol: https or ssh", parseProtocol, "https")
    .option("--token <token>", "GitHub token (or use GITHUB_TOKEN env var)")
    .parse(process.argv);

  const options = program.opts<{
    org: string;
    reposDir: string;
    issuesDir: string;
    protocol: CloneProtocol;
    token?: string;
  }>();

  const org = options.org?.trim();
  if (!org) {
    throw new Error("Organization name cannot be empty.");
  }

  const readonlyReposDir = path.resolve(options.reposDir);
  const issuesRootDir = path.resolve(options.issuesDir);
  const token = options.token || process.env.GITHUB_TOKEN;
  const octokit = createOctokit(token);

  await fs.ensureDir(readonlyReposDir);
  await fs.ensureDir(issuesRootDir);

  console.log(`Fetching repositories for organization: ${org}`);
  console.log(`Readonly repositories: ${readonlyReposDir}`);
  console.log(`Issues root: ${issuesRootDir}`);
  console.log(`Protocol: ${options.protocol}`);
  console.log(token ? "GitHub auth: token configured" : "GitHub auth: anonymous (public data only)");

  const stats: RepoStats = {
    cloned: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    issuesReposExported: 0,
    issuesFilesExported: 0,
    issuesFailed: 0,
    pullsReposExported: 0,
    pullsFilesExported: 0,
    pullsFailed: 0
  };

  const repoIterator = octokit.paginate.iterator(octokit.repos.listForOrg, {
    org,
    type: "all",
    per_page: 100
  });

  for await (const { data: repos } of repoIterator) {
    for (const repo of repos) {
      const repoPath = path.join(readonlyReposDir, repo.name);
      const issuesPath = path.join(issuesRootDir, repo.name, "issues");
      const pullsPath = path.join(issuesRootDir, repo.name, "pulls");
      const repoUrl = createRepoUrl(options.protocol, repo.clone_url, repo.ssh_url);

      const cloneStatus = await cloneOrUpdateRepository({
        repoName: repo.name,
        repoUrl,
        repoPath
      });
      if (cloneStatus === "cloned") stats.cloned += 1;
      if (cloneStatus === "updated") stats.updated += 1;
      if (cloneStatus === "skipped") stats.skipped += 1;
      if (cloneStatus === "failed") stats.failed += 1;

      console.log(`Exporting issues: ${repo.name}`);
      try {
        const exportedCount = await exportRepoIssues(octokit, repo.full_name, issuesPath);
        stats.issuesReposExported += 1;
        stats.issuesFilesExported += exportedCount;
      } catch {
        console.error(`Warning: issue export failed for ${repo.name}`);
        stats.issuesFailed += 1;
      }

      console.log(`Exporting pull requests: ${repo.name}`);
      try {
        const exportedCount = await exportRepoPullRequests(octokit, repo.full_name, pullsPath);
        stats.pullsReposExported += 1;
        stats.pullsFilesExported += exportedCount;
      } catch {
        console.error(`Warning: pull request export failed for ${repo.name}`);
        stats.pullsFailed += 1;
      }
    }
  }

  console.log("");
  console.log("Done.");
  console.log(`Cloned: ${stats.cloned}`);
  console.log(`Updated: ${stats.updated}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Issue repos exported: ${stats.issuesReposExported}`);
  console.log(`Issue files exported: ${stats.issuesFilesExported}`);
  console.log(`Issue exports failed: ${stats.issuesFailed}`);
  console.log(`Pull request repos exported: ${stats.pullsReposExported}`);
  console.log(`Pull request files exported: ${stats.pullsFilesExported}`);
  console.log(`Pull request exports failed: ${stats.pullsFailed}`);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
