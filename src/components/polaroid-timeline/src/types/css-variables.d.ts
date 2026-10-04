import "react";

declare module "react" {
  interface CSSProperties {
    /** Framer / modern CSS extras not in default React typings */
    [key: `--${string}`]: string | number | undefined;
    cornerShape?: string | number;
    [key: string]: string | number | undefined | null;
  }
}
