
import { useState, useEffect } from 'react';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { SettingsPanel } from '@/components/SettingsPanel';
import { StatsPanel } from '@/components/StatsPanel';
import { Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('seoul-sunrise');

  const themes = {
    'seoul-sunrise': 'bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300',
    'ocean-breeze': 'bg-gradient-to-br from-blue-400 via-teal-400 to-green-300',
    'sunset-vibes': 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-400',
    'forest-dream': 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400',
    'midnight-aurora': 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${themes[currentTheme as keyof typeof themes]}`}>
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-light tracking-wide">focus with me.io</h1>
            <p className="text-white/70 text-sm">BY GALI VAMSEE KRISHNA</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowStats(!showStats)}
              className="text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        <PomodoroTimer />
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />
      )}

      {/* Stats Panel */}
      {showStats && (
        <StatsPanel 
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
};

export default Index;
