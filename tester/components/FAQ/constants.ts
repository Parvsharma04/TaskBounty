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
    question: "How can testers earn by completing tasks?",
    answer:
      "Testers can browse through the available tasks. Once a task is completed and the submission is verified by the task owner, the payout is transferred in SOL to the tester’s wallet.",
  },
  {
    question: "Is TaskBounty secure?",
    answer:
      "Yes, TaskBounty leverages blockchain technology for transparency and security. All transactions are handled using your connected Solana wallet, ensuring your data and funds are secure.",
  },
  {
    question: "How do payouts work?",
    answer:
      "Payouts are made in SOL. Once a task is completed and verified, the earnings are added to your dashboard balance. Payouts are processed once your dashboard balance reaches a minimum of 2 SOL, ensuring efficient fund transfers.",
  },
];
