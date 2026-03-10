import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class PnpmCleaner extends BaseCleaner {
  constructor() {
    const cachePath = process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || '', 'pnpm', 'store')
      : path.join(process.env.HOME || '', '.local', 'share', 'pnpm', 'store')
    
    const tool: CacheTool = {
      name: 'pnpm',
      displayName: 'pnpm Store',
      category: 'package-manager',
      cachePath,
      cleanCommand: 'pnpm store prune',
      riskLevel: 'low',
      description: 'pnpm package manager store'
    }
    super(tool)
  }
}
