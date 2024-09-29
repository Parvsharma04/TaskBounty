import Image from "next/image";
import Link from "next/link";

const FooterPage = () => {
  return (
    <footer className="rounded-lg shadow bg-gray-950">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/icon-removebg-preview.png"
              alt="TaskBounty Logo"
              width={32}
              height={32}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              TaskBounty
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium  sm:mb-0 text-gray-400">
            <li>
              <Link href="/privacy" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/dev-team" className="hover:underline me-4 md:me-6">
                Developer Team
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 sm:mx-auto bg-gray-950 lg:my-8" />
        <span className="block text-sm  sm:text-center text-gray-400">
          © 2024{" "}
          <Link href="/" className="hover:underline">
            TaskBounty™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default FooterPage;
