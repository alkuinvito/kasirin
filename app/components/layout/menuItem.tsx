"use client";
import Image from "next/image";

export default function MenuItem({
  image,
  name,
  price
}: {
  image: string,
  name: string,
  price: number
}) {
  return (
    <div className="flex flex-col items-center bg-gray-300 rounded-lg">
      <Image className="w-full rounded-t-lg" src={image} alt={name} width={100} height={100}></Image>
      <span>{name}</span>
      <span>{price}</span>
      <div className="text-center"><button>-</button><span>4</span><button>+</button>
      </div>
    </div>
  );
}
