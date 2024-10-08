import { Timeline } from "@/components/ui/timeline";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  type: "User" | "Tester"; // Field to specify the type
}

export function LongSection() {
  const data: TimelineEntry[] = [
    {
      title: "Overview",
      type: "User",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            A decentralized, blockchain-based platform that allows users to post tasks, set bounties, and complete tasks to earn rewards without relying on a central authority. This project leverages Web3 technologies to provide a secure, user-owned task management system.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            The platform is built to promote transparency and fairness, ensuring that all participants are rewarded based on their contributions and no single entity has control over the task or reward system.
          </p>
        </div>
      ),
    },
    {
      title: "Client",
      type: "User",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Clients on the platform can post tasks, set bounties, and manage the progress of tasks. They have complete autonomy over their task listings, and they can define specific criteria and rewards for each task. Clients can also review and approve completed submissions.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            This allows for a decentralized workflow where users have ownership over their content and interact directly with testers through the platform&#39;s trustless mechanisms.
          </p>
        </div>
      ),
    },
    {
      title: "Tester",
      type: "Tester",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Testers can browse available tasks, complete submissions, and earn rewards based on successful completions. They have the flexibility to choose tasks that align with their skills and interests, contributing to a collaborative ecosystem that benefits both testers and users.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            By completing tasks, testers gain experience, build their portfolios, and receive direct bounties set by the users without any central authority interference.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Timeline data={data} />
      </div>
    </section>
  );
}
