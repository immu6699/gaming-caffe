import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShiftStickyNote, StickyNoteColor } from '../../types';
import { sound } from '../../utils/audio';
import {
  Pin,
  Trash2,
  Plus,
  StickyNote,
  Tag,
  Check,
  AlertCircle,
  Coffee,
  Wrench,
  Crown,
  Trophy,
} from 'lucide-react';

interface ShiftStickyNotesBoardProps {
  compact?: boolean;
}

export const ShiftStickyNotesBoard: React.FC<ShiftStickyNotesBoardProps> = ({ compact = false }) => {
  const { stickyNotes, addStickyNote, deleteStickyNote, togglePinStickyNote, currentUser } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<StickyNoteColor>('amber');
  const [tag, setTag] = useState<ShiftStickyNote['tag']>('Handover');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('ALL');

  const colorStyles: Record<
    StickyNoteColor,
    { bg: string; border: string; text: string; header: string; pin: string }
  > = {
    amber: {
      bg: 'bg-amber-950/40 hover:bg-amber-950/60',
      border: 'border-amber-500/50',
      text: 'text-amber-200',
      header: 'text-amber-300',
      pin: 'text-amber-400',
    },
    cyan: {
      bg: 'bg-cyan-950/40 hover:bg-cyan-950/60',
      border: 'border-cyan-500/50',
      text: 'text-cyan-200',
      header: 'text-cyan-300',
      pin: 'text-cyan-400',
    },
    emerald: {
      bg: 'bg-emerald-950/40 hover:bg-emerald-950/60',
      border: 'border-emerald-500/50',
      text: 'text-emerald-200',
      header: 'text-emerald-300',
      pin: 'text-emerald-400',
    },
    purple: {
      bg: 'bg-purple-950/40 hover:bg-purple-950/60',
      border: 'border-purple-500/50',
      text: 'text-purple-200',
      header: 'text-purple-300',
      pin: 'text-purple-400',
    },
    rose: {
      bg: 'bg-rose-950/40 hover:bg-rose-950/60',
      border: 'border-rose-500/50',
      text: 'text-rose-200',
      header: 'text-rose-300',
      pin: 'text-rose-400',
    },
  };

  const getTagIcon = (t: ShiftStickyNote['tag']) => {
    switch (t) {
      case 'Maintenance':
        return <Wrench className="w-3 h-3 text-amber-400" />;
      case 'VIP Customer':
        return <Crown className="w-3 h-3 text-cyan-400" />;
      case 'F&B Alert':
        return <Coffee className="w-3 h-3 text-emerald-400" />;
      case 'Tournament':
        return <Trophy className="w-3 h-3 text-purple-400" />;
      default:
        return <Tag className="w-3 h-3 text-slate-400" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addStickyNote({
      title: title.trim(),
      content: content.trim(),
      author: `${currentUser.name} (${currentUser.role})`,
      color,
      pinned: true,
      tag,
    });

    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const filteredNotes = stickyNotes.filter((n) =>
    selectedTagFilter === 'ALL' ? true : n.tag === selectedTagFilter
  );

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-5 shadow-card-dark">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-dark-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <StickyNote className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white font-gaming tracking-wide">
              FRONT DESK SHIFT MEMOS & STICKY NOTES
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-dark-800 text-slate-300 border border-dark-700">
              {stickyNotes.length} Notes Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time shift handover notes, hardware issues, customer quirks, and reminders between staff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tag Filter */}
          <select
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className="input-field text-xs py-1.5 px-3 bg-dark-850"
          >
            <option value="ALL">All Categories</option>
            <option value="Maintenance">🔧 Hardware Maintenance</option>
            <option value="VIP Customer">👑 VIP Gamer Quirks</option>
            <option value="F&B Alert">☕ F&B Refill Alerts</option>
            <option value="Handover">📋 Shift Handover</option>
            <option value="Tournament">🏆 Tournament Notes</option>
          </select>

          <button
            onClick={() => {
              sound.playClick();
              setIsAdding(!isAdding);
            }}
            className="btn-cyan text-xs py-1.5 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAdding ? 'Cancel' : 'Pin Note'}
          </button>
        </div>
      </div>

      {/* Inline Add Note Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 rounded-xl bg-dark-850 border border-cyan-500/30 shadow-glow-cyan/20 animate-in fade-in duration-150 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5" /> Pin New Shift Note
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">Note Color:</span>
              {(['amber', 'cyan', 'emerald', 'purple', 'rose'] as StickyNoteColor[]).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  } ${
                    c === 'amber'
                      ? 'bg-amber-400 border-amber-500'
                      : c === 'cyan'
                      ? 'bg-cyan-400 border-cyan-500'
                      : c === 'emerald'
                      ? 'bg-emerald-400 border-emerald-500'
                      : c === 'purple'
                      ? 'bg-purple-400 border-purple-500'
                      : 'bg-rose-400 border-rose-500'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Note Title / Subject</label>
              <input
                type="text"
                placeholder="e.g. PC-04 Left Alt Switch loose, replaced with Red switch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-xs py-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Category Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as ShiftStickyNote['tag'])}
                className="input-field text-xs py-2 mt-1"
              >
                <option value="Handover">📋 Shift Handover</option>
                <option value="Maintenance">🔧 Hardware Maintenance</option>
                <option value="VIP Customer">👑 VIP Gamer Quirk</option>
                <option value="F&B Alert">☕ F&B Refill Alert</option>
                <option value="Tournament">🏆 Tournament / LAN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Details / Staff Message</label>
            <textarea
              placeholder="Write the notes for your colleague or next shift crew..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field text-xs py-2 mt-1 h-20 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button type="submit" className="btn-cyan text-xs py-1.5 px-4 font-bold">
              Pin to Board
            </button>
          </div>
        </form>
      )}

      {/* Grid of Sticky Notes */}
      <div className={`mt-4 grid gap-3.5 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-8 text-center bg-dark-850/50 border border-dashed border-dark-750 rounded-xl">
            <StickyNote className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-medium">No shift notes in this category.</p>
            <p className="text-[11px] text-slate-500">Pin one above to keep your team aligned!</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const style = colorStyles[note.color] || colorStyles.amber;
            return (
              <div
                key={note.id}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 shadow-md ${
                  style.bg
                } ${style.border} ${
                  note.pinned ? 'shadow-glow-cyan/10' : 'opacity-85'
                } group hover:scale-[1.02] flex flex-col justify-between`}
              >
                {/* Pin Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-dark-950/60 border border-dark-800 text-slate-300">
                      {getTagIcon(note.tag)}
                      {note.tag}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        title={note.pinned ? 'Unpin note' : 'Pin note'}
                        onClick={() => togglePinStickyNote(note.id)}
                        className={`p-1 rounded hover:bg-dark-900/50 transition-colors ${
                          note.pinned ? style.pin : 'text-slate-500'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        title="Delete note"
                        onClick={() => deleteStickyNote(note.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className={`text-xs font-bold ${style.header} line-clamp-2 leading-snug mb-1.5`}>
                    {note.title}
                  </h4>

                  <p className={`text-xs ${style.text} leading-relaxed whitespace-pre-wrap font-sans text-slate-300/90`}>
                    {note.content}
                  </p>
                </div>

                {/* Author & Timestamp */}
                <div className="mt-3 pt-2.5 border-t border-dark-800/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-medium truncate max-w-[130px]">{note.author}</span>
                  <span className="font-mono text-slate-500">{note.createdAt}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
