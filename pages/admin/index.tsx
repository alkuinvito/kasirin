import * as Form from "@radix-ui/react-form";

export default function Page() {
  return (
    <>
      <Form.Root className="FormRoot">
        <Form.Field className="FormField" name="email">
          <div className="flex align-baseline justify-between">
            <Form.Label className="FormLabel">Email</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter a Google email account
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              Please provide a valid email
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              className="font-medium py-2 px-3 bg-gray-100 dark:bg-slate-900 rounded-lg"
              placeholder="new-user@gmail.com"
              type="email"
              required
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button className="flex gap-3 items-center py-2 px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white font-medium cursor-pointer">
            Add user
          </button>
        </Form.Submit>
      </Form.Root>
    </>
  );
}
