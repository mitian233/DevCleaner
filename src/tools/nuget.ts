import path from 'path'
import { BaseCleaner } from './base'
import { CacheTool } from '../types'

export class NugetCleaner extends BaseCleaner {
  constructor() {
    const cachePath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.nuget', 'packages')
    
    const tool: CacheTool = {
      name: 'nuget',
      displayName: 'NuGet Packages',
      category: 'language',
      cachePath,
      cleanCommand: 'dotnet nuget locals all --clear',
      riskLevel: 'medium',
      description: 'NuGet package manager cache'
    }
    super(tool)
  }
}
