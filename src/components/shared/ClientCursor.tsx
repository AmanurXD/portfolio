"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
    () =>
        import("@/components/shared/CustomCursor").then((mod) => mod.CustomCursor),
    { ssr: false }
);

export function ClientCursor() {
    return <CustomCursor />;
}
