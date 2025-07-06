
import { useState } from 'react';
import { Plus, X, Check, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  title: string;
  tag: string;
  completed: boolean;
  pomodoros: number;
  estimatedPomodoros: number;
}

const taskTags = [
  { label: '📖 Study', value: 'study', color: 'bg-blue-500' },
  { label: '✍️ Writing', value: 'writing', color: 'bg-green-500' },
  { label: '🧪 Review', value: 'review', color: 'bg-purple-500' },
  { label: '💻 Code', value: 'code', color: 'bg-orange-500' },
  { label: '📝 Planning', value: 'planning', color: 'bg-pink-500' },
];

export const TaskPanel = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete React Components',
      tag: 'code',
      completed: false,
      pomodoros: 2,
      estimatedPomodoros: 4
    },
    {
      id: '2',
      title: 'Study Advanced Mathematics',
      tag: 'study',
      completed: false,
      pomodoros: 1,
      estimatedPomodoros: 3
    }
  ]);
  
  const [newTask, setNewTask] = useState('');
  const [selectedTag, setSelectedTag] = useState('study');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        tag: selectedTag,
        completed: false,
        pomodoros: 0,
        estimatedPomodoros
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setEstimatedPomodoros(1);
      setShowAddForm(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getTagInfo = (tagValue: string) => {
    return taskTags.find(tag => tag.value === tagValue) || taskTags[0];
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 h-full border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <ListTodo className="h-5 w-5" />
          Today's Tasks
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <Input
            placeholder="Enter task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="mb-3 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          
          <div className="flex gap-2 mb-3">
            {taskTags.map((tag) => (
              <button
                key={tag.value}
                onClick={() => setSelectedTag(tag.value)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedTag === tag.value 
                    ? 'bg-white text-gray-900' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-white/60" />
            <Input
              type="number"
              min="1"
              max="10"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value) || 1)}
              className="w-16 bg-white/10 border-white/20 text-white text-center"
            />
            <span className="text-white/60 text-sm">pomodoros</span>
          </div>

          <div className="flex gap-2">
            <Button onClick={addTask} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
              Add Task
            </Button>
            <Button 
              onClick={() => setShowAddForm(false)} 
              size="sm" 
              variant="ghost" 
              className="text-white/60 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const tagInfo = getTagInfo(task.tag);
          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${
                task.completed 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-white/40 hover:border-white/60'
                  }`}
                >
                  {task.completed && <Check className="h-3 w-3 text-white" />}
                </button>

                <div className="flex-1">
                  <h3 className={`font-medium mb-2 ${
                    task.completed ? 'text-white/60 line-through' : 'text-white'
                  }`}>
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span className={`px-2 py-1 rounded-full text-xs ${tagInfo.color} text-white`}>
                        {tagInfo.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-white/60">
                      <Clock className="h-3 w-3" />
                      <span>{task.pomodoros}/{task.estimatedPomodoros}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 bg-white/10 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-pink-400 to-purple-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((task.pomodoros / task.estimatedPomodoros) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Progress */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-2">Daily Progress</h3>
        <div className="text-2xl font-bold text-white mb-1">
          {tasks.reduce((acc, task) => acc + task.pomodoros, 0)} / {tasks.reduce((acc, task) => acc + task.estimatedPomodoros, 0)}
        </div>
        <p className="text-white/60 text-sm">Pomodoros completed today</p>
        
        <div className="mt-3 bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min((tasks.reduce((acc, task) => acc + task.pomodoros, 0) / Math.max(tasks.reduce((acc, task) => acc + task.estimatedPomodoros, 0), 1)) * 100, 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
