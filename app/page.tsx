
"use client";

import { useState, type FormEvent } from "react";

type Service = "pet" | "farm" | "walk";

type PetDetails = {
  allergies: string;
  medications: string;
};

const SERVICES = [
  {
    id: "pet" as Service,
    title: "Pet Sitting",
    price: "$75 / day",
    description: "Three visits daily: morning, afternoon, and night.",
    detail: "+ $5 per additional pet per day",
  },
  {
    id: "farm" as Service,
    title: "Farm Sitting",
    price: "$75 / day",
    description: "Two visits daily for your farm animals.",
    detail: "Custom morning and night visit times",
  },
  {
    id: "walk" as Service,
    title: "Dog Walks",
    price: "$25 / walk",
    description: "Choose 1–5 walks per day.",
    detail: "+ $5 per additional dog per walk",
  },
];

const emptyPet = (): PetDetails => ({
  allergies: "",
  medications: "",
});

const timeOptions = Array.from({ length: 96 }, (_, index) => {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;
  const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const hour12 = hour % 12 || 12;
  const label = `${hour12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
  return { value, label };
});

function formatTime(value: string) {
  return timeOptions.find((option) => option.value === value)?.label || value;
}

function dateNumber(value: string) {
  return Date.parse(`${value}T00:00:00Z`);
}

function getToday() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

const inputClass =
  "box-border w-full min-w-0 rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20";

const choiceClass = (selected: boolean) =>
  `flex min-h-12 cursor-pointer touch-manipulation items-center justify-center rounded-xl border-2 px-3 py-3 text-center font-bold transition ${
    selected
      ? "border-[#128ced] bg-[#128ced] text-white shadow-md"
      : "border-[#128ced]/20 bg-[#f5f9ff] text-[#128ced] hover:border-[#128ced]"
  }`;

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
    <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
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
            className={choiceClass(value === option)}
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

function TimePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-bold">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className={inputClass}
      >
        <option value="">Select a time</option>
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Home() {
  const [service, setService] = useState<Service>("pet");
  const [petCount, setPetCount] = useState(0);
  const [walkCount, setWalkCount] = useState(1);

  const [visitTimes, setVisitTimes] = useState<string[]>([
    "08:00",
    "13:00",
    "19:00",
  ]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startVisit, setStartVisit] = useState(0);
  const [endVisit, setEndVisit] = useState(2);

  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [petDetails, setPetDetails] = useState<PetDetails[]>(
    Array.from({ length: 5 }, emptyPet)
  );

  const todayString = getToday();

  const visitCount =
    service === "pet" ? 3 : service === "farm" ? 2 : walkCount;

  const activeTimes = visitTimes.slice(0, visitCount);

  const sortedVisits = activeTimes
    .map((time, index) => ({
      time,
      index,
      label: formatTime(time),
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  const datesValid =
    Boolean(startDate && endDate) &&
    endDate >= startDate &&
    startDate >= todayString;

  const dayCount = datesValid
    ? Math.round(
        (dateNumber(endDate) - dateNumber(startDate)) / 86400000
      ) + 1
    : 0;

  const firstVisit = Math.min(startVisit, visitCount - 1);
  const lastVisit = Math.min(endVisit, visitCount - 1);

  const timesComplete =
    activeTimes.length === visitCount &&
    activeTimes.every(Boolean) &&
    new Set(activeTimes).size === visitCount;

  const selectedStartTime = sortedVisits[firstVisit]?.time || "";
  const selectedEndTime = sortedVisits[lastVisit]?.time || "";

  const selectionValid =
    datesValid &&
    timesComplete &&
    (startDate !== endDate || firstVisit <= lastVisit);

  const totalVisits = selectionValid
    ? (dayCount - 1) * visitCount + lastVisit - firstVisit + 1
    : 0;

  const rate =
    service === "farm"
      ? 75
      : service === "pet"
        ? 75 + Math.max(0, petCount - 1) * 5
        : 25 + Math.max(0, petCount - 1) * 5;

  // Sitting is billed by calendar day; walks by selected visit.
  const total =
    petCount > 0 && selectionValid
      ? service === "walk"
        ? totalVisits * rate
        : dayCount * rate
      : 0;

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
    if (!digits.length) return "";
    if (digits.length < 4) return `(${digits}`;
    if (digits.length < 7) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const changeService = (next: Service) => {
    setService(next);
    setStartVisit(0);

    if (next === "pet") {
      setVisitTimes(["08:00", "13:00", "19:00"]);
      setEndVisit(2);
    } else if (next === "farm") {
      setVisitTimes(["08:00", "19:00"]);
      setEndVisit(1);
    } else {
      setWalkCount(1);
      setVisitTimes(["09:00"]);
      setEndVisit(0);
    }
  };

  const changeWalkCount = (count: number) => {
    setWalkCount(count);
    setVisitTimes((previous) =>
      Array.from({ length: count }, (_, i) => previous[i] || "")
    );
    setStartVisit(0);
    setEndVisit(count - 1);
  };

  const updateTime = (index: number, value: string) => {
    setVisitTimes((previous) =>
      previous.map((time, i) => (i === index ? value : time))
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (petCount < 1) {
      setSubmitSuccess(false);
      setSubmitMessage("Please select how many pets you have.");
      return;
    }

    if (!selectionValid || totalVisits < 1) {
      setSubmitSuccess(false);
      setSubmitMessage(
        "Please select valid dates and unique visit times."
      );
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
      service,
      serviceName:
        SERVICES.find((item) => item.id === service)?.title || "",
      petCount,
      pets,
      walkCount: service === "walk" ? walkCount : null,
      visitTimes: sortedVisits.map((visit) => visit.label),
      startDate,
      startTime: formatTime(selectedStartTime),
      startPeriod: formatTime(selectedStartTime),
      endDate,
      endTime: formatTime(selectedEndTime),
      endPeriod: formatTime(selectedEndTime),
      totalVisits,
      dayCount,
      rate,
      total,
      additionalInfo: get("additionalInfo"),
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
        "Request sent successfully! We'll contact you shortly."
      );

      form.reset();
      setPetCount(0);
      setPetDetails(Array.from({ length: 5 }, emptyPet));
      setPhone("");
      setStartDate("");
      setEndDate("");
      changeService("pet");
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
      {/* Logo */}
      <div className="w-full px-20 pt-6 sm:px-40 sm:pt-8">
        <img
          src="/thankdogitsfriday.png"
          alt="Thank Dog It's Friday"
          className="mx-auto block h-auto w-full max-w-md object-contain"
        />
      </div>

      <div className="px-5 text-center">
        <h1 className="text-base font-semibold text-white sm:text-lg">
          Southern Oregon Pet Sitter
        </h1>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-12 pt-6 sm:px-6 sm:pb-16">
        {/* Cities and Animals */}
        <section className="w-full rounded-[2rem] border border-white/20 bg-white px-4 py-3 text-center text-[#128ced] shadow-xl sm:px-10">
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
            I spent four years working at R&amp;R Pet Resort in
            Phoenix, Oregon, where I gained hands-on experience
            caring for dogs and cats, administering medications,
            following feeding routines, and making sure every
            animal was safe, happy, and comfortable.
          </p>

          <p className="mt-4 text-base leading-8 text-white/95 sm:text-lg">
            I also volunteered at Roxy Rose Ranch in East Medford,
            gaining valuable experience working with horses.
            Alongside my professional experience, I&apos;ve
            continued providing independent pet sitting and
            house sitting for local families.
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

        {/* Service Selection */}
        <section className="mt-6 rounded-[2rem] border border-white/20 bg-white p-5 text-[#1f2a24] shadow-xl sm:p-8">
          <h2 className="mb-5 text-center text-2xl font-black text-[#128ced]">
            Choose Your Service
          </h2>

          <div className="grid gap-3">
            {SERVICES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={service === item.id}
                onClick={() => changeService(item.id)}
                className={`w-full rounded-2xl border-2 p-5 text-left transition ${
                  service === item.id
                    ? "border-[#128ced] bg-[#128ced] text-white shadow-md"
                    : "border-[#128ced]/20 bg-[#f5f9ff] text-[#1f2a24] hover:border-[#128ced]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xl font-black">
                    {item.title}
                  </span>
                  <span className="text-xl font-black">
                    {item.price}
                  </span>
                </div>
                <p className="mt-2 text-sm">
                  {item.description}
                </p>
                <p className="mt-1 text-xs font-semibold opacity-80">
                  {item.detail}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid min-w-0 gap-6 rounded-[2rem] border border-white/20 bg-white p-5 text-[#1f2a24] shadow-xl sm:p-10"
        >
          <h2 className="text-center text-2xl font-black text-[#128ced]">
            Request {SERVICES.find((item) => item.id === service)?.title}
          </h2>

          <Input
            name="fullName"
            label="What is your full name?"
            placeholder="First and last name"
            required
          />

          <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
            What is your phone number?
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(555) 555-5555"
              value={phone}
              onChange={(event) =>
                setPhone(formatPhoneNumber(event.target.value))
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

          <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
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
              className={inputClass}
            />
          </label>

          {/* Pet Count */}
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
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setPetCount(count)}
                  className={`${choiceClass(petCount === count)} aspect-square text-lg font-black`}
                >
                  {count}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Walk Count */}
          {service === "walk" && (
            <fieldset className="grid min-w-0 gap-3">
              <legend className="mb-3 text-[15px] font-bold sm:text-base">
                How many walks per day?
              </legend>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    aria-pressed={walkCount === count}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => changeWalkCount(count)}
                    className={`${choiceClass(walkCount === count)} aspect-square text-lg font-black`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Custom Visit Times */}
          <section className="grid min-w-0 gap-4">
            <div>
              <h3 className="text-[15px] font-bold sm:text-base">
                What times work best for your {service === "walk" ? "walks" : "visits"}?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select your preferred daily times. These will also
                appear in your booking date selections.
              </p>
            </div>

            <div className="grid gap-3">
              {Array.from({ length: visitCount }, (_, index) => (
                <TimePicker
                  key={`${service}-${index}`}
                  label={
                    service === "pet"
                      ? ["Morning Visit", "Afternoon Visit", "Night Visit"][index]
                      : service === "farm"
                        ? ["Morning Visit", "Night Visit"][index]
                        : `Walk ${index + 1}`
                  }
                  value={visitTimes[index] || ""}
                  onChange={(value) => updateTime(index, value)}
                />
              ))}
            </div>

            {!timesComplete && (
              <p className="text-sm font-medium text-amber-700">
                Please select a different time for each visit.
              </p>
            )}
          </section>

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
                    className={`${inputClass} min-h-24 resize-y bg-white`}
                    placeholder="List allergies and any special precautions..."
                  />
                </label>
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
                <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
                  What medications does your pet take?
                  <textarea
                    name={`pet${index + 1}MedicationDetails`}
                    required
                    className={`${inputClass} min-h-24 resize-y bg-white`}
                    placeholder="Medication names, dosage, schedule, and instructions..."
                  />
                </label>
              )}

              <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
                Personality?
                <textarea
                  name={`pet${index + 1}Personality`}
                  className={`${inputClass} min-h-28 resize-y`}
                  placeholder="Friendly, energetic, shy, playful, etc."
                />
              </label>
            </section>
          ))}

          {/* Booking Dates */}
          <section className="grid min-w-0 gap-5">
            <h2 className="text-[15px] font-bold sm:text-base">
              When do you need {service === "walk" ? "dog walks" : "a sitter"}?
            </h2>

            <div className="grid gap-3">
              <label htmlFor="startDate" className="text-sm font-semibold">
                Starting
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                min={todayString}
                value={startDate}
                onChange={(event) => {
                  const next = event.target.value;
                  setStartDate(next);
                  if (endDate && endDate < next) setEndDate("");
                }}
                required
                className={inputClass}
                style={{ minWidth: 0, maxWidth: "100%" }}
              />

              <p className="text-sm font-semibold">
                First visit on your starting day
              </p>

              <div className={`grid gap-2 ${visitCount > 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
                {sortedVisits.map((visit, index) => (
                  <button
                    key={`start-${visit.index}`}
                    type="button"
                    aria-pressed={firstVisit === index}
                    onClick={() => setStartVisit(index)}
                    className={choiceClass(firstVisit === index)}
                  >
                    {visit.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <label htmlFor="endDate" className="text-sm font-semibold">
                Ending
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                min={startDate || todayString}
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                required
                className={inputClass}
                style={{ minWidth: 0, maxWidth: "100%" }}
              />

              <p className="text-sm font-semibold">
                Last visit on your ending day
              </p>

              <div className={`grid gap-2 ${visitCount > 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
                {sortedVisits.map((visit, index) => (
                  <button
                    key={`end-${visit.index}`}
                    type="button"
                    aria-pressed={lastVisit === index}
                    onClick={() => setEndVisit(index)}
                    className={choiceClass(lastVisit === index)}
                  >
                    {visit.label}
                  </button>
                ))}
              </div>
            </div>

            {datesValid &&
              startDate === endDate &&
              firstVisit > lastVisit && (
                <p className="text-sm font-semibold text-red-600">
                  The last visit must be at or after the first visit
                  when booking a single day.
                </p>
              )}
          </section>

          {/* Additional Information */}
          <label className="grid min-w-0 gap-2 text-[15px] font-bold sm:text-base">
            Is there anything else I should know?
            <textarea
              name="additionalInfo"
              className={`${inputClass} min-h-28 resize-y`}
              placeholder="Feeding schedules, special instructions, or anything else you'd like to share..."
            />
          </label>

          {/* Total */}
          <section className="rounded-2xl border border-[#128ced]/20 bg-[#f5f9ff] p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xl font-black">Total:</span>
              <span className="text-3xl font-black text-[#128ced]">
                ${total.toLocaleString("en-US")}
              </span>
            </div>

            {petCount > 0 && selectionValid ? (
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>
                  {SERVICES.find((item) => item.id === service)?.title}
                </p>
                <p>
                  {petCount} {petCount === 1 ? "pet" : "pets"}
                </p>
                <p>
                  {dayCount} {dayCount === 1 ? "day" : "days"}
                  {" • "}
                  {totalVisits} {totalVisits === 1 ? "visit" : "visits"}
                </p>
                <p className="font-semibold">
                  {service === "walk"
                    ? `${totalVisits} walks × $${rate} per walk`
                    : `${dayCount} days × $${rate} per day`}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Select your pets, visit times, and booking dates
                to calculate the total.
              </p>
            )}
          </section>

          {/* Booking Information */}
          <div className="rounded-2xl border border-[#128ced]/20 bg-[#f5f9ff] p-5 text-center">
            <div className="space-y-3 text-sm leading-6 text-gray-600">
              <p>
                We will review your request, then charge the full
                amount before your scheduled service.
              </p>
              <p>
                Please provide all food and medications for your pets.
              </p>
            </div>
          </div>

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-xl bg-[#128ced] px-8 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-[#0875cc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending Request..." : "Send Request"}
          </button>
        </form>

        <footer className="mt-6 border-t border-white/25 pt-8 text-center text-sm text-white/80">
          © 2026 Thank Dog It&apos;s Friday
        </footer>
      </div>
    </main>
  );
}
