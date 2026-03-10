import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'
import { executeCommand, commandExists } from '../utils/execute'

export class ScoopCleaner extends BaseCleaner {
  constructor() {
    const cachePath = process.platform === 'win32'
      ? path.join(process.env.USERPROFILE || '', 'scoop', 'cache')
      : path.join(process.env.HOME || '', 'scoop', 'cache')

    const tool: CacheTool = {
      name: 'scoop',
      displayName: 'Scoop Cache',
      category: 'package-manager',
      cachePath,
      cleanCommand: 'scoop cache rm *',
      riskLevel: 'low',
      description: 'Scoop package manager cache'
    }
    super(tool)
  }

  async clean(): Promise<void> {
    // Check if scoop is installed
    if (!await commandExists('scoop')) {
      throw new Error('Scoop is not installed')
    }

    // Execute scoop cache rm * (removes downloaded cache files)
    await executeCommand('scoop', ['cache', 'rm', '*'])

    // Execute scoop cleanup * (removes old versions of installed apps)
    await executeCommand('scoop', ['cleanup', '*'])
  }
}