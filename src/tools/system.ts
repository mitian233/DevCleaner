import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class SystemTempCleaner extends BaseCleaner {
  constructor() {
    const cachePath = process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || '', 'Temp')
      : '/tmp'
    
    const tool: CacheTool = {
      name: 'system-temp',
      displayName: 'System Temp',
      category: 'system',
      cachePath,
      fallbackAction: 'delete',
      riskLevel: 'low',
      description: 'System temporary files'
    }
    super(tool)
  }
}
