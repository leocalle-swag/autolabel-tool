// app/page.tsx
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowRight, Image as ImageIcon, Tags, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold tracking-tight">
                Auto-Label Your Images with AI
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Streamline your dataset creation with our powerful AI-driven image labeling tool. 
                Fast, accurate, and effortless.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/auto-label">
                  <Button size="lg" className="gap-2">
                    Start Labeling <ArrowRight size={16} />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Features
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Batch Processing</h3>
                <p className="text-muted-foreground">
                  Upload and process multiple images simultaneously for maximum efficiency.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Leverage advanced AI models for accurate and consistent image labeling.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Tags className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Custom Labels</h3>
                <p className="text-muted-foreground">
                  Define your own labeling criteria with flexible prompt-based instructions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="space-y-4">
                <div className="text-4xl font-bold text-primary">01</div>
                <h3 className="text-xl font-semibold">Upload Images</h3>
                <p className="text-muted-foreground">
                  Select multiple images to process. Supports various formats including JPG, PNG, and WebP.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="text-4xl font-bold text-primary">02</div>
                <h3 className="text-xl font-semibold">Define Labels</h3>
                <p className="text-muted-foreground">
                  Enter your labeling instructions using natural language prompts.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="text-4xl font-bold text-primary">03</div>
                <h3 className="text-xl font-semibold">Get Results</h3>
                <p className="text-muted-foreground">
                  Review and download your labeled dataset with detailed statistics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Transform your image labeling workflow today.
            </p>
            <Link href="/auto-label">
              <Button size="lg" variant="secondary" className="gap-2">
                Try AutoLabel Now <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 AutoLabel AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}