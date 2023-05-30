"use client";
import Image from "next/image";

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
        <b className="text-bold">{name}</b>
        <span className="text-sm">{price}</span>
      </div>
    </div>
  );
}
