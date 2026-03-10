import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class CargoCleaner extends BaseCleaner {
  constructor() {
    const cachePath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.cargo', 'registry')
    
    const tool: CacheTool = {
      name: 'cargo',
      displayName: 'Cargo Registry',
      category: 'language',
      cachePath,
      cleanCommand: 'cargo cache -a',
      fallbackAction: 'delete',
      riskLevel: 'medium',
      description: 'Rust Cargo package index cache'
    }
    super(tool)
  }
}
