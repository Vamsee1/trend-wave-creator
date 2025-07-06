
import { useState, useEffect } from 'react';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { SettingsPanel } from '@/components/SettingsPanel';
import { StatsPanel } from '@/components/StatsPanel';
import { TaskPanel } from '@/components/TaskPanel';
import { Settings, BarChart3, ListTodo, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('seoul-sunrise');

  const themes = {
    'seoul-sunrise': 'bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300',
    'ocean-breeze': 'bg-gradient-to-br from-blue-400 via-teal-400 to-green-300',
    'sunset-vibes': 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-400',
    'forest-dream': 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400',
    'midnight-aurora': 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    'study-focus': 'bg-[url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80")] bg-cover bg-center bg-fixed',
    'deep-work': 'bg-[url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")] bg-cover bg-center bg-fixed'
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${themes[currentTheme as keyof typeof themes]} ${isFullscreen ? 'p-0' : ''}`}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      {/* Header */}
      {!isFullscreen && (
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
                onClick={() => setShowTasks(!showTasks)}
                className="text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <ListTodo className="h-5 w-5" />
              </Button>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Layout */}
      <div className="relative z-10 flex min-h-[calc(100vh-8rem)]">
        {/* Left Side - Tasks Panel */}
        {showTasks && !isFullscreen && (
          <div className="w-80 p-6">
            <TaskPanel />
          </div>
        )}

        {/* Right Side - Timer */}
        <div className={`flex-1 flex flex-col items-center justify-center px-6 ${isFullscreen ? 'min-h-screen' : ''}`}>
          <PomodoroTimer isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
        </div>
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
