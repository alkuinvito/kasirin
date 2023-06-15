export default function FieldErrors(props: { errors?: string[] }) {
  if (!props.errors?.length) return null;
  return (
    <div>
      {props.errors.map((err, index) => (
        <p key={index} className="text-red-600 text-sm">{err}</p>
      ))}
    </div>
  );
}
