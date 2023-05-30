import Image from "next/image";

export interface Menu {
  image: string;
  name: string;
  price: number;
}

export default function MenuItem({
  image,
  name,
  price,
}: {
  image: string;
  name: string;
  price: number;
}) {
  return (
    <div className="flex flex-col rounded-lg cursor-pointer">
      <Image
        className="w-full rounded-lg"
        src={image}
        alt={name}
        width={100}
        height={100}
      ></Image>
      <div className="grid pt-2">
        <span className="font-semibold">{name}</span>
        <span className="text-sm">{price}</span>
      </div>
    </div>
  );
}
