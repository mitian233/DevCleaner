import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class PipCleaner extends BaseCleaner {
  constructor() {
    const cachePath = process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || '', 'pip', 'Cache')
      : path.join(process.env.HOME || '', '.cache', 'pip')
    
    const tool: CacheTool = {
      name: 'pip',
      displayName: 'pip Cache',
      category: 'language',
      cachePath,
      cleanCommand: 'pip cache purge',
      riskLevel: 'low',
      description: 'Python package manager cache'
    }
    super(tool)
  }
}
