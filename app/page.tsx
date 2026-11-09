
"use client";

import { useState } from "react";

type PetDetails = {
  allergies: string;
  medications: string;
};

const BLUE = "#128ced";

const services = [
  {
    icon: "🐾",
    title: "Pet Sitting & Drop-In Visits",
    description:
      "Dependable visits for dogs, cats, and other pets, including feeding, fresh water, companionship, medication, and special routines.",
  },
  {
    icon: "🦮",
    title: "Dog Walking & Exercise",
    description:
      "Personalized walks, playtime, and exercise to keep your dog happy, healthy, and comfortable while you're away.",
  },
  {
    icon: "🏡",
    title: "House Sitting & Home Care",
    description:
      "Attentive care for your pets and home during extended trips, giving you peace of mind while you're away.",
  },
  {
    icon: "🐴",
    title: "Horse & Farm Animal Care",
    description:
      "Experienced care for horses, goats, and other farm animals, with services tailored to their daily routines.",
  },
];

const emptyPet = (): PetDetails => ({
  allergies: "",
  medications: "",
});

export default function Home() {
  const [petCount, setPetCount] = useState(0);
  const [petDetails, setPetDetails] = useState<PetDetails[]>(
    Array.from({ length: 5 }, emptyPet)
  );

  const [serviceType, setServiceType] = useState("Drop-In Visits");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startPeriod, setStartPeriod] = useState<
    "morning" | "evening"
  >("morning");
  const [endPeriod, setEndPeriod] = useState<
    "morning" | "evening"
  >("evening");

  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const standardVisits = serviceType === "Drop-In Visits";

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

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

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (!digits) return "";
    if (digits.length < 4) return `(${digits}`;
    if (digits.length < 7) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(
      3,
      6
    )}-${digits.slice(6)}`;
  };

  const calculateVisits = () => {
    if (!startDate || !endDate || endDate < startDate) return 0;

    const start = new Date(`${startDate}T00:00:00Z`).getTime();
    const end = new Date(`${endDate}T00:00:00Z`).getTime();

    const days = Math.round((end - start) / 86400000);

    const visits =
      days * 2 +
      (endPeriod === "evening" ? 1 : 0) -
      (startPeriod === "evening" ? 1 : 0) +
      1;

    return Math.max(0, visits);
  };

  const totalVisits = calculateVisits();
  const visitRate = petCount > 0 ? 25 + (petCount - 1) * 5 : 0;
  const total = standardVisits ? visitRate * totalVisits : 0;

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (petCount < 1) {
      setSubmitSuccess(false);
      setSubmitMessage("Please select how many pets you have.");
      return;
    }

    if (
      !startDate ||
      !endDate ||
      endDate < startDate ||
      (standardVisits && totalVisits <= 0)
    ) {
      setSubmitSuccess(false);
      setSubmitMessage("Please select valid service dates.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const get = (name: string) =>
      String(formData.get(name) ?? "").trim();

    const pets = Array.from({ length: petCount }, (_, i) => {
      const n = i + 1;

      return {
        name: get(`pet${n}Name`),
        breed: get(`pet${n}Breed`),
        allergies: get(`pet${n}Allergies`),
        allergyDetails: get(`pet${n}AllergyDetails`),
        medications: get(`pet${n}Medications`),
        medicationDetails: get(`pet${n}MedicationDetails`),
        personality: get(`pet${n}Personality`),
      };
    });

    const booking = {
      fullName: get("fullName"),
      phone: get("phone"),
      email: get("email"),
      streetAddress: get("streetAddress"),
      city: get("city"),
      zipCode: get("zipCode"),
      petCount,
      pets,
      startDate,
      startPeriod,
      endDate,
      endPeriod,
      totalVisits: standardVisits ? totalVisits : 0,
      total,
      additionalInfo: [
        `Requested service: ${serviceType}`,
        standardVisits
          ? ""
          : "Custom quote required. Morning/evening selections indicate preferred arrival and departure periods.",
        get("additionalInfo"),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Submission failed.");
      }

      setSubmitSuccess(true);
      setSubmitMessage(
        "Your request has been sent! Ava will contact you shortly."
      );

      form.reset();
      setPetCount(0);
      setPetDetails(Array.from({ length: 5 }, emptyPet));
      setServiceType("Drop-In Visits");
      setPhone("");
      setStartDate("");
      setEndDate("");
      setStartPeriod("morning");
      setEndPeriod("evening");
    } catch (error) {
      setSubmitSuccess(false);
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#128ced] text-white">

      {/* HEADER / HERO */}
      <header className="px-5 pb-10 pt-8 text-center sm:pb-14">
        <img
          src="/thankdogitsfriday.png"
          alt="Thank Dog It's Friday"
          className="mx-auto block h-auto w-full max-w-md object-contain"
        />

        <p className="mt-5 text-lg font-bold tracking-wide sm:text-xl">
          Pet Sitting & Home Care
        </p>

        <h1 className="mx-auto mt-6 max-w-2xl text-2xl font-black leading-tight sm:text-4xl">
          Loving Care for Your Pets.
          <br />
          Peace of Mind for You.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
          Because your dog deserves a good Friday, every day —
          and you do too.
        </p>

        <button
          type="button"
          onClick={scrollToBooking}
          className="mt-8 rounded-2xl bg-white px-9 py-4 text-lg font-black text-[#128ced] shadow-xl transition hover:scale-[1.02] hover:bg-blue-50"
        >
          Request Pet Care
        </button>
      </header>

      <div className="mx-auto max-w-3xl px-5 pb-12 sm:px-6">

        {/* SERVICE AREA */}
        <section className="rounded-[2rem] bg-white px-5 py-5 text-center text-[#128ced] shadow-xl sm:px-10">
          <p className="text-sm font-bold leading-6 sm:text-base">
            Grants Pass • Central Point • Medford • White City • Eagle Point
          </p>

          <div className="mx-auto my-3 h-px max-w-md bg-[#128ced]/15" />

          <p className="text-sm font-semibold sm:text-base">
            Dogs • Cats • Horses • Goats • Fish
          </p>
        </section>

        {/* INTRODUCTION */}
        <section className="px-3 pb-3 pt-14 text-center sm:pt-20">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-white/75">
            Welcome to TDIF
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Your Pets Are in Good Hands
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
            ThankDogItsFriday is an independent pet-sitting and
            home-care service proudly serving the Rogue Valley.
            We provide dependable, attentive, and compassionate
            care for your animals while you're away.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/90">
            Our goal is simple: happy animals, a well-maintained
            home, and the confidence that everything has been
            taken care of.
          </p>
        </section>

        {/* SERVICES */}
        <section id="services" className="pt-14 sm:pt-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/75">
              What We Offer
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Our Services
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/90">
              From daily visits to extended care, every animal
              deserves attention tailored to their needs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="flex flex-col rounded-[2rem] bg-white p-7 text-[#1f2a24] shadow-xl sm:p-8"
              >
                <div className="text-4xl" aria-hidden="true">
                  {service.icon}
                </div>

                <h3 className="mt-5 text-xl font-black leading-snug text-[#128ced]">
                  {service.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-gray-600 sm:text-base">
                  {service.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-7 text-white/85">
            Senior pet care, medication administration, special
            feeding routines, and additional farm animal care
            are available by arrangement.
          </p>
        </section>

        {/* MEET THE OWNER */}
        <section
          id="about"
          className="mt-16 rounded-[2rem] bg-white px-6 py-10 text-[#1f2a24] shadow-xl sm:mt-20 sm:px-12 sm:py-14"
        >
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#128ced]">
              The Person Behind TDIF
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Meet Ava
            </h2>

            <h3 className="mt-5 text-xl font-bold text-[#128ced]">
              Hi, I'm Ava Henrie!
            </h3>
          </div>

          {/* Add Ava's real photo here when available.
              Suggested path: /ava.jpg */}

          <div className="mt-7 space-y-5 text-base leading-8 text-gray-700">
            <p>
              I moved to the Rogue Valley in 2018, and ever since,
              I've enjoyed helping families with pet sitting and
              house sitting. I've always had a love for animals,
              and while I appreciate all creatures big and small,
              most of my hands-on experience has been with horses,
              dogs, and cats.
            </p>

            <p>
              I spent about a year volunteering at Roxy Rose Ranch
              in East Medford, where I had the opportunity to work
              around horses and gain valuable experience caring for
              them. I also grew up attending horse camps, so if
              there's ever a job that can be paid for in horseback
              riding lessons, I'm your girl!
            </p>

            <p>
              I spent four years working at R&R Pet Resort in
              Phoenix, where I gained extensive experience caring
              for both dogs and cats. My responsibilities included
              feeding, administering medications, laundry, walks,
              yard time, and making sure each animal's care routine
              and safety protocols were followed.
            </p>

            <p>
              I also worked at the front desk, where I handled
              client communication, veterinary calls, and other
              day-to-day responsibilities.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-[#f0f7ff] px-6 py-6 text-center">
            <p className="text-lg font-bold leading-8 text-[#128ced]">
              "My goal is to give pet owners peace of mind
              while they're away."
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section className="pt-16 sm:pt-20">
          <div className="mb-7 text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/75">
              Simple & Transparent
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Pricing
            </h2>
          </div>

          <div className="rounded-[2rem] bg-white px-5 py-9 text-[#1f2a24] shadow-xl sm:px-12">
            <h3 className="text-center text-xl font-black">
              Standard Drop-In Visits
            </h3>

            <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
              <div className="text-center">
                <p className="text-3xl font-black text-[#128ced] sm:text-4xl">
                  $25
                </p>
                <p className="mt-2 text-sm font-semibold">
                  Per Visit
                </p>
              </div>

              <span className="text-3xl font-light text-gray-400">
                +
              </span>

              <div className="text-center">
                <p className="text-3xl font-black text-[#128ced] sm:text-4xl">
                  $5
                </p>
                <p className="mt-2 text-sm font-semibold">
                  Per Additional Pet
                </p>
              </div>
            </div>

            <div className="mt-7 border-t border-gray-100 pt-5 text-center">
              <p className="text-sm text-gray-600">
                30-minute visits • Morning and evening options
              </p>

              <p className="mt-2 text-sm font-semibold text-[#128ced]">
                Example: 2 full days, 2 pets = $120
              </p>
            </div>

            <p className="mt-5 text-center text-sm leading-6 text-gray-500">
              House sitting, extended stays, dog walking, and farm
              animal care are quoted individually.
            </p>
          </div>
        </section>

        {/* BOOKING */}
        <section id="booking" className="scroll-mt-6 pt-16 sm:pt-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/75">
              Let's Get Started
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Request Pet Care
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/90">
              Tell Ava a little about yourself and your pets.
              She'll review your request and contact you
              to confirm availability.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid min-w-0 gap-7 rounded-[2rem] bg-white p-5 text-[#1f2a24] shadow-xl sm:p-10"
          >
            {/* SERVICE TYPE */}
            <section className="grid gap-3">
              <h3 className="text-lg font-black text-[#128ced]">
                What Type of Care Do You Need?
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Drop-In Visits",
                  "Dog Walking",
                  "House Sitting",
                  "Horse & Farm Animal Care",
                ].map((service) => (
                  <button
                    key={service}
                    type="button"
                    aria-pressed={serviceType === service}
                    onClick={() => setServiceType(service)}
                    className={`min-h-14 rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${
                      serviceType === service
                        ? "border-[#128ced] bg-[#128ced] text-white"
                        : "border-[#128ced]/20 bg-[#f5f9ff] text-[#128ced] hover:border-[#128ced]"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-gray-100" />

            {/* CUSTOMER INFORMATION */}
            <section className="grid gap-5">
              <h3 className="text-xl font-black text-[#128ced]">
                Your Information
              </h3>

              <Input
                name="fullName"
                label="What is your full name?"
                placeholder="First and last name"
                required
              />

              <label className="grid gap-2 text-[15px] font-bold">
                What is your phone number?
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) =>
                    setPhone(formatPhoneNumber(e.target.value))
                  }
                  required
                  pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
                  maxLength={14}
                  className={inputClass}
                />
              </label>

              <Input
                name="email"
                label="What is your email?"
                placeholder="you@example.com"
                type="email"
                required
              />

              <Input
                name="streetAddress"
                label="What is your street address?"
                placeholder="123 Main Street"
                required
              />

              <Input
                name="city"
                label="What city do you live in?"
                placeholder="Medford"
                required
              />

              <label className="grid gap-2 text-[15px] font-bold">
                What is your ZIP code?
                <input
                  name="zipCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="97501"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                  className={inputClass}
                />
              </label>
            </section>

            <div className="h-px bg-gray-100" />

            {/* PET INFORMATION */}
            <section className="grid gap-5">
              <h3 className="text-xl font-black text-[#128ced]">
                Your Pets
              </h3>

              <fieldset className="grid gap-3">
                <legend className="mb-3 text-[15px] font-bold">
                  How many pets do you have?
                </legend>

                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      aria-pressed={petCount === count}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPetCount(count)}
                      className={`flex aspect-square items-center justify-center rounded-xl border-2 text-lg font-black transition ${
                        petCount === count
                          ? "border-[#128ced] bg-[#128ced] text-white"
                          : "border-[#128ced]/20 bg-[#f5f9ff] text-[#128ced]"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </fieldset>

              {Array.from({ length: petCount }, (_, index) => (
                <section
                  key={index}
                  className="grid min-w-0 gap-5 rounded-2xl border border-[#128ced]/15 bg-[#f5f9ff] p-4 sm:p-6"
                >
                  <h4 className="text-xl font-black text-[#128ced]">
                    Pet #{index + 1}
                  </h4>

                  <Input
                    name={`pet${index + 1}Name`}
                    label="Name?"
                    placeholder="Pet's name"
                    required
                  />

                  <Input
                    name={`pet${index + 1}Breed`}
                    label="Breed or animal type?"
                    placeholder="Golden Retriever, Cat, Horse, etc."
                    required
                  />

                  <YesNoQuestion
                    name={`pet${index + 1}Allergies`}
                    label="Does your pet have any allergies?"
                    value={petDetails[index].allergies}
                    onChange={(value) =>
                      updatePet(index, "allergies", value)
                    }
                  />

                  {petDetails[index].allergies === "yes" && (
                    <TextArea
                      name={`pet${index + 1}AllergyDetails`}
                      label="What allergies does your pet have?"
                      placeholder="List allergies and precautions..."
                      required
                    />
                  )}

                  <YesNoQuestion
                    name={`pet${index + 1}Medications`}
                    label="Does your pet take any medications?"
                    value={petDetails[index].medications}
                    onChange={(value) =>
                      updatePet(index, "medications", value)
                    }
                  />

                  {petDetails[index].medications === "yes" && (
                    <TextArea
                      name={`pet${index + 1}MedicationDetails`}
                      label="What medications does your pet take?"
                      placeholder="Medication, dosage, schedule, and instructions..."
                      required
                    />
                  )}

                  <TextArea
                    name={`pet${index + 1}Personality`}
                    label="Tell us about your pet's personality."
                    placeholder="Friendly, energetic, shy, playful, etc."
                  />
                </section>
              ))}
            </section>

            <div className="h-px bg-gray-100" />

            {/* DATES */}
            <section className="grid min-w-0 gap-5">
              <h3 className="text-xl font-black text-[#128ced]">
                When Do You Need Care?
              </h3>

              <div className="grid min-w-0 gap-3">
                <label
                  htmlFor="startDate"
                  className="text-[15px] font-bold"
                >
                  Starting
                </label>

                <div className="min-w-0 overflow-hidden rounded-xl">
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    min={todayString}
                    value={startDate}
                    onChange={(e) => {
                      const next = e.target.value;
                      setStartDate(next);
                      if (endDate && endDate < next) {
                        setEndDate("");
                      }
                    }}
                    required
                    style={{
                      width: "100%",
                      minWidth: 0,
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                    className={inputClass}
                  />
                </div>

                <PeriodButtons
                  value={startPeriod}
                  onChange={setStartPeriod}
                />
              </div>

              <div className="grid min-w-0 gap-3">
                <label
                  htmlFor="endDate"
                  className="text-[15px] font-bold"
                >
                  Ending
                </label>

                <div className="min-w-0 overflow-hidden rounded-xl">
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={startDate || todayString}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      minWidth: 0,
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                    className={inputClass}
                  />
                </div>

                <PeriodButtons
                  value={endPeriod}
                  onChange={setEndPeriod}
                />
              </div>
            </section>

            {/* ADDITIONAL INFORMATION */}
            <TextArea
              name="additionalInfo"
              label="Is there anything else Ava should know?"
              placeholder="Feeding schedules, special instructions, home-care needs, or anything else..."
            />

            {/* PRICE ESTIMATE */}
            <section className="rounded-2xl border border-[#128ced]/20 bg-[#f0f7ff] p-6">
              {standardVisits ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xl font-black">
                      Estimated Total
                    </span>

                    <span className="text-3xl font-black text-[#128ced]">
                      ${total.toLocaleString("en-US")}
                    </span>
                  </div>

                  {petCount > 0 && totalVisits > 0 ? (
                    <p className="mt-3 text-sm text-gray-600">
                      {totalVisits}{" "}
                      {totalVisits === 1 ? "visit" : "visits"} ×
                      ${visitRate} per visit (
                      {petCount}{" "}
                      {petCount === 1 ? "pet" : "pets"})
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-gray-600">
                      Select your pets and dates to calculate
                      your estimated total.
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h4 className="text-xl font-black text-[#128ced]">
                    Custom Quote
                  </h4>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    Ava will review your requested service,
                    number of animals, and dates before
                    providing a personalized price.
                  </p>
                </div>
              )}
            </section>

            {/* BOOKING NOTES */}
            <div className="rounded-2xl bg-[#f5f9ff] p-5 text-center">
              <p className="text-sm leading-7 text-gray-600">
                This is a request, not a confirmed booking.
                Ava will review your information and contact
                you about availability and payment.
              </p>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Please provide all necessary food and medications
                for your pets.
              </p>
            </div>

            {/* SUBMISSION STATUS */}
            {submitMessage && (
              <div
                role="status"
                className={`rounded-xl p-4 text-center font-semibold ${
                  submitSuccess
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#128ced] px-8 py-4 text-lg font-black text-white shadow-md transition hover:bg-[#0875cc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Sending Request..."
                : "Send Pet Care Request"}
            </button>
          </form>
        </section>

        {/* FINAL MESSAGE */}
        <section className="px-3 pb-4 pt-16 text-center sm:pt-20">
          <p className="text-4xl" aria-hidden="true">
            🐾
          </p>

          <h2 className="mt-5 text-2xl font-black sm:text-3xl">
            Happy Pets. Happy Homes.
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-white/90">
            Whether you're away for the day or taking a
            well-deserved vacation, your animals deserve
            loving, dependable care.
          </p>

          <p className="mt-6 text-lg font-bold">
            Thank Dog It's Friday!
          </p>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-white/25 pt-8 text-center text-sm text-white/80">
          <p>ThankDogItsFriday — Pet Sitting & Home Care</p>

          <p className="mt-2">
            Proudly Serving Southern Oregon's Rogue Valley
          </p>

          <p className="mt-4">
            © 2026 Thank Dog It's Friday
          </p>
        </footer>
      </div>
    </main>
  );
}

// SHARED INPUT STYLES

const inputClass =
  "box-border block w-full min-w-0 max-w-full rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20";

// REUSABLE TEXT INPUT

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
    <label className="grid min-w-0 gap-2 text-[15px] font-bold">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </label>
  );
}

// REUSABLE TEXTAREA

function TextArea({
  name,
  label,
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-[15px] font-bold">
      {label}
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        className={`${inputClass} min-h-28 resize-y leading-6`}
      />
    </label>
  );
}

// YES / NO BUTTONS

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
      <legend className="mb-3 text-[15px] font-bold">
        {label}
      </legend>

      <div className="grid grid-cols-2 gap-3">
        {["yes", "no"].map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 font-bold transition ${
              value === option
                ? "border-[#128ced] bg-[#128ced] text-white"
                : "border-[#128ced]/20 bg-white text-[#128ced]"
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

// MORNING / EVENING BUTTONS

function PeriodButtons({
  value,
  onChange,
}: {
  value: "morning" | "evening";
  onChange: (value: "morning" | "evening") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["morning", "evening"] as const).map((period) => (
        <button
          key={period}
          type="button"
          aria-pressed={value === period}
          onClick={() => onChange(period)}
          className={`rounded-xl border-2 px-4 py-3 font-bold transition ${
            value === period
              ? "border-[#128ced] bg-[#128ced] text-white"
              : "border-[#128ced]/20 bg-[#f5f9ff] text-[#128ced]"
          }`}
        >
          {period === "morning" ? "Morning" : "Evening"}
        </button>
      ))}
    </div>
  );
}
