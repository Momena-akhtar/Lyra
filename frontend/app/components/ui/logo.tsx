import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 rounded-full px-2 py-1 cursor-pointer w-fit">
      <Image src="/namewithlogo.png" alt="Logo" width={100} height={35} />
    </div>
  );
}