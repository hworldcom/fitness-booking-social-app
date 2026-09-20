import { Empty } from "@/components/ui";
export default function NotFound() {
  return (
    <Empty
      title="A little off the beaten track."
      description="We couldn’t find that page. Your club is just one click away."
      href="/"
      action="Back to the club"
    />
  );
}
