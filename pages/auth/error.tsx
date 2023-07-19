import { useRouter } from "next/router";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;
  switch (error) {
    case "AccessDenied":
      return <h1>Your account is not a member of this organization.</h1>;
    default:
      return <h1>Something went wrong</h1>;
  }
}
