
"use client";

import { useState } from "react";

export default function Home() {
  const [petCount, setPetCount] = useState(0);

  return (
    <main className="min-h-screen bg-[#128ced] text-white">
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
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Southern Oregon Dog Sitter
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            Looking for someone you can trust with your dog while you&apos;re
            away? Tell me a little about you and your pets below.
          </p>
        </section>

        {/* Questions */}
        <form className="mt-12 grid gap-6 rounded-[2rem] border border-white/20 bg-white p-6 text-[#1f2a24] shadow-xl sm:p-10">
          <Input
            label="What is your full name?"
            placeholder="First and last name"
            required
          />

          <Input
            label="What is your phone number?"
            placeholder="(555) 555-5555"
            type="tel"
            required
          />

          <Input
            label="What is your email?"
            placeholder="you@example.com"
            type="email"
            required
          />

          {/* Number of Pets */}
          <label className="grid gap-2 text-[15px] font-bold sm:text-base">
            How many pets do you have?
            <input
              type="number"
              min="0"
              max="20"
              value={petCount || ""}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPetCount(
                  Math.max(0, Math.min(20, value))
                );
              }}
              placeholder="Enter number of pets"
              required
              className="rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none transition focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
            />
          </label>

          {/* Dynamic Pet Questions */}
          {Array.from({ length: petCount }, (_, index) => (
            <section
              key={index}
              className="grid gap-5 rounded-2xl border border-[#128ced]/20 bg-[#f5f9ff] p-5"
            >
              <h2 className="text-xl font-black text-[#128ced]">
                Pet #{index + 1}
              </h2>

              <Input
                label="Name?"
                placeholder="Pet's name"
                required
              />

              <Input
                label="Breed?"
                placeholder="Golden Retriever, Labrador, etc."
                required
              />

              <Input
                label="Allergies?"
                placeholder="List any allergies or enter None"
              />

              <label className="grid gap-2 text-[15px] font-bold sm:text-base">
                Personality?
                <textarea
                  name={`pet-${index + 1}-personality`}
                  className="min-h-28 resize-y rounded-xl border border-black/10 bg-white px-4 py-3 font-normal leading-6 text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
                  placeholder="Friendly, energetic, shy, playful, etc."
                />
              </label>
            </section>
          ))}

          {/* Sitting Dates */}
          <section className="grid gap-4">
            <h2 className="text-[15px] font-bold sm:text-base">
              What dates do you need a sitter?
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Start Date
                <input
                  type="date"
                  name="startDate"
                  required
                  className="min-w-0 w-full rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold">
                End Date
                <input
                  type="date"
                  name="endDate"
                  required
                  className="min-w-0 w-full rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
                />
              </label>
            </div>
          </section>

          {/* Address */}
          <Input
            label="What is your address?"
            placeholder="Street address, city, ZIP code"
            required
          />

          {/* Additional Information */}
          <label className="grid gap-2 text-[15px] font-bold sm:text-base">
            Is there anything else I should know?
            <textarea
              name="additionalInfo"
              className="min-h-32 resize-y rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal leading-6 text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
              placeholder="Feeding schedules, medications, special instructions, or anything else you'd like to share..."
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 rounded-xl bg-[#128ced] px-8 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-[#0875cc]"
          >
            Send Request
          </button>
        </form>

        {/* Meet the Owner */}
        <section className="mt-20 rounded-[2rem] border border-white/20 bg-white/15 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Meet the Owner
          </h2>

          <p className="mt-6 text-base leading-8 text-white/95 sm:text-lg">
            Hi, I&apos;m Ava! I&apos;m a local dog sitter serving the Medford
            and Grants Pass area. I&apos;ve always loved animals and know how
            important it is to have someone you trust taking care of your dog
            while you&apos;re away.
          </p>

          <p className="mt-4 text-base leading-8 text-white/95 sm:text-lg">
            My goal is to make sure every dog feels safe, comfortable, and
            loved. I&apos;ll treat your dog like one of my own and keep you
            updated so you can relax knowing they&apos;re in good hands.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/25 pt-8 text-center text-sm text-white/80">
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
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-[15px] font-bold text-[#1f2a24] sm:text-base">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
      />
    </label>
  );
}
