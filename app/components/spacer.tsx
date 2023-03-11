type SpacerProps = {
  number: number;
  border: string;
};

export default function Spacer(props: SpacerProps) {
  const { number, border } = props;

  const spacer = [];

  for (let i = 0; i < number; i++) {
    spacer[i] = i;
  }

  return (
    <>
      {spacer.map(i => (
        <div
          key={`spacer-${i}`}
          className={`item w1 l1 ${border} spacer-${number}`}
        ></div>
      ))}
    </>
  );
}
