export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#1f2a24]">
      {/* Navigation */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-black tracking-tight">
          Thank Dog It&apos;s Friday
        </div>

        <a
          href="#booking"
          className="rounded-full bg-[#315c47] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#274b3a]"
        >
          Request a Booking
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-2 md:pt-24">
        <div>
          <p className="mb-4 font-bold uppercase tracking-[0.2em] text-[#c9734b]">
            Pet Sitting & Animal Care
          </p>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Your pets deserve a good Friday too.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#526158]">
            Dependable, loving pet care while you&apos;re away. Personalized
            attention, regular updates, and plenty of belly rubs included.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#booking"
              className="rounded-full bg-[#315c47] px-7 py-4 font-bold text-white transition hover:bg-[#274b3a]"
            >
              Request Pet Sitting
            </a>

            <a
              href="#services"
              className="rounded-full border-2 border-[#315c47] px-7 py-4 font-bold text-[#315c47] transition hover:bg-[#edf3ee]"
            >
              View Services
            </a>
          </div>
        </div>

        <div className="flex min-h-[420px] items-center justify-center rounded-[2.5rem] bg-[#efd9bf] p-10">
          <div className="text-center">
            <div className="text-8xl">🐶</div>
            <p className="mt-6 text-xl font-bold">
              Your sister&apos;s photo will go here
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="font-bold uppercase tracking-[0.2em] text-[#c9734b]">
              Services
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Care for every kind of best friend.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <ServiceCard
              emoji="🐕"
              title="Dog Sitting"
              text="Personalized care, playtime, feeding, walks, and lots of attention."
            />

            <ServiceCard
              emoji="🐈"
              title="Cat Sitting"
              text="Calm, reliable visits for feeding, litter care, play, and companionship."
            />

            <ServiceCard
              emoji="🐾"
              title="Other Animals"
              text="Have another kind of pet? Reach out and tell us what care they need."
            />
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="font-bold uppercase tracking-[0.2em] text-[#c9734b]">
                Why choose us?
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Pet care you can actually feel good about.
              </h2>
            </div>

            <div className="grid gap-4">
              <Benefit text="Personalized care for every pet" />
              <Benefit text="Photo and text updates while you're away" />
              <Benefit text="Reliable and responsive communication" />
              <Benefit text="Meet-and-greet before your first booking" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-[#315c47] py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <div className="min-h-[350px] rounded-[2rem] bg-white/10" />

          <div className="flex flex-col justify-center">
            <p className="font-bold uppercase tracking-[0.2em] text-[#f2bc8d]">
              About
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Hi, I&apos;m your local pet sitter.
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/80">
              Add your sister&apos;s story here—why she loves animals, her
              experience caring for pets, and why owners can trust her with
              their furry family members.
            </p>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[0.2em] text-[#c9734b]">
              Get Started
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Request a booking.
            </h2>

            <p className="mt-4 text-[#647067]">
              Tell us a little about your pets and the care you need.
            </p>
          </div>

          <form className="mt-12 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Your name" placeholder="Jane Smith" />
              <Input label="Phone" placeholder="(555) 555-5555" />
            </div>

            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Pet type" placeholder="Dog, cat, etc." />
              <Input label="Number of pets" placeholder="1" />
            </div>

            <Input label="Dates needed" placeholder="September 12–15" />

            <label className="grid gap-2 font-semibold">
              Tell us about your pets
              <textarea
                className="min-h-36 rounded-2xl border border-black/10 bg-[#fffaf3] px-4 py-3 font-normal outline-none transition focus:border-[#315c47]"
                placeholder="Names, breeds, routines, medications, special instructions..."
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-full bg-[#315c47] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#274b3a]"
            >
              Request Pet Sitting
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white px-6 py-10 text-center text-sm text-[#6b756e]">
        © 2026 Thank Dog It&apos;s Friday
      </footer>
    </main>
  );
}

function ServiceCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] bg-[#fffaf3] p-8">
      <div className="text-5xl">{emoji}</div>
      <h3 className="mt-6 text-2xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-[#637067]">{text}</p>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#315c47] font-bold text-white">
        ✓
      </div>
      <span className="font-bold">{text}</span>
    </div>
  );
}

function Input({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 font-semibold">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-2xl border border-black/10 bg-[#fffaf3] px-4 py-3 font-normal outline-none transition focus:border-[#315c47]"
      />
    </label>
  );
}