import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class GoCleaner extends BaseCleaner {
  constructor() {
    const cachePath = path.join(process.env.USERPROFILE || process.env.HOME || '', 'go', 'build')
    
    const tool: CacheTool = {
      name: 'go',
      displayName: 'Go Build Cache',
      category: 'language',
      cachePath,
      cleanCommand: 'go clean -cache',
      riskLevel: 'low',
      description: 'Go build cache'
    }
    super(tool)
  }
}
