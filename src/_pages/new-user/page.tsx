import { NewUser } from "../../widgets";

export function NewUserPage({ email }: { email: string }) {
  return <NewUser email={email} />;
}
