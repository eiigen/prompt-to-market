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

  if (output.status === 'loading' || busy) return <p className="text-gray-500 animate-pulse">Generating...</p>;
  if (output.status === 'error') return (
    <div>
      <p className="text-red-400 text-sm">{output.error}</p>
      <button onClick={regenerate} className="text-blue-400 text-sm underline mt-1">Retry</button>
    </div>
  );

  return (
    <div>
      {editing ? (
        <div>
          <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm min-h-[100px] text-white" />
          <div className="flex gap-2 mt-2">
            <button onClick={regenerateFromEdit} className="text-blue-400 text-sm underline">Regenerate from edit</button>
            <button onClick={() => setEditing(false)} className="text-gray-500 text-sm underline">Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <pre className="whitespace-pre-wrap text-sm text-gray-300">{output.content}</pre>
          <div className="flex gap-3 mt-2">
            <button onClick={() => navigator.clipboard.writeText(output.content)} className="text-blue-400 text-sm underline">Copy</button>
            <button onClick={() => { setEditText(output.content); setEditing(true); }} className="text-blue-400 text-sm underline">Edit</button>
            <button onClick={regenerate} className="text-blue-400 text-sm underline">Regenerate</button>
          </div>
        </div>
      )}
    </div>
  );
}
