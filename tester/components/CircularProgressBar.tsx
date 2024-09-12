// components/CircularProgressBar.js
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressBar = ({ percentage }: any) => {
  console.log(percentage);
  return (
    <div style={{ width: 100, height: 100 }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          // Change color to blue
          pathColor: `blue`,
          textColor: 'white',
          trailColor: 'gray',
          backgroundColor: 'black',
          // Center the text
          textSize: '20px',
          text: {
            fontSize: '16px',
            fill: 'white',
            fontWeight: 'bold',
          },
        })}
      />
    </div>
  );
};

export default CircularProgressBar;
