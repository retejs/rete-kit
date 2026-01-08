import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs'
import { join } from 'path'

// Mock logger to silence console output during tests
jest.mock('../src/ai/logger', () => ({
  logger: {
    warn: jest.fn(),
    info: jest.fn(),
    ready: jest.fn(),
    skip: jest.fn()
  }
}))

import { InstructionFile } from '../src/ai/contexts/base'
import { AIAssets } from '../src/ai/filesystem'
import {
  AmazonQTool,
  AntigravityTool,
  ClaudeTool,
  CodexTool,
  ContinueTool,
  CursorTool,
  GithubTool,
  WindsurfTool
} from '../src/ai/tools'

const mockWorkingDir = '/tmp/rete-kit-test'

// Helper to create a temporary directory for testing
function setupTestDir(): string {
  const testDir = join(mockWorkingDir, `test-${Date.now()}`)

  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true })
  }
  mkdirSync(testDir, { recursive: true })
  return testDir
}

// Mock AIAssets class
class MockAIAssets extends AIAssets {
  private mockInstructions = new Map<string, string>()

  constructor(workingDirectory: string, interactive = false) {
    super(workingDirectory, interactive)
  }

  setMockInstruction(file: string, content: string): void {
    this.mockInstructions.set(file, content)
  }

  getInstructionForContext(instructionFile: { file: string, path: string, contextId: string, title: string }): { path: string, content: string, file: string, contextId: string, title: string } | null {
    const content = this.mockInstructions.get(instructionFile.file)

    if (content) {
      return {
        path: instructionFile.path,
        content,
        file: instructionFile.file,
        contextId: instructionFile.contextId,
        title: instructionFile.title
      }
    }
    return null
  }
}

describe('Tools', () => {
  let testDir = ''
  let originalCwd = ''

  beforeEach(() => {
    testDir = setupTestDir()
    originalCwd = process.cwd()
    process.chdir(testDir)
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
    process.chdir(originalCwd)
  })

  describe('GithubTool', () => {
    it('should generate copilot-instructions.md in .github directory', async () => {
      const tool = new GithubTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('instruction1.md', 'Content from instruction 1')
      aiAssets.setMockInstruction('instruction2.md', 'Content from instruction 2')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'instruction1.md', title: 'Instruction 1', path: '/mock/path/instruction1.md', contextId: 'test' },
        { file: 'instruction2.md', title: 'Instruction 2', path: '/mock/path/instruction2.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.github', 'copilot-instructions.md')

      expect(existsSync(targetFile)).toBe(true)

      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toBe('# [Rete.js] Instruction 1\n\nContent from instruction 1\n\n# [Rete.js] Instruction 2\n\nContent from instruction 2')
    })

    it('should merge multiple instruction files into single file', async () => {
      const tool = new GithubTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('rule1.md', 'Rule 1')
      aiAssets.setMockInstruction('rule2.md', 'Rule 2')
      aiAssets.setMockInstruction('rule3.md', 'Rule 3')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'rule1.md', title: 'Rule 1', path: '/mock/path/rule1.md', contextId: 'test' },
        { file: 'rule2.md', title: 'Rule 2', path: '/mock/path/rule2.md', contextId: 'test' },
        { file: 'rule3.md', title: 'Rule 3', path: '/mock/path/rule3.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.github', 'copilot-instructions.md')
      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toBe('# [Rete.js] Rule 1\n\nRule 1\n\n# [Rete.js] Rule 2\n\nRule 2\n\n# [Rete.js] Rule 3\n\nRule 3')
    })

    it('should handle empty instruction files array', async () => {
      const tool = new GithubTool()
      const aiAssets = new MockAIAssets(testDir, false)

      await tool.apply(aiAssets, [], true)

      const targetFile = join(testDir, '.github', 'copilot-instructions.md')

      expect(existsSync(targetFile)).toBe(false)
    })

    it('should handle missing instruction files gracefully', async () => {
      const tool = new GithubTool()
      const aiAssets = new MockAIAssets(testDir, false)

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'missing.md', title: 'Missing', path: '/mock/path/missing.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.github', 'copilot-instructions.md')

      expect(existsSync(targetFile)).toBe(false)
    })
  })

  describe('CodexTool', () => {
    it('should generate AGENTS.md in root directory', async () => {
      const tool = new CodexTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('rule1.md', 'Rule 1 content')
      aiAssets.setMockInstruction('rule2.md', 'Rule 2 content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'rule1.md', title: 'Rule 1', path: '/mock/path/rule1.md', contextId: 'test' },
        { file: 'rule2.md', title: 'Rule 2', path: '/mock/path/rule2.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, 'AGENTS.md')

      expect(existsSync(targetFile)).toBe(true)

      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toBe('# [Rete.js] Rule 1\n\nRule 1 content\n\n# [Rete.js] Rule 2\n\nRule 2 content')
    })

    it('should merge multiple files into single AGENTS.md', async () => {
      const tool = new CodexTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('guide.md', 'Guide content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'guide.md', title: 'Guide', path: '/mock/path/guide.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, 'AGENTS.md')

      expect(existsSync(targetFile)).toBe(true)
      expect(readFileSync(targetFile, 'utf-8')).toBe('# [Rete.js] Guide\n\nGuide content')
    })
  })

  describe('ClaudeTool', () => {
    it('should generate CLAUDE.md in root directory', async () => {
      const tool = new ClaudeTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('guide.md', 'Guide content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'guide.md', title: 'Guide', path: '/mock/path/guide.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, 'CLAUDE.md')

      expect(existsSync(targetFile)).toBe(true)

      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toBe('# [Rete.js] Guide\n\nGuide content')
    })

    it('should merge multiple files into single CLAUDE.md', async () => {
      const tool = new ClaudeTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('part1.md', 'Part 1')
      aiAssets.setMockInstruction('part2.md', 'Part 2')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'part1.md', title: 'Part 1', path: '/mock/path/part1.md', contextId: 'test' },
        { file: 'part2.md', title: 'Part 2', path: '/mock/path/part2.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, 'CLAUDE.md')
      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toBe('# [Rete.js] Part 1\n\nPart 1\n\n# [Rete.js] Part 2\n\nPart 2')
    })
  })

  describe('CursorTool', () => {
    it('should generate files with .mdc extension in .cursor/rules directory', async () => {
      const tool = new CursorTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('rule1.md', 'Rule 1 content')
      aiAssets.setMockInstruction('rule2.md', 'Rule 2 content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'rule1.md', title: 'Rule 1', path: '/mock/path/rule1.md', contextId: 'test' },
        { file: 'rule2.md', title: 'Rule 2', path: '/mock/path/rule2.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile1 = join(testDir, '.cursor', 'rules', 'rete-test-rule1.mdc')

      expect(existsSync(targetFile1)).toBe(true)
      const content1 = readFileSync(targetFile1, 'utf-8')

      expect(content1).toContain('# [Rete.js] Rule 1')
      expect(content1).toContain('Rule 1 content')

      const targetFile2 = join(testDir, '.cursor', 'rules', 'rete-test-rule2.mdc')

      expect(existsSync(targetFile2)).toBe(true)
      const content2 = readFileSync(targetFile2, 'utf-8')

      expect(content2).toContain('# [Rete.js] Rule 2')
      expect(content2).toContain('Rule 2 content')
    })

    it('should add YAML frontmatter with alwaysApply: true', async () => {
      const tool = new CursorTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('rule.md', 'Rule content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'rule.md', title: 'Rule', path: '/mock/path/rule.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.cursor', 'rules', 'rete-test-rule.mdc')
      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('---')
      expect(content).toContain('alwaysApply: true')
      expect(content).toContain('# [Rete.js] Rule')
      expect(content).toContain('Rule content')
      expect(content).toMatch(/^---\n.*alwaysApply: true\n---\n# \[Rete\.js\] Rule\n\nRule content$/s)
    })

    it('should handle multiple files with complex transformations', async () => {
      const tool = new CursorTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('file1.md', 'Content 1')
      aiAssets.setMockInstruction('file2.md', 'Content 2')
      aiAssets.setMockInstruction('file3.md', 'Content 3')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'file1.md', title: 'File 1', path: '/mock/path/file1.md', contextId: 'test' },
        { file: 'file2.md', title: 'File 2', path: '/mock/path/file2.md', contextId: 'test' },
        { file: 'file3.md', title: 'File 3', path: '/mock/path/file3.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      expect(existsSync(join(testDir, '.cursor', 'rules', 'rete-test-file1.mdc'))).toBe(true)
      expect(existsSync(join(testDir, '.cursor', 'rules', 'rete-test-file2.mdc'))).toBe(true)
      expect(existsSync(join(testDir, '.cursor', 'rules', 'rete-test-file3.mdc'))).toBe(true)

      const content1 = readFileSync(join(testDir, '.cursor', 'rules', 'rete-test-file1.mdc'), 'utf-8')

      expect(content1).toContain('---')
      expect(content1).toContain('alwaysApply: true')
      expect(content1).toContain('# [Rete.js] File 1')
      expect(content1).toContain('Content 1')

      const content2 = readFileSync(join(testDir, '.cursor', 'rules', 'rete-test-file2.mdc'), 'utf-8')

      expect(content2).toContain('# [Rete.js] File 2')
      expect(content2).toContain('Content 2')

      const content3 = readFileSync(join(testDir, '.cursor', 'rules', 'rete-test-file3.mdc'), 'utf-8')

      expect(content3).toContain('# [Rete.js] File 3')
      expect(content3).toContain('Content 3')
    })
  })

  describe('WindsurfTool', () => {
    it('should generate files in .windsurf/rules directory', async () => {
      const tool = new WindsurfTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('guide.md', 'Guide content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'guide.md', title: 'Guide', path: '/mock/path/guide.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.windsurf', 'rules', 'rete-test-guide.md')

      expect(existsSync(targetFile)).toBe(true)

      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('# [Rete.js] Guide')
      expect(content).toContain('Guide content')
    })

    it('should add YAML frontmatter with trigger: always_on', async () => {
      const tool = new WindsurfTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('rule.md', 'Rule content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'rule.md', title: 'Rule', path: '/mock/path/rule.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.windsurf', 'rules', 'rete-test-rule.md')
      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('---')
      expect(content).toContain('trigger: always_on')
      expect(content).toContain('# [Rete.js] Rule')
      expect(content).toContain('Rule content')
    })

    it('should preserve original file extension', async () => {
      const tool = new WindsurfTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('guide.md', 'Guide content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'guide.md', title: 'Guide', path: '/mock/path/guide.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.windsurf', 'rules', 'rete-test-guide.md')

      expect(existsSync(targetFile)).toBe(true)
    })
  })

  describe('AntigravityTool', () => {
    it('should generate files in .agent/rules directory', async () => {
      const tool = new AntigravityTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('rule.md', 'Rule content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'rule.md', title: 'Rule', path: '/mock/path/rule.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.agent', 'rules', 'rete-test-rule.md')

      expect(existsSync(targetFile)).toBe(true)

      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('# [Rete.js] Rule')
      expect(content).toContain('Rule content')
    })

    it('should preserve original content without transformations', async () => {
      const tool = new AntigravityTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('guide.md', 'Original content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'guide.md', title: 'Guide', path: '/mock/path/guide.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.agent', 'rules', 'rete-test-guide.md')
      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('# [Rete.js] Guide')
      expect(content).toContain('Original content')
      expect(content).not.toContain('---')
    })
  })

  describe('ContinueTool', () => {
    it('should generate files in .continue/rules directory', async () => {
      const tool = new ContinueTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('instruction.md', 'Instruction content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'instruction.md', title: 'Instruction', path: '/mock/path/instruction.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.continue', 'rules', 'rete-test-instruction.md')

      expect(existsSync(targetFile)).toBe(true)

      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('# [Rete.js] Instruction')
      expect(content).toContain('Instruction content')
    })

    it('should preserve original content without YAML frontmatter', async () => {
      const tool = new ContinueTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('rule.md', 'Rule content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'rule.md', title: 'Rule', path: '/mock/path/rule.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.continue', 'rules', 'rete-test-rule.md')
      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('# [Rete.js] Rule')
      expect(content).toContain('Rule content')
      expect(content).not.toContain('---')
    })
  })

  describe('AmazonQTool', () => {
    it('should generate files in .amazonq/rules directory', async () => {
      const tool = new AmazonQTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('rule.md', 'Amazon Q rule content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'rule.md', title: 'Rule', path: '/mock/path/rule.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.amazonq', 'rules', 'rete-test-rule.md')

      expect(existsSync(targetFile)).toBe(true)

      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('# [Rete.js] Rule')
      expect(content).toContain('Amazon Q rule content')
    })

    it('should preserve original content without YAML frontmatter', async () => {
      const tool = new AmazonQTool()
      const aiAssets = new MockAIAssets(testDir, false)

      aiAssets.setMockInstruction('guide.md', 'Guide content')

      const instructionFiles: (InstructionFile & { path: string, contextId: string })[] = [
        { file: 'guide.md', title: 'Guide', path: '/mock/path/guide.md', contextId: 'test' }
      ]

      await tool.apply(aiAssets, instructionFiles, true)

      const targetFile = join(testDir, '.amazonq', 'rules', 'rete-test-guide.md')
      const content = readFileSync(targetFile, 'utf-8')

      expect(content).toContain('# [Rete.js] Guide')
      expect(content).toContain('Guide content')
      expect(content).not.toContain('---')
    })
  })
})
