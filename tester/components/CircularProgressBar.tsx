import CircularProgress from "@mui/joy/CircularProgress";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import { useCountUp } from "use-count-up";

export default function CircularProgressCountUp() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [buttonLabel, setButtonLabel] = React.useState("Start");

  const { value: value2, reset } = useCountUp({
    isCounting: true,
    duration: 1,
    start: 0,
    end: 75,
  });

  const handleButtonClick = () => {
    if (isLoading) {
      setIsLoading(false);
      setButtonLabel("Start");
    } else if (buttonLabel === "Reset") {
      setButtonLabel("Start");
    } else {
      setIsLoading(true);
      setButtonLabel("Reset");
    }
  };

  return (
    <Stack
      direction="row"
      spacing={8}
      sx={{ alignItems: "center", flexWrap: "wrap" }}
    >
      <Stack spacing={2}>
        <CircularProgress size="lg" determinate value={value2 as number}>
          <Typography>{value2}%</Typography>
        </CircularProgress>
      </Stack>
    </Stack>
  );
}
