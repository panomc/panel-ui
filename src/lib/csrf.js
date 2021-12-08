import Tokens from "csrf";

export default function generateToken() {
  const tokens = new Tokens();
  const secret = tokens.secretSync();

  return tokens.create(secret);
}
