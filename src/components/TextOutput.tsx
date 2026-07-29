import { useState } from 'react';
import { getApiKey } from '../lib/auth';
import { generateText } from '../lib/pollinations';
import { TEXT_PROMPTS } from '../lib/prompts';
import type { TextOutput as TextOutputType } from '../lib/types';

interface Props {
  output: TextOutputType;
  idea: string;
  onUpdate: (id: string, content: string) => void;
}

export default function TextOutput({ output, idea, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(output.content);
  const [busy, setBusy] = useState(false);

  const regenerate = async () => {
    const key = getApiKey();
    if (!key) return;
    setBusy(true);
    try {
      const { system, user } = TEXT_PROMPTS[output.type](idea);
      const content = await generateText(system, user, key);
      onUpdate(output.id, content);
      setEditText(content);
    } catch (e) { console.error(e); }
    setBusy(false);
  };

  const regenerateFromEdit = async () => {
    const key = getApiKey();
    if (!key) return;
    setBusy(true);
    try {
      const base = TEXT_PROMPTS[output.type](idea);
      const system = base.system + '\n\nThe user edited the previous output. Here is their version:\n' + editText + '\n\nImprove it while keeping their intent.';
      const content = await generateText(system, base.user, key);
      onUpdate(output.id, content);
      setEditText(content);
      setEditing(false);
    } catch (e) { console.error(e); }
    setBusy(false);
  };

  if (output.status === 'loading' || busy) return (
    <div className="space-y-2">
      <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/2" />
      <div className="h-4 bg-zinc-800 rounded animate-pulse w-5/6" />
    </div>
  );

  if (output.status === 'error') return (
    <div>
      <p className="text-rose-400 text-sm">{output.error}</p>
      <button onClick={regenerate} className="text-indigo-400 hover:text-indigo-300 text-sm underline mt-1">Retry</button>
    </div>
  );

  return (
    <div>
      {editing ? (
        <div>
          <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-sm min-h-[100px] text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
          <div className="flex gap-3 mt-2">
            <button onClick={regenerateFromEdit} className="text-indigo-400 hover:text-indigo-300 text-sm underline">Regenerate from edit</button>
            <button onClick={() => setEditing(false)} className="text-zinc-500 hover:text-zinc-400 text-sm underline">Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <pre className="whitespace-pre-wrap text-sm text-zinc-300">{output.content}</pre>
          <div className="flex gap-3 mt-2">
            <button onClick={() => navigator.clipboard.writeText(output.content)} className="text-indigo-400 hover:text-indigo-300 text-sm underline">Copy</button>
            <button onClick={() => { setEditText(output.content); setEditing(true); }} className="text-indigo-400 hover:text-indigo-300 text-sm underline">Edit</button>
            <button onClick={regenerate} className="text-indigo-400 hover:text-indigo-300 text-sm underline">Regenerate</button>
          </div>
        </div>
      )}
    </div>
  );
}
