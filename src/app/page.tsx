import { ReleaseNotesForm } from "@/components/release-notes-form";

export default function Home() {
    return (
        <main className="min-h-svh p-4">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="tracking-light text-3xl font-bold">
                        Release Notes Generator
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Create and publish release notes to Discord
                    </p>
                </div>
                <ReleaseNotesForm />
            </div>
        </main>
    );
}
