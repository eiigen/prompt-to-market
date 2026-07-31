import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { AnyOutput, TextOutput, ImageOutput } from '../lib/types';

interface Props {
  outputs: AnyOutput[];
  idea: string;
}

export default function DownloadAll({ outputs, idea }: Props) {
  const handleDownload = async () => {
    const zip = new JSZip();
    const done = outputs.filter((o) => o.status === 'done');
    for (const o of done) {
      if ('content' in o) {
        zip.file('copy/' + o.type + '.txt', (o as TextOutput).content);
      } else if ('url' in o && (o as ImageOutput).url) {
        try {
          const res = await fetch((o as ImageOutput).url);
          const blob = await res.blob();
          zip.file('visuals/' + o.type + '.jpg', blob);
        } catch {}
      }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, idea + '-launch-kit.zip');
  };

  const count = outputs.filter((o) => o.status === 'done').length;
  if (count === 0) return null;

  return (
    <button onClick={handleDownload}
      className="bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg px-4 py-2 transition-all hover:shadow-glow-sm hover:-translate-y-0.5 active:translate-y-0 text-sm">
      Download All ({count})
    </button>
  );
}
