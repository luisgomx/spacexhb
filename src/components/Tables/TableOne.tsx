import { BRAND } from "@/types/brand";
import Image from "next/image";

const brandData: BRAND[] = [
  {
    logo: "/images/brand/brand-01.svg",
    name: "Google",
    visitors: 3.5,
    revenues: "5,768",
    sales: 590,
    conversion: 4.8,
  },
  {
    logo: "/images/brand/brand-02.svg",
    name: "Twitter",
    visitors: 2.2,
    revenues: "4,635",
    sales: 467,
    conversion: 4.3,
  },
  {
    logo: "/images/brand/brand-03.svg",
    name: "Github",
    visitors: 2.1,
    revenues: "4,290",
    sales: 420,
    conversion: 3.7,
  },
  {
    logo: "/images/brand/brand-04.svg",
    name: "Vimeo",
    visitors: 1.5,
    revenues: "3,580",
    sales: 389,
    conversion: 2.5,
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Facebook",
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },
];

const TableOne = () => {
  return (
    <div className="px-5pb-2.5 rounded-sm border border-stroke bg-white pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <table className="w-full table-auto border-collapse text-center">
        <thead>
          <tr className="text-center">
            <th className="px-4 py-2">Tiempo</th>
            <th className="px-4 py-2">Persona</th>
            <th className="px-4 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-gray-200 border-b">
            <td className="px-4 py-2">Tomó tiempo</td>
            <td className="px-4 py-2">-Elon-</td>
            <td className="px-4 py-2">2024-07-21 18:04:57</td>
          </tr>
          <tr className="border-gray-200 border-b">
            <td className="px-4 py-2">Tomó tiempo</td>
            <td className="px-4 py-2">-Elon-</td>
            <td className="px-4 py-2">2024-07-21 18:04:57</td>
          </tr>
          <tr className="border-gray-200 border-b">
            <td className="px-4 py-2">Tomó tiempo</td>
            <td className="px-4 py-2">-Elon-</td>
            <td className="px-4 py-2">2024-07-21 18:04:57</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableOne;
