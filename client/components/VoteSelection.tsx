import { StarIcon } from "@/utils/StarIcon";
import { PollIcon } from "@/utils/PollIcon";
import { DoubleArrowIcon } from "@/utils/DoubleArrowIcon";
import { Tabs, Tab } from "@nextui-org/react";
import { EmojiIcon } from "@/utils/EmojiIcon";

export default function VoteSelection(props: any) {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        className="block"
        onSelectionChange={(e) => props.setVotingType(e)}
      >
        <Tab
          key="Rating_Scale"
          title={
            <div className="flex items-center space-x-2">
              <StarIcon />
              <span>Rating Scale</span>
            </div>
          }
        />
        <Tab
          key="Multiple_Choice_Poll"
          title={
            <div className="flex items-center space-x-2">
              <PollIcon />
              <span>Multiple-Choice Poll</span>
            </div>
          }
        />
        <Tab
          key="Upvote_Downvote"
          title={
            <div className="flex items-center space-x-2">
              <DoubleArrowIcon />
              <span>Upvote/Downvote System</span>
            </div>
          }
        />
        <Tab
          key="Emoji_Reaction_Vote"
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
