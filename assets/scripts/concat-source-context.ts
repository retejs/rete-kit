#!/usr/bin/env node

import path from "node:path";
import { promises as fs } from "node:fs";
import { Command, InvalidArgumentError } from "commander";

type FileSection = {
  relativePath: string;
  text: string;
  tokens: number;
};

type Page = {
  sections: FileSection[];
  tokens: number;
  text: string;
};

const DEFAULT_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".css",
  ".scss",
  ".html",
  ".yml",
  ".yaml"
];

const DEFAULT_IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  ".turbo",
  ".cache",
  ".idea",
  ".vscode"
]);

const DEFAULT_IGNORED_FILE_NAMES = new Set([
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb"
]);

const MAX_FILE_LINES = 1000;

type IgnoredFile = {
  relativePath: string;
  reason: "lockfile" | "too_many_lines";
};

function parsePositiveInt(value: string, label: string): number {
  const num = Number.parseInt(value, 10);
  if (!Number.isFinite(num) || num <= 0) {
    throw new InvalidArgumentError(`${label} must be a positive integer.`);
  }
  return num;
}

function parseExtensions(value: string): Set<string> {
  const raw = value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (raw.length === 0) {
    throw new InvalidArgumentError("At least one extension must be provided.");
  }

  const normalized = raw.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`));
  return new Set(normalized);
}

function estimateTokens(text: string): number {
  // Practical approximation for code/text when model tokenizer is unknown.
  return Math.ceil(text.length / 4);
}

function normalizeRelativePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

async function walkFiles(
  rootDir: string,
  extensions: Set<string>,
  includeHidden: boolean
): Promise<{ files: string[]; ignored: IgnoredFile[] }> {
  const files: string[] = [];
  const ignored: IgnoredFile[] = [];
  const queue: string[] = [rootDir];

  while (queue.length > 0) {
    const current = queue.pop();
    if (!current) continue;

    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (!includeHidden && entry.name.startsWith(".")) {
        continue;
      }

      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (DEFAULT_IGNORED_DIRS.has(entry.name)) {
          continue;
        }
        queue.push(absolutePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (DEFAULT_IGNORED_FILE_NAMES.has(entry.name)) {
        ignored.push({
          relativePath: normalizeRelativePath(path.relative(rootDir, absolutePath)),
          reason: "lockfile"
        });
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.has(ext)) {
        files.push(absolutePath);
      }
    }
  }

  files.sort((a, b) => a.localeCompare(b));
  ignored.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  return { files, ignored };
}

function makeSection(relativePath: string, content: string): FileSection {
  const header = `\n===== FILE: ${relativePath} =====\n`;
  const text = `${header}${content}\n`;
  return {
    relativePath,
    text,
    tokens: estimateTokens(text)
  };
}

function splitLargeSection(relativePath: string, content: string, maxTokens: number): FileSection[] {
  const lines = content.split(/\r?\n/);
  const chunks: string[] = [];
  let buffer: string[] = [];

  for (const line of lines) {
    const candidateLines = [...buffer, line];
    const candidateContent = candidateLines.join("\n");
    const candidateSection = makeSection(relativePath, candidateContent);

    if (candidateSection.tokens <= maxTokens || buffer.length === 0) {
      buffer = candidateLines;
      continue;
    }

    chunks.push(buffer.join("\n"));
    buffer = [line];
  }

  if (buffer.length > 0) {
    chunks.push(buffer.join("\n"));
  }

  if (chunks.length === 0) {
    return [makeSection(relativePath, content)];
  }

  return chunks.map((chunk, index) => {
    const partPath = `${relativePath} (part ${index + 1}/${chunks.length})`;
    return makeSection(partPath, chunk);
  });
}

function paginateSections(sections: FileSection[], maxTokens: number): Page[] {
  const pages: Page[] = [];
  let currentSections: FileSection[] = [];
  let currentTokens = 0;

  const flushPage = (): void => {
    if (currentSections.length === 0) return;
    const text = currentSections.map((section) => section.text).join("");
    pages.push({
      sections: currentSections,
      tokens: currentTokens,
      text
    });
    currentSections = [];
    currentTokens = 0;
  };

  for (const section of sections) {
    if (section.tokens > maxTokens) {
      flushPage();
      pages.push({
        sections: [section],
        tokens: section.tokens,
        text: section.text
      });
      continue;
    }

    if (currentTokens + section.tokens > maxTokens && currentSections.length > 0) {
      flushPage();
    }

    currentSections.push(section);
    currentTokens += section.tokens;
  }

  flushPage();
  return pages;
}

async function buildSections(
  directory: string,
  extensions: Set<string>,
  maxTokens: number,
  includeHidden: boolean
): Promise<{ files: string[]; sections: FileSection[]; totalTokens: number; ignores: IgnoredFile[] }> {
  const discovered = await walkFiles(directory, extensions, includeHidden);
  const files: string[] = [];
  const ignores: IgnoredFile[] = [...discovered.ignored];
  const sections: FileSection[] = [];
  let totalTokens = 0;

  for (const absolutePath of discovered.files) {
    const relativePath = normalizeRelativePath(path.relative(directory, absolutePath));
    const content = await fs.readFile(absolutePath, "utf8");
    const lineCount = content === "" ? 0 : content.split(/\r?\n/).length;

    if (lineCount > MAX_FILE_LINES) {
      ignores.push({
        relativePath,
        reason: "too_many_lines"
      });
      continue;
    }

    files.push(absolutePath);
    const baseSection = makeSection(relativePath, content);

    const preparedSections =
      baseSection.tokens > maxTokens
        ? splitLargeSection(relativePath, content, maxTokens)
        : [baseSection];

    for (const section of preparedSections) {
      sections.push(section);
      totalTokens += section.tokens;
    }
  }

  ignores.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  return { files, sections, totalTokens, ignores };
}

async function run(): Promise<void> {
  const program = new Command()
    .name("concat-source-context")
    .description("Concatenate source files from a directory with token-aware pagination.")
    .argument("<directory>", "Directory to scan")
    .option(
      "--ext <list>",
      "Comma-separated file extensions (example: .ts,.tsx,.js)",
      DEFAULT_EXTENSIONS.join(",")
    )
    .option("--max-tokens <number>", "Maximum tokens per page", (value) => parsePositiveInt(value, "max-tokens"), 120000)
    .option("--page <number>", "Page number to output", (value) => parsePositiveInt(value, "page"), 1)
    .option("--include-hidden", "Include hidden files/directories", false)
    .parse(process.argv);

  const options = program.opts<{
    ext: string;
    maxTokens: number;
    page: number;
    includeHidden: boolean;
  }>();

  const directoryArg = program.args[0];
  const targetDirectory = path.resolve(directoryArg);
  const extensions = parseExtensions(options.ext);

  const stat = await fs.stat(targetDirectory).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    throw new Error(`Directory does not exist: ${targetDirectory}`);
  }

  const { files, sections, totalTokens, ignores } = await buildSections(
    targetDirectory,
    extensions,
    options.maxTokens,
    options.includeHidden
  );

  const pages = paginateSections(sections, options.maxTokens);
  const totalPages = Math.max(pages.length, 1);

  if (options.page > totalPages) {
    throw new Error(`Page ${options.page} is out of range. Total pages: ${totalPages}.`);
  }

  const selectedPage = pages[options.page - 1];
  const metadata = {
    directory: targetDirectory,
    extensions: [...extensions].sort(),
    filesMatched: files.length,
    totalEstimatedTokens: totalTokens,
    maxTokensPerPage: options.maxTokens,
    totalPages,
    page: options.page,
    pageEstimatedTokens: selectedPage?.tokens ?? 0,
    pageFiles: selectedPage?.sections.map((section) => section.relativePath) ?? [],
    ignores
  };

  console.log(JSON.stringify(metadata, null, 2));
  console.log("\n----- PAGE CONTENT START -----\n");
  if (selectedPage) {
    process.stdout.write(selectedPage.text);
  }
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
