import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class GradleCleaner extends BaseCleaner {
  constructor() {
    const cachePath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.gradle', 'caches')
    
    const tool: CacheTool = {
      name: 'gradle',
      displayName: 'Gradle Cache',
      category: 'language',
      cachePath,
      fallbackAction: 'delete',
      riskLevel: 'medium',
      description: 'Gradle build cache'
    }
    super(tool)
  }
}
