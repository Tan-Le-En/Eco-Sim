import SiteHeader from "@/components/SiteHeader";

export default function WhiteNavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] w-max min-w-full whitespace-nowrap">
      <SiteHeader bare />
    </div>
  );
}
