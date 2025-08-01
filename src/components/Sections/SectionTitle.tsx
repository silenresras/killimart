interface Props {
  title: string;
}

export default function SectionTitle({ title }: Props) {
  return (
    <h2 className="text-2xl font-semibold mt-4 mb-4 sm:text-xl md:text-xl text-black ">
      {title}
    </h2>
  );
}
