import { ReleaseNotesForm } from "@/components/release-notes-form";

export default function Home() {
    return (
        <div className="mx-auto flex min-h-svh max-w-6xl flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center text-center">
                <h1 className="tracking-light text-3xl font-bold">
                    Release Notes Generator
                </h1>
                <p className="text-muted-foreground mt-2">
                    Create and publish release notes to Discord
                </p>
            </div>
            <ReleaseNotesForm />
        </div>
    );
}
