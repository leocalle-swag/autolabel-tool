// components/Header.tsx
import { Button } from '@/components/ui/button';
import { Github, Settings2 } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          AutoLabel AI
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/auto-label" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Start Labeling
          </Link>
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </Link>
          <Link href="/profile"  className="flex text-sm text-muted-foreground hover:text-foreground transition-colors"> <Settings2/> </Link> 
          <Button variant="outline" size="sm" className="gap-2">
            <Github size={16} />
            Github
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;