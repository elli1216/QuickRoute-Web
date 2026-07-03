import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "#/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="shrink-0 rounded-full border-0 shadow-none bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
      title="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" style={{ color: 'var(--foreground)' }} />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" style={{ color: 'var(--foreground)' }} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
