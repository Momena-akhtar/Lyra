import { Hero, VideoBackground, Navbar } from './components';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <VideoBackground />
      <Navbar />
      <Hero />
    </main>
  );
}