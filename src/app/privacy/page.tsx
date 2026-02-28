import { Metadata } from "next";
import { SectionReveal } from "@/components/shared/SectionReveal";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Privacy policy for debugwithjames.com",
};

export default function PrivacyPage() {
    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <SectionReveal>
                    <h1 className="text-3xl font-extrabold text-foreground mb-8">
                        Privacy Policy
                    </h1>
                    <div className="prose text-foreground-muted">
                        <p><em>Last updated: February 2026</em></p>

                        <h2>Information We Collect</h2>
                        <p>
                            This website collects minimal information. When you use the contact
                            form, we collect your name, email address, and message content solely
                            to respond to your inquiry.
                        </p>

                        <h2>How We Use Information</h2>
                        <p>
                            Information submitted through the contact form is used exclusively
                            to respond to your inquiry. We do not sell, share, or distribute your
                            personal information to third parties.
                        </p>

                        <h2>Cookies</h2>
                        <p>
                            This website uses essential cookies only (theme preference). We do
                            not use tracking cookies or third-party analytics that collect personal
                            data.
                        </p>

                        <h2>Third-Party Services</h2>
                        <p>
                            This website is hosted on Vercel. Please refer to{" "}
                            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                                Vercel&apos;s Privacy Policy
                            </a>{" "}
                            for information about their data practices.
                        </p>

                        <h2>Contact</h2>
                        <p>
                            If you have questions about this privacy policy, please contact me
                            at hello@debugwithjames.com.
                        </p>
                    </div>
                </SectionReveal>
            </div>
        </div>
    );
}
