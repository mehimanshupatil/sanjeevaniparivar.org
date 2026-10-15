// Closing paragraphs; `emphasis` ones are bold and deep-coloured
interface Props {
  paragraphs: { text: string; emphasis: boolean }[];
}

export default function Closing({ paragraphs }: Props) {
  return (
    <section className="max-w-[900px] flex flex-col items-center gap-3 text-center text-[23px] leading-[1.55]">
      {paragraphs.map((c, i) => <p key={i} className={c.emphasis ? 'font-bold text-deep' : undefined}>{c.text}</p>)}
    </section>
  );
}
