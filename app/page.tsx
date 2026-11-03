
"use client";

import { useState } from "react";

type PetDetails = {
  allergies: string;
  medications: string;
};

export default function Home() {
  const [petCount, setPetCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startPeriod, setStartPeriod] = useState<"morning" | "evening">("morning");
  const [endPeriod, setEndPeriod] = useState<"morning" | "evening">("evening");
  const [phone, setPhone] = useState("");

  const [petDetails, setPetDetails] = useState<PetDetails[]>(
    Array.from({ length: 5 }, () => ({
      allergies: "",
      medications: "",
    }))
  );

  const updatePet = (
    index: number,
    field: keyof PetDetails,
    value: string
  ) => {
    setPetDetails((previous) =>
      previous.map((pet, i) =>
        i === index ? { ...pet, [field]: value } : pet
      )
    );
  };

  // Automatically format phone number: (555) 555-5555
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length === 0) return "";
    if (digits.length < 4) return `(${digits}`;

    if (digits.length < 7) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Count the morning/evening visits requested, including both endpoints.
  const calculateVisits = () => {
    if (!startDate || !endDate || endDate < startDate) return 0;
    const start = new Date(`${startDate}T00:00:00Z`).getTime();
    const end = new Date(`${endDate}T00:00:00Z`).getTime();
    const dayDifference = Math.round((end - start) / 86400000);
    const visits = dayDifference * 2 +
      (endPeriod === "evening" ? 1 : 0) -
      (startPeriod === "evening" ? 1 : 0) + 1;
    return Math.max(0, visits);
  };

  const totalVisits = calculateVisits();
  // Two visits cost $40 for the first pet, plus $10 per additional pet.
  const visitRate = petCount > 0 ? 20 + (petCount - 1) * 5 : 0;
  const total = visitRate * totalVisits;

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

      {/* Subtitle */}
      <div className="px-5 text-center">
        <h1 className="text-base font-semibold text-white sm:text-lg">
          Southern Oregon Pet Sitter
        </h1>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-12 pt-6 sm:px-6 sm:pb-16">

      {/* Service Area Bubble */}
      <section className="w-full rounded-[2rem] border border-white/20 bg-white px-4 py-3 text-center text-[#128ced] shadow-xl sm:px-10">
        <p className="text-[11px] font-medium leading-5 sm:text-xs">
          Grants Pass • Central Point • Medford • White City • Eagle Point
        </p>
      </section>

        {/* Pricing Bubble */}
        <section className="mt-6 rounded-[2rem] border border-white/20 bg-white px-4 py-7 text-[#1f2a24] shadow-xl sm:px-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-[#128ced] sm:text-4xl">
                $20
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-base">
                per Visit
              </p>
            </div>

            <span className="text-3xl font-light text-gray-400 sm:text-4xl">
              +
            </span>

            <div className="text-center">
              <p className="text-2xl font-black text-[#128ced] sm:text-4xl">
                $5
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-base">
                per additional Pet
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Morning and evening visits, 30 minutes each
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Example: 2 full days, 2 pets = $100
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

          {/* Automatically Formatted Phone Number */}
          <label className="grid min-w-0 gap-2 text-[15px] font-bold text-[#1f2a24] sm:text-base">
            What is your phone number?
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(555) 555-5555"
              value={phone}
              onChange={(e) => {
                setPhone(formatPhoneNumber(e.target.value));
              }}
              required
              pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
              maxLength={14}
              className="box-border w-full min-w-0 max-w-full rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
            />
          </label>

          <Input
            name="email"
            label="What is your email?"
            placeholder="you@example.com"
            type="email"
            required
          />

          {/* Street Address */}
          <Input
            name="streetAddress"
            label="What is your street address?"
            placeholder="123 Main Street"
            required
          />

          {/* City */}
          <Input
            name="city"
            label="What city do you live in?"
            placeholder="Medford"
            required
          />

          {/* ZIP Code */}
          <label className="grid min-w-0 gap-2 text-[15px] font-bold text-[#1f2a24] sm:text-base">
            What is your ZIP code?
            <input
              name="zipCode"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="97501"
              maxLength={5}
              pattern="[0-9]{5}"
              title="Please enter a 5-digit ZIP code"
              required
              className="box-border w-full min-w-0 max-w-full rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
            />
          </label>

          {/* Number of Pets */}
          <fieldset className="grid min-w-0 gap-3">
            <legend className="mb-3 text-[15px] font-bold sm:text-base">
              How many pets do you have?
            </legend>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  type="button"
                  aria-pressed={petCount === count}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    setPetCount(count);
                  }}
                  className={`flex aspect-square w-full cursor-pointer touch-manipulation items-center justify-center rounded-xl border-2 text-lg font-black transition ${
                    petCount === count
                      ? "border-[#128ced] bg-[#128ced] text-white shadow-md"
                      : "border-[#128ced]/20 bg-[#f5f9ff] text-[#128ced] hover:border-[#128ced]"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
                        <input
              type="hidden"
              name="petCount"
              value={petCount || ""}
            />
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

              {/* Allergies */}
              <YesNoQuestion
                name={`pet${index + 1}Allergies`}
                label="Does your pet have any allergies?"
                value={petDetails[index].allergies}
                onChange={(value) =>
                  updatePet(index, "allergies", value)
                }
              />

              {petDetails[index].allergies === "yes" && (
                <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
                  What allergies does your pet have?
                  <textarea
                    name={`pet${index + 1}AllergyDetails`}
                    required
                    className="min-h-24 w-full min-w-0 resize-y rounded-xl border border-black/10 bg-white px-4 py-3 font-normal text-[#1f2a24] outline-none focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
                    placeholder="List allergies and any special precautions..."
                  />
                </label>
              )}

              {/* Medications */}
              <YesNoQuestion
                name={`pet${index + 1}Medications`}
                label="Does your pet take any medications?"
                value={petDetails[index].medications}
                onChange={(value) =>
                  updatePet(index, "medications", value)
                }
              />

              {petDetails[index].medications === "yes" && (
                <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
                  What medications does your pet take?
                  <textarea
                    name={`pet${index + 1}MedicationDetails`}
                    required
                    className="min-h-24 w-full min-w-0 resize-y rounded-xl border border-black/10 bg-white px-4 py-3 font-normal text-[#1f2a24] outline-none focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
                    placeholder="Medication names, dosage, schedule, and instructions..."
                  />
                </label>
              )}

              {/* Personality */}
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

          {/* Sitting Dates and Visit Times */}
          <section className="w-full min-w-0 max-w-full">
            <h2 className="mb-4 text-[15px] font-bold sm:text-base">
              When do you need a sitter?
            </h2>
            <div className="flex w-full min-w-0 flex-col gap-5">
              <div className="grid min-w-0 gap-3">
                <label htmlFor="startDate" className="text-sm font-semibold">Starting</label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  min={todayString}
                  value={startDate}
                  onChange={(e) => {
                    const next = e.target.value;
                    setStartDate(next);
                    if (endDate && endDate < next) setEndDate("");
                  }}
                  required
                  className="block box-border w-full min-w-0 rounded-xl border border-black/10 bg-[#f5f9ff] px-3 py-3 font-normal text-[#1f2a24] outline-none focus:ring-2 focus:ring-[#128ced]/20"
                />
                <div className="grid grid-cols-2 gap-3">
                  {(["morning", "evening"] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      aria-pressed={startPeriod === period}
                      onClick={() => setStartPeriod(period)}
                      className={`rounded-xl border-2 px-4 py-3 font-bold transition ${startPeriod === period ? "border-[#128ced] bg-[#128ced] text-white" : "border-[#128ced]/20 bg-[#f5f9ff] text-[#128ced] hover:border-[#128ced]"}`}
                    >
                      {period === "morning" ? "Morning" : "Evening"}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="startPeriod" value={startPeriod} />
              </div>
              <div className="grid min-w-0 gap-3">
                <label htmlFor="endDate" className="text-sm font-semibold">Ending</label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  min={startDate || todayString}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="block box-border w-full min-w-0 rounded-xl border border-black/10 bg-[#f5f9ff] px-3 py-3 font-normal text-[#1f2a24] outline-none focus:ring-2 focus:ring-[#128ced]/20"
                />
                <div className="grid grid-cols-2 gap-3">
                  {(["morning", "evening"] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      aria-pressed={endPeriod === period}
                      onClick={() => setEndPeriod(period)}
                      className={`rounded-xl border-2 px-4 py-3 font-bold transition ${endPeriod === period ? "border-[#128ced] bg-[#128ced] text-white" : "border-[#128ced]/20 bg-[#f5f9ff] text-[#128ced] hover:border-[#128ced]"}`}
                    >
                      {period === "morning" ? "Morning" : "Evening"}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="endPeriod" value={endPeriod} />
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
            Is there anything else I should know?
            <textarea
              name="additionalInfo"
              className="box-border min-h-28 w-full min-w-0 resize-y rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal leading-6 text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20"
              placeholder="Feeding schedules, special instructions, or anything else you'd like to share..."
            />
          </label>

          {/* Total Calculator */}
          <section className="rounded-2xl border border-[#128ced]/20 bg-[#f5f9ff] p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xl font-black">
                Total:
              </span>

              <span className="text-3xl font-black text-[#128ced]">
                ${total.toLocaleString("en-US")}
              </span>
            </div>

            {petCount > 0 && totalVisits > 0 ? (
              <p className="mt-2 text-sm text-gray-500">
                {totalVisits} {totalVisits === 1 ? "visit" : "visits"} ×
                {" "}${visitRate} per visit
                {" "}({petCount} {petCount === 1 ? "pet" : "pets"})
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Select your number of pets, dates, and visit times to calculate the total.
              </p>
            )}
          </section>

          {/* Booking Information */}
          <div className="rounded-2xl border border-[#128ced]/20 bg-[#f5f9ff] p-5 text-center">
            <div className="space-y-3 text-sm leading-6 text-gray-600">
              <p>
                We will review your request, then charge the full amount
                before your scheduled service.
              </p>

              <p>
                Please provide all food and medications for your pets.
              </p>
            </div>
          </div>

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
        <footer className="mt-6 border-t border-white/25 pt-8 text-center text-sm text-white/80">
          © 2026 Thank Dog It&apos;s Friday
        </footer>
      </div>
    </main>
  );
}

// Reusable Input
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

// Reusable Yes/No Buttons
function YesNoQuestion({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="grid min-w-0 gap-3">
      <legend className="mb-3 text-[15px] font-bold sm:text-base">
        {label}
      </legend>

      <div className="grid grid-cols-2 gap-3">
        {["yes", "no"].map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 text-base font-bold transition ${
              value === option
                ? "border-[#128ced] bg-[#128ced] text-white shadow-md"
                : "border-[#128ced]/20 bg-white text-[#128ced] hover:border-[#128ced]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              required
              className="sr-only"
            />
            {option === "yes" ? "Yes" : "No"}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
