/*
{
  "id": "bacf3582-84de-42e7-8d12-c3c9d8ca27df",
  "resinId": "c04fcb41-9569-4f9c-baa5-72218a8219d4",
  "status": "SUCCESS",
  "layerHeight": 0.05,
  "speed": 150,
  "bottomLayerCount": 5,
  "bottomLayerExposureTime": 35,
  "bottomLayerLightOffDelay": 10,
  "bottomLayerLiftDistance": 6,
  "bottomLayerLiftSpeed": 60,
  "bottomLayerTransitionCount": 0,
  "normalExposureTime": 2.5,
  "normalLightOffDelay": 10,
  "normalLiftDistance": 6,
  "normalLiftSpeed": 60,
  "transitionType": "LINEAR",
  "createdAt": "2023-02-17T07:09:33.085Z",
  "updatedAt": "2023-02-17T07:09:33.085Z"
}
*/

import {
  Card,
  Collapse,
  Descriptions,
  Divider,
  Empty,
  List,
  Space,
  Timeline,
} from "antd";
import Typography from "antd/es/typography/Typography";
import moment from "moment";
import { useEffect, useState } from "react";
import { Dot } from "./styleds";

const LabelRow = ({ label, children }) => (
  <Space>
    {label}: <b>{children}</b>
  </Space>
);

const ModalTrials = (props) => {
  const [trials, setTrials] = useState([]);
  const [unfilteredTrials, setUnfilteredTrials] = useState([]);
  useEffect(() => {
    fetch(`/resins/${props.resin.id}`)
      .then((res) => res.json())
      // Sort the trials by (1) status then (2) date. Success should be first, Partial should be second, then the rest should be chronological.
      .then((resin) => {
        resin.trials.sort((a, b) => {
          if (a.status === "SUCCESS" && b.status !== "SUCCESS") return -1;
          if (a.status !== "SUCCESS" && b.status === "SUCCESS") return 1;
          if (a.status === "PARTIAL" && b.status !== "PARTIAL") return -1;
          if (a.status !== "PARTIAL" && b.status === "PARTIAL") return 1;
          return moment(a.createdAt).isBefore(moment(b.createdAt)) ? 1 : -1;
        });
        return resin;
      })
      .then((resin) => setUnfilteredTrials(resin.trials));
  }, [props]);
  if (unfilteredTrials.length === 0) return <Empty description="No trials" />;

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Collapse>
          {unfilteredTrials.map((trial, i) => (
            <Collapse.Panel
              key={i}
              header={
                <Space>
                  <Dot status={trial.status} />
                  {trial.status}
                  {moment(trial.createdAt).format("MM/DD/YYYY hh:mm a")}
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <LabelRow label="Date">
                  {moment(trial.createdAt).format("MM/DD/YYYY hh:mm a")}
                </LabelRow>
                <LabelRow label="Layer Height">{trial.layerHeight}</LabelRow>
                <LabelRow label="Speed">{trial.speed}</LabelRow>
                <Collapse>
                  <Collapse.Panel header="Bottom Layer">
                    <LabelRow label="Bottom Layer Count">
                      {trial.bottomLayerCount}
                    </LabelRow>
                    <LabelRow label="Bottom Layer Exposure Time">
                      {trial.bottomLayerExposureTime}
                    </LabelRow>
                    <LabelRow label="Bottom Layer Light Off Delay">
                      {trial.bottomLayerLightOffDelay}
                    </LabelRow>
                    <LabelRow label="Bottom Layer Lift Distance">
                      {trial.bottomLayerLiftDistance}
                    </LabelRow>
                    <LabelRow label="Bottom Layer Lift Speed">
                      {trial.bottomLayerLiftSpeed}
                    </LabelRow>
                    <LabelRow label="Bottom Layer Transition Count">
                      {trial.bottomLayerTransitionCount}
                    </LabelRow>
                    <LabelRow label="Normal Exposure Time">
                      {trial.normalExposureTime}
                    </LabelRow>
                  </Collapse.Panel>
                  <Collapse.Panel header="Normal Layer">
                    <LabelRow label="Normal Light Off Delay">
                      {trial.normalLightOffDelay}
                    </LabelRow>
                    <LabelRow label="Normal Lift Distance">
                      {trial.normalLiftDistance}
                    </LabelRow>
                    <LabelRow label="Normal Lift Speed">
                      {trial.normalLiftSpeed}
                    </LabelRow>
                    <LabelRow label="Transition Type">
                      {trial.transitionType}
                    </LabelRow>
                  </Collapse.Panel>
                </Collapse>
                {trial.notes && trial.notes.length > 0 && (
                  <>
                    <Typography.Title level={5}>Notes</Typography.Title>
                    <Typography.Text>{trial.notes}</Typography.Text>
                  </>
                )}
              </Space>
            </Collapse.Panel>
          ))}
        </Collapse>
      </Space>
    </>
  );
};

export default ModalTrials;
