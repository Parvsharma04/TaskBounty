import { StarIcon } from "@/utils/StarIcon";
import { PollIcon } from "@/utils/PollIcon";
import { DoubleArrowIcon } from "@/utils/DoubleArrowIcon";
import { Tabs, Tab } from "@nextui-org/react";
import { EmojiIcon } from "@/utils/EmojiIcon";

interface VoteSelectionProps {
  setVotingType: (type: string) => void;
}

export default function VoteSelection({ setVotingType }: VoteSelectionProps) {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        className="block"
      >
        <Tab
          key="rateScale"
          value="Rating_Scale"
          onClick={() => setVotingType("Rating_Scale")}
          title={
            <div className="flex items-center space-x-2">
              <StarIcon />
              <span>Rating Scale</span>
            </div>
          }
        />
        <Tab
          key="poll"
          value="Multiple_Choice_Poll"
          onClick={() => setVotingType("Multiple_Choice_Poll")}
          title={
            <div className="flex items-center space-x-2">
              <PollIcon />
              <span>Multiple-Choice Poll</span>
            </div>
          }
        />
        <Tab
          key="upvoteDownvote"
          value="Upvote_Downvote"
          onClick={() => setVotingType("Upvote_Downvote")}
          title={
            <div className="flex items-center space-x-2">
              <DoubleArrowIcon />
              <span>Upvote/Downvote System</span>
            </div>
          }
        />
        <Tab
          key="emojiVote"
          value="Emoji_Reaction_Vote"
          onClick={() => setVotingType("Emoji_Reaction_Vote")}
          title={
            <div className="flex items-center space-x-2">
              <EmojiIcon />
              <span>Emoji Reaction Voting</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
