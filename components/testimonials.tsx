'use client'

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Student",
      avatar: "SM",
      rating: 5,
      text: "Grammarlina gives me full Grammarly Premium for less than a coffee! My essays have never looked better and I saved hundreds of dollars.",
    },
    {
      id: 2,
      name: "James Rodriguez",
      role: "Freelance Writer",
      avatar: "JR",
      rating: 5,
      text: "The lifetime plan is absolutely insane value. I've already made back the $49 investment with better client work. Highly recommend!",
    },
    {
      id: 3,
      name: "Emma Chen",
      role: "Content Creator",
      avatar: "EC",
      rating: 5,
      text: "No hidden fees, instant access, and I can cancel the monthly anytime. This is 100% legit. Finally affordable premium writing tools!",
    },
    {
      id: 4,
      name: "Marcus Thompson",
      role: "Professional",
      avatar: "MT",
      rating: 5,
      text: "Been using Grammarlina for 6 months now. The customer support is amazing and the pricing is unbeatable compared to paying Grammarly directly.",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "English Teacher",
      avatar: "LA",
      rating: 5,
      text: "I recommended this to my entire class. All my students got premium access for $1.99/month. Best decision ever for their writing skills!",
    },
    {
      id: 6,
      name: "David Park",
      role: "Blogger",
      avatar: "DP",
      rating: 5,
      text: "The 14-day free trial convinced me immediately. No credit card needed, no tricks. I've been a happy customer ever since.",
    },
  ]

  return (
    <section className="py-16 px-4 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Trusted By Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-2">
            Trusted by <span className="text-primary">10,000+</span> Users
          </h3>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Join thousands of students, professionals, and writers who are already saving money and improving their writing with Grammarlina.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</p>
            <p className="text-foreground/60">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</p>
            <p className="text-foreground/60">Savings vs Official</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9★</p>
            <p className="text-foreground/60">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</p>
            <p className="text-foreground/60">Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
