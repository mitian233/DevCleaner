import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class WingetCleaner extends BaseCleaner {
  constructor() {
    // WinGet packages cache location
    const cachePath = process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages')
      : path.join(process.env.HOME || '', '.cache', 'winget')

    const tool: CacheTool = {
      name: 'winget',
      displayName: 'WinGet Cache',
      category: 'package-manager',
      cachePath,
      cleanCommand: 'winget',
      fallbackAction: 'delete',
      riskLevel: 'low',
      description: 'Windows Package Manager (WinGet) cache'
    }
    super(tool)
  }

  // Override clean to use winget --cache purge if available, otherwise delete
  async clean(): Promise<void> {
    const { commandExists, executeCommand } = await import('../utils/execute')
    const { exists, deleteDirectory } = await import('../utils/format')

    if (!await exists(this.tool.cachePath)) {
      throw new Error(`Cache directory does not exist: ${this.tool.cachePath}`)
    }

    // Try winget --cache purge first
    if (await commandExists('winget')) {
      try {
        await executeCommand('winget', ['--cache', 'purge'])
        return
      } catch {
        // Fall back to directory deletion if command fails
      }
    }

    // Fallback: delete cache directory
    if (this.tool.fallbackAction === 'delete') {
      await this.deleteCache()
    }
  }
}