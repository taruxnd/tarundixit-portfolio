import { redirect } from "next/navigation";

/** About content lives on the homepage at `#about`. */
export default function AboutPage() {
  redirect("/#about");
}
