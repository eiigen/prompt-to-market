import { useState } from 'react';
import { getImageUrl } from '../lib/pollinations';
import { IMAGE_PROMPTS } from '../lib/prompts';
import type { ImageOutput as ImageOutputType } from '../lib/types';

interface Props {
  output: ImageOutputType;
  idea: string;
  onUpdate: (id: string, url: string) => void;
}

export default function ImageOutput({ output, idea, onUpdate }: Props) {
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = () => {
    setRegenerating(true);
    const prompt = IMAGE_PROMPTS[output.type](idea);
    const url = getImageUrl(prompt, output.width, output.height);
    setTimeout(() => { onUpdate(output.id, url); setRegenerating(false); }, 500);
  };

  if (output.status === 'error') return (
    <div>
      <p className="text-red-400 text-sm">{output.error}</p>
      <button onClick={handleRegenerate} className="text-blue-400 text-sm underline mt-1">Retry</button>
    </div>
  );

  return (
    <div>
      {output.url && !regenerating ? (
        <div>
          <img src={output.url} alt={output.type} className="w-full rounded" loading="lazy" />
          <div className="flex gap-3 mt-2">
            <a href={output.url} download={idea + '-' + output.type + '.jpg'} className="text-blue-400 text-sm underline">Download</a>
            <button onClick={handleRegenerate} className="text-blue-400 text-sm underline">Regenerate</button>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-800 rounded animate-pulse flex items-center justify-center">
          <p className="text-gray-500">{regenerating ? 'Regenerating...' : 'Loading...'}</p>
        </div>
      )}
    </div>
  );
}
