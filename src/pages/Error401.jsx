import ErrorPage from "./ErrorPage";

export default function Error401() {
  return (
    <ErrorPage
      code="401"
      description="Unauthorized"
    />
  );
}