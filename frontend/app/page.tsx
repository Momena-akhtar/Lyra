import Image from "next/image";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">Theme Test</h1>
      
      <div className="space-y-4">
        <p>Background and text colors working</p>
        
        <div 
          className="p-4 rounded-lg text-black font-semibold"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Primary yellow color test
        </div>
        
        <button 
          className="px-6 py-2 rounded-md font-medium"
          style={{ backgroundColor: 'var(--primary)', color: '#000' }}
        >
          Primary Button
        </button>
      </div>
    </main>
  );
}