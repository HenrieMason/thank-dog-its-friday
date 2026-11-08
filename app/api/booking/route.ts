
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      console.error("Missing Google Script configuration");
      return NextResponse.json(
        { error: "Booking service is not configured." },
        { status: 500 }
      );
    }

    const data = await request.json();

    if (
      !data.fullName?.trim() ||
      !data.email?.trim() ||
      !/^\(\d{3}\) \d{3}-\d{4}$/.test(data.phone || "") ||
      !data.streetAddress?.trim() ||
      !data.city?.trim() ||
      !/^\d{5}$/.test(data.zipCode || "")
    ) {
      return NextResponse.json(
        { error: "Please complete your contact information." },
        { status: 400 }
      );
    }

    const count = Number(data.petCount);
    const pets = data.pets;

    if (
      !Number.isInteger(count) ||
      count < 1 ||
      count > 5 ||
      !Array.isArray(pets) ||
      pets.length !== count ||
      pets.some(
        (pet) =>
          !pet.name?.trim() ||
          !pet.breed?.trim() ||
          !["yes", "no"].includes(pet.allergies) ||
          !["yes", "no"].includes(pet.medications) ||
          (pet.allergies === "yes" && !pet.allergyDetails?.trim()) ||
          (pet.medications === "yes" && !pet.medicationDetails?.trim())
      )
    ) {
      return NextResponse.json(
        { error: "Please complete all required pet details." },
        { status: 400 }
      );
    }

    const { startDate, endDate, startPeriod, endPeriod } = data;

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (
      !datePattern.test(startDate || "") ||
      !datePattern.test(endDate || "") ||
      !["morning", "evening"].includes(startPeriod) ||
      !["morning", "evening"].includes(endPeriod)
    ) {
      return NextResponse.json(
        { error: "Please select valid booking dates and times." },
        { status: 400 }
      );
    }

    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);

    const validDate = (date: Date, value: string) =>
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value;

    const today = new Date();
    const todayPacific = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(today);

    if (
      !validDate(start, startDate) ||
      !validDate(end, endDate) ||
      startDate < todayPacific ||
      endDate < startDate
    ) {
      return NextResponse.json(
        { error: "Please choose valid future dates." },
        { status: 400 }
      );
    }

    const days = Math.round(
      (end.getTime() - start.getTime()) / 86400000
    );

    const visits =
      days * 2 +
      (endPeriod === "evening" ? 1 : 0) -
      (startPeriod === "evening" ? 1 : 0) +
      1;

    if (visits <= 0) {
      return NextResponse.json(
        { error: "Your ending visit must be after your starting visit." },
        { status: 400 }
      );
    }

    const rate = 25 + (count - 1) * 5;
    const total = rate * visits;

    const payload = {
      ...data,
      petCount: count,
      totalVisits: visits,
      total,
      secret,
    };

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Google Script returned ${response.status}`);
    }

    const result = await response.json();

    if (result.success !== true) {
      throw new Error("Google Script rejected the booking.");
    }

    return NextResponse.json({
      success: true,
      message: "Your booking request was submitted successfully!",
    });
  } catch (error) {
    console.error("Booking submission error:", error);

    return NextResponse.json(
      { error: "Unable to send your request. Please try again." },
      { status: 500 }
    );
  }
}
