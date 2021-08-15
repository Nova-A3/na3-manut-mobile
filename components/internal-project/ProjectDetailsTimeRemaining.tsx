import moment, { Moment } from "moment";
import * as React from "react";
import { TextStyle } from "react-native";
import { Subheading } from "react-native-paper";

type ProjectDetailsTimeRemainingProps = {
  eta: Moment;
  styles: {
    default: TextStyle;
    onTime: TextStyle;
    late: TextStyle;
    finished: TextStyle;
  };
  text: {
    onTime: string | ((remainingMs: number) => string);
    late: string | ((remainingMs: number) => string);
    finished: string;
  };
  projectIsFinished?: boolean;
};

const ProjectDetailsTimeRemaining: React.FC<ProjectDetailsTimeRemainingProps> =
  ({ eta, styles, text, projectIsFinished }) => {
    const [countdownMs, setCountdownMs] = React.useState(
      moment
        .duration(moment(eta.toDate()).diff(moment(), "ms"), "ms")
        .asMilliseconds()
    );

    text = {
      onTime:
        typeof text.onTime === "string"
          ? text.onTime
          : text.onTime(countdownMs),
      late: typeof text.late === "string" ? text.late : text.late(countdownMs),
      finished: text.finished,
    };

    React.useEffect(() => {
      let countdownUpdater: NodeJS.Timer;
      if (!projectIsFinished) {
        countdownUpdater = setInterval(() => {
          setCountdownMs((currCountdownMs) => currCountdownMs - 1000);
        }, 1000);
      }

      return () => {
        if (countdownUpdater) {
          clearInterval(countdownUpdater);
        }
      };
    }, []);

    return (
      <Subheading
        style={[
          styles.default,
          projectIsFinished
            ? styles.finished
            : countdownMs >= 1000
            ? styles.onTime
            : styles.late,
        ]}
      >
        {projectIsFinished
          ? text.finished
          : countdownMs >= 1000
          ? text.onTime
          : text.late}
      </Subheading>
    );
  };

export default ProjectDetailsTimeRemaining;
