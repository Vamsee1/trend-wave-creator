
import { useState } from 'react';
import { X, Palette, Bell, Music, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export const SettingsPanel = ({ isOpen, onClose, currentTheme, onThemeChange }: SettingsPanelProps) => {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [autoBreak, setAutoBreak] = useState(true);

  const themes = [
    // Gradient Themes
    { id: 'seoul-sunrise', name: 'Seoul Sunrise', colors: '🌅 Purple to Orange', category: 'Gradient' },
    { id: 'ocean-breeze', name: 'Ocean Breeze', colors: '🌊 Blue to Green', category: 'Gradient' },
    { id: 'sunset-vibes', name: 'Sunset Vibes', colors: '🌇 Orange to Pink', category: 'Gradient' },
    { id: 'forest-dream', name: 'Forest Dream', colors: '🌿 Green to Teal', category: 'Gradient' },
    { id: 'midnight-aurora', name: 'Midnight Aurora', colors: '🌌 Indigo to Pink', category: 'Gradient' },
    { id: 'cherry-blossom', name: 'Cherry Blossom', colors: '🌸 Pink to Purple', category: 'Gradient' },
    { id: 'arctic-glow', name: 'Arctic Glow', colors: '❄️ Cyan to Indigo', category: 'Gradient' },
    { id: 'golden-hour', name: 'Golden Hour', colors: '✨ Yellow to Red', category: 'Gradient' },
    
    // Photo Backgrounds
    { id: 'study-focus', name: 'Library Study', colors: '📚 Classic Library', category: 'Study Spaces' },
    { id: 'deep-work', name: 'Forest Path', colors: '🌲 Nature Focus', category: 'Nature' },
    { id: 'mountain-zen', name: 'Mountain Peak', colors: '⛰️ Misty Mountains', category: 'Nature' },
    { id: 'forest-light', name: 'Forest Sunbeam', colors: '🌳 Golden Light', category: 'Nature' },
    { id: 'coding-night', name: 'Circuit Board', colors: '💻 Tech Vibes', category: 'Tech' },
    { id: 'modern-workspace', name: 'MacBook Setup', colors: '🖥️ Modern Office', category: 'Workspace' },
    { id: 'minimalist-desk', name: 'Clean Workspace', colors: '✨ Minimalist', category: 'Workspace' },
    { id: 'laptop-study', name: 'Laptop Study', colors: '💻 Study Mode', category: 'Study Spaces' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-white">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-6">
          {/* Theme Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-white" />
              <h3 className="text-lg font-medium text-white">Appearance</h3>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm text-white/70">Select theme:</label>
              <Select value={currentTheme} onValueChange={onThemeChange}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20 text-white max-h-60">
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id} className="hover:bg-white/10">
                      <div>
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-xs text-white/60">{theme.colors}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-pink-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Trending Backgrounds!</span>
              </div>
              <p className="text-xs text-white/70">
                New aesthetic backgrounds added: Mountain Zen, Cherry Blossom, Arctic Glow, and more study-focused environments!
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-white" />
              <h3 className="text-lg font-medium text-white">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">Browser notifications</div>
                  <div className="text-white/60 text-xs">Get notified when timer finishes</div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">Sound alerts</div>
                  <div className="text-white/60 text-xs">Play sound when session ends</div>
                </div>
                <Switch
                  checked={sounds}
                  onCheckedChange={setSounds}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Timer Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Music className="h-5 w-5 text-white" />
              <h3 className="text-lg font-medium text-white">Timer</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">Auto-start breaks</div>
                  <div className="text-white/60 text-xs">Automatically start break sessions</div>
                </div>
                <Switch
                  checked={autoBreak}
                  onCheckedChange={setAutoBreak}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-white" />
              <h3 className="text-lg font-medium text-white">About</h3>
            </div>
            
            <div className="space-y-3 text-sm text-white/70">
              <p>
                <strong className="text-white">Focus with me.io</strong> - A modern Pomodoro timer designed to boost your productivity and focus.
              </p>
              <p>
                Created by <strong className="text-pink-400">Gali Vamsee Krishna</strong>
              </p>
              <p>
                Based on the Pomodoro Technique® - work in focused 25-minute intervals followed by short breaks.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-white text-gray-900 hover:bg-white/90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
