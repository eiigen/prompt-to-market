import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GenerateForm from '../components/GenerateForm';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = (idea: string) => {
    setIsLoading(true);
    sessionStorage.setItem('product_idea', idea);
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <main className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Type a product idea.<br />Get a launch kit.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8">
          Landing page copy, social posts, hero image, logo — generated in 60 seconds.
        </p>
        <GenerateForm onGenerate={handleGenerate} isLoading={isLoading} />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { n: '1', title: 'Type your idea', desc: 'One sentence. That\'s it.' },
            { n: '2', title: 'AI generates everything', desc: 'Copy, images, social posts — all at once.' },
            { n: '3', title: 'Download and launch', desc: 'Copy, download, or regenerate anything.' },
          ].map((s) => (
            <div key={s.n} className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <div className="text-2xl mb-2 text-blue-400">{s.n}</div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-gray-500 text-sm">Powered by Pollinations AI · Bring Your Own Pollen</p>
      </main>
    </div>
  );
}
