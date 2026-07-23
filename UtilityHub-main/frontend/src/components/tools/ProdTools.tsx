import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Plus, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';

interface ToolProps {
  toolId: string;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}

export const ProdTools: React.FC<ToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  // 1. To-Do List States
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('todo_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
    setTaskInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // 2. Notes States
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('prod_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  useEffect(() => {
    localStorage.setItem('prod_notes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (!noteTitle.trim()) return;
    const newNote = {
      id: activeNote ? activeNote.id : Date.now(),
      title: noteTitle,
      content: noteContent,
      date: new Date().toLocaleDateString()
    };
    if (activeNote) {
      setNotes(notes.map(n => n.id === activeNote.id ? newNote : n));
    } else {
      setNotes([newNote, ...notes]);
    }
    setNoteTitle('');
    setNoteContent('');
    setActiveNote(null);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
    if (activeNote?.id === id) {
      setNoteTitle('');
      setNoteContent('');
      setActiveNote(null);
    }
  };

  // 3. Pomodoro States
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoSession, setPomoSession] = useState<'work' | 'break'>('work');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (pomoActive) {
      timerRef.current = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(pomoSeconds - 1);
        } else if (pomoSeconds === 0) {
          if (pomoMinutes === 0) {
            // Session switch
            if (pomoSession === 'work') {
              setPomoSession('break');
              setPomoMinutes(5);
            } else {
              setPomoSession('work');
              setPomoMinutes(25);
            }
            alert('Timer Session Completed!');
          } else {
            setPomoMinutes(pomoMinutes - 1);
            setPomoSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [pomoActive, pomoMinutes, pomoSeconds, pomoSession]);

  const resetPomo = () => {
    setPomoActive(false);
    setPomoMinutes(25);
    setPomoSeconds(0);
    setPomoSession('work');
  };

  // 4. Password Generator States
  const [passLength, setPassLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNums, setIncludeNums] = useState(true);
  const [includeSyms, setIncludeSyms] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('');

  const generatePass = () => {
    let pool = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNums) pool += '0123456789';
    if (includeSyms) pool += '!@#$%^&*()_+~}{[]:;?><';

    let result = '';
    for (let i = 0; i < passLength; i++) {
      result += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setGeneratedPass(result);
  };

  // 5. Password Strength states
  const [checkPass, setCheckPass] = useState('');
  const [strengthScore, setStrengthScore] = useState({ score: 0, label: 'Very Weak', color: 'bg-red-500' });

  const checkStrength = (pass: string) => {
    setCheckPass(pass);
    if (!pass) {
      setStrengthScore({ score: 0, label: 'Very Weak', color: 'bg-red-550' });
      return;
    }
    let score = 0;
    if (pass.length >= 8) score += 20;
    if (pass.length >= 12) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    let label = 'Very Weak';
    let color = 'bg-red-500';
    if (score >= 40 && score < 60) {
      label = 'Weak';
      color = 'bg-orange-500';
    } else if (score >= 60 && score < 80) {
      label = 'Medium';
      color = 'bg-amber-500';
    } else if (score >= 80 && score < 100) {
      label = 'Strong';
      color = 'bg-green-500';
    } else if (score === 100) {
      label = 'Very Strong';
      color = 'bg-emerald-500';
    }
    setStrengthScore({ score, label, color });
  };

  // 6. Stopwatch States
  const [swActive, setSwActive] = useState(false);
  const [swTime, setSwTime] = useState(0); // in deciseconds
  const [laps, setLaps] = useState<number[]>([]);
  const swRef = useRef<any>(null);

  useEffect(() => {
    if (swActive) {
      swRef.current = setInterval(() => {
        setSwTime(prev => prev + 1);
      }, 100);
    } else {
      clearInterval(swRef.current);
    }
    return () => clearInterval(swRef.current);
  }, [swActive]);

  const formatSwTime = (time: number) => {
    const mins = Math.floor(time / 600);
    const secs = Math.floor((time % 600) / 10);
    const deci = time % 10;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${deci}`;
  };

  // 7. Calendar Highlights
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const firstDayIdx = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* 1. Pomodoro Timer */}
      {toolId === 'pomodoro' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-8 bg-white/60 dark:bg-slate-900/60 flex flex-col items-center justify-center gap-6">
          <div className="w-48 h-48 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{pomoSession === 'work' ? 'Work Session' : 'Short Break'}</span>
            <p className="text-4xl font-extrabold text-slate-850 dark:text-white mt-1">
              {pomoMinutes.toString().padStart(2, '0')}:{pomoSeconds.toString().padStart(2, '0')}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={() => setPomoActive(!pomoActive)} variant="secondary" size="sm">
              {pomoActive ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
              {pomoActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetPomo} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
          </div>
        </Card>
      )}

      {/* 2. To-Do List */}
      {toolId === 'todo-list' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Task Checklist</h4>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Add a new task..."
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
              />
            </div>
            <Button onClick={addTask} className="text-xs py-2.5">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/55 dark:bg-slate-950/40 text-xs border border-slate-200/20">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/20 w-4 h-4"
                  />
                  <span className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {task.text}
                  </span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="p-1 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-6">Your tasks will show here.</p>
            )}
          </div>
        </Card>
      )}

      {/* 3. Notes Repository */}
      {toolId === 'notes' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Quick Scratch Notes</h4>
          
          <div className="flex gap-4">
            {/* Sidebar list */}
            <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 pr-4 flex flex-col gap-2 max-h-80 overflow-y-auto">
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] w-full"
                onClick={() => {
                  setActiveNote(null);
                  setNoteTitle('');
                  setNoteContent('');
                }}
              >
                + New Note
              </Button>
              {notes.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    setActiveNote(n);
                    setNoteTitle(n.title);
                    setNoteContent(n.content);
                  }}
                  className={`p-2.5 rounded-lg text-left cursor-pointer transition-colors ${activeNote?.id === n.id ? 'bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-500/20' : 'hover:bg-slate-100/50 dark:hover:bg-slate-950/20'}`}
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                  <span className="text-[9px] text-slate-400">{n.date}</span>
                </div>
              ))}
            </div>

            {/* Editing field */}
            <div className="flex-1 space-y-4">
              <Input placeholder="Note Title..." value={noteTitle} onChange={e => setNoteTitle(e.target.value)} />
              <textarea
                className="w-full h-40 px-3 py-2 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs"
                placeholder="Draft note content here..."
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={saveNote} className="text-xs py-2 w-full">Save note</Button>
                {activeNote && (
                  <Button variant="outline" size="sm" onClick={() => deleteNote(activeNote.id)} className="text-xs py-2 text-red-500">Delete</Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 4. Password Generator */}
      {toolId === 'password-gen' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Secure Credentials Generator</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Length</span>
              <span className="text-indigo-500">{passLength} chars</span>
            </div>
            <input
              type="range"
              min={6}
              max={32}
              value={passLength}
              onChange={e => setPassLength(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 mt-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={includeUpper} onChange={e => setIncludeUpper(e.target.checked)} />
                Uppercase
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={includeNums} onChange={e => setIncludeNums(e.target.checked)} />
                Numbers
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={includeSyms} onChange={e => setIncludeSyms(e.target.checked)} />
                Symbols
              </label>
            </div>
            <Button onClick={generatePass} className="w-full text-xs">Generate Password</Button>
          </div>

          {generatedPass && (
            <div className="relative border border-slate-200/25 dark:border-slate-800/25 rounded-xl p-4 bg-slate-950/90 text-left font-mono flex items-center justify-between">
              <span className="text-xs text-slate-200 break-all">{generatedPass}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generatedPass);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[10px]"
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* 5. Password Strength Checker */}
      {toolId === 'password-strength' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <Input
            label="Evaluate Password"
            type="password"
            placeholder="Type password..."
            value={checkPass}
            onChange={e => checkStrength(e.target.value)}
          />
          {checkPass && (
            <div className="space-y-4">
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${strengthScore.color} transition-all duration-300`} style={{ width: `${strengthScore.score}%` }} />
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">Strength Rank</span>
                <span className="text-indigo-500">{strengthScore.label}</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* 6. Stopwatch */}
      {toolId === 'stopwatch' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 flex flex-col items-center gap-6">
          <div className="text-4xl font-extrabold text-slate-800 dark:text-white font-mono">
            {formatSwTime(swTime)}
          </div>
          
          <div className="flex gap-4">
            <Button onClick={() => setSwActive(!swActive)} variant="secondary" size="sm">
              {swActive ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={() => {
                if (swActive) {
                  setLaps([...laps, swTime]);
                }
              }}
              variant="outline"
              size="sm"
              disabled={!swActive}
            >
              Lap
            </Button>
            <Button
              onClick={() => {
                setSwActive(false);
                setSwTime(0);
                setLaps([]);
              }}
              variant="outline"
              size="sm"
            >
              Reset
            </Button>
          </div>

          {laps.length > 0 && (
            <div className="w-full space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 max-h-40 overflow-y-auto">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Laps Elapsed</p>
              {laps.map((lap, idx) => (
                <div key={idx} className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  <span>Lap {idx + 1}</span>
                  <span className="font-mono">{formatSwTime(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* 7. Calendar */}
      {(toolId === 'calendar' || toolId === 'countdown') && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white text-center">
            {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
          </h4>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {Array(firstDayIdx).fill(null).map((_, idx) => <span key={`empty-${idx}`} />)}
            {Array(daysInMonth).fill(null).map((_, idx) => {
              const day = idx + 1;
              const isToday = day === new Date().getDate();
              return (
                <span
                  key={day}
                  className={`py-2 font-bold rounded-lg ${isToday ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-950'}`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </Card>
      )}

    </div>
  );
};
export default ProdTools;
