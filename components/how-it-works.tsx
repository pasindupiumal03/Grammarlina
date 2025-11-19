import { Download, Key, Zap } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: Download,
    title: 'Claim Your Trial',
    description: 'Start your 14-day free trial instantly. No credit card required. Get immediate access to all premium features.',
  },
  {
    number: '2',
    icon: Key,
    title: 'Activate Your Account',
    description: 'Follow our simple setup process. Link your Grammarly account to your browser or apps in seconds.',
  },
  {
    number: '3',
    icon: Zap,
    title: 'Start Writing Better',
    description: 'Enjoy unlimited premium writing features. Watch as Grammarly enhances your writing across all platforms.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three quick steps to affordable, premium writing tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-background border border-border rounded-xl p-8 text-center h-full flex flex-col">
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary text-primary-foreground font-bold text-xl mx-auto mb-6">
                    {step.number}
                  </div>
                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <div className="text-primary text-3xl">→</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
