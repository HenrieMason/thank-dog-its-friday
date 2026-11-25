import Link from "next/link";

const SERVICES = [
  {
    id: "pet", href: "/pet-sitting",
    title: "Pet Sitting",
    price: "$100 / day",
    description: "Three Visits Daily",
    detail: "+ $5 per additional pet per day",
  },
  {
    id: "farm", href: "/farm-sitting",
    title: "Farm Sitting",
    price: "$90 / day",
    description: "Two Visits Daily",
    detail: "Custom morning and night visit times",
  },
  {
    id: "walk", href: "/dog-walks",
    title: "Dog Walks",
    price: "$25 / walk",
    description: "Choose 1–5 walks per day",
    detail: "+ $5 per additional dog per walk",
  },
];

// Add actual photo paths here.
const gallery: { src: string; alt: string }[] = [];
const faqs = [
  ["What areas do you serve?", "Grants Pass, Central Point, Medford, White City and Eagle Point."],
  ["What animals do you care for?", "Dogs, cats, horses, goats and fish."],
  ["Can I choose visit times?", "Yes. Select your preferred times in the booking form."],
  ["When is payment due?", "After your request is reviewed, the full amount is due before your scheduled service."],
  ["What should I provide?", "Please provide all food and medications for your pets."],
];
export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#128ced] text-white">
      {/* Logo */}
      <div className="w-full px-20 pt-6 sm:px-40 sm:pt-8">
        <img
          src="/thankdogitsfriday.webp"
          alt="Thank Dog It's Friday"
          className="mx-auto block h-auto w-full max-w-md object-contain"
        />
      </div>

      {/* Subtitle */}
      <div className="px-5 text-center">
        <h1 className="text-base font-semibold text-white sm:text-lg">
          Southern Oregon Pet Sitter
        </h1>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-12 pt-6 sm:px-6 sm:pb-16">
        {/* Cities and Animals - Blue Bubble */}
        <section className="w-full rounded-[2rem] border border-white/20 bg-white/15 px-4 py-3 text-center text-white shadow-sm sm:px-10">
          <p className="text-sm font-bold leading-6 sm:text-base">
            Dogs • Cats • Horses • Goats • Fish
          </p>

          <p className="mt-1 text-[11px] font-medium leading-5 sm:text-xs">
            Grants Pass • Central Point • Medford • White City • Eagle Point
          </p>
        </section>

        {/* Meet the Owner */}
        <section className="mt-6 rounded-[2rem] border border-white/20 bg-white/15 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Meet the Owner
          </h2>

          <h3 className="mt-5 text-xl font-bold sm:text-2xl">
            Hi, I&apos;m Ava!
          </h3>

          <p className="mt-5 text-base leading-8 text-white/95 sm:text-lg">
            I&apos;ve called the Rogue Valley home since 2018,
            and caring for animals has always been a huge part
            of my life. From dogs and cats to horses and farm
            animals, I love getting to know each animal&apos;s
            unique personality.
          </p>

          <p className="mt-4 text-base leading-8 text-white/95 sm:text-lg">
            Whether your pet is energetic and playful, shy and
            nervous, or a senior who needs a little extra attention,
            my goal is to give them the same patience, affection,
            and care I&apos;d want someone to give my own.
          </p>

          <p className="mt-7 text-lg font-black leading-8 sm:text-xl">
            Because your dog deserves a good Friday, every day
          </p>

          <p className="mt-1 text-lg font-bold sm:text-xl">
            — and you do too! 🐾
          </p>
        </section>


        <section id="services" className="mt-6 rounded-[2rem] bg-white p-5 text-[#1f2a24] shadow-xl sm:p-8">
          <h2 className="mb-5 text-center text-2xl font-black text-[#128ced]">Services and Pricing</h2>
          <div className="grid gap-3">
            {SERVICES.map(item => (
              <Link key={item.id} href={item.href} className="block rounded-2xl border-2 border-[#128ced]/20 bg-[#f5f9ff] p-5 transition hover:border-[#128ced]">
                <div className="flex flex-wrap justify-between gap-2 text-xl font-black text-[#128ced]"><span>{item.title}</span><span>{item.price}</span></div>
                <p className="mt-2 text-sm">{item.description}</p>
                <p className="mt-1 text-xs font-semibold">{item.detail}</p>
                <p className="mt-4 font-bold text-[#128ced]">Request Booking →</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-6 rounded-[2rem] border border-white/20 bg-white/15 p-5 text-center sm:p-8">
          <h2 className="mb-5 text-2xl font-black">Doggo Gallery</h2>
          <div className="grid grid-cols-3 gap-3">
            {gallery.length ? gallery.map(photo => <img key={photo.src} src={photo.src} alt={photo.alt} className="aspect-square w-full rounded-xl object-cover" />) : Array.from({length: 6}, (_, i) => <div key={i} aria-hidden="true" className="grid aspect-square place-items-center rounded-xl bg-white/20 text-3xl">🐾</div>)}
          </div>
          {!gallery.length && <p className="mt-4 text-sm">Pet photos coming soon!</p>}
        </section>
        <section className="mt-6 rounded-[2rem] border border-white/20 bg-white/15 p-5 sm:p-8">
          <h2 className="mb-5 text-center text-2xl font-black">How It Works</h2>
          <div className="grid gap-5">
            {[["Choose your service", "Pick the care that fits your pets."], ["Submit a request", "Enter your pet details, dates and preferred times."], ["Confirm your booking", "We review your request and contact you. Payment is due before service."], ["Enjoy your time away", "Leave the food and medications your pets need ready for their visits."]].map(([title,detail],i) => <div key={title} className="flex items-start gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 font-black">{i+1}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6">{detail}</p></div></div>)}
          </div>
        </section>
        <section className="mt-6 rounded-[2rem] border border-white/20 bg-white/15 p-5 sm:p-8">
          <h2 className="mb-5 text-center text-2xl font-black">FAQ</h2>
          {faqs.map(([q,a]) => <details key={q} className="border-b border-white/20 py-4 last:border-0"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-3 text-sm leading-6 text-white/95">{a}</p></details>)}
        </section>
        {/* Footer */}
        <footer className="mt-6 border-t border-white/25 pt-8 text-center text-sm text-white/80">
          © 2026 Thank Dog It&apos;s Friday
        </footer>
      </div>
    </main>
  );
}
