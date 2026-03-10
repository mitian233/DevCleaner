import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class MavenCleaner extends BaseCleaner {
  constructor() {
    const cachePath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.m2', 'repository')
    
    const tool: CacheTool = {
      name: 'maven',
      displayName: 'Maven Repository',
      category: 'language',
      cachePath,
      fallbackAction: 'delete',
      riskLevel: 'high',
      description: 'Maven dependency repository (requires re-download after cleaning)'
    }
    super(tool)
  }
}
