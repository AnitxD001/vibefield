import { MoodState, RenderStats, UserSettings } from '../types';

export interface IRenderer {
  init(): Promise<boolean>;
  resize(width: number, height: number): void;
  render(mood: MoodState, settings: UserSettings, deltaSeconds: number): void;
  getStats(): RenderStats;
  dispose(): void;
}
