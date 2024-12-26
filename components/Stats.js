import Image from "next/image";

const stats = [
  { id: 1, name: "Autos en inventario", value: "+500", top: "" },
  { id: 2, name: "Agencias", value: "8", top: "" },
  { id: 3, name: "Clientes Satisfechos", value: "+20000", top: "" },
];

export default function Stats() {
  return (
    <div className="pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-secondary py-12">
          <dl className="grid grid-cols-1 gap-y-16 gap-x-6 text-center lg:grid-cols-4 lg:gap-x-12">
            {/* Stats */}
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="mx-auto flex max-w-xs flex-col items-center text-center gap-y-2"
              >
                <dd className="text-6xl font-black text-white">{stat.value}</dd>
                <dt className="text-2xl font-light leading-7 text-gray-200">
                  {stat.name}
                </dt>
              </div>
            ))}

            {/* Imagen */}
            <div className="-m-20 lg:flex flex-col hidden ">
              <Image
                className="rounded-md"
                src="/auto-agencias.png"
                alt=""
                width={800}
                height={424}
              />
            </div>
          </dl>


        </div>
      </div>
    </div>
  );
}
