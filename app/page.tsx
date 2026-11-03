
"use client";

import { useState } from "react";

export default function Home() {
  const [petCount, setPetCount] = useState(0);
  const [startDate, setStartDate] = useState("");

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#128ced] text-white">
      {/* Full-width Logo */}
      <div className="w-full px-4 pt-6 sm:px-8 sm:pt-8">
        <img
          src="/thankdogitsfriday.png"
          alt="Thank Dog It's Friday"
          className="mx-auto block h-auto w-full max-w-6xl object-contain"
        />
      </div>

      {/* Subtitle Directly Below Logo */}
      <div className="px-5 text-center">
        <h1 className="text-base font-semibold text-white sm:text-lg">
          Southern Oregon Pet Sitter
        </h1>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-12 pt-6 sm:px-6 sm:pb-16">
        {/* Pricing Bubble */}
        <section className="rounded-[2rem] border border-white/20 bg-white px-4 py-7 text-[#1f2a24] shadow-xl sm:px-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-[#128ced] sm:text-4xl">
                $35
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-base">
                per Day
              </p>
            </div>

            <span className="text-3xl font-light text-gray-400 sm:text-4xl">
              +
            </span>

            <div className="text-center">
              <p className="text-2xl font-black text-[#128ced] sm:text-4xl">
                $10
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-base">
                per additional Pet
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Two visits per day, 30 minutes each
          </p>
        </section>

        {/* Request Form */}
        <form className="mt-6 grid min-w-0 gap-6 rounded-[2rem] border border-white/20 bg-white p-5 text-[#1f2a24] shadow-xl sm:p-10">
          <Input
            name="fullName"
            label="What is your full name?"
            placeholder="First and last name"
            required
          />

          <Input
            name="phone"
            label="What is your phone number?"
            placeholder="5555555555"
            type="tel"
            required
          />

          <Input
            name="email"
            label="What is your email?"
            placeholder="you@example.com"
            type="email"
            required
          />

          {/* Pet Count Selection */}
          <fieldset className="grid min-w-0 gap-3">
            <legend className="mb-3 text-[15px] font-bold sm:text-base">
              How many pets do you have?
            </legend>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((count) => (
                <label
                  key={count}
                  className={`flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 text-lg font-black transition ${
                    petCount === count
                      ? "border-[#128ced] bg-[#128ced] text-white shadow-md"
                      : "border-[#128ced]/20 bg-[#f5f9ff] text-[#128ced] hover:border-[#128ced]"
                  }`}
                >
                  <input
                    type="radio"
                    name="petCount"
                    value={count}
                    checked={petCount === count}
                    onChange={() => setPetCount(count)}
                    required
                    className="sr-only"
                  />
                  {count}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Dynamic Pet Questions */}
          {Array.from({ length: petCount }, (_, index) => (
            <section
              key={index}
              className="grid min-w-0 gap-5 rounded-2xl border border-[#128ced]/20 bg-[#f5f9ff] p-4 sm:p-6"
            >
              <h2 className="text-xl font-black text-[#128ced]">
                Pet #{index + 1}
              </h2>

              <Input
                name={`pet${index + 1}Name`}
                label="Name?"
                placeholder="Pet's name"
                required
              />

              <Input
                name={`pet${index + 1}Breed`}
                label="Breed?"
                placeholder="Breed or type of pet"
                required
              />

              <Input
                name={`pet${index + 1}Allergies`}
                label="Allergies?"
                placeholder="None, or list any allergies"
              />

              <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
                Personality?
                <textarea
                  name={`pet${index + 1}Personality`}
                  className="box-border min-h-28 w-full min-w-0 resize-y rounded-xl border border-black/10 bg-white px-4 py-3 font-normal leading-6 text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
                  placeholder="Friendly, energetic, shy, playful, etc."
                />
              </label>
            </section>
          ))}
          
          {/* Sitting Dates */}
          <section className="w-full min-w-0 max-w-full overflow-hidden">
            <h2 className="mb-4 text-[15px] font-bold sm:text-base">
              What dates do you need a sitter?
            </h2>

            <div className="flex w-full min-w-0 flex-col gap-4">
              {/* Start Date */}
              <label className="flex w-full min-w-0 flex-col gap-2 text-sm font-semibold">
                Start Date
                <div className="w-full min-w-0 overflow-hidden rounded-xl border border-black/10 bg-[#f5f9ff]">
                  <input
                    type="date"
                    name="startDate"
                    min={todayString}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      minWidth: 0,
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                    className="block appearance-none border-0 bg-transparent px-3 py-3 font-normal text-[#1f2a24] outline-none focus:ring-2 focus:ring-inset focus:ring-[#128ced]/20"
                  />
                </div>
              </label>

              {/* End Date */}
              <label className="flex w-full min-w-0 flex-col gap-2 text-sm font-semibold">
                End Date
                <div className="w-full min-w-0 overflow-hidden rounded-xl border border-black/10 bg-[#f5f9ff]">
                  <input
                    type="date"
                    name="endDate"
                    min={startDate || todayString}
                    key={startDate}
                    required
                    style={{
                      width: "100%",
                      minWidth: 0,
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                    className="block appearance-none border-0 bg-transparent px-3 py-3 font-normal text-[#1f2a24] outline-none focus:ring-2 focus:ring-inset focus:ring-[#128ced]/20"
                  />
                </div>
              </label>
            </div>
          </section>

          {/* Address */}
          <Input
            name="address"
            label="What is your address?"
            placeholder="Street address, city, ZIP code"
            required
          />

          {/* Additional Information */}
          <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
            Is there anything else I should know?
            <textarea
              name="additionalInfo"
              className="box-border min-h-28 w-full min-w-0 resize-y rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal leading-6 text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
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
        <section className="mt-6 rounded-[2rem] border border-white/20 bg-white/15 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
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
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-[15px] font-bold text-[#1f2a24] sm:text-base">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="box-border w-full min-w-0 max-w-full rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
      />
    </label>
  );
}
