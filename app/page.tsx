
"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type Service = "pet" | "farm" | "walk";

type PetDetails = {
  allergies: string;
  medications: string;
};

const SERVICES = [
  {
    id: "pet" as Service,
    title: "Pet Sitting",
    price: "$100 / day",
    description: "Three Visits Daily",
    detail: "+ $5 per additional pet per day",
  },
  {
    id: "farm" as Service,
    title: "Farm Sitting",
    price: "$90 / day",
    description: "Two Visits Daily",
    detail: "Custom morning and night visit times",
  },
  {
    id: "walk" as Service,
    title: "Dog Walks",
    price: "$25 / walk",
    description: "Choose 1–5 walks per day",
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
  "box-border block w-full min-w-0 max-w-full rounded-xl border border-black/10 bg-[#f5f9ff] px-4 py-3 font-normal text-[#1f2a24] outline-none transition placeholder:text-gray-400 focus:border-[#128ced] focus:ring-2 focus:ring-[#128ced]/20";

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

function DateInput({
  id,
  label,
  value,
  min,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid w-full min-w-0 max-w-full gap-3">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>

      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-black/10 bg-[#f5f9ff]">
        <input
          id={id}
          name={id}
          type="date"
          min={min}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            minWidth: 0,
            maxWidth: "100%",
            boxSizing: "border-box",
            WebkitAppearance: "none",
          }}
          className="border-0 bg-transparent px-3 py-3 font-normal text-[#1f2a24] outline-none focus:ring-2 focus:ring-inset focus:ring-[#128ced]/20"
        />
      </div>
    </div>
  );
}

function BookingForm() {
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
    Array.from({ length: 10 }, emptyPet)
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
      ? 90
      : service === "pet"
        ? 100 + Math.max(0, petCount - 1) * 5
        : 25 + Math.max(0, petCount - 1) * 5;

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

    if (next !== "farm") {
      setPetCount((previous) => Math.min(previous, 5));
    }

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
      setPetDetails(Array.from({ length: 10 }, emptyPet));
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
      <div className="mx-auto max-w-2xl px-5 pb-12 pt-10 sm:px-6 sm:pb-16">
        <div className="mb-7 text-center"><h1 className="text-3xl font-black sm:text-4xl">Request Pet Care</h1><p className="mt-2 text-white/90">Choose a service and tell Ava what your pets need.</p></div>
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

          {/* Phone */}
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

          {/* ZIP Code */}
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

          {/* Number of Pets */}
          <fieldset className="grid min-w-0 gap-3">
            <legend className="mb-3 text-[15px] font-bold sm:text-base">
              How many pets do you have?
            </legend>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {Array.from(
                { length: service === "farm" ? 10 : 5 },
                (_, index) => index + 1
              ).map((count) => (
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
                    className={`${inputClass} min-h-24 resize-y bg-white`}
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
                    className={`${inputClass} min-h-24 resize-y bg-white`}
                    placeholder="Medication names, dosage, schedule, and instructions..."
                  />
                </label>
              )}

              {/* Personality */}
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

          {/* Custom Visit Times - Below Pet Descriptions */}
          <section className="grid min-w-0 gap-4">
            <div>
              <h3 className="text-[15px] font-bold sm:text-base">
                What times work best for your{" "}
                {service === "walk" ? "walks" : "visits"}?
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
                      ? [
                          "Morning Visit",
                          "Afternoon Visit",
                          "Night Visit",
                        ][index]
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

          {/* Booking Dates */}
          <section className="grid w-full min-w-0 max-w-full gap-5">
            <h2 className="text-[15px] font-bold sm:text-base">
              When do you need{" "}
              {service === "walk" ? "dog walks" : "a sitter"}?
            </h2>

            {/* Starting Date */}
            <div className="grid w-full min-w-0 max-w-full gap-3">
              <DateInput
                id="startDate"
                label="Starting"
                value={startDate}
                min={todayString}
                onChange={(next) => {
                  setStartDate(next);
                  if (endDate && endDate < next) {
                    setEndDate("");
                  }
                }}
              />

              <p className="text-sm font-semibold">
                First visit on your starting day
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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

            {/* Ending Date */}
            <div className="grid w-full min-w-0 max-w-full gap-3">
              <DateInput
                id="endDate"
                label="Ending"
                value={endDate}
                min={startDate || todayString}
                onChange={setEndDate}
              />

              <p className="text-sm font-semibold">
                Last visit on your ending day
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                  The last visit must be at or after the first
                  visit when booking a single day.
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

            {petCount > 0 && selectionValid ? (
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>
                  {
                    SERVICES.find((item) => item.id === service)
                      ?.title
                  }
                </p>

                <p>
                  {petCount} {petCount === 1 ? "pet" : "pets"}
                </p>

                <p>
                  {dayCount} {dayCount === 1 ? "day" : "days"}
                  {" • "}
                  {totalVisits}{" "}
                  {totalVisits === 1 ? "visit" : "visits"}
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

          {/* Submission Message */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-xl bg-[#128ced] px-8 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-[#0875cc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending Request..." : "Send Request"}
          </button>
        </form>

      </div>
    </main>
  );
}


type Section = "home" | "services" | "gallery" | "faq" | "about" | "how" | "reviews" | "contact" | "booking";
const navigation: { id: Section; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services & Pricing" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
  { id: "about", label: "About" },
  { id: "how", label: "How It Works / What to Expect" },
  { id: "reviews", label: "Reviews / Testimonials" },
  { id: "contact", label: "Contact Info" },
];
const faqItems = [
  ["What animals do you care for?", "Dogs, cats, horses, goats, and fish. Share any special care needs in your request."],
  ["Where do you offer services?", "Grants Pass, Central Point, Medford, White City, and Eagle Point."],
  ["How many visits are included?", "Pet sitting includes three daily visits, farm sitting includes two, and dog walks can be booked one to five times daily."],
  ["When do I pay?", "We'll review your request first. Full payment is collected before the scheduled service."],
  ["Do I provide food and medications?", "Yes, please provide the food and medications your pets need."],
];
export default function Home() {
  const [page, setPage] = useState<Section>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (next: Section) => {
    setPage(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const action = (label = "Request Pet Care") => (
    <button type="button" onClick={() => navigate("booking")} className="rounded-full bg-white px-7 py-3 font-extrabold text-[#128ced] shadow-md hover:bg-blue-50">{label}</button>
  );
  const section = (title: string, children: React.ReactNode) => (
    <section className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <h1 className="mb-8 text-center text-3xl font-black sm:text-4xl">{title}</h1>
      {children}
    </section>
  );
  return (
    <main className="min-h-screen bg-[#128ced] text-white">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-[#128ced] shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button type="button" onClick={() => navigate("home")} className="text-left text-base font-black sm:text-xl">Thank Dog It&apos;s Friday 🐾</button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate("booking")} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#128ced]">Book Now</button>
            <div className="relative">
              <button type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl border border-white/40 px-4 py-2 text-sm font-bold">Menu {menuOpen ? "×" : "☰"}</button>
              {menuOpen && <nav aria-label="Site navigation" className="absolute right-0 top-full mt-2 w-[min(85vw,320px)] overflow-hidden rounded-2xl bg-white py-2 text-[#1f2a24] shadow-2xl">
                {navigation.map(item => <button key={item.id} type="button" onClick={() => navigate(item.id)} className={`block w-full px-5 py-3 text-left font-semibold hover:bg-blue-50 ${page === item.id ? "text-[#128ced]" : ""}`}>{item.label}</button>)}
                <button type="button" onClick={() => navigate("booking")} className="block w-full border-t border-blue-100 px-5 py-3 text-left font-black text-[#128ced]">Booking</button>
              </nav>}
            </div>
          </div>
        </div>
      </header>
      {page === "home" && <>
        <section className="mx-auto flex max-w-4xl flex-col items-center px-5 pb-16 pt-10 text-center sm:pt-16">
          <img src="/thankdogitsfriday.png" alt="Thank Dog It's Friday" className="mb-7 w-full max-w-md object-contain" />
          <h1 className="text-2xl font-black leading-snug sm:text-4xl">Because your dog deserves a good Friday, every day</h1>
          <p className="mt-2 text-xl font-bold sm:text-2xl">— and you do too! 🐾</p>
          <p className="mt-6 max-w-xl text-lg leading-8">Dependable, attentive pet care across Southern Oregon for dogs, cats, horses, goats, and fish.</p>
          <p className="mt-4 text-sm font-semibold text-white/85">Grants Pass • Central Point • Medford • White City • Eagle Point</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">{action()}<button type="button" onClick={() => navigate("services")} className="rounded-full border-2 border-white px-7 py-3 font-bold">Services & Pricing</button></div>
        </section>
        <div className="bg-white text-[#1f2a24]"><div className="mx-auto max-w-5xl px-5 py-14 text-center"><h2 className="text-3xl font-black text-[#128ced]">Care you can count on</h2><div className="mt-8 grid gap-4 sm:grid-cols-3">{SERVICES.map(item => <button key={item.id} type="button" onClick={() => navigate("services")} className="rounded-2xl border border-blue-100 bg-[#f5f9ff] p-7 text-left"><h3 className="text-xl font-black">{item.title}</h3><p className="mt-2 text-2xl font-black text-[#128ced]">{item.price}</p><p className="mt-3 text-sm">{item.description}</p></button>)}</div></div></div>
        <section className="mx-auto max-w-3xl px-5 py-14 text-center"><h2 className="text-3xl font-black">Meet Ava</h2><p className="mt-5 text-lg leading-8">I&apos;ve called the Rogue Valley home since 2018, and caring for animals has always been a huge part of my life. From dogs and cats to horses and farm animals, I love getting to know each animal&apos;s unique personality.</p><button type="button" onClick={() => navigate("about")} className="mt-7 rounded-full border-2 border-white px-6 py-3 font-bold">More About Ava</button></section>
      </>}
      {page === "services" && section("Services & Pricing", <><div className="grid gap-5 md:grid-cols-3">{SERVICES.map(item => <article key={item.id} className="rounded-3xl bg-white p-7 text-[#1f2a24] shadow-lg"><h2 className="text-2xl font-black text-[#128ced]">{item.title}</h2><p className="mt-3 text-2xl font-black">{item.price}</p><p className="mt-4">{item.description}</p><p className="mt-2 text-sm text-gray-600">{item.detail}</p><button type="button" onClick={() => navigate("booking")} className="mt-7 rounded-xl bg-[#128ced] px-5 py-3 font-bold text-white">Request This Service</button></article>)}</div><p className="mt-8 text-center text-sm">Your total is calculated in the booking form before submitting a request.</p></>)}
      {page === "gallery" && section("Gallery", <div className="rounded-3xl border border-white/30 bg-white/10 p-10 text-center"><p>Photos of Ava&apos;s animal friends and pet-sitting adventures will be added here.</p></div>)}
      {page === "faq" && section("Frequently Asked Questions", <div className="mx-auto max-w-3xl space-y-3">{faqItems.map(([q,a]) => <details key={q} className="rounded-2xl bg-white p-5 text-[#1f2a24]"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-3 leading-7">{a}</p></details>)}</div>)}
      {page === "about" && section("About Ava", <div className="mx-auto max-w-3xl space-y-5 rounded-3xl bg-white p-8 text-lg leading-8 text-[#1f2a24]"><p>Hi, I&apos;m Ava! I&apos;ve called the Rogue Valley home since 2018, and caring for animals has always been a huge part of my life. From dogs and cats to horses and farm animals, I love getting to know each animal&apos;s unique personality.</p><p>Whether your pet is energetic and playful, shy and nervous, or a senior who needs a little extra attention, my goal is to give them the same patience, affection, and care I&apos;d want someone to give my own.</p></div>)}
      {page === "how" && section("How It Works / What to Expect", <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">{[["1", "Choose a service", "Select pet sitting, farm sitting, or dog walks."],["2", "Send your request", "Tell us about your pets, preferred times, and dates."],["3", "Confirm the details", "Ava reviews your request and confirms arrangements before payment."]].map(([n,t,d]) => <article key={n} className="rounded-3xl bg-white p-7 text-[#1f2a24]"><p className="text-3xl font-black text-[#128ced]">{n}</p><h2 className="mt-3 text-xl font-black">{t}</h2><p className="mt-3 leading-7">{d}</p></article>)}</div>)}
      {page === "reviews" && section("Reviews / Testimonials", <div className="rounded-3xl border border-white/30 bg-white/10 p-10 text-center">Customer testimonials will appear here once Ava has permission to share them.</div>)}
      {page === "contact" && section("Contact Info", <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center text-[#1f2a24]"><p className="text-lg">Serving Grants Pass, Central Point, Medford, White City, and Eagle Point.</p><p className="mt-4 text-gray-600">Contact details can be added here when confirmed.</p><div className="mt-7"> <button type="button" onClick={() => navigate("booking")} className="rounded-xl bg-[#128ced] px-6 py-3 font-bold text-white">Send a Booking Request</button></div></div>)}
      {page === "booking" && <BookingForm />}
      <footer className="border-t border-white/25 px-5 py-7 text-center text-sm text-white/80">© 2026 Thank Dog It&apos;s Friday</footer>
    </main>
  );
}
