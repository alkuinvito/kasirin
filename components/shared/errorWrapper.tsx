import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const DEFAULT_ERROR_MSG = "Something went wrong";
const DEFAULT_REDIRECT_URL = "/";

export default function ErrorWrapper({
  message = DEFAULT_ERROR_MSG,
  redirectUrl = DEFAULT_REDIRECT_URL,
  desc,
}: {
  message?: string;
  redirectUrl?: string;
  desc?: string;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 flex items-center bg-gray-100 dark:bg-zinc-900 rounded-lg">
      <div className="grid grow gap-2">
        <h2 className="text-4xl font-bold">{message}</h2>
        {desc && <span>{desc}</span>}
        <Link
          href={redirectUrl}
          className="mt-4 py-2 px-4 w-fit rounded-lg text-white font-medium bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 transition-colors"
        >
          Take me back
        </Link>
      </div>
      <span className="text-8xl">
        <FontAwesomeIcon icon={faPersonRunning} />
      </span>
    </div>
  );
}
