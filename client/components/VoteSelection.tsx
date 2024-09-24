import { StarIcon } from "@/utils/StarIcon";
import { PollIcon } from "@/utils/PollIcon";
import { DoubleArrowIcon } from "@/utils/DoubleArrowIcon";
import { Tabs, Tab } from "@nextui-org/react";
import { EmojiIcon } from "@/utils/EmojiIcon";

export default function VoteSelection() {
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
          title={
            <div className="flex items-center space-x-2">
              <StarIcon />
              <span>Rating Scale</span>
            </div>
          }
        />
        <Tab
          key="poll"
          title={
            <div className="flex items-center space-x-2">
              <PollIcon />
              <span>Multiple-Choice Poll</span>
            </div>
          }
        />
        <Tab
          key="upvoteDownvote"
          title={
            <div className="flex items-center space-x-2">
              <DoubleArrowIcon />
              <span>Upvote/Downvote System</span>
            </div>
          }
        />
        <Tab
          key="emojiVote"
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
