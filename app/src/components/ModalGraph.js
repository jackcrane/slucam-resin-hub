import { useEffect } from "react";
import { CartesianGrid, Scatter, ScatterChart } from "recharts";

const ModalGraph = (props) => {
  useEffect(() => {
    console.log(
      props.resin.trials[0].bottomLayerExposureTime,
      props.resin.trials[0].normalExposureTime
    );
  }, [props]);
  return (
    <div>
      <p>Plotting {props.resin.trials.length} datapoints</p>
      <p>
        Plotting the following data:
        {props.resin.trials.map((trial) => (
          <p>
            {trial.bottomLayerExposureTime}, {trial.normalExposureTime}
          </p>
        ))}
      </p>
      <ScatterChart
        width={400}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {props?.resin?.trials
          ? props.resin.trials.map((trial) => (
              <Scatter
                name={trial.id}
                data={props.resin.trials.map((trial) => ({
                  x: trial.bottomLayerExposureTime,
                  y: trial.normalExposureTime,
                }))}
                fill="#8884d8"
              />
            ))
          : null}
      </ScatterChart>
    </div>
  );
};

export { ModalGraph };
