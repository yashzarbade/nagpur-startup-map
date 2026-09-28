import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ sector: string }> };

export default async function SectorRedirect({ params }: Props) {
  const { sector } = await params;
  permanentRedirect(`/nagpur/startups/${sector}`);
}
