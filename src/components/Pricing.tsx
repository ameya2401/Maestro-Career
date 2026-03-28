import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS, formatInr } from "@/data/plans";

export default function Pricing() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Choose the right plan for you
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos odit doloribus perspiciatis.
                </p>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
                    {PLANS.map((tier) => (
                        <div
                            key={tier.id}
                            className={`rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 transition-all duration-300 ${tier.mostPopular ? 'ring-2 ring-primary bg-primary/5 scale-105 shadow-xl' : 'hover:shadow-lg bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between gap-x-4">
                                <h3
                                    className={`text-lg font-semibold leading-8 ${tier.mostPopular ? 'text-primary' : 'text-gray-900'
                                        }`}
                                >
                                    {tier.name}
                                </h3>
                                {tier.mostPopular && (
                                    <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                                        Most popular
                                    </p>
                                )}
                            </div>
                            <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">{formatInr(tier.priceInr)}</span>
                                <span className="text-sm font-semibold leading-6 text-gray-600">one-time</span>
                            </p>
                            <Link
                                href={`/checkout/${tier.id}`}
                                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-200 ${tier.mostPopular
                                    ? 'bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary'
                                    : 'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:outline-primary'
                                    }`}
                            >
                                Buy plan
                            </Link>
                            <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
