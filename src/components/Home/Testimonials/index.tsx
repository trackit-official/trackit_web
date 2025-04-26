import SectionHeader from "@/components/Common/SectionHeader";
import TestimonialItem from "./TestimonialItem";
import testimonialData from "./testmonialsData";

const Testimonials = () => {
  return (
    <section className="relative z-1 overflow-hidden bg-gray-1 py-17.5 dark:bg-black lg:py-22.5 xl:py-27.5">
      {/* <!-- section title --> */}
      <SectionHeader
        title={
          <>
            Experience the <span className="text-primary">success stories</span>{" "}
            from our users
          </>
        }
        description="See how Trackiitt helps individuals, freelancers, and businesses transform their financial management with our powerful tracking and visualization tools."
      />

      <div className="relative z-1 mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
          {/* <!-- Testimonial Columns --> */}
          {testimonialData?.map((group, key) => {
            return (
              <div key={key} className="flex flex-col gap-7.5">
                {group?.map((item, key) => (
                  <TestimonialItem data={item} key={key} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-primary-300/10 rounded-full blur-3xl dark:bg-primary-700/10"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary-300/10 rounded-full blur-3xl dark:bg-primary-700/10"></div>
    </section>
  );
};

export default Testimonials;
