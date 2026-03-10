import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class NpmCleaner extends BaseCleaner {
  constructor() {
    const cachePath = process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || '', 'npm-cache')
      : path.join(process.env.HOME || '', '.npm')
    
    const tool: CacheTool = {
      name: 'npm',
      displayName: 'npm Cache',
      category: 'package-manager',
      cachePath,
      cleanCommand: 'npm cache clean --force',
      riskLevel: 'low',
      description: 'npm package manager cache'
    }
    super(tool)
  }
}
