import { CheckCircle2, Zap, BarChart3, MessageSquare, Lightbulb, Settings } from 'lucide-react'

const features = [
  {
    icon: CheckCircle2,
    title: 'AI Writing Enhancements',
    description: 'Get intelligent suggestions for tone, clarity, and style with advanced AI analysis.',
  },
  {
    icon: Zap,
    title: 'Grammar & Spell Check',
    description: 'Catch every error instantly with our powerful grammar checking engine.',
  },
  {
    icon: BarChart3,
    title: 'Writing Analytics',
    description: 'Track your writing progress with detailed insights and personalized feedback.',
  },
  {
    icon: MessageSquare,
    title: 'Tone Detector',
    description: 'Ensure your message has the right tone for every situation and audience.',
  },
  {
    icon: Lightbulb,
    title: 'Style Guide',
    description: 'Follow your style guide automatically across all your writing.',
  },
  {
    icon: Settings,
    title: 'Full Customization',
    description: 'Personalize Grammarly to match your unique writing style and preferences.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <div className="relative">
            <img 
              src="/grammarly-logo.png" 
              alt="Grammarly Logo" 
              className="h-16 sm:h-20 md:h-24 object-contain"
            />
          </div>
        </div>

        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Premium Features, Tiny Price
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to write better, faster, and with confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-background border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
