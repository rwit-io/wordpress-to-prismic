import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { JSX } from "react";

/**
 * Props for `Demo`.
 */
export type DemoProps = SliceComponentProps<Content.DemoSlice>;

/**
 * Component for "Demo" Slices.
 */
const Demo = ({ slice }: DemoProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      className="h-screen w-screen flex justify-center items-center"
      data-slice-variation={slice.variation}
    >
      wordpress to prismic migration 
    </section>
  );
};

export default Demo;
