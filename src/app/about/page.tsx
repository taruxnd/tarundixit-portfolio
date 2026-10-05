import { permanentRedirect } from "next/navigation";

/** Keep existing About links pointing to the consolidated homepage. */
export default function AboutPage() {
  permanentRedirect("/#about");
}
