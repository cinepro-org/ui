import { Button } from "@/components/ui/button.tsx"
import { HomeIcon } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] w-full flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
            <h1 className="text-4xl font-bold">404 - Mmmhh... Lost you are</h1>
            <p className="text-lg">Found, this page is not</p>
            <p className="text-lg text-muted-foreground italic">- Yoda</p>
            <div className={"mt-2 flex flex-col items-center justify-center gap-2"}>
                <Button size="lg" asChild>
                    <Link to="/" className="mt-4">
                        Back Home
                        <HomeIcon />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
