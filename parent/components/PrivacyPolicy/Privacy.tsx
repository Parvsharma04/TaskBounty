import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-900 shadow-md rounded-lg mt-28">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Privacy Policy
      </h1>
      <p className="text-lg text-gray-200 mb-4">
        Welcome to TaskBounty! Your privacy is of utmost importance to us. This
        policy outlines how we collect, use, and protect your information as you
        complete bounties on our decentralized platform.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-4">
        1. Information We Collect
      </h2>
      <p className="text-lg text-gray-200 mb-4">
        TaskBounty aims to keep your data collection to a minimum. We primarily
        collect your wallet address and basic interactions to track bounty
        completions. No personally identifiable information (PII) is required.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-4">
        2. How We Use Your Information
      </h2>
      <p className="text-lg text-gray-200 mb-4">
        The information we collect is used solely for the purpose of managing
        bounties, verifying completions, and improving our platform. We do not
        sell or share your data with third parties.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-4">
        3. Security and Data Protection
      </h2>
      <p className="text-lg text-gray-200 mb-4">
        TaskBounty leverages blockchain technology for data integrity and
        security. Your wallet interactions are encrypted, and all data is stored
        in a decentralized manner. We encourage users to maintain the security
        of their wallet keys and credentials.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-4">
        4. User Rights
      </h2>
      <p className="text-lg text-gray-200 mb-4">
        As a decentralized platform, you have full control over your data and
        interactions. You can choose to disconnect your wallet or stop
        participating in bounties at any time without any repercussions.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6 mb-4">
        5. Changes to This Policy
      </h2>
      <p className="text-lg text-gray-200 mb-4">
        We may update this privacy policy as necessary to reflect changes to
        TaskBounty or evolving regulations. Any changes will be transparently
        communicated through our app or website.
      </p>

      <p className="text-lg text-gray-300 font-semibold mt-8">
        If you have any questions or want to learn more about us, feel free to
        contact us{" "}
        <Link
          href="/dev-team"
          className="text-blue-400 underline hover:text-blue-300"
        >
          Team
        </Link>
        {"."}
      </p>
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
