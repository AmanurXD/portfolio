import { Metadata } from "next";
import { SectionReveal } from "@/components/shared/SectionReveal";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms of service for debugwithjames.com",
};

export default function TermsPage() {
    return (
        <div className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <SectionReveal>
                    <h1 className="text-3xl font-extrabold text-foreground mb-8">
                        Terms of Service
                    </h1>
                    <div className="prose text-foreground-muted">
                        <p><em>Last updated: February 2026</em></p>

                        <h2>Services</h2>
                        <p>
                            James Benett (&quot;debugwithjames&quot;) provides freelance web development
                            services including but not limited to bug fixing, feature development,
                            deployment assistance, and technical consulting.
                        </p>

                        <h2>Engagement</h2>
                        <p>
                            All project engagements are initiated through Fiverr or direct email
                            communication. Project scope, timeline, and pricing are agreed upon
                            before work begins.
                        </p>

                        <h2>Intellectual Property</h2>
                        <p>
                            Upon full payment, all code and deliverables created for your project
                            become your intellectual property. I retain the right to showcase
                            non-confidential aspects of the project in my portfolio unless
                            otherwise agreed.
                        </p>

                        <h2>Confidentiality</h2>
                        <p>
                            I treat all client code, data, and business information as
                            confidential. NDAs are available upon request.
                        </p>

                        <h2>Limitation of Liability</h2>
                        <p>
                            Services are provided &quot;as is.&quot; While I strive for the highest quality,
                            liability is limited to the amount paid for the specific service.
                        </p>

                        <h2>Contact</h2>
                        <p>
                            For questions about these terms, please contact me at
                            hello@debugwithjames.com.
                        </p>
                    </div>
                </SectionReveal>
            </div>
        </div>
    );
}
