import { SubmissionCount } from "@/utils";

export const calculateTaskRate = (submissionCounts: SubmissionCount[]) => {
  const sortedCounts = submissionCounts.sort(
    (a, b) => b.postYear * 12 + b.postMonth - (a.postYear * 12 + a.postMonth)
  );

  if (sortedCounts.length >= 2) {
    const currentMonth = sortedCounts[0]._count.id;
    const previousMonth = sortedCounts[1]._count.id;

    if (previousMonth > 0) {
      const changeRate = ((currentMonth - previousMonth) / previousMonth) * 100;
      return {
        rate: `${Math.abs(changeRate).toFixed(2)}%`,
        increase: changeRate >= 0,
      };
    } else if (currentMonth > 0) {
      return { rate: "100%", increase: true };
    } else {
      return { rate: "0%", increase: false };
    }
  } else if (sortedCounts.length === 1 && sortedCounts[0]._count.id > 0) {
    return { rate: "100%", increase: true };
  } else {
    return { rate: "0%", increase: false };
  }
};

export const calculateTotalEarned = (
  pendingAmount: number = 0,
  lockedAmount: number = 0
) => {
  // console.log(pendingAmount + lockedAmount)
  return pendingAmount + lockedAmount; // Adjust according to your logic
};

export const calculatePayout = (payouts: any[]) => {
  return payouts.reduce((total, element) => total + Number(element.amount), 0);
};

export const formatNumberToSOL = (amount: number): string => {
  return `${Number(amount.toFixed(6))} SOL`;
};

// Utility function to calculate formatted pending amount
export const calculateFormattedPending = (pendingAmount: number): string => {
  return parseFloat(((pendingAmount / 2) * 100).toFixed(2)).toString();
};
