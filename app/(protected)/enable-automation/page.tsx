"use client"

import Header from "@/app/_components/header/Header";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { use, useEffect, useState } from "react";
import { checkAutomatorEnabled } from "./_actions/actions";

export default function EnableAutomationPage() {

    const handleClick = () => {
        window.location.href = "/api/auth/google/start";
    }

    const [automatorEnabled, setAutomatorEnabled] = useState<boolean | null>(null);
    
    useEffect(() => {
        async function fetchAutomatorStatus() {
            const enabled = await checkAutomatorEnabled();
            setAutomatorEnabled(enabled ?? null);
        }
        fetchAutomatorStatus();
    }, []);


    return (
        <>
            <Header />
            <main className="md:px-14 md:py-2 py-0 px-6 pt-2 mt-16 max-w-3xl mx-auto">
                <div className="space-y-8 text-[#001F3F]">
                    <section className="space-y-3">
                        <h1 className="text-3xl text-[#001F3F] font-semibold tracking-tight">Introducing TrackHub Automator</h1>
                    </section>

                    <section className="flex flex-wrap items-center gap-4">
                        {automatorEnabled ? (
                            <span className="text-sm font-medium text-green-600">Gmail Automator is enabled on your account.</span>
                        ) : (
                            <Button size="lg" className="gap-2 bg-[#001F3F]" onClick={handleClick}>
                                <Mail className="h-4 w-4" />
                                Connect Gmail
                            </Button>
                        )}
                        <span className="text-xs text-muted-foreground">
                            OAuth 2.0 & granular readonly access. We never store your raw emails.
                        </span>
                    </section>

                    <section className="rounded-lg border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-medium">What it does</h2>
                        <ul className="list-disc space-y-2 pl-5 text-sm">
                            <li>Automatically creates applications from incoming emails.</li>
                            <li>Generates and schedules interview / assessment rounds.</li>
                            <li>Parses key details (dates, company, role, status) with an AI parser.</li>
                            <li>Surfaces upcoming events & recent changes on your dashboard.</li>
                        </ul>
                    </section>

                    <section className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-md border bg-card p-5">
                            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Security</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Uses standards‑based OAuth 2.0 for authentication & authorization. Only metadata required for tracking is retained.
                            </p>
                        </div>
                        <div className="rounded-md border bg-card p-5">
                            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Efficiency</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Reduce manual data entry and keep application progress up to date without switching contexts.
                            </p>
                        </div>
                    </section>

                    <section className="rounded-lg bg-muted/40 p-5">
                        <h3 className="mb-2 text-sm font-medium">Beta notice</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            The AI parsing is still in beta and may occasionally mis‑label fields. Please verify critical information until a stable release.
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}