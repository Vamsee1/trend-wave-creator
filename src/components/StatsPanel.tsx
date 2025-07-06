
import { X, TrendingUp, Clock, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsPanel = ({ isOpen, onClose }: StatsPanelProps) => {
  if (!isOpen) return null;

  // Mock data - in a real app, this would come from localStorage or a database
  const stats = {
    todayFocus: 120, // minutes
    weeklyStreak: 5,
    totalSessions: 47,
    longestStreak: 12,
    averageDaily: 95,
    completionRate: 89
  };

  const achievements = [
    { id: 1, name: "First Focus", description: "Complete your first session", earned: true },
    { id: 2, name: "Week Warrior", description: "Focus for 7 days straight", earned: true },
    { id: 3, name: "Century Club", description: "Complete 100 sessions", earned: false },
    { id: 4, name: "Marathon Master", description: "Focus for 10 hours in a day", earned: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-pink-400" />
            <h2 className="text-2xl font-light text-white">Your Progress</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Today's Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Focus
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-white">{stats.todayFocus}m</div>
              <div className="text-white/70 text-sm">Focus Time</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-pink-400">{stats.weeklyStreak}</div>
              <div className="text-white/70 text-sm">Day Streak</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Daily Goal</span>
              <span>{stats.todayFocus}/150 min</span>
            </div>
            <div className="bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.todayFocus / 150) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            All Time
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <div className="text-xl font-bold text-white">{stats.totalSessions}</div>
              <div className="text-white/60 text-xs">Sessions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <div className="text-xl font-bold text-orange-400">{stats.longestStreak}</div>
              <div className="text-white/60 text-xs">Best Streak</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <div className="text-xl font-bold text-green-400">{stats.completionRate}%</div>
              <div className="text-white/60 text-xs">Complete</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </h3>
          
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  achievement.earned 
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-yellow-500' : 'bg-white/10'
                  }`}>
                    <Award className={`h-5 w-5 ${achievement.earned ? 'text-white' : 'text-white/40'}`} />
                  </div>
                  <div>
                    <div className={`font-medium ${achievement.earned ? 'text-yellow-400' : 'text-white/60'}`}>
                      {achievement.name}
                    </div>
                    <div className="text-white/50 text-sm">{achievement.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8">
          <Button
            onClick={onClose}
            className="w-full bg-white text-gray-900 hover:bg-white/90 rounded-xl py-3"
          >
            Keep Focusing!
          </Button>
        </div>
      </div>
    </div>
  );
};
