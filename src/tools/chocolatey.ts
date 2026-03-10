import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class ChocolateyCleaner extends BaseCleaner {
  constructor() {
    const cachePath = process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || '', 'Temp', 'chocolatey')
      : path.join(process.env.HOME || '', '.cache', 'chocolatey')

    const tool: CacheTool = {
      name: 'chocolatey',
      displayName: 'Chocolatey Cache',
      category: 'package-manager',
      cachePath,
      cleanCommand: 'choco clean',
      riskLevel: 'low',
      description: 'Chocolatey package manager cache'
    }
    super(tool)
  }
}