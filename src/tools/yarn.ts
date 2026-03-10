import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class YarnCleaner extends BaseCleaner {
  constructor() {
    const cachePath = process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || '', 'Yarn', 'Cache')
      : path.join(process.env.HOME || '', '.cache', 'yarn')
    
    const tool: CacheTool = {
      name: 'yarn',
      displayName: 'Yarn Cache',
      category: 'package-manager',
      cachePath,
      cleanCommand: 'yarn cache clean',
      riskLevel: 'low',
      description: 'Yarn package manager cache'
    }
    super(tool)
  }
}
