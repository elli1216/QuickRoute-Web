import { FileQuestion, Home, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-2xl mb-8 shadow-sm border border-border">
        <FileQuestion className="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground">
        Page not found
      </h1>
      <p className="text-xl text-muted-foreground max-w-150 mb-8">
        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button asChild size="lg">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/docs">
            <Search className="w-4 h-4 mr-2" />
            Documentation
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFoundComponent