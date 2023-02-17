import { Timeline } from "antd";
import moment from "moment";

const ModalTimeline = (props) => {
  return (
    <Timeline
      mode={"left"}
      items={[
        {
          children: "Resin created",
          label: moment(props.resin.createdAt).format("MM/DD/YYYY hh:mm a"),
        },
      ]}
    />
  );
};

export default ModalTimeline;
