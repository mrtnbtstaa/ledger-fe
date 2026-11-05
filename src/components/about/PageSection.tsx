type Props = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export const PageSection = ({ id, title, children }: Props) => {
  return (
    <section className="mt-10" aria-labelledby={id}>
      <h2 id={id} className="font-serif text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}