import Provider from "@/components/Provider"

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Provider>
            {children}
        </Provider>
    )
}
