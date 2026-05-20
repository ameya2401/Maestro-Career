import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GoogleFindPlaceResponse = {
    status: string;
    candidates?: Array<{ place_id?: string }>;
    error_message?: string;
};

type GooglePlaceDetailsResponse = {
    status: string;
    result?: {
        name?: string;
        url?: string;
        rating?: number;
        user_ratings_total?: number;
        reviews?: Array<{
            author_name?: string;
            rating?: number;
            text?: string;
            time?: number;
            relative_time_description?: string;
            language?: string;
        }>;
    };
    error_message?: string;
};

function jsonError(message: string, status: number) {
    return NextResponse.json({ ok: false, error: message }, { status });
}

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upstream request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    return (await res.json()) as T;
}

async function resolvePlaceId(apiKey: string): Promise<string | null> {
    const explicit = process.env.GOOGLE_PLACE_ID;
    if (explicit) return explicit;

    const input = process.env.GOOGLE_PLACE_QUERY || "Maestrocareer Nagpur";
    const locationBias =
        process.env.GOOGLE_PLACE_LOCATION_BIAS || "circle:5000@21.1141393,79.0674004";

    const url =
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json" +
        `?input=${encodeURIComponent(input)}` +
        `&inputtype=textquery` +
        `&fields=place_id` +
        `&locationbias=${encodeURIComponent(locationBias)}` +
        `&key=${encodeURIComponent(apiKey)}`;

    const data = await fetchJson<GoogleFindPlaceResponse>(url);
    if (data.status !== "OK") return null;

    const placeId = data.candidates?.[0]?.place_id;
    return placeId || null;
}

export async function GET() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return jsonError(
            "Missing GOOGLE_MAPS_API_KEY. Set it in your environment to enable Google reviews.",
            500
        );
    }

    try {
        const placeId = await resolvePlaceId(apiKey);
        if (!placeId) {
            return jsonError(
                "Could not resolve place_id. Set GOOGLE_PLACE_ID explicitly (recommended) or adjust GOOGLE_PLACE_QUERY/GOOGLE_PLACE_LOCATION_BIAS.",
                500
            );
        }

        const fields = ["name", "url", "rating", "user_ratings_total", "reviews"].join(",");
        const reviewsSort = process.env.GOOGLE_PLACE_REVIEWS_SORT || "most_relevant";

        const detailsUrl =
            "https://maps.googleapis.com/maps/api/place/details/json" +
            `?place_id=${encodeURIComponent(placeId)}` +
            `&fields=${encodeURIComponent(fields)}` +
            `&reviews_sort=${encodeURIComponent(reviewsSort)}` +
            `&key=${encodeURIComponent(apiKey)}`;

        const data = await fetchJson<GooglePlaceDetailsResponse>(detailsUrl);

        if (data.status !== "OK") {
            return jsonError(data.error_message || `Google Places error: ${data.status}`, 502);
        }

        const reviews = (data.result?.reviews || [])
            .filter((r) => r.rating === 5)
            .map((r) => ({
                authorName: r.author_name || "Anonymous",
                text: (r.text || "").trim(),
            }))
            .filter((r) => r.text.length > 0)
            .slice(0, 20);

        return NextResponse.json(
            {
                ok: true,
                place: {
                    placeId,
                    name: data.result?.name || null,
                    url: data.result?.url || null,
                    rating: data.result?.rating ?? null,
                    userRatingsTotal: data.result?.user_ratings_total ?? null,
                },
                reviews,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return jsonError(message, 500);
    }
}
