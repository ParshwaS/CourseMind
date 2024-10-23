import TopNavBar from "@/components/custom/navbar";
import AuthGuard from "@/components/custom/authGuard";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <TopNavBar />
            {/* <AuthGuard> */}
                {children}
            {/* </AuthGuard> */}
        </>
    );
}