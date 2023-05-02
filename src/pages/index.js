import Image from 'next/image';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { PlayBar } from '@/components/PlayBar';

const inter = Inter({ subsets: ['latin'] });

const SEO = () => (
  <Head>
    <title>Spotify Clone</title>
  </Head>
);

export default function Home() {
  return (
    <>
      <SEO />
      <div className='bg-black h-screen overflow-hidden'>
        <main className='flex h-full'>
          <Sidebar />
          <MainContent />
        </main>
        <div className='absolute bottom-0 left-0 right-0'>
          <PlayBar />
        </div>
      </div>
    </>
  );
}
