import { Text } from "@/components/ui/text";
import Link from "next/link";

function CopyRight() {
  return (
    <div className="flex items-center justify-start pb-8">
      <Text size="xs">
        © TreatMeta 2026 Powered by{" "}
        <Link href="https://unidevs.co/" target="_blank">
          UniDevs
        </Link>{" "}
      </Text>
    </div>
  );
}

export default CopyRight;
