import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";

export const createMagic = () => {
  // We make sure that the window object is available
  // Then we create a new instance of Magic using a publishable key
  if (typeof window !== "undefined") {
    return new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!, {
      extensions: [new OAuthExtension()],
    });
  }
};

// Pass in your publishable key from your .env file
// export const magic = createMagic(
//   process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!
// );

// Create client-side Magic instance
// const createMagic = (key: string) => {
//   return (
//     typeof window != "undefined" &&
//     new Magic(key, {
//       extensions: [new OAuthExtension()],
//     })
//   );
// };

// export const magic = createMagic(
//   process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!
// );
