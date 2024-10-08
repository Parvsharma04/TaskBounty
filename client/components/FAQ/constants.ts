"use client";

type FAQItem = {
  question: string;
  answer: string;
};

export const desktopHeaderPhrase = ["Frequently asked", "questions"];
export const mobileHeaderPhrase = ["Frequently", "asked", "questions"];
export const animate = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  open: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 1, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] },
  }),
};

export const faqData: FAQItem[] = [
  {
    question: "How do I create an account with TaskBounty?",
    answer:
      "Simply connect your Solana wallet to get started. No traditional account registration is required.",
  },
  {
    question: "How do I post a task?",
    answer:
      'After connecting your wallet, go to the "Post a Task" section. Fill out the required details like task description, category, payout amount, and submit.',
  },
  {
    question: "What types of tasks can be posted on TaskBounty?",
    answer:
      "TaskBounty allows users to post tasks in categories like UI/UX Design, Product Ideas, YouTube Thumbnails, and more. You can also create custom tasks based on your specific needs.",
  },
  {
    question: "Is TaskBounty secure?",
    answer:
      "Yes, TaskBounty leverages blockchain technology for transparency and security. All transactions are handled using your connected Solana wallet, ensuring your data and funds are secure.",
  },
  {
    question: "What is the fee structure for TaskBounty?",
    answer:
      "TaskBounty charges a small convenience fee on completed tasks. This fee is deducted from the payout amount before it’s transferred to the tester.",
  },
];
