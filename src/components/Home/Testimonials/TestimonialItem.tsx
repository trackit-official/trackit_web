import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

const TestimonialItem = ({ data }: { data: Testimonial }) => {
  return (
    <div className="rounded-2xl bg-white p-[35px] shadow-testimonial transition-all duration-300 hover:shadow-testimonial-2 hover:transform hover:-translate-y-1 dark:bg-gray-dark">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full">
          <Image
            src={data?.image}
            alt={data?.name}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <div className="w-full">
          <h3 className="font-satoshi text-xl font-semibold -tracking-[0.2px] text-black dark:text-white">
            {data?.name}
          </h3>
          <p className="font-satoshi text-gray-6 dark:text-gray-4">
            {data?.role}
          </p>
        </div>
      </div>

      {/* <!-- divider --> */}
      <div className="my-6 h-px w-full bg-stroke dark:bg-stroke-dark"></div>

      <div className="relative testimonial-content">
        <span className="absolute -left-1 -top-2 text-4xl text-primary/30 font-serif">
          "
        </span>
        <p className="font-satoshi text-base leading-relaxed text-gray-700 dark:text-gray-300 pl-5 pr-3">
          {data?.text}
        </p>
        <span className="absolute -bottom-3 right-0 text-4xl text-primary/30 font-serif">
          "
        </span>
      </div>
    </div>
  );
};

export default TestimonialItem;
