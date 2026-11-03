export default function Home() {
  return (
    <main className="min-h-screen bg-[#128ced] text-[#1f2a24]">
      {/* Full-width Logo */}
      <div className="w-full px-4 pt-6 sm:px-8 sm:pt-8">
        <img
          src="/thankdogitsfriday.png"
          alt="Thank Dog It's Friday"
          className="mx-auto h-auto w-full max-w-6xl object-contain"
        />
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
        {/* Title */}
        <section className="text-center">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Medford/Grants Pass Dog Sitter
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#647067] sm:text-lg">
            Looking for someone you can trust with your dog while you&apos;re
            away? Tell me a little about you and your pup below.
          </p>
        </section>

        {/* Questions */}
        <form className="mt-12 grid gap-6 rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-sm sm:p-10">
          <Input label="What is your name?" placeholder="Your name" />

          <Input
            label="What is your phone number?"
            placeholder="(555) 555-5555"
            type="tel"
          />

          <Input
            label="What is your email?"
            placeholder="you@example.com"
            type="email"
          />

          <Input label="What is your dog's name?" placeholder="Dog's name" />

          <Input
            label="What breed is your dog?"
            placeholder="Golden Retriever, Lab, etc."
          />

          <Input
            label="How many dogs do you have?"
            placeholder="1"
            type="number"
          />

          <Input
            label="What dates do you need a dog sitter?"
            placeholder="September 12–15"
          />

          <label className="grid gap-2 text-[15px] font-bold sm:text-base">
            Tell me about your dog.
            <textarea
              className="min-h-36 resize-y rounded-xl border border-black/10 bg-[#fffdf9] px-4 py-3 font-normal leading-6 outline-none transition focus:border-[#315c47] focus:ring-2 focus:ring-[#315c47]/10"
              placeholder="Personality, feeding schedule, medications, walks, special instructions, etc."
            />
          </label>

          <label className="grid gap-2 text-[15px] font-bold sm:text-base">
            Is there anything else I should know?
            <textarea
              className="min-h-28 resize-y rounded-xl border border-black/10 bg-[#fffdf9] px-4 py-3 font-normal leading-6 outline-none transition focus:border-[#315c47] focus:ring-2 focus:ring-[#315c47]/10"
              placeholder="Anything else you'd like to share..."
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-[#315c47] px-8 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-[#274b3a]"
          >
            Send Request
          </button>
        </form>

        {/* Meet the Owner */}
        <section className="mt-20 rounded-[2rem] bg-[#eef3ed] px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Meet the Owner
          </h2>

          <p className="mt-6 text-base leading-8 text-[#526158] sm:text-lg">
            Hi, I&apos;m Ava! I&apos;m a local dog sitter serving the Medford
            and Grants Pass area. I&apos;ve always loved animals and know how
            important it is to have someone you trust taking care of your dog
            while you&apos;re away.
          </p>

          <p className="mt-4 text-base leading-8 text-[#526158] sm:text-lg">
            My goal is to make sure every dog feels safe, comfortable, and
            loved. I&apos;ll treat your dog like one of my own and keep you
            updated so you can relax knowing they&apos;re in good hands.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-black/10 pt-8 text-center text-sm text-[#6b756e]">
          © 2026 Thank Dog It&apos;s Friday
        </footer>
      </div>
    </main>
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
    <label className="grid gap-2 text-[15px] font-bold sm:text-base">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-xl border border-black/10 bg-[#fffdf9] px-4 py-3 font-normal outline-none transition focus:border-[#315c47] focus:ring-2 focus:ring-[#315c47]/10"
      />
    </label>
  );
}