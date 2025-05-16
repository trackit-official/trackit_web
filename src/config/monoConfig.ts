export const monoSecretKey = process.env.MONO_SECRET_KEY;
export const monoPublicKey = process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY;

if (!monoSecretKey) {
  throw new Error("Missing MONO_SECRET_KEY in environment variables");
}

if (!monoPublicKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_MONO_PUBLIC_KEY in environment variables"
  );
}
